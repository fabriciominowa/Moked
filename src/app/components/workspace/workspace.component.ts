import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ConsultantVisitRecord,
  ContractDetail,
  ContractId,
  ContractInfo,
  MokedDatabaseSchema,
  MokedUser,
  MonitoringAlertRecord,
  OccurrenceRecord,
  RoleId,
  ShiftLogRecord,
  TrainingSessionRecord,
  WhatsAppMessageLog,
} from '../../models/moked';
import { MokedService } from '../../services/mokedService';
import { MokedPersistence } from '../../services/mokedPersistence';
import { WhatsAppService } from '../../services/whatsappService';
import { KanbanComponent } from '../kanban/kanban.component';
import { WhatsAppModalComponent } from '../whatsapp-modal/whatsapp-modal.component';
import { ExportService } from '../../services/exportService';

export type ActiveNavTab =
  | 'dashboard'
  | 'kanban'
  | 'areas'
  | 'treinamento'
  | 'auditoria';

export interface BudgetApprovalItem {
  id: string;
  contractCode: string;
  contractName: string;
  title: string;
  supplier: string;
  amount: number;
  category: string;
  urgency: 'Alta' | 'Média' | 'Normal';
  status: 'pendente' | 'aprovado' | 'rejeitado';
  requester: string;
  date: string;
}

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, KanbanComponent, WhatsAppModalComponent],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnInit {
  @Input({ required: true }) initialUser!: MokedUser;
  @Input({ required: true }) initialEmail!: string;
  @Output() logout = new EventEmitter<void>();

  // Estado da Navegação e Layout Treva-Admin
  isSidebarCollapsed = false;
  activeNav: ActiveNavTab = 'dashboard';
  activeRoleId: RoleId = 'alta_gestao';
  searchQuery = '';
  showNotifications = false;
  showWhatsAppModal = false;
  toastMessage: string | null = null;
  busy = false;

  // Sessão e Escopo
  currentUser!: MokedUser;
  currentEmail!: string;
  emailToInspect = '';

  // Dados do Moked CRM
  allUsers: MokedUser[] = [];
  allContracts: ContractInfo[] = [];
  occurrences: OccurrenceRecord[] = [];
  trainings: TrainingSessionRecord[] = [];
  whatsappLogs: WhatsAppMessageLog[] = [];
  consultantVisits: ConsultantVisitRecord[] = [];
  shiftLogs: ShiftLogRecord[] = [];
  monitoringAlerts: MonitoringAlertRecord[] = [];
  demoFlowStage: 0 | 1 | 2 | 3 = 0;

  // Formulário de Visitas do Consultor
  newVisitContract: ContractId = 'CTR-A';
  newVisitObjective = 'Auditoria preventiva pós-reparo do portão e validação com gestora de facilities';
  newVisitPublicSummary = 'Visita técnica realizada para conferência dos ciclos do portão e alinhamento do cronograma preventivo.';
  newVisitInternalNote = 'AUDITORIA INTERNA: Prestador TecPortões cumpriu SLA, porém foi notificado sobre necessidade de engraxamento semanal do trilho.';
  newVisitSharedWithClient = true;
  newVisitNextStep = 'Aguardar aprovação do cliente para janela de preventiva em 30 dias.';

  // Formulário de Faltas/Atrasos do Líder de Posto
  newShiftContract: ContractId = 'CTR-A';
  newShiftPost = 'Posto 01 — Portão & Docas Norte';
  newShiftVigilante = 'Vigilante Marcos Souza';
  newShiftType: 'Falta com Cobertura' | 'Atraso no Turno' | 'Troca Operacional' = 'Falta com Cobertura';
  newShiftForwarding = 'Reserva técnica Carlos Eduardo acionado imediatamente. Cobertura realizada em 12 minutos.';

  // Formulário da Central de Monitoramento
  newAlertContract: ContractId = 'CTR-A';
  newAlertEquipment = 'SENSOR-DOCA-03';
  newAlertZone = 'Portão Norte · Docas Contrato A';
  newAlertType: MonitoringAlertRecord['alertType'] = 'Sensor de Portão';
  newAlertSeverity: MonitoringAlertRecord['severity'] = 'Alta';
  newAlertOutcome = 'Disparo prolongado detectado. Operador acionou consultor e líder do posto para verificação física.';

  // Formulários da Área de Treinamento
  newTrnContract: ContractId = 'CTR-A';
  newTrnTitle = 'Operação de Eclusas, Controle Biométrico e Protocolo de Emergência';
  newTrnDate = '07/11/2026 às 14:00 (Turma Aberta)';
  newTrnInstructor = 'Capitão Roberto Silva';
  participantName = 'Vigilante Lucas Andrade';
  participantPost = 'Posto 01 — Portão & Docas Norte';
  selectedTrnId = 'TRN-703';

  // Formulário do Líder de Posto
  gateTitle = 'Falha no motor do Portão Eletrônico Principal (Docas Norte — Contrato A)';
  gateDesc = 'Portão deslizante das Docas Norte travou semiaberto após passagem de carreta. Operação convertida temporariamente para controle manual com 2 vigilantes na eclusa.';

  // Formulário do Consultor
  assignResp = 'Carlos Eduardo (TecPortões Terceirizada)';
  assignDeadline = 'Hoje, até 17:00 (SLA 4h)';

  // Formulário do Técnico Terceirizado
  techCheckIn = '10:15';
  techCheckOut = '11:40';
  techService = 'Substituição da placa inversora de comando, realinhamento do trilho norte e destravamento mecânico do motor. Portão testado em 15 ciclos completos.';
  techInternalNotes = 'LAUDO TÉCNICO INTERNO (CONFIDENCIAL): Identificado desgaste de 70% na engrenagem secundária de bronze. Recomendamos cotar troca preventiva em até 15 dias (custo interno estimado R$ 680).';

  // Metadados dos 7 Cargos
  readonly rolesList: { id: RoleId; label: string; areaNumber: string; icon: string }[] = [
    { id: 'cliente', label: 'Cliente', areaNumber: '01', icon: '🏢' },
    { id: 'consultor', label: 'Consultor Moked', areaNumber: '02', icon: '💼' },
    { id: 'lider_posto', label: 'Líder de Posto', areaNumber: '03', icon: '👮' },
    { id: 'terceirizados', label: 'Terceirizados', areaNumber: '04', icon: '🔧' },
    { id: 'central_monitoramento', label: 'Central Monitoramento', areaNumber: '05', icon: '📡' },
    { id: 'treinamento', label: 'Treinamento', areaNumber: '06', icon: '🎓' },
    { id: 'alta_gestao', label: 'Alta Gestão', areaNumber: '07', icon: '📊' },
  ];

  // Modal Interativo de Dossiê Contratual Completo
  selectedContractForModal: ContractDetail | null = null;
  activeContractModalTab: 'dados' | 'postos' | 'ativos' | 'financeiro' | 'sla' = 'dados';

  contractsDetailList: ContractDetail[] = [
    {
      id: 'CTR-A',
      code: 'CTR-A',
      name: 'Alpha Corp Logística',
      corporateName: 'Alpha Corporation Armazéns Gerais & Logística Integrada Ltda.',
      cnpj: '12.345.678/0001-90',
      unitAddress: 'Av. das Nações Unidas, 14.200 - Docas Norte, São Paulo - SP',
      startDate: '01/01/2025',
      endDate: '31/12/2027',
      monthlyValue: 265000.0,
      paymentDueDay: 10,
      billingStatus: 'Adimplente',
      consultantName: 'Henrique Vasconcelos',
      consultantPhone: '+55 (11) 98765-4321',
      consultantEmail: 'henrique.vasconcelos@moked.com.br',
      clientManagerName: 'Marina Alencar',
      clientManagerRole: 'Diretora de Operações & Risco Patrimonial',
      clientManagerEmail: 'marina.alencar@alphalogistica.com.br',
      activePosts: [
        {
          code: 'POSTO-A1',
          name: 'Portaria Central & Eclusa de Pedestres',
          schedule: '24 horas (Escala 12x36)',
          headcount: 6,
          description: 'Triagem biométrica, controle de visitantes, crachás RFID e inspeção de veículos leves.',
        },
        {
          code: 'POSTO-A2',
          name: 'Docas Norte - Eclusa de Carretas & Cargas',
          schedule: '24 horas (Escala 12x36)',
          headcount: 6,
          description: 'Controle de pesagem, inspeção de notas fiscais, acionamento do portão motorizado e travas de segurança.',
        },
        {
          code: 'POSTO-A3',
          name: 'Ronda Motorizada Perimetral Externa',
          schedule: 'Noturno (18h às 06h)',
          headcount: 4,
          description: 'Patrulhamento preventivo em viatura leve com bastão vigia eletrônico em 14 bottons perimetrais.',
        },
        {
          code: 'POSTO-A4',
          name: 'Central de Operações Local (CCO / CFTV)',
          schedule: '24 horas (Monitoramento Dedicado)',
          headcount: 2,
          description: 'Operação de mural de câmeras IP DarkFighter, alarmes de cerca elétrica e comunicação via rádio UHF.',
        },
      ],
      technicalAssets: [
        {
          tag: 'ATV-POR-01',
          name: 'Portão Deslizante Industrial Automatizado PPA JetFlex',
          location: 'Docas Norte - Acesso Principal de Carretas',
          status: 'Operação Normal (Reparo Recente)',
          lastMaintenance: 'Ontem, 11:40 (TecPortões)',
        },
        {
          tag: 'ATV-CFT-01',
          name: 'Sistema CFTV IP DarkFighter Hikvision (16 Câmeras 4K)',
          location: 'Perímetro e Galpões de Armazenamento',
          status: '100% Online',
          lastMaintenance: '28/10/2026 (CFTV Prime)',
        },
        {
          tag: 'ATV-ECL-01',
          name: 'Eclusa Dupla com Intertravamento Magnético & Facial',
          location: 'Portaria Principal de Visitantes',
          status: 'Operacional',
          lastMaintenance: '15/10/2026 (Moked Tech)',
        },
        {
          tag: 'ATV-CER-01',
          name: 'Cerca Elétrica Perimetral Speedrite 6J com Sensores de Rompimento',
          location: 'Muros Laterais e Fundos das Docas',
          status: 'Ativo e Calibrado',
          lastMaintenance: '22/10/2026 (AlarmTech)',
        },
      ],
      slaTarget: '95,0% dos chamados atendidos no prazo',
      slaCurrent: '98,6% (Acima da meta)',
      maxResponseTime: '4 horas para ocorrências críticas',
      avgResponseTime: '1 hora e 25 minutos',
      insuranceCoverage: 'R$ 15.000.000,00 (Responsabilidade Civil Operacional)',
      policyNumber: 'APOL-BR-998822-MOKED',
    },
    {
      id: 'CTR-B',
      code: 'CTR-B',
      name: 'Beta Logística Intermodal',
      corporateName: 'Beta Logística e Operações Intermodais S.A.',
      cnpj: '98.765.432/0001-11',
      unitAddress: 'Rodovia Anhanguera, km 112 - Pátio Intermodal CD Sul, Campinas - SP',
      startDate: '15/03/2024',
      endDate: '14/03/2027',
      monthlyValue: 220000.0,
      paymentDueDay: 15,
      billingStatus: 'Adimplente',
      consultantName: 'Carlos Eduardo Consultoria',
      consultantPhone: '+55 (19) 98888-5555',
      consultantEmail: 'carlos.consultor@moked.com.br',
      clientManagerName: 'Fábio Guimarães',
      clientManagerRole: 'Gerente Geral de Facilities & Segurança',
      clientManagerEmail: 'fabio.guimaraes@betalog.com.br',
      activePosts: [
        {
          code: 'POSTO-B1',
          name: 'Portaria Principal & Balança Rodoviária',
          schedule: '24 horas (Escala 12x36)',
          headcount: 6,
          description: 'Pesagem de carretas, leitura de placas LPR e triagem de motoristas terceirizados.',
        },
        {
          code: 'POSTO-B2',
          name: 'Eclusa Ferroviária & Linha Férrea',
          schedule: '24 horas (Escala 12x36)',
          headcount: 4,
          description: 'Abertura assistida de cancelas de vagões e inspeção de lacres de contêineres.',
        },
        {
          code: 'POSTO-B3',
          name: 'Ronda Armada de Pátio com Cão Adestrado',
          schedule: 'Noturno (18h às 06h)',
          headcount: 4,
          description: 'Vigilância ostensiva em área aberta de 40.000m² com apoio canino especializado.',
        },
      ],
      technicalAssets: [
        {
          tag: 'ATV-LPR-02',
          name: 'Câmeras LPR Leitura Automática de Placas OCR',
          location: 'Balança de Entrada e Saída',
          status: 'Instalação Aprovada (Orçamento R$ 4.250)',
          lastMaintenance: 'Em Implantação',
        },
        {
          tag: 'ATV-CAN-01',
          name: 'Cancelas Eletromecânicas Rápidas PPA Barra 4m',
          location: 'Portões 01 e 02',
          status: 'Operação Normal',
          lastMaintenance: '20/10/2026 (TecPortões)',
        },
        {
          tag: 'ATV-RAI-01',
          name: 'Scanner e Raio-X de Bagagens e Encomendas',
          location: 'Guarita de Inspeção de Visitantes',
          status: 'Certificado e Calibrado',
          lastMaintenance: '10/10/2026 (VisiScan)',
        },
      ],
      slaTarget: '95,0% dos chamados atendidos no prazo',
      slaCurrent: '96,2% (Conforme contratado)',
      maxResponseTime: '4 horas para ocorrências críticas',
      avgResponseTime: '1 hora e 40 minutos',
      insuranceCoverage: 'R$ 15.000.000,00 (Responsabilidade Civil Operacional)',
      policyNumber: 'APOL-BR-774411-MOKED',
    },
  ];

  openContractModal(contractId: ContractId) {
    const isAllowed = this.isManager || this.currentUser.authorizedContractIds.includes(contractId);
    if (!isAllowed) {
      this.notify(
        `⛔ ACESSO NEGADO (403): O perfil ${this.currentUser.roleLabel} não tem autorização para visualizar o Contrato ${contractId}. Faça login como Gestor para acesso total.`
      );
      return;
    }
    const found = this.contractsDetailList.find((c) => c.id === contractId);
    if (found) {
      this.selectedContractForModal = found;
      this.activeContractModalTab = 'dados';
      this.notify(`✓ Dossiê Completo do Contrato ${found.code} aberto com sucesso!`);
    }
  }

  closeContractModal() {
    this.selectedContractForModal = null;
  }

  downloadContractPdf(contract: ContractDetail) {
    try {
      ExportService.generateContractDossierPdf(contract);
      this.notify(`✓ Dossiê Oficial do Contrato ${contract.code} gerado e baixado em PDF!`);
    } catch (err) {
      console.error(err);
      this.notify('Erro ao gerar PDF do contrato.');
    }
  }
  budgetApprovals: BudgetApprovalItem[] = [
    {
      id: 'APV-001',
      contractCode: 'CTR-A',
      contractName: 'Alpha Corp (Docas Norte)',
      title: 'Substituição Preventiva da Engrenagem do Portão Principal',
      supplier: 'TecPortões & Automação Industrial',
      amount: 680.0,
      category: 'Manutenção Preventiva',
      urgency: 'Alta',
      status: 'pendente',
      requester: 'Carlos Eduardo (Consultor)',
      date: 'Hoje, 11:45',
    },
    {
      id: 'APV-002',
      contractCode: 'CTR-B',
      contractName: 'Beta Logística (Centro de Distribuição)',
      title: 'Instalação de 2 Câmeras LPR Leitura de Placa na Eclusa 02',
      supplier: 'CFTV Prime Engenharia de Segurança',
      amount: 4250.0,
      category: 'CAPEX / Ativo de CFTV',
      urgency: 'Média',
      status: 'pendente',
      requester: 'Henrique Vasconcelos (Consultor)',
      date: 'Hoje, 09:30',
    },
    {
      id: 'APV-003',
      contractCode: 'CTR-A',
      contractName: 'Alpha Corp (Portaria Central)',
      title: 'Cobertura Emergencial de Falta (Turno Noturno 12x36)',
      supplier: 'Folha Operacional Própria',
      amount: 380.0,
      category: 'Efetivo & Escala',
      urgency: 'Alta',
      status: 'aprovado',
      requester: 'Sérgio Nascimento (Líder de Posto)',
      date: 'Ontem, 19:10',
    },
    {
      id: 'APV-004',
      contractCode: 'CTR-B',
      contractName: 'Beta Logística (Perímetro Sul)',
      title: 'Calibração e Troca de Baterias de 6 Sensores de Cerca Elétrica',
      supplier: 'AlarmTech Soluções',
      amount: 890.0,
      category: 'Perímetro & Intrusão',
      urgency: 'Normal',
      status: 'aprovado',
      requester: 'Patrícia Gomes (CCO)',
      date: 'Ontem, 14:00',
    },
  ];

  get totalPendingBudget(): number {
    return this.budgetApprovals
      .filter((b) => b.status === 'pendente')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }

  approveBudget(item: BudgetApprovalItem) {
    item.status = 'aprovado';
    this.notify(
      `✓ Verba de R$ ${item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} aprovada com sucesso para ${item.contractCode}!`
    );
  }

  rejectBudget(item: BudgetApprovalItem) {
    item.status = 'rejeitado';
    this.notify(`Orçamento ${item.id} recusado. Solicitada nova cotação.`);
  }

  exportReport(type: 'pdf' | 'csv' | 'laudo') {
    try {
      if (type === 'pdf') {
        ExportService.generateDrePdf(this.allContracts, this.budgetApprovals);
        this.notify('✓ DRE Operacional Consolidado gerado e baixado em PDF com sucesso!');
      } else if (type === 'csv') {
        ExportService.generateCostsCsv(this.budgetApprovals);
        this.notify('✓ Planilha de Auditoria e Custos gerada e baixada em Excel/CSV com sucesso!');
      } else if (type === 'laudo') {
        ExportService.generateLaudoConsolidadoPdf(this.occurrences, this.allContracts);
        this.notify('✓ Laudo Executivo Consolidado Moked gerado e baixado em PDF com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao gerar exportação:', err);
      this.notify('Ocorreu um erro ao gerar o arquivo para download.');
    }
  }

  ngOnInit() {
    this.currentUser = this.initialUser;
    this.currentEmail = this.initialEmail;
    this.emailToInspect = this.initialEmail;
    this.activeRoleId = this.initialUser.role;
    this.refreshState();
  }

  get isManager(): boolean {
    return this.currentUser?.role === 'alta_gestao' || this.currentUser?.role === 'consultor';
  }

  get gateOccurrence(): OccurrenceRecord | undefined {
    return this.occurrences.find((o) => o.id === 'OC-PORTAO-A1');
  }

  get filteredOccurrences(): OccurrenceRecord[] {
    if (!this.searchQuery.trim()) return this.occurrences;
    const q = this.searchQuery.toLowerCase();
    return this.occurrences.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q) ||
        o.postName.toLowerCase().includes(q) ||
        o.createdByName.toLowerCase().includes(q)
    );
  }

  notify(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4500);
  }

  refreshState() {
    const snapshot = MokedService.getAuthorizedSnapshotForUser(this.currentUser.id);
    this.allUsers = snapshot.allUsers;
    this.allContracts = snapshot.authorizedContracts;
    this.occurrences = snapshot.occurrences;
    this.trainings = snapshot.trainingSessions;
    this.whatsappLogs = snapshot.whatsappLogs;
    this.consultantVisits = snapshot.consultantVisits;
    this.shiftLogs = snapshot.shiftLogs;
    this.monitoringAlerts = snapshot.monitoringAlerts;
    this.demoFlowStage = snapshot.demoFlowStage;
  }

  // Alternância Rápida de Usuário pelo Header
  switchActiveUser(targetUser: MokedUser) {
    this.currentUser = targetUser;
    this.currentEmail = targetUser.email;
    this.emailToInspect = targetUser.email;
    this.activeRoleId = targetUser.role;
    this.refreshState();
    this.notify(`Sessão alternada para ${targetUser.name} (${targetUser.roleLabel})`);
  }

  selectArea(roleId: RoleId) {
    if (!this.isManager && this.currentUser.role !== roleId) {
      this.notify(`🔒 Isolamento de Cargo: Acesso restrito para ${this.currentUser.roleLabel}. Use o perfil Gestão para inspecionar todas as áreas.`);
      return;
    }
    this.activeRoleId = roleId;
    this.activeNav = 'areas';
    this.notify(`Visualizando módulo da área: ${this.getRoleLabel(roleId)}`);
  }

  getRoleLabel(roleId: RoleId): string {
    return this.rolesList.find((r) => r.id === roleId)?.label ?? roleId;
  }

  // Próxima Ação Recomendada do Fluxo Ponta a Ponta
  get nextStepInfo() {
    if (!this.gateOccurrence) {
      return {
        badge: 'ETAPA 1A DE 3 · ABERTURA NO POSTO',
        title: 'Registrar falha no motor do Portão das Docas Norte (Contrato A)',
        desc: 'Abra a ordem de serviço no posto para criar a OS OC-PORTAO-A1 com carimbo de data, hora e autor.',
        btnText: 'Abrir OS no Portão Agora',
        action: () => this.handleOpenGateOs(),
      };
    }
    if (this.gateOccurrence.status === 'aberta_pelo_lider') {
      return {
        badge: 'ETAPA 1B DE 3 · TRIAGEM E SLA',
        title: 'Atribuir técnico responsável e definir prazo de SLA (4h)',
        desc: 'Como consultor, atribua a empresa terceirizada e mova a OS para a Etapa 2 do Kanban.',
        btnText: 'Atribuir Técnico e Prazo SLA',
        action: () => this.handleAssignGateOs(),
      };
    }
    if (this.gateOccurrence.status === 'atribuida_pelo_consultor') {
      return {
        badge: 'ETAPA 2A DE 3 · EXECUÇÃO TÉCNICA',
        title: 'Registrar visita técnica, check-in/out e laudo restrito',
        desc: 'Registre a entrada e saída do técnico e o serviço executado no motor.',
        btnText: 'Registrar Visita Técnica',
        action: () => this.handleRegisterTechVisit(),
      };
    }
    if (this.gateOccurrence.status === 'visita_registrada_tecnico') {
      return {
        badge: 'ETAPA 2B DE 3 · PUBLICAÇÃO AO CLIENTE',
        title: 'Revisar laudo e publicar atualização limpa para o Cliente',
        desc: 'Publique o resumo da normalização mantendo as notas confidenciais restritas.',
        btnText: 'Publicar ao Cliente',
        action: () => this.handlePublishToClient(),
      };
    }
    return {
      badge: 'ETAPA 3 DE 3 · CONFERÊNCIA & AUDITORIA',
      title: 'Ciclo Operacional Concluído & Auditoria RBAC Ativa',
      desc: 'Todas as etapas foram concluídas e auditadas. Acesso total confirmado para gestores.',
      btnText: 'Testar Acesso Contrato B',
      action: () => this.testContractAccess('CTR-B'),
    };
  }

  handleOpenGateOs() {
    MokedService.registerGateFailureByLeader();
    this.refreshState();
    this.notify('✓ OS OC-PORTAO-A1 aberta com sucesso! Aparecendo na Etapa 1 do Kanban.');
  }

  handleAssignGateOs(occId = 'OC-PORTAO-A1') {
    MokedService.assignOccurrenceByConsultant({
      occurrenceId: occId,
      responsibleName: this.assignResp,
      responsibleCompany: 'TecPortões & Automação Industrial',
      deadlineLabel: this.assignDeadline,
    });
    this.refreshState();
    this.notify('✓ Técnico e prazo SLA atribuídos! Movido para a Etapa 2 do Kanban.');
  }

  handleRegisterTechVisit(occId = 'OC-PORTAO-A1') {
    MokedService.registerVisitByTechnician({
      occurrenceId: occId,
      checkInTime: this.techCheckIn,
      checkOutTime: this.techCheckOut,
      servicePerformed: this.techService,
      technicalInternalRecommendation: this.techInternalNotes,
    });
    this.refreshState();
    this.notify('✓ Check-in/out e laudo técnico registrados na Etapa 3 do Kanban.');
  }

  handlePublishToClient(occId = 'OC-PORTAO-A1') {
    MokedService.publishUpdateToClientByConsultant({
      occurrenceId: occId,
      summaryForClient: 'Portão das Docas Norte normalizado. Peça substituída com sucesso.',
      nextStepForClient: 'Confirmar janela de 30 min para revisão preventiva na próxima semana.',
      requiresClientDecision: true,
    });
    this.refreshState();
    this.notify('✓ Atualização publicada para o Cliente! Notas internas mantidas em sigilo.');
  }

  handleApproveDecision(occId = 'OC-PORTAO-A1') {
    MokedService.approveClientDecision({
      occurrenceId: occId,
      userId: this.currentUser.id,
    });
    this.refreshState();
    this.notify('✓ Decisão aprovada pelo Cliente! OS concluída e auditada na Etapa 5.');
  }

  testContractAccess(contractId: ContractId) {
    const isAllowed = this.isManager || this.currentUser.authorizedContractIds.includes(contractId);
    if (isAllowed) {
      this.notify(`✓ ACESSO LIBERADO: ${this.currentEmail} possui permissão total no ${contractId}!`);
    } else {
      this.notify(`⛔ ACESSO NEGADO (403): O perfil ${this.currentUser.roleLabel} não tem autorização para o ${contractId}.`);
    }
  }

  handleCreateTraining() {
    if (!this.newTrnTitle.trim()) return;
    MokedService.createTrainingSession({
      contractId: this.newTrnContract,
      courseTitle: this.newTrnTitle,
      sessionDate: this.newTrnDate,
      instructorName: this.newTrnInstructor,
      createdBy: this.currentUser.id,
    });
    this.refreshState();
    this.notify('✓ Nova turma de treinamento operacional criada com sucesso!');
  }

  handleEnrollParticipant() {
    if (!this.participantName.trim()) return;
    MokedService.enrollOrUpdateTrainingParticipant({
      trainingId: this.selectedTrnId,
      employeeName: this.participantName,
      postName: this.participantPost,
    });
    this.refreshState();
    this.notify(`✓ Presença confirmada para ${this.participantName}! Quórum atualizado em tempo real.`);
  }

  handleSendWhatsAppMessage(event: { senderPhone: string; question: string }) {
    WhatsAppService.processIncomingMessage(event);
    this.refreshState();
    this.notify('✓ Mensagem respondida pelo CCO Moked Bot via WhatsApp!');
  }

  handleCreateConsultantVisit() {
    MokedService.createConsultantVisit({
      contractId: this.newVisitContract,
      objective: this.newVisitObjective,
      publicSummary: this.newVisitPublicSummary,
      internalAuditNote: this.newVisitInternalNote,
      sharedWithClient: this.newVisitSharedWithClient,
      nextStep: this.newVisitNextStep,
    });
    this.refreshState();
    this.notify('✓ Visita do consultor registrada com sucesso!');
  }

  handleCreateShiftLog() {
    MokedService.createShiftLog({
      contractId: this.newShiftContract,
      postName: this.newShiftPost,
      vigilanteName: this.newShiftVigilante,
      eventType: this.newShiftType,
      forwardingStatus: this.newShiftForwarding,
    });
    this.refreshState();
    this.notify('✓ Ocorrência de turno (falta/atraso) registrada pelo Líder!');
  }

  handleCreateMonitoringAlert() {
    MokedService.createMonitoringAlert({
      contractId: this.newAlertContract,
      equipmentCode: this.newAlertEquipment,
      zone: this.newAlertZone,
      alertType: this.newAlertType,
      severity: this.newAlertSeverity,
      outcomeNote: this.newAlertOutcome,
    });
    this.refreshState();
    this.notify('✓ Alerta registrado na Central e encaminhado ao Consultor!');
  }

  resetDemo() {
    MokedPersistence.resetToSeed();
    this.refreshState();
    this.notify('✓ Base de dados reiniciada para os valores iniciais da demonstração!');
  }
}
