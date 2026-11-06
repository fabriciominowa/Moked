import { ContractId, WhatsAppMessageLog } from '@/types/moked';
import { MokedPersistence } from './mokedPersistence';
import { MokedService, sanitizeOccurrenceForViewer } from './mokedService';
import { WHATSAPP_AGENT_BLUEPRINT } from './skillsFramework';

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function timeShort(): string {
  return new Date().toTimeString().slice(0, 5);
}

export class WhatsAppService {
  public static processIncomingMessage(params: {
    senderPhone: string;
    question: string;
  }): WhatsAppMessageLog {
    const cleanPhone = params.senderPhone.replace(/\D/g, '');
    const normQ = normalizeText(params.question);
    const permissionSteps: string[] = [];

    // 1. Vinculação do número do WhatsApp ao perfil correto
    const matchedUser = MokedService.getUserByPhone(cleanPhone);

    if (!matchedUser) {
      permissionSteps.push(
        `1. Lookup de número: ${params.senderPhone} NÃO encontrado na tabela de usuários credenciados.`
      );
      permissionSteps.push(
        `2. Bloqueio preventivo: nenhuma consulta executada na base de contratos.`
      );

      return MokedPersistence.updateDb((db) => {
        const entry: WhatsAppMessageLog = {
          id: `WA-${Date.now()}`,
          timestamp: timeShort(),
          senderPhone: params.senderPhone,
          matchedUserName: 'Número Não Vinculado',
          matchedRoleLabel: 'Sem Perfil',
          authorizedContracts: [],
          question: params.question,
          response:
            '🔒 Número não vinculado: Este telefone não está associado a nenhum perfil ativo no Moked. Por segurança, nenhuma informação contratual foi consultada. Solicite o vínculo do seu número ao administrador do contrato.',
          decisionStatus: 'blocked_unregistered',
          permissionSteps,
        };
        db.whatsappLogs.unshift(entry);
        return entry;
      });
    }

    permissionSteps.push(
      `1. Vínculo de WhatsApp validado: ${params.senderPhone} → ${matchedUser.name} (Perfil: ${matchedUser.roleLabel})`
    );

    // 2. Verifica se a pergunta tenta consultar um contrato fora do escopo autorizado do usuário
    const asksContractB =
      /\b(contrato b|ctr-b|parque farmaceutico|beta biopharma|setor quimico)\b/.test(normQ);
    const asksContractA =
      /\b(contrato a|ctr-a|centro logistico|alpha logistica|docas norte)\b/.test(normQ);

    const targetExplicitContract: ContractId | undefined = asksContractB
      ? 'CTR-B'
      : asksContractA
        ? 'CTR-A'
        : undefined;

    if (
      targetExplicitContract &&
      !matchedUser.authorizedContractIds.includes(targetExplicitContract)
    ) {
      permissionSteps.push(
        `2. Controle de Permissões (RBAC): Perfil autorizado apenas para [${matchedUser.authorizedContractIds.join(
          ', '
        )}]. Tentativa de acesso ao ${targetExplicitContract} BLOQUEADA antes da consulta.`
      );

      // Registra também na auditoria central de acesso
      MokedService.verifyContractAccess({
        userId: matchedUser.id,
        targetContractId: targetExplicitContract,
        channel: 'WhatsApp Bot',
        recordAudit: true,
      });

      return MokedPersistence.updateDb((db) => {
        const entry: WhatsAppMessageLog = {
          id: `WA-${Date.now()}`,
          timestamp: timeShort(),
          senderPhone: params.senderPhone,
          matchedUserName: matchedUser.name,
          matchedRoleLabel: matchedUser.roleLabel,
          authorizedContracts: matchedUser.authorizedContractIds,
          question: params.question,
          response: `⛔ Acesso não autorizado ao ${
            targetExplicitContract === 'CTR-B' ? 'Contrato B' : 'Contrato A'
          }: Seu número (${params.senderPhone}) está vinculado ao perfil "${
            matchedUser.roleLabel
          }" com acesso exclusivo a [${matchedUser.authorizedContractIds.join(
            ', '
          )}]. Não é permitido consultar ocorrências ou visitas de outros contratos.`,
          decisionStatus: 'blocked_contract',
          permissionSteps,
        };
        db.whatsappLogs.unshift(entry);
        return entry;
      });
    }

    permissionSteps.push(
      `2. Escopo de Contrato aplicado antes da query: filtrando base exclusivamente por [${matchedUser.authorizedContractIds.join(
        ', '
      )}]`
    );
    permissionSteps.push(
      matchedUser.canViewInternalNotes
        ? `3. Filtro de Visibilidade: perfil interno (${matchedUser.roleLabel}) autorizado a ver status operacionais internos.`
        : `3. Filtro de Visibilidade (Cliente): anotações internas (internalNotes) e laudos não publicados pelo consultor foram bloqueados.`
    );

    // 3. Executa a consulta sobre a mesma base usada pelo aplicativo
    const db = MokedPersistence.readDb();
    const allowedSet = new Set(matchedUser.authorizedContractIds);
    const scopedOccurrences = db.occurrences
      .filter((o) => allowedSet.has(o.contractId))
      .map((o) => sanitizeOccurrenceForViewer(o, matchedUser));

    const scopedTrainings = db.trainingSessions.filter((t) => allowedSet.has(t.contractId));
    const scopedAlerts = db.monitoringAlerts.filter((a) => allowedSet.has(a.contractId));

    // Cenário A: "Quais pendências vencem hoje nos meus contratos?"
    if (/\b(pendencia|pendencias|vencem hoje|vence hoje|prazo hoje|atrasad)\b/.test(normQ)) {
      const dueTodayOccs = scopedOccurrences.filter(
        (o) => o.dueToday && o.status !== 'concluida'
      );
      const pendingTrainings = scopedTrainings.filter(
        (t) => t.replacementNeededCount > 0
      );

      if (dueTodayOccs.length === 0 && pendingTrainings.length === 0) {
        return this.saveLog({
          senderPhone: params.senderPhone,
          matchedUser,
          question: params.question,
          decisionStatus: 'allowed',
          permissionSteps,
          response: `Olá, ${matchedUser.name.split(' ')[0]}! Consultei a base em tempo real para [${matchedUser.authorizedContractIds.join(
            ', '
          )}] e não há nenhuma pendência crítica vencendo hoje.`,
        });
      }

      const lines: string[] = [
        `Olá, ${matchedUser.name.split(' ')[0]}! Aqui estão as pendências que vencem hoje nos seus contratos autorizados (${matchedUser.authorizedContractIds.join(', ')}):`,
      ];

      for (const occ of dueTodayOccs) {
        if (matchedUser.role === 'cliente' && !occ.clientPublication?.published) {
          lines.push(
            `• [${occ.contractId} · ${occ.id}] ${occ.title} — Em tratamento técnico interno (aguardando publicação do consultor).`
          );
        } else {
          const respInfo = occ.assignedResponsibleName
            ? ` | Resp.: ${occ.assignedResponsibleName}`
            : ' | Aguardando atribuição';
          const deadlineInfo = occ.deadlineLabel ? ` (${occ.deadlineLabel})` : ' (Vence hoje)';
          lines.push(
            `• [${occ.contractId} · ${occ.id}] ${occ.title} — Status: ${occ.statusLabel}${respInfo}${deadlineInfo}`
          );
        }
      }

      if (matchedUser.role !== 'cliente') {
        for (const trn of pendingTrainings) {
          lines.push(
            `• [${trn.contractId} · Treinamento ${trn.id}] ${trn.replacementNeededCount} reposição(ões) pendente(s) (${trn.courseTitle}).`
          );
        }
      }

      return this.saveLog({
        senderPhone: params.senderPhone,
        matchedUser,
        question: params.question,
        decisionStatus: 'allowed',
        permissionSteps,
        response: lines.join('\n'),
      });
    }

    // Cenário B: "Qual é a situação do portão no meu contrato?"
    if (/\b(portao|docas|eclusa|motor do portao)\b/.test(normQ)) {
      const gateOcc = scopedOccurrences.find(
        (o) =>
          o.id === 'OC-PORTAO-A1' ||
          o.assetOrTopic === 'Portão Principal / Docas' ||
          normalizeText(o.title).includes('portao')
      );

      // Se a falha no portão ainda não foi registrada pelo Líder no aplicativo
      if (!gateOcc) {
        const gateAlert = scopedAlerts.find((a) => a.alertType === 'Sensor de Portão');
        permissionSteps.push(
          `4. Verificação de Suficiência de Dados: nenhuma ocorrência aberta para "Portão" no ${matchedUser.authorizedContractIds.join(', ')}.`
        );

        return this.saveLog({
          senderPhone: params.senderPhone,
          matchedUser,
          question: params.question,
          decisionStatus: 'insufficient_data',
          permissionSteps,
          response: gateAlert
            ? `ℹ️ Informação parcial na base: Ainda não há ocorrência formal registrada pelo Líder de Posto para o portão do Contrato A (há apenas um alerta preventivo ${gateAlert.id} da Central de Monitoramento às ${gateAlert.timestamp}). Assim que o Líder registrar a ocorrência no aplicativo, o status aparecerá aqui.`
            : `ℹ️ Não há registros de ocorrência para o portão no seu contrato autorizado (${matchedUser.authorizedContractIds.join(', ')}).`,
        });
      }

      // Se quem pergunta é o CLIENTE, verifica se o Consultor já revisou e publicou a atualização!
      if (matchedUser.role === 'cliente') {
        if (!gateOcc.clientPublication?.published) {
          permissionSteps.push(
            `4. Controle de Publicação ao Cliente: ocorrência ${gateOcc.id} existe (${gateOcc.status}), mas ainda NÃO foi publicada pelo Consultor. Retornando aviso sem expor notas internas.`
          );

          return this.saveLog({
            senderPhone: params.senderPhone,
            matchedUser,
            question: params.question,
            decisionStatus: 'insufficient_data',
            permissionSteps,
            response: `⏳ Atualização em andamento (${gateOcc.id} · Contrato A): Foi registrado um atendimento operacional para "${gateOcc.title}" (${gateOcc.statusLabel}), sob acompanhamento do consultor Henrique Vasconcelos. Os detalhes técnicos estão em revisão e serão liberados para sua visualização assim que o consultor publicar o parecer final.`,
          });
        }

        // O Consultor JÁ publicou para o Cliente! Retorna o resumo limpo + próximo passo (sem notas internas)
        const pub = gateOcc.clientPublication;
        const decisionText =
          pub.requiresClientDecision && pub.clientDecisionStatus === 'aguardando_cliente'
            ? `\n👉 Aguarda sua decisão no painel: "${pub.clientDecisionPrompt}"`
            : pub.clientDecisionStatus === 'aprovado_pelo_cliente'
              ? `\n✅ Decisão já aprovada por você no painel.`
              : '';

        return this.saveLog({
          senderPhone: params.senderPhone,
          matchedUser,
          question: params.question,
          decisionStatus: 'allowed',
          permissionSteps,
          response: `✅ Situação do Portão (${gateOcc.contractName} · ${gateOcc.id}):\n• Status: ${gateOcc.statusLabel}\n• Resumo publicado por ${pub.publishedBy}: ${pub.summaryForClient}\n• Próximo passo: ${pub.nextStepForClient}${decisionText}`,
        });
      }

      // Se quem pergunta é perfil interno (Consultor, Líder, Alta Gestão, etc.)
      return this.saveLog({
        senderPhone: params.senderPhone,
        matchedUser,
        question: params.question,
        decisionStatus: 'allowed',
        permissionSteps,
        response: `📋 Status Operacional do Portão (${gateOcc.id} · ${gateOcc.contractId}):\n• Status: ${gateOcc.statusLabel}\n• Responsável: ${gateOcc.assignedResponsibleName ?? 'Aguardando atribuição do Consultor'}\n• Prazo: ${gateOcc.deadlineLabel ?? 'A definir'}\n• Publicado ao cliente? ${gateOcc.clientPublication?.published ? 'Sim' : 'Ainda não'}`,
      });
    }

    // Cenário C: Consulta sobre visitas ou situação geral do contrato
    if (/\b(visita|visitas|situacao do meu contrato|resumo do contrato|como esta meu contrato)\b/.test(normQ)) {
      const visits = db.consultantVisits
        .filter((v) => allowedSet.has(v.contractId))
        .filter((v) => (matchedUser.role === 'cliente' ? v.sharedWithClient : true));

      const contracts = db.contracts.filter((c) => allowedSet.has(c.id));
      const summaryLines = contracts.map(
        (c) => `• ${c.name}: ${c.statusLabel} (Índice SLA: ${c.slaHealthScore}% · ${c.activePostsCount} postos ativos)`
      );

      if (visits.length > 0) {
        summaryLines.push(
          `Última visita registrada (${visits[0].visitDate}): "${visits[0].publicSummary}" — Próximo passo: ${visits[0].nextStep}`
        );
      }

      return this.saveLog({
        senderPhone: params.senderPhone,
        matchedUser,
        question: params.question,
        decisionStatus: 'allowed',
        permissionSteps,
        response: `📊 Resumo para ${matchedUser.name.split(' ')[0]}:\n${summaryLines.join('\n')}`,
      });
    }

    // Cenário C2 (Skill: Agente de IA — Atendimento via WhatsApp.md): Escalada para Atendimento Humano
    if (
      /\b(falar com humano|atendente|falar com o consultor|consultor humano|transferir|pessoa real|emergencia)\b/.test(
        normQ
      )
    ) {
      permissionSteps.push(
        `4. Protocolo de Escalada Humana (Skill Agente WhatsApp): solicitante ${matchedUser.name} transferido para o Consultor Henrique Vasconcelos com contexto de [${matchedUser.authorizedContractIds.join(', ')}].`
      );

      return this.saveLog({
        senderPhone: params.senderPhone,
        matchedUser,
        question: params.question,
        decisionStatus: 'allowed',
        permissionSteps,
        response: WHATSAPP_AGENT_BLUEPRINT.humanTransferMessage,
      });
    }

    // Cenário D: Quando NÃO HÁ informação suficiente na base para responder à pergunta
    permissionSteps.push(
      `4. Verificação de Suficiência de Dados: a pergunta "${params.question}" solicita dados que não constam nos registros estruturados de [${matchedUser.authorizedContractIds.join(', ')}].`
    );

    return this.saveLog({
      senderPhone: params.senderPhone,
      matchedUser,
      question: params.question,
      decisionStatus: 'insufficient_data',
      permissionSteps,
      response: `⚠️ Informação insuficiente na base: Consultei os registros autorizados para o seu perfil (${matchedUser.roleLabel} · ${matchedUser.authorizedContractIds.join(
        ', '
      )}), mas não encontrei dados específicos sobre "${
        params.question
      }".\n\nVocê pode perguntar sobre:\n• "Qual é a situação do portão no meu contrato?"\n• "Quais pendências vencem hoje nos meus contratos?"\n• "Qual o resumo e últimas visitas do meu contrato?"\nOu acionar diretamente o consultor responsável (Henrique Vasconcelos).`,
    });
  }

  private static saveLog(params: {
    senderPhone: string;
    matchedUser: { name: string; roleLabel: string; authorizedContractIds: ContractId[] };
    question: string;
    response: string;
    decisionStatus: WhatsAppMessageLog['decisionStatus'];
    permissionSteps: string[];
  }): WhatsAppMessageLog {
    return MokedPersistence.updateDb((db) => {
      const entry: WhatsAppMessageLog = {
        id: `WA-${Date.now()}`,
        timestamp: timeShort(),
        senderPhone: params.senderPhone,
        matchedUserName: params.matchedUser.name,
        matchedRoleLabel: params.matchedUser.roleLabel,
        authorizedContracts: params.matchedUser.authorizedContractIds,
        question: params.question,
        response: params.response,
        decisionStatus: params.decisionStatus,
        permissionSteps: params.permissionSteps,
      };
      db.whatsappLogs.unshift(entry);
      return entry;
    });
  }
}

