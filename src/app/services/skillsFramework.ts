/**
 * Catálogo e Artefatos Operacionais gerados a partir das bibliotecas locais:
 * - `skills-ia-main/Código/Agente de IA — Atendimento via WhatsApp.md`
 * - `skills-ia-main/Código/Autenticação e Autorização (Implementação).md`
 * - `skills-ia-main/Código/Modelagem de Banco de Dados (Schema).md`
 * - `skills-ia-main/Código/Design de API RESTful (Boas Práticas).md`
 * - `skills-ia-main/Código/Testes Unitários (Framework de Escrita).md`
 * - `skills-ia-main/Operações/Sistema de SLA e Prazos por Tipo de Demanda.md`
 * - `skills-ia-main/Operações/Mapa de Riscos Operacionais.md`
 * - `skills-ia-main/Operações/Plano de Treinamento Operacional.md`
 * - `skills-ia-main/Operações/Relatório Operacional Semanal.md`
 * - `skills-ia-main/Produto/Relatório Executivo (C-Level Summary).md`
 * - `skills/LlamaGameDesign.Modelfile.txt` (Árvores de diálogo e tabelas de decisão)
 */

export interface AppliedSkillMetadata {
  id: string;
  sourceFolder: 'skills-ia-main' | 'skills';
  category: string;
  skillFileName: string;
  targetMokedArea: string;
  howItWasApplied: string;
}

export interface OperationalRiskMatrixItem {
  code: string;
  contractId: 'CTR-A' | 'CTR-B';
  riskDescription: string;
  processStage: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number;
  classification: 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
  preventiveControl: string;
  detectiveControl: string;
  owner: string;
}

export interface SlaDemandRule {
  demandType: string;
  severity: 'Crítica' | 'Alta' | 'Média' | 'Preventiva';
  targetResponseSla: string;
  targetResolutionSla: string;
  prioritizationRule: string;
  escalationTrigger: string;
}

export interface WhatsAppAgentBlueprint {
  agentName: string;
  personaAndTone: string;
  systemPrompt: string;
  welcomeMessage: string;
  humanTransferMessage: string;
  dialogueTree: {
    scenario: string;
    triggerExample: string;
    rbacCheck: string;
    botDecision: string;
  }[];
}

