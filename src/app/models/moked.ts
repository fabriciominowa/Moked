export type RoleId =
  | 'cliente'
  | 'consultor'
  | 'lider_posto'
  | 'terceirizados'
  | 'central_monitoramento'
  | 'treinamento'
  | 'alta_gestao';

export type ContractId = 'CTR-A' | 'CTR-B';

export interface ContractPostItem {
  code: string;
  name: string;
  schedule: string;
  headcount: number;
  description: string;
}

export interface ContractAssetItem {
  tag: string;
  name: string;
  location: string;
  status: string;
  lastMaintenance: string;
}

export interface ContractDetail {
  id: ContractId;
  code: string;
  name: string;
  corporateName: string;
  cnpj: string;
  unitAddress: string;
  startDate: string;
  endDate: string;
  monthlyValue: number;
  paymentDueDay: number;
  billingStatus: string;
  consultantName: string;
  consultantPhone: string;
  consultantEmail: string;
  clientManagerName: string;
  clientManagerRole: string;
  clientManagerEmail: string;
  activePosts: ContractPostItem[];
  technicalAssets: ContractAssetItem[];
  slaTarget: string;
  slaCurrent: string;
  maxResponseTime: string;
  avgResponseTime: string;
  insuranceCoverage: string;
  policyNumber: string;
}

export interface ContractInfo {
  id: ContractId;
  code: string;
  name: string;
  clientOrganization: string;
  unitAddress: string;
  consultantName: string;
  consultantId: string;
  slaHealthScore: number;
  activePostsCount: number;
  statusLabel: 'Operação Normal' | 'Atenção Operacional' | 'Pendência Crítica';
}

export interface MokedUser {
  id: string;
  name: string;
  role: RoleId;
  roleLabel: string;
  areaDescription: string;
  email: string;
  whatsappPhone: string; // Número vinculado para o canal WhatsApp
  authorizedContractIds: ContractId[]; // Contratos que este perfil tem permissão de acessar
  canViewInternalNotes: boolean; // Notas internas são ocultadas para 'cliente'
  organizationOrPost: string;
  avatarInitials: string;
}

export type OccurrenceStatus =
  | 'aberta_pelo_lider'
  | 'atribuida_pelo_consultor'
  | 'visita_registrada_tecnico'
  | 'publicada_ao_cliente'
  | 'concluida';

export interface ThirdPartyVisitDetail {
  visitId: string;
  technicianName: string;
  companyName: string;
  checkInTime: string;
  checkOutTime: string;
  servicePerformed: string;
  technicalInternalRecommendation: string; // Interno até revisão do consultor
  registeredAt: string;
}

export interface ClientVisiblePublication {
  published: boolean;
  summaryForClient: string;
  nextStepForClient: string;
  requiresClientDecision: boolean;
  clientDecisionPrompt?: string;
  clientDecisionStatus?: 'aguardando_cliente' | 'aprovado_pelo_cliente' | 'nao_aplicavel';
  publishedBy: string;
  publishedAt: string;
}

export interface OccurrenceTimelineItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: RoleId;
  stepTitle: string;
  detail: string;
  internalOnly?: boolean;
}

export interface OccurrenceRecord {
  id: string;
  contractId: ContractId;
  contractName: string;
  postName: string;
  assetOrTopic: 'Portão Principal / Docas' | 'CFTV & Sensores' | 'Efetivo & Turno' | 'Perímetro';
  title: string;
  description: string;
  severity: 'Alta' | 'Média' | 'Baixa';
  status: OccurrenceStatus;
  statusLabel: string;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  assignedResponsibleName?: string;
  assignedResponsibleCompany?: string;
  deadlineLabel?: string;
  dueToday: boolean;
  internalNotes?: string; // ESTRITAMENTE RESTRITO: nunca retornado para perfil 'cliente'
  thirdPartyVisit?: ThirdPartyVisitDetail;
  clientPublication?: ClientVisiblePublication;
  timeline: OccurrenceTimelineItem[];
}

export interface ConsultantVisitRecord {
  id: string;
  contractId: ContractId;
  contractName: string;
  consultantName: string;
  visitDate: string;
  objective: string;
  publicSummary: string;
  internalAuditNote?: string; // Restrito a perfis internos
  sharedWithClient: boolean;
  nextStep: string;
}

export interface ShiftLogRecord {
  id: string;
  contractId: ContractId;
  contractName: string;
  postName: string;
  leaderName: string;
  shiftLabel: string;
  vigilanteName: string;
  eventType: 'Falta com Cobertura' | 'Atraso no Turno' | 'Troca Operacional';
  forwardingStatus: string;
  createdAt: string;
}

export interface MonitoringAlertRecord {
  id: string;
  contractId: ContractId;
  contractName: string;
  equipmentCode: string;
  zone: string;
  alertType: 'Falha de Câmera CFTV' | 'Alarme de Intrusão Perimetral' | 'Oscilação de Nobreak' | 'Sensor de Portão';
  severity: 'Crítica' | 'Alta' | 'Média';
  status: 'Em tratamento na Central' | 'Encaminhado ao Consultor' | 'Desfecho Concluído';
  operatorName: string;
  forwardedTo: string;
  outcomeNote: string;
  timestamp: string;
}

export interface TrainingAttendanceItem {
  employeeName: string;
  postName: string;
  status: 'Presente' | 'Ausente — Reposição Necessária';
  registeredAt?: string;
}

export interface TrainingSessionRecord {
  id: string;
  contractId: ContractId;
  contractName: string;
  courseTitle: string;
  instructorName: string;
  sessionDate: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  replacementNeededCount: number;
  status: 'Concluída com Pendência de Reposição' | '100% Concluída' | 'Agendada';
  participants: TrainingAttendanceItem[];
  consultantVisibilityNote: string;
  createdBy?: string;
  createdAt?: string;
}

export interface AccessControlAuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: RoleId;
  targetContractId: ContractId;
  channel: 'Web App' | 'WhatsApp Bot';
  allowed: boolean;
  reason: string;
}

export interface WhatsAppMessageLog {
  id: string;
  timestamp: string;
  senderPhone: string;
  matchedUserName: string;
  matchedRoleLabel: string;
  authorizedContracts: ContractId[];
  question: string;
  response: string;
  decisionStatus: 'allowed' | 'blocked_contract' | 'blocked_unregistered' | 'insufficient_data';
  permissionSteps: string[];
}

export interface MokedDatabaseSchema {
  contracts: ContractInfo[];
  users: MokedUser[];
  occurrences: OccurrenceRecord[];
  consultantVisits: ConsultantVisitRecord[];
  shiftLogs: ShiftLogRecord[];
  monitoringAlerts: MonitoringAlertRecord[];
  trainingSessions: TrainingSessionRecord[];
  accessAuditLogs: AccessControlAuditEntry[];
  whatsappLogs: WhatsAppMessageLog[];
  demoFlowStage: 0 | 1 | 2 | 3; // 0 = Inicial, 1 = Líder abriu + Consultor atribuiu, 2 = Técnico registrou + Consultor publicou ao Cliente, 3 = Alta Gestão + Teste RBAC
}

