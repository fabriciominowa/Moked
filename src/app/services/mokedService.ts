import {
  AccessControlAuditEntry,
  ConsultantVisitRecord,
  ContractId,
  ContractInfo,
  MokedUser,
  MonitoringAlertRecord,
  OccurrenceRecord,
  RoleId,
  ShiftLogRecord,
  TrainingSessionRecord,
} from '@/types/moked';
import { MokedPersistence } from './mokedPersistence';

export const CORPORATE_EMAIL_TO_ROLE: Record<string, RoleId> = {
  'gestao@moked.com.br': 'alta_gestao',
  'fernanda.tavares@moked.com.br': 'alta_gestao',
  'consultor@moked.com.br': 'consultor',
  'henrique.vasconcelos@moked.com.br': 'consultor',
  'lider@moked.com.br': 'lider_posto',
  'sergio.nascimento@moked.com.br': 'lider_posto',
  'terceirizado@tecportoes.com.br': 'terceirizados',
  'carlos.eduardo@tecportoes.com.br': 'terceirizados',
  'monitoramento@moked.com.br': 'central_monitoramento',
  'patricia.gomes@moked.com.br': 'central_monitoramento',
  'treinamento@moked.com.br': 'treinamento',
  'roberto.silva@moked.com.br': 'treinamento',
  'cliente@alphalogistica.com.br': 'cliente',
  'marina.alencar@alphalogistica.com.br': 'cliente',
};

export interface EmailPermissionInspection {
  found: boolean;
  queriedEmail: string;
  canonicalEmail?: string;
  user?: MokedUser;
  isManagerFullAccess: boolean;
  authorizedContracts: ContractId[];
  blockedContracts: ContractId[];
  visibleAreasCount: number;
  visibleAreaNames: string[];
  canViewInternalNotes: boolean;
  summaryHeadline: string;
  whatWillAppear: string[];
}