export const APPLIED_SKILLS_REGISTRY: AppliedSkillMetadata[] = [
  {
    id: 'skill-wa-agent',
    sourceFolder: 'skills-ia-main',
    category: 'Código',
    skillFileName: 'Código/Agente de IA — Atendimento via WhatsApp.md',
    targetMokedArea: 'Canal WhatsApp Rápido (Todas as Áreas)',
    howItWasApplied:
      'Define o System Prompt do MokedBot, mensagem de boas-vindas, regras estritas do que PODE e NÃO PODE responder por perfil/contrato e protocolo de escalada para o consultor humano.',
  },
  {
    id: 'skill-auth-rbac',
    sourceFolder: 'skills-ia-main',
    category: 'Código',
    skillFileName: 'Código/Autenticação e Autorização (Implementação).md',
    targetMokedArea: 'Motor de Permissões RBAC (Contratos A e B + Notas Internas)',
    howItWasApplied:
      'Aplica os princípios de Defesa em Profundidade, Menor Privilégio por role (7 perfis) e Falha Segura (bloqueio 403 FORBIDDEN antes de consultar dados de outro contrato).',
  },
  {
    id: 'skill-db-schema',
    sourceFolder: 'skills-ia-main',
    category: 'Código',
    skillFileName: 'Código/Modelagem de Banco de Dados (Schema).md',
    targetMokedArea: 'Arquitetura de Dados Multi-Contrato (CTR-A e CTR-B)',
    howItWasApplied:
      'Estrutura o isolamento multi-tenant por contract_id, separando colunas operacionais restritas (internal_notes) da camada de publicação ao cliente (client_publications).',
  },
  {
    id: 'skill-rest-api',
    sourceFolder: 'skills-ia-main',
    category: 'Código',
    skillFileName: 'Código/Design de API RESTful (Boas Práticas).md',
    targetMokedArea: 'Endpoints /api/state e /api/whatsapp',
    howItWasApplied:
      'Padroniza respostas HTTP e payloads de erro estruturados ({ error: { code, message, status } }) em bloqueios de autorização 400/403/404.',
  },
  {
    id: 'skill-sla-demanda',
    sourceFolder: 'skills-ia-main',
    category: 'Operações',
    skillFileName: 'Operações/Sistema de SLA e Prazos por Tipo de Demanda.md',
    targetMokedArea: 'Consultor & Líder de Posto',
    howItWasApplied:
      'Define a tabela oficial de SLAs por tipo de ocorrência (Falha de Portão/Eclusa = SLA Crítico 4h; CFTV = SLA Alto 8h) evitando prazos ad-hoc.',
  },
  {
    id: 'skill-mapa-riscos',
    sourceFolder: 'skills-ia-main',
    category: 'Operações',
    skillFileName: 'Operações/Mapa de Riscos Operacionais.md',
    targetMokedArea: 'Consultor, Central de Monitoramento e Alta Gestão',
    howItWasApplied:
      'Classifica os riscos dos Contratos A e B pela matriz Probabilidade × Impacto (1-5) com controles preventivos e detectivos vinculados.',
  },
  {
    id: 'skill-plano-treinamento',
    sourceFolder: 'skills-ia-main',
    category: 'Operações',
    skillFileName: 'Operações/Plano de Treinamento Operacional.md',
    targetMokedArea: 'Área de Treinamento',
    howItWasApplied:
      'Estrutura as turmas com Objetivo Comportamental ("ser capaz de operar sem supervisão"), prática supervisionada em campo e plano de reforço/reposição.',
  },
  {
    id: 'skill-relatorio-semanal',
    sourceFolder: 'skills-ia-main',
    category: 'Operações',
    skillFileName: 'Operações/Relatório Operacional Semanal.md',
    targetMokedArea: 'Consultor & Cliente',
    howItWasApplied:
      'Gera a narrativa operacional da semana conectando fatos, impacto e próximo passo para publicação transparente ao cliente.',
  },
  {
    id: 'skill-exec-summary',
    sourceFolder: 'skills-ia-main',
    category: 'Produto',
    skillFileName: 'Produto/Relatório Executivo (C-Level Summary).md',
    targetMokedArea: 'Alta Gestão',
    howItWasApplied:
      'Condensa os números dos Contratos A e B em um TL;DR Executivo de 30 segundos, Scorecard Estratégico (🟢🟡🔴) e Decisões Pendentes.',
  },
  {
    id: 'skill-dialogue-tree',
    sourceFolder: 'skills',
    category: 'Modelagem de Árvore de Diálogo & Tabelas',
    skillFileName: 'skills/LlamaGameDesign.Modelfile.txt',
    targetMokedArea: 'Árvore de Decisão do Assistente WhatsApp & Tabelas Markdown',
    howItWasApplied:
      'Aplica a diretriz de estruturar árvores de diálogo ramificadas e matrizes de balanceamento em tabelas claras para o simulador de WhatsApp.',
  },
  {
    id: 'skill-wcag-a11y',
    sourceFolder: 'skills-ia-main',
    category: 'Código & UX',
    skillFileName: 'Código/Acessibilidade Web (WCAG Checklist).md',
    targetMokedArea: 'Usabilidade Global do CRM (WCAG 2.1 AA)',
    howItWasApplied:
      'Implementa landmarks semânticos (aside, nav, main), aria-live em alertas RBAC/toasts, contraste AA, foco visível e atalhos de teclado (Esc / Busca rápida).',
  },
  {
    id: 'skill-ux-microcopy',
    sourceFolder: 'skills-ia-main',
    category: 'Conteúdo & Copy (UX Writing)',
    skillFileName: 'Conteúdo & Copy/Microcopy para Botões e CTAs.md',
    targetMokedArea: 'Botões de Ação, Formulários e Estados Vazios das 7 Áreas',
    howItWasApplied:
      'Substitui rótulos genéricos por microcopy orientada a ação clara e benefício operacional, com indicadores de "Próxima Ação Recomendada".',
  },
  {
    id: 'skill-saas-onboarding',
    sourceFolder: 'skills-ia-main',
    category: 'Conteúdo & Copy (Onboarding)',
    skillFileName: 'Conteúdo & Copy/Copy para Onboarding de App_SaaS.md',
    targetMokedArea: 'Guia Interativo Passo a Passo (Momento Aha!)',
    howItWasApplied:
      'Divide o fluxo ponta a ponta em 3 marcos visuais celebrando cada etapa concluída e guiando o avaliador até a publicação ao cliente e teste RBAC.',
  },
  {
    id: 'skill-b2b-brand',
    sourceFolder: 'skills-ia-main',
    category: 'Design & Branding',
    skillFileName: 'Design & Branding/Brand Guidelines _ Identidade B2B.md',
    targetMokedArea: 'Arquitetura Visual Enterprise B2B (Sidebar + Command Bar + Drawers)',
    howItWasApplied:
      'Aplica a paleta institucional oficial da Moked (Preto #09090B, Vermelho Carmim #922125 e Branco #FFFFFF), tipografia geométrica Cairo e grid de alta precisão.',
  },
  {
    id: 'skill-creative-system',
    sourceFolder: 'skills-ia-main',
    category: 'Direção Criativa',
    skillFileName: 'Direção Criativa/Criação de Sistemas Visuais Consistentes.md',
    targetMokedArea: 'Identidade Oficial moked.com.br (Emblema, Gradientes #922125 e Cards)',
    howItWasApplied:
      'Reproduz o sistema visual do site moked.com.br: cantos arquitetônicos no portal, gradientes lineares #000000 → #922125 nos cards de unidades e pilares Consultoria, Projeção, Gestão e DSE.',
  },
  {
    id: 'skill-visual-storytelling',
    sourceFolder: 'skills-ia-main',
    category: 'Direção Criativa',
    skillFileName: 'Direção Criativa/Storytelling Visual para Projetos Criativos.md',
    targetMokedArea: 'Portal de Inteligência & Manifesto Moked (3 Décadas de Experiência)',
    howItWasApplied:
      'Conecta o conceito "A Segurança é uma ferramenta e não o objetivo" à jornada operacional das 7 áreas, sem expor contratos ou senhas antes da autenticação.',
  },
];

export const SLA_RULES_TABLE: SlaDemandRule[] = [
  {
    demandType: 'Falha em Portão Principal / Eclusa de Docas',
    severity: 'Crítica',
    targetResponseSla: 'Até 15 min (contingência manual imediata)',
    targetResolutionSla: 'Até 4 horas (SLA Emergencial)',
    prioritizationRule: 'Prioridade P1 — Risco de intrusão perimetral ou parada logística',
    escalationTrigger: 'Acionar Consultor + Terceirizada credenciada em até 30 min',
  },
  {
    demandType: 'Câmera CFTV Offline / Sensor Perimetral IVA',
    severity: 'Alta',
    targetResponseSla: 'Até 30 min (ronda física no setor)',
    targetResolutionSla: 'Até 8 horas (visita técnica no mesmo turno)',
    prioritizationRule: 'Prioridade P2 — Ponto cego em perímetro monitorado pelo CCO',
    escalationTrigger: 'Escalar à Alta Gestão se ultrapassar 8h sem reparo',
  },
  {
    demandType: 'Falta ou Atraso de Efetivo no Posto',
    severity: 'Alta',
    targetResponseSla: 'Imediato pelo Líder de Posto',
    targetResolutionSla: 'Até 2 horas (cobertura por reserva técnica)',
    prioritizationRule: 'Prioridade P2 — Posto nunca fica descoberto na troca de turno',
    escalationTrigger: 'Acionar Treinamento se exigir reciclagem ou substituição definitiva',
  },
  {
    demandType: 'Manutenção Preventiva / Troca de Componente com Desgaste',
    severity: 'Preventiva',
    targetResponseSla: 'Até 24 horas (parecer do Consultor)',
    targetResolutionSla: 'Até 7 dias (janela agendada com aprovação do Cliente)',
    prioritizationRule: 'Prioridade P3 — Evita parada não programada futura',
    escalationTrigger: 'Publicar no painel do Cliente para aprovação de janela de parada',
  },
];

export const OPERATIONAL_RISK_MATRIX: OperationalRiskMatrixItem[] = [
  {
    code: 'RSK-A01',
    contractId: 'CTR-A',
    riskDescription: 'Travamento do Portão Principal das Docas Norte em horário de pico logístico',
    processStage: 'Controle de Acesso Veicular (Posto 01)',
    probability: 4,
    impact: 5,
    score: 20,
    classification: 'Crítico',
    preventiveControl: 'Inspeção quinzenal de cremalheira e engrenagem secundária pela TecPortões',
    detectiveControl: 'Sensor de fim de curso conectado à Central de Monitoramento (CCO 24x7)',
    owner: 'Henrique Vasconcelos (Consultor)',
  },
  {
    code: 'RSK-A02',
    contractId: 'CTR-A',
    riskDescription: 'Vigilante operar eclusa sem reciclagem atualizada do protocolo de contingência',
    processStage: 'Ronda & Operação Manual de Emergência',
    probability: 3,
    impact: 4,
    score: 12,
    classification: 'Alto',
    preventiveControl: 'Bloqueio de escala sem certificação NR-10 / Eclusa (Treinamento)',
    detectiveControl: 'Auditoria presencial do Consultor com lista de presença assinada',
    owner: 'Cap. Roberto Silva (Treinamento)',
  },
  {
    code: 'RSK-B01',
    contractId: 'CTR-B',
    riskDescription: 'Oscilação de link PoE nas câmeras térmicas do Setor Químico (Contrato B)',
    processStage: 'Monitoramento Perimetral Farmacêutico',
    probability: 3,
    impact: 5,
    score: 15,
    classification: 'Alto',
    preventiveControl: 'Switch PoE redundante com nobreak dedicado no rack norte',
    detectiveControl: 'Alerta automático de perda de ping no CCO em menos de 10 segundos',
    owner: 'Patrícia Gomes (CCO)',
  },
];