function nowLabel(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} às ${hh}:${min}`;
}

/**
 * Remove anotações internas e detalhes técnicos não publicados quando o visualizador é o Cliente.
 */
export function sanitizeOccurrenceForViewer(
  occ: OccurrenceRecord,
  viewer: MokedUser
): OccurrenceRecord {
  if (viewer.canViewInternalNotes && viewer.role !== 'cliente') {
    return occ;
  }

  return {
    ...occ,
    internalNotes: undefined,
    thirdPartyVisit: occ.thirdPartyVisit
      ? {
          ...occ.thirdPartyVisit,
          technicalInternalRecommendation:
            '[Restrito à operação interna — ocultado na visão do cliente]',
        }
      : undefined,
    timeline: occ.timeline.filter((item) => !item.internalOnly),
  };
}

export function sanitizeVisitForViewer(
  visit: ConsultantVisitRecord,
  viewer: MokedUser
): ConsultantVisitRecord {
  if (viewer.canViewInternalNotes && viewer.role !== 'cliente') {
    return visit;
  }
  return {
    ...visit,
    internalAuditNote: undefined,
  };
}

export class MokedService {
  public static getUserById(userId: string): MokedUser | undefined {
    const db = MokedPersistence.readDb();
    return db.users.find((u) => u.id === userId);
  }

  public static getUserByPhone(phone: string): MokedUser | undefined {
    const db = MokedPersistence.readDb();
    const cleanInput = phone.replace(/\D/g, '');
    return db.users.find((u) => u.whatsappPhone.replace(/\D/g, '') === cleanInput);
  }

  /**
   * Resolve um usuário a partir do e-mail corporativo (suporta tanto o e-mail curto
   * como gestao@moked.com.br quanto o e-mail completo fernanda.tavares@moked.com.br).
   */
  public static resolveUserByEmail(email: string): MokedUser | undefined {
    const db = MokedPersistence.readDb();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return undefined;

    const directMatch = db.users.find((u) => u.email.toLowerCase() === normalized);
    if (directMatch) return directMatch;

    const mappedRole = CORPORATE_EMAIL_TO_ROLE[normalized];
    if (mappedRole) {
      return db.users.find((u) => u.role === mappedRole);
    }

    return undefined;
  }

  /**
   * Faz a conferência completa de permissões por e-mail para informar exatamente
   * o que aparecerá na tela para aquele e-mail (contratos, áreas, notas internas e Kanban de OS).
   */
  public static inspectEmailAccess(email: string): EmailPermissionInspection {
    const normalized = email.trim().toLowerCase();
    const user = MokedService.resolveUserByEmail(normalized);

    if (!user) {
      return {
        found: false,
        queriedEmail: normalized,
        isManagerFullAccess: false,
        authorizedContracts: [],
        blockedContracts: ['CTR-A', 'CTR-B'],
        visibleAreasCount: 0,
        visibleAreaNames: [],
        canViewInternalNotes: false,
        summaryHeadline: `E-mail "${normalized}" não localizado na matriz de credenciais Moked.`,
        whatWillAppear: [
          'Nenhum contrato ou módulo liberado para e-mail não credenciado.',
        ],
      };
    }

    const isManager = user.role === 'alta_gestao' || user.role === 'consultor';
    const allContracts: ContractId[] = ['CTR-A', 'CTR-B'];
    const authorizedContracts: ContractId[] = isManager
      ? allContracts
      : user.authorizedContractIds;
    const blockedContracts = allContracts.filter((c) => !authorizedContracts.includes(c));

    const allAreaNames = [
      '1. Cliente',
      '2. Consultor',
      '3. Líder de posto',
      '4. Terceirizados',
      '5. Central de Monitoramento',
      '6. Treinamento',
      '7. Alta Gestão',
    ];

    const visibleAreaNames = isManager ? allAreaNames : [`Área exclusiva: ${user.roleLabel}`];

    const whatWillAppear: string[] = isManager
      ? [
          `ACESSO TOTAL DE GESTÃO (${user.roleLabel}): Contratos A e B 100% liberados sem bloqueio.`,
          'Navegação irrestrita pelas 7 áreas operacionais + Quadro Kanban Completo de OS (Trello).',
          'Anotações internas, laudos técnicos confidenciais e trilha de auditoria RBAC visíveis.',
          'Histórico completo de data, hora e responsável de todas as Ordens de Serviço (OS).',
        ]
      : [
          `Escopo de Contrato vinculado ao e-mail: somente [${authorizedContracts.join(', ')}]${
            blockedContracts.length > 0 ? ` (Bloqueio 403 em ${blockedContracts.join(', ')})` : ''
          }.`,
          `Módulo habilitado na barra lateral: apenas "${user.roleLabel}".`,
          user.canViewInternalNotes
            ? 'Anotações operacionais internas habilitadas para este perfil técnico/operacional.'
            : 'Anotações internas e laudos confidenciais OCULTADOS automaticamente (visão limpa do Cliente).',
          `Quadro Kanban de OS filtrado para ${authorizedContracts.join(', ')}.`,
        ];

    return {
      found: true,
      queriedEmail: normalized,
      canonicalEmail: user.email,
      user,
      isManagerFullAccess: isManager,
      authorizedContracts,
      blockedContracts,
      visibleAreasCount: visibleAreaNames.length,
      visibleAreaNames,
      canViewInternalNotes: isManager || user.canViewInternalNotes,
      summaryHeadline: isManager
        ? `ACESSO TOTAL LIBERADO PARA GESTOR (${normalized}) — Todos os Contratos (CTR-A e CTR-B) e todas as 7 Áreas desbloqueadas.`
        : `ESCOPO VINCULADO AO E-MAIL (${normalized}) — Perfil: ${user.roleLabel} · Contratos: [${authorizedContracts.join(', ')}].`,
      whatWillAppear,
    };
  }

  /**
   * Valida se um usuário (por e-mail da sessão ou userId) tem permissão para consultar
   * os dados de determinado contrato e grava o evento na trilha de auditoria de RBAC.
   * Gestores (Alta Gestão e Consultor) SEMPRE têm acesso total autorizado a todos os contratos.
   */
  public static verifyContractAccess(params: {
    userId: string;
    email?: string;
    targetContractId: ContractId;
    channel?: 'Web App' | 'WhatsApp Bot';
    recordAudit?: boolean;
  }): {
    allowed: boolean;
    user?: MokedUser;
    inspectedEmail?: string;
    errorMessage?: string;
    auditEntry?: AccessControlAuditEntry;
  } {
    return MokedPersistence.updateDb((db) => {
      let user: MokedUser | undefined;
      if (params.email) {
        const normalized = params.email.trim().toLowerCase();
        const mappedRole = CORPORATE_EMAIL_TO_ROLE[normalized];
        user =
          db.users.find((u) => u.email.toLowerCase() === normalized) ??
          (mappedRole ? db.users.find((u) => u.role === mappedRole) : undefined);
      }
      if (!user) {
        user = db.users.find((u) => u.id === params.userId);
      }

      if (!user) {
        return {
          allowed: false,
          errorMessage: 'Usuário ou e-mail não encontrado na base de operação.',
        };
      }

      const inspectedEmail = params.email?.trim().toLowerCase() || user.email;
      const isManager = user.role === 'alta_gestao' || user.role === 'consultor';
      const isAllowed =
        isManager || user.authorizedContractIds.includes(params.targetContractId);

      const reason = isAllowed
        ? isManager
          ? `ACESSO TOTAL DE GESTOR LIBERADO (E-mail conferido: ${inspectedEmail}): ${user.name} (${user.roleLabel}) possui permissão irrestrita para consultar ${params.targetContractId}, todas as 7 áreas e notas internas.`
          : `Acesso autorizado ao ${params.targetContractId} para ${user.name} (${user.roleLabel} · ${inspectedEmail}).${
              !user.canViewInternalNotes ? ' Anotações internas filtradas.' : ''
            }`
        : `ACESSO NEGADO (403) [Conferência por E-mail: ${inspectedEmail}]: O perfil "${user.name}" (${user.roleLabel}) possui escopo restrito a [${user.authorizedContractIds.join(
            ', '
          )}] e não tem permissão para consultar dados do ${params.targetContractId}.`;

      let auditEntry: AccessControlAuditEntry | undefined;
      if (params.recordAudit !== false) {
        auditEntry = {
          id: `AUD-${Date.now()}`,
          timestamp: nowLabel(),
          userId: user.id,
          userName: `${user.name} <${inspectedEmail}>`,
          userRole: user.role,
          targetContractId: params.targetContractId,
          channel: params.channel ?? 'Web App',
          allowed: isAllowed,
          reason,
        };
        db.accessAuditLogs.unshift(auditEntry);
      }

      if (!isAllowed) {
        return {
          allowed: false,
          user,
          inspectedEmail,
          errorMessage: reason,
          auditEntry,
        };
      }

      return {
        allowed: true,
        user,
        inspectedEmail,
        auditEntry,
      };
    });
  }

  /**
   * Retorna a visão filtrada do banco de dados de acordo com o perfil ativo.
   */
  public static getAuthorizedSnapshotForUser(userId: string): {
    activeUser: MokedUser;
    allUsers: MokedUser[];
    authorizedContracts: ContractInfo[];
    allContractsMetadata: { id: ContractId; code: string; name: string }[];
    occurrences: OccurrenceRecord[];
    consultantVisits: ConsultantVisitRecord[];
    shiftLogs: ShiftLogRecord[];
    monitoringAlerts: MonitoringAlertRecord[];
    trainingSessions: TrainingSessionRecord[];
    accessAuditLogs: AccessControlAuditEntry[];
    whatsappLogs: MokedPersistence extends never ? never : ReturnType<typeof MokedPersistence.readDb>['whatsappLogs'];
    demoFlowStage: 0 | 1 | 2 | 3;
  } {
    const db = MokedPersistence.readDb();
    const activeUser = db.users.find((u) => u.id === userId) ?? db.users[0];
    const allowedSet = new Set(activeUser.authorizedContractIds);

    const authorizedContracts = db.contracts.filter((c) => allowedSet.has(c.id));

    // O cliente vê apenas ocorrências compartilhadas/publicadas do seu contrato (ou em andamento no seu contrato sem notas internas)
    const rawOccurrences = db.occurrences.filter((o) => allowedSet.has(o.contractId));
    const occurrences = rawOccurrences
      .filter((o) => {
        if (activeUser.role === 'cliente') {
          // O cliente vê ocorrências compartilhadas (clientPublication.published)
          return Boolean(o.clientPublication?.published);
        }
        return true;
      })
      .map((o) => sanitizeOccurrenceForViewer(o, activeUser));

    const consultantVisits = db.consultantVisits
      .filter((v) => allowedSet.has(v.contractId))
      .filter((v) => (activeUser.role === 'cliente' ? v.sharedWithClient : true))
      .map((v) => sanitizeVisitForViewer(v, activeUser));

    const shiftLogs = db.shiftLogs.filter((s) => allowedSet.has(s.contractId));
    const monitoringAlerts = db.monitoringAlerts.filter((m) => allowedSet.has(m.contractId));
    const trainingSessions = db.trainingSessions.filter((t) => allowedSet.has(t.contractId));

    return {
      activeUser,
      allUsers: db.users,
      authorizedContracts,
      allContractsMetadata: db.contracts.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
      })),
      occurrences,
      consultantVisits,
      shiftLogs,
      monitoringAlerts,
      trainingSessions,
      accessAuditLogs: db.accessAuditLogs.slice(0, 15),
      whatsappLogs: db.whatsappLogs,
      demoFlowStage: db.demoFlowStage,
    };
  }

  /**
   * ============================================================================
   * PASSO 1 DO FLUXO DE DEMONSTRAÇÃO:
   * 1a. O líder de posto registra uma falha no portão do Contrato A.
   * ============================================================================
   */
  public static registerGateFailureByLeader(params?: {
    title?: string;
    description?: string;
    postName?: string;
    severity?: 'Alta' | 'Média' | 'Baixa';
  }): OccurrenceRecord {
    return MokedPersistence.updateDb((db) => {
      const existingGate = db.occurrences.find((o) => o.id === 'OC-PORTAO-A1');
      const time = nowLabel();

      const gateOcc: OccurrenceRecord = {
        id: 'OC-PORTAO-A1',
        contractId: 'CTR-A',
        contractName: 'Contrato A · Centro Logístico Alpha',
        postName: params?.postName || 'Posto 01 — Portão Principal & Docas Norte',
        assetOrTopic: 'Portão Principal / Docas',
        title:
          params?.title ||
          'Falha no motor do Portão Eletrônico Principal (Docas Norte — Contrato A)',
        description:
          params?.description ||
          'Portão deslizante das Docas Norte travou semiaberto após passagem de carreta. Operação convertida temporariamente para controle manual com 2 vigilantes na eclusa.',
        severity: params?.severity || 'Alta',
        status: 'aberta_pelo_lider',
        statusLabel: 'Aberta pelo Líder · Aguardando atribuição do Consultor',
        createdByUserId: 'usr-lider-a',
        createdByName: 'Sérgio Nascimento (Líder de Posto)',
        createdAt: time,
        updatedAt: time,
        dueToday: true,
        internalNotes:
          'REGISTRO DO LÍDER (INTERNO): Cremalheira com desgaste visível no trilho norte; posto reforçado com vigilante ronda até chegada da manutenção.',
        timeline: [
          {
            id: `tl-gate-1-${Date.now()}`,
            timestamp: time,
            actorName: 'Sérgio Nascimento (Líder de Posto)',
            actorRole: 'lider_posto',
            stepTitle: '1. Falha no portão registrada pelo Líder de Posto (Contrato A)',
            detail:
              'Portão das Docas Norte travou semiaberto. Controle manual ativado com reforço de vigilante na eclusa.',
          },
        ],
      };

      if (existingGate) {
        const idx = db.occurrences.findIndex((o) => o.id === 'OC-PORTAO-A1');
        db.occurrences[idx] = gateOcc;
      } else {
        db.occurrences.unshift(gateOcc);
      }

      // Atualiza status do Contrato A para Atenção Operacional
      const ctrA = db.contracts.find((c) => c.id === 'CTR-A');
      if (ctrA) {
        ctrA.statusLabel = 'Pendência Crítica';
        ctrA.slaHealthScore = 84;
      }

      return gateOcc;
    });
  }

  /**
   * ============================================================================
   * PASSO 1b DO FLUXO DE DEMONSTRAÇÃO:
   * O consultor responsável vê a ocorrência no seu painel, atribui um responsável
   * e define um prazo.
   * ============================================================================
   */
  public static assignOccurrenceByConsultant(params: {
    occurrenceId: string;
    responsibleName: string;
    responsibleCompany: string;
    deadlineLabel: string;
    internalNote?: string;
  }): OccurrenceRecord {
    return MokedPersistence.updateDb((db) => {
      let occ = db.occurrences.find((o) => o.id === params.occurrenceId);
      if (!occ) {
        // Se ainda não existia, cria a falha do portão primeiro
        occ = MokedService.registerGateFailureByLeader();
        occ = db.occurrences.find((o) => o.id === 'OC-PORTAO-A1')!;
      }

      const time = nowLabel();
      occ.assignedResponsibleName = params.responsibleName;
      occ.assignedResponsibleCompany = params.responsibleCompany;
      occ.deadlineLabel = params.deadlineLabel;
      occ.dueToday = true;
      occ.status = 'atribuida_pelo_consultor';
      occ.statusLabel = `Atribuída a ${params.responsibleName} · Prazo: ${params.deadlineLabel}`;
      occ.updatedAt = time;

      if (params.internalNote) {
        occ.internalNotes = `${occ.internalNotes ? occ.internalNotes + ' | ' : ''}NOTA INTERNA DO CONSULTOR: ${params.internalNote}`;
      } else if (!occ.internalNotes?.includes('NOTA INTERNA DO CONSULTOR')) {
        occ.internalNotes = `${occ.internalNotes ?? ''} | NOTA INTERNA DO CONSULTOR (RESTRITA): Acionado SLA emergencial de 4h com a TecPortões; verificar se houve impacto de empilhadeira no trilho antes de aprovar orçamento extra.`;
      }

      occ.timeline.push({
        id: `tl-gate-2-${Date.now()}`,
        timestamp: time,
        actorName: 'Henrique Vasconcelos (Consultor)',
        actorRole: 'consultor',
        stepTitle: '2. Responsável e prazo atribuídos pelo Consultor',
        detail: `Responsável: ${params.responsibleName} (${params.responsibleCompany}) · Prazo definido: ${params.deadlineLabel}.`,
      });

      const ctrA = db.contracts.find((c) => c.id === 'CTR-A');
      if (ctrA) {
        ctrA.statusLabel = 'Atenção Operacional';
        ctrA.slaHealthScore = 88;
      }

      if (db.demoFlowStage < 1) {
        db.demoFlowStage = 1;
      }

      return occ;
    });
  }

  /**
   * ============================================================================
   * PASSO 2a DO FLUXO DE DEMONSTRAÇÃO:
   * O técnico terceirizado registra a visita (entrada e saída) e o serviço realizado.
   * ============================================================================
   */
  public static registerVisitByTechnician(params: {
    occurrenceId: string;
    technicianName?: string;
    companyName?: string;
    checkInTime?: string;
    checkOutTime?: string;
    servicePerformed?: string;
    technicalInternalRecommendation?: string;
  }): OccurrenceRecord {
    return MokedPersistence.updateDb((db) => {
      let occ = db.occurrences.find((o) => o.id === params.occurrenceId);
      if (!occ) {
        throw new Error('Ocorrência não encontrada para registro de visita técnica.');
      }

      const time = nowLabel();
      const visitDetail = {
        visitId: `VTEC-${Date.now().toString().slice(-4)}`,
        technicianName: params.technicianName || 'Carlos Eduardo',
        companyName: params.companyName || 'TecPortões & Automação Industrial',
        checkInTime: params.checkInTime || '10:15',
        checkOutTime: params.checkOutTime || '11:40',
        servicePerformed:
          params.servicePerformed ||
          'Substituição da placa inversora de comando, realinhamento do trilho norte e destravamento mecânico do motor. Portão testado em 15 ciclos completos de abertura e fechamento.',
        technicalInternalRecommendation:
          params.technicalInternalRecommendation ||
          'LAUDO TÉCNICO INTERNO (RESTRITO): Identificado desgaste de 70% na engrenagem secundária de bronze. Funciona normalmente hoje, mas recomendamos cotar troca preventiva em até 15 dias (custo estimado R$ 680).',
        registeredAt: time,
      };

      occ.thirdPartyVisit = visitDetail;
      occ.status = 'visita_registrada_tecnico';
      occ.statusLabel = 'Visita técnica concluída · Aguardando revisão do Consultor';
      occ.updatedAt = time;
      occ.internalNotes = `${occ.internalNotes ?? ''} | ${visitDetail.technicalInternalRecommendation}`;

      occ.timeline.push({
        id: `tl-gate-3-${Date.now()}`,
        timestamp: time,
        actorName: `${visitDetail.technicianName} (${visitDetail.companyName})`,
        actorRole: 'terceirizados',
        stepTitle: `3. Visita técnica registrada (${visitDetail.checkInTime} às ${visitDetail.checkOutTime})`,
        detail: visitDetail.servicePerformed,
      });

      return occ;
    });
  }

  /**
   * ============================================================================
   * PASSO 2b DO FLUXO DE DEMONSTRAÇÃO:
   * O consultor revisa o registro do técnico e publica uma atualização para o cliente
   * (mantendo as anotações internas restritas).
   * ============================================================================
   */
  public static publishUpdateToClientByConsultant(params: {
    occurrenceId: string;
    summaryForClient?: string;
    nextStepForClient?: string;
    requiresClientDecision?: boolean;
    clientDecisionPrompt?: string;
    additionalInternalNote?: string;
  }): OccurrenceRecord {
    return MokedPersistence.updateDb((db) => {
      const occ = db.occurrences.find((o) => o.id === params.occurrenceId);
      if (!occ) {
        throw new Error('Ocorrência não encontrada para publicação ao cliente.');
      }

      const time = nowLabel();
      if (params.additionalInternalNote) {
        occ.internalNotes = `${occ.internalNotes ?? ''} | NOTA CONFIDENCIAL CONSULTOR: ${params.additionalInternalNote}`;
      }

      const requiresDecision = params.requiresClientDecision ?? true;

      occ.clientPublication = {
        published: true,
        summaryForClient:
          params.summaryForClient ||
          'O portão eletrônico das Docas Norte já foi reparado e voltou a operar automaticamente com segurança (visita técnica realizada das 10:15 às 11:40, com substituição da placa inversora e realinhamento do trilho).',
        nextStepForClient:
          params.nextStepForClient ||
          'Confirmar janela de 30 minutos na próxima semana para substituição preventiva da engrenagem secundária.',
        requiresClientDecision: requiresDecision,
        clientDecisionPrompt:
          params.clientDecisionPrompt ||
          'Autorizar janela preventiva de 30 min na próxima terça-feira (12:30) para troca da engrenagem secundária?',
        clientDecisionStatus: requiresDecision ? 'aguardando_cliente' : 'nao_aplicavel',
        publishedBy: 'Henrique Vasconcelos (Consultor)',
        publishedAt: time,
      };

      occ.status = 'publicada_ao_cliente';
      occ.statusLabel = requiresDecision
        ? 'Portão Operacional · Aguardando decisão do cliente'
        : 'Portão Operacional · Atualização publicada ao cliente';
      occ.updatedAt = time;

      occ.timeline.push({
        id: `tl-gate-4-${Date.now()}`,
        timestamp: time,
        actorName: 'Henrique Vasconcelos (Consultor)',
        actorRole: 'consultor',
        stepTitle: '4. Revisão concluída e atualização publicada para o Cliente',
        detail: `Publicado ao cliente: "${occ.clientPublication.summaryForClient}" Próximo passo: "${occ.clientPublication.nextStepForClient}". (Anotações internas preservadas com acesso restrito).`,
      });

      const ctrA = db.contracts.find((c) => c.id === 'CTR-A');
      if (ctrA) {
        ctrA.statusLabel = 'Operação Normal';
        ctrA.slaHealthScore = 95;
      }

      if (db.demoFlowStage < 2) {
        db.demoFlowStage = 2;
      }

      return occ;
    });
  }

  /**
   * Permite ao cliente registrar sua decisão no próprio painel sobre um próximo passo publicado.
   */
  public static approveClientDecision(params: {
    occurrenceId: string;
    userId: string;
  }): OccurrenceRecord {
    return MokedPersistence.updateDb((db) => {
      const occ = db.occurrences.find((o) => o.id === params.occurrenceId);
      if (!occ || !occ.clientPublication) {
        throw new Error('Ocorrência compartilhada não encontrada.');
      }

      const time = nowLabel();
      occ.clientPublication.clientDecisionStatus = 'aprovado_pelo_cliente';
      occ.clientPublication.nextStepForClient =
        'Janela preventiva aprovada pelo cliente para terça-feira às 12:30. Equipe técnica agendada.';
      occ.status = 'concluida';
      occ.statusLabel = 'Concluída · Janela preventiva aprovada pelo Cliente';
      occ.dueToday = false;
      occ.updatedAt = time;

      occ.timeline.push({
        id: `tl-gate-5-${Date.now()}`,
        timestamp: time,
        actorName: 'Marina Alencar (Cliente · Contrato A)',
        actorRole: 'cliente',
        stepTitle: '5. Decisão confirmada pelo Cliente no painel',
        detail: 'Cliente autorizou a janela preventiva sugerida pelo consultor.',
      });

      const ctrA = db.contracts.find((c) => c.id === 'CTR-A');
      if (ctrA) {
        ctrA.statusLabel = 'Operação Normal';
        ctrA.slaHealthScore = 98;
      }

      if (db.demoFlowStage < 3) {
        db.demoFlowStage = 3;
      }

      return occ;
    });
  }

  /**
   * ============================================================================
   * Ações adicionais para alimentar Líder, Consultor, Monitoramento e Treinamento
   * ============================================================================
   */
  public static createShiftLog(params: {
    contractId: ContractId;
    postName: string;
    vigilanteName: string;
    eventType: 'Falta com Cobertura' | 'Atraso no Turno' | 'Troca Operacional';
    forwardingStatus: string;
  }): ShiftLogRecord {
    return MokedPersistence.updateDb((db) => {
      const rec: ShiftLogRecord = {
        id: `SHF-${Date.now().toString().slice(-4)}`,
        contractId: params.contractId,
        contractName:
          params.contractId === 'CTR-A'
            ? 'Contrato A · Centro Logístico Alpha'
            : 'Contrato B · Parque Farmacêutico Beta',
        postName: params.postName,
        leaderName: 'Sérgio Nascimento',
        shiftLabel: 'Turno Atual',
        vigilanteName: params.vigilanteName,
        eventType: params.eventType,
        forwardingStatus: params.forwardingStatus,
        createdAt: nowLabel(),
      };
      db.shiftLogs.unshift(rec);
      return rec;
    });
  }

  public static createMonitoringAlert(params: {
    contractId: ContractId;
    equipmentCode: string;
    zone: string;
    alertType: MonitoringAlertRecord['alertType'];
    severity: MonitoringAlertRecord['severity'];
    outcomeNote: string;
  }): MonitoringAlertRecord {
    return MokedPersistence.updateDb((db) => {
      const alert: MonitoringAlertRecord = {
        id: `MON-${Date.now().toString().slice(-4)}`,
        contractId: params.contractId,
        contractName:
          params.contractId === 'CTR-A'
            ? 'Contrato A · Centro Logístico Alpha'
            : 'Contrato B · Parque Farmacêutico Beta',
        equipmentCode: params.equipmentCode,
        zone: params.zone,
        alertType: params.alertType,
        severity: params.severity,
        status: 'Encaminhado ao Consultor',
        operatorName: 'Patrícia Gomes (CCO)',
        forwardedTo: 'Henrique Vasconcelos (Consultor)',
        outcomeNote: params.outcomeNote,
        timestamp: nowLabel(),
      };
      db.monitoringAlerts.unshift(alert);
      return alert;
    });
  }

  public static createConsultantVisit(params: {
    contractId: ContractId;
    objective: string;
    publicSummary: string;
    internalAuditNote?: string;
    sharedWithClient: boolean;
    nextStep: string;
  }): ConsultantVisitRecord {
    return MokedPersistence.updateDb((db) => {
      const visit: ConsultantVisitRecord = {
        id: `VIS-${Date.now().toString().slice(-4)}`,
        contractId: params.contractId,
        contractName:
          params.contractId === 'CTR-A'
            ? 'Contrato A · Centro Logístico Alpha'
            : 'Contrato B · Parque Farmacêutico Beta',
        consultantName: 'Henrique Vasconcelos',
        visitDate: nowLabel(),
        objective: params.objective,
        publicSummary: params.publicSummary,
        internalAuditNote: params.internalAuditNote,
        sharedWithClient: params.sharedWithClient,
        nextStep: params.nextStep,
      };
      db.consultantVisits.unshift(visit);
      return visit;
    });
  }

  public static createTrainingSession(params: {
    contractId: ContractId;
    courseTitle: string;
    instructorName?: string;
    sessionDate?: string;
    createdBy?: string;
    initialParticipantName?: string;
    initialPostName?: string;
  }): TrainingSessionRecord {
    return MokedPersistence.updateDb((db) => {
      const time = nowLabel();
      const participants = params.initialParticipantName
        ? [
            {
              employeeName: params.initialParticipantName,
              postName: params.initialPostName || 'Posto 01 — Docas Norte',
              status: 'Presente' as const,
              registeredAt: time,
            },
          ]
        : [];

      const session: TrainingSessionRecord = {
        id: `TRN-${Date.now().toString().slice(-4)}`,
        contractId: params.contractId,
        contractName:
          params.contractId === 'CTR-A'
            ? 'Contrato A · Centro Logístico Alpha'
            : 'Contrato B · Parque Farmacêutico Beta',
        courseTitle:
          params.courseTitle ||
          'Reciclagem Tática de Controle de Acesso, Eclusas e Resposta a Emergências',
        instructorName: params.instructorName || 'Capitão Roberto Silva',
        sessionDate: params.sessionDate || `${time} (Turma Aberta)`,
        totalEnrolled: participants.length,
        presentCount: participants.length,
        absentCount: 0,
        replacementNeededCount: 0,
        status: 'Agendada',
        createdBy: params.createdBy || 'Capitão Roberto Silva (Academia Moked)',
        createdAt: time,
        participants,
        consultantVisibilityNote:
          'Nova turma criada e disponível para inscrição/participação dos profissionais do contrato.',
      };

      db.trainingSessions.unshift(session);
      return session;
    });
  }

  public static enrollOrUpdateTrainingParticipant(params: {
    trainingId: string;
    employeeName: string;
    postName?: string;
    status?: 'Presente' | 'Ausente — Reposição Necessária';
  }): TrainingSessionRecord {
    return MokedPersistence.updateDb((db) => {
      const session = db.trainingSessions.find((t) => t.id === params.trainingId);
      if (!session) {
        throw new Error('Turma de treinamento não encontrada.');
      }

      const time = nowLabel();
      const targetName = params.employeeName.trim();
      const desiredStatus = params.status || 'Presente';
      const existingIdx = session.participants.findIndex(
        (p) => p.employeeName.toLowerCase() === targetName.toLowerCase()
      );

      if (existingIdx >= 0) {
        session.participants[existingIdx] = {
          ...session.participants[existingIdx],
          postName: params.postName || session.participants[existingIdx].postName,
          status: desiredStatus,
          registeredAt: time,
        };
      } else {
        session.participants.push({
          employeeName: targetName,
          postName: params.postName || 'Posto Operacional Credenciado',
          status: desiredStatus,
          registeredAt: time,
        });
      }

      const presentCount = session.participants.filter((p) => p.status === 'Presente').length;
      const absentItems = session.participants.filter((p) => p.status !== 'Presente');
      const absentCount = absentItems.length;

      session.totalEnrolled = session.participants.length;
      session.presentCount = presentCount;
      session.absentCount = absentCount;
      session.replacementNeededCount = absentCount;

      if (absentCount > 0) {
        session.status = 'Concluída com Pendência de Reposição';
        const names = absentItems.map((a) => a.employeeName).join(', ');
        session.consultantVisibilityNote = `${absentCount} profissional(is) (${names}) com pendência de reposição obrigatória registrada em ${time}. Visível na fila do Consultor.`;
      } else if (session.status !== 'Agendada') {
        session.status = '100% Concluída';
        session.consultantVisibilityNote = `Turma 100% presente (${presentCount}/${session.totalEnrolled}) sem pendências de reposição (atualizado em ${time}).`;
      } else {
        session.consultantVisibilityNote = `Turma disponível com ${presentCount} participante(s) confirmado(s) em ${time}. Sem pendências de reposição.`;
      }

      return session;
    });
  }
}