export const WHATSAPP_AGENT_BLUEPRINT: WhatsAppAgentBlueprint = {
  agentName: 'MokedBot — Assistente Oficial de Operações de Segurança',
  personaAndTone:
    'Profissional, objetivo, confiável e orientado a governança. Nunca inventa informações fora da base e aplica validação de perfil e contrato antes de qualquer resposta.',
  systemPrompt: `Você é o MokedBot, assistente operacional da plataforma Moked Segurança Corporativa.
SEUS PRINCÍPIOS (Skill: Agente de IA — Atendimento via WhatsApp):
1. VÍNCULO DE IDENTIDADE: Antes de processar qualquer pergunta, identifique o usuário pelo telefone remetente (senderPhone) e carregue seu perfil (role) e contratos autorizados (authorizedContractIds).
2. ESCOPO ESTRITO POR CONTRATO (RBAC): Você PODE responder apenas sobre os contratos listados em authorizedContractIds do remetente. Se um usuário do Contrato A perguntar sobre o Contrato B, bloqueie imediatamente (403) e registre na auditoria.
3. CONFIDENCIALIDADE DE NOTAS INTERNAS: Se o remetente tiver role="cliente", você NUNCA pode exibir internalNotes, custos internos ou laudos técnicos não publicados pelo consultor. Exiba apenas os dados de clientPublication.
4. INFORMAÇÃO INSUFICIENTE: Se o dado ainda não foi registrado na base ou ainda está em revisão interna pelo consultor, informe com transparência e não especule.
5. ESCALADA PARA HUMANO: Sempre que o usuário pedir para falar com um atendente/consultor humano ou reportar emergência crítica, acione o protocolo de transferência imediata para o Consultor Responsável (Henrique Vasconcelos).`,
  welcomeMessage:
    'Olá! Sou o MokedBot 🛡️, assistente integrado de operações. Seu número foi autenticado automaticamente com as permissões do seu perfil. Você pode consultar pendências que vencem hoje, a situação do portão/ocorrências do seu contrato ou solicitar transferência para o consultor responsável.',
  humanTransferMessage:
    '👨‍💼 Transferência para Atendimento Humano iniciada! Conectando sua conversa diretamente ao Consultor Sênior Henrique Vasconcelos (SLA de resposta humana: até 10 min em horário comercial ou plantão CCO 24x7). Todo o histórico autorizado do seu contrato já foi anexado ao chamado.',
  dialogueTree: [
    {
      scenario: '1. Consulta de Pendências do Dia (Consultor / Gestão)',
      triggerExample: '"Quais pendências vencem hoje nos meus contratos?"',
      rbacCheck: 'Valida vínculo do telefone → Filtra contratos autorizados [CTR-A, CTR-B]',
      botDecision: 'Retorna ocorrências com dueToday=true e reposições de treinamento pendentes.',
    },
    {
      scenario: '2. Situação do Portão (Visão do Cliente)',
      triggerExample: '"Qual é a situação do portão no meu contrato?"',
      rbacCheck: 'Valida vínculo [CTR-A] → Verifica clientPublication.published === true → Remove internalNotes',
      botDecision: 'Se publicado pelo consultor, envia resumo limpo + próximo passo. Se ainda em revisão interna, informa que está em tratamento técnico sem vazar notas internas.',
    },
    {
      scenario: '3. Tentativa de Acesso Cruzado entre Contratos',
      triggerExample: '"Quais ocorrências estão abertas no Contrato B?" (enviado pelo Cliente A)',
      rbacCheck: 'Detecta target=CTR-B fora de authorizedContractIds=[CTR-A]',
      botDecision: 'Bloqueia antes da query (blocked_contract), responde aviso de segurança e grava log de auditoria 403.',
    },
    {
      scenario: '4. Dados Inexistentes na Base',
      triggerExample: '"Qual a previsão de troca da frota de helicópteros?"',
      rbacCheck: 'Escopo validado, mas busca estruturada retorna 0 registros',
      botDecision: 'Retorna status insufficient_data explicando que não consta na base e sugerindo consultas válidas.',
    },
    {
      scenario: '5. Escalada para Atendimento Humano (Hand-off)',
      triggerExample: '"Quero falar com o consultor humano / atendente"',
      rbacCheck: 'Identifica perfil e contrato do solicitante',
      botDecision: 'Envia mensagem de transferência humana e notifica o Consultor responsável com o contexto da conversa.',
    },
  ],
};

