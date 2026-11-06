import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractId, MokedUser, OccurrenceRecord, OccurrenceStatus } from '../../models/moked';

interface KanbanColumnConfig {
  status: OccurrenceStatus;
  stepNumber: string;
  title: string;
  subtitle: string;
  headerBorder: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section aria-label="Quadro Kanban de Ordens de Serviço (Estilo Trello)" class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      <!-- Cabeçalho Tático do Quadro -->
      <div class="bg-[#09090B] text-white px-5 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#922125] flex items-center justify-center shadow-sm shrink-0">
            <span class="text-white font-bold text-lg">📋</span>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-[15px] font-extrabold uppercase tracking-wider text-white">
                Quadro Kanban de Ordens de Serviço (OS) & Ocorrências
              </h2>
              <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#922125] text-white">
                Estilo Trello · Rastreabilidade Data, Hora & Autor
              </span>
            </div>
            <p class="text-[12px] text-zinc-400 mt-0.5">
              Acompanhe quem abriu cada OS, data e hora exatas, técnico responsável, check-in/out e histórico por etapa.
            </p>
          </div>
        </div>

        <!-- Filtros de Contrato e Ação Rápida de Abertura -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-1 text-[11.5px]">
            <button
              type="button"
              (click)="setFilter('ALL')"
              [class]="contractFilter === 'ALL' ? 'px-2.5 py-1 rounded font-bold bg-[#922125] text-white' : 'px-2.5 py-1 rounded font-bold text-zinc-300 hover:text-white'"
            >
              Todas ({{ occurrences.length }})
            </button>
            <button
              type="button"
              (click)="setFilter('CTR-A')"
              [class]="contractFilter === 'CTR-A' ? 'px-2.5 py-1 rounded font-bold bg-[#922125] text-white' : 'px-2.5 py-1 rounded font-bold text-zinc-300 hover:text-white'"
            >
              Contrato A ({{ getCountForContract('CTR-A') }})
            </button>
            @if (isManager || sessionUser.authorizedContractIds.includes('CTR-B')) {
              <button
                type="button"
                (click)="setFilter('CTR-B')"
                [class]="contractFilter === 'CTR-B' ? 'px-2.5 py-1 rounded font-bold bg-[#922125] text-white' : 'px-2.5 py-1 rounded font-bold text-zinc-300 hover:text-white'"
              >
                Contrato B ({{ getCountForContract('CTR-B') }})
              </button>
            }
          </div>

          @if (!hasGateOs) {
            <button
              type="button"
              [disabled]="busy"
              (click)="openGateOs.emit()"
              class="px-3.5 py-2 rounded-lg bg-[#922125] hover:bg-[#7a1b1e] text-white font-bold text-[11.5px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <span>+</span>
              <span>Abrir OS Portão (OC-PORTAO-A1)</span>
            </button>
          }
        </div>
      </div>

      <!-- As 5 Colunas Estilo Trello -->
      <div class="p-4 bg-slate-100/80 overflow-x-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5 min-w-[300px]">
          @for (col of columns; track col.status) {
            <div class="flex flex-col rounded-xl bg-slate-200/75 border border-slate-300/80 overflow-hidden min-h-[440px]">
              <!-- Topo da Coluna -->
              <div [class]="col.headerBorder + ' bg-zinc-900 text-white px-3.5 py-2.5 flex items-center justify-between border-t-4'">
                <div>
                  <div class="text-[9.5px] font-bold uppercase tracking-widest text-zinc-400">
                    {{ col.stepNumber }}
                  </div>
                  <h3 class="text-[13px] font-extrabold tracking-wide text-white">
                    {{ col.title }}
                  </h3>
                  <p class="text-[10px] text-zinc-400">{{ col.subtitle }}</p>
                </div>
                <span class="w-6 h-6 rounded-full bg-white/15 text-white font-black text-[12px] flex items-center justify-center">
                  {{ getCardsForStatus(col.status).length }}
                </span>
              </div>

              <!-- Lista de Cartões da Coluna -->
              <div class="p-2.5 space-y-3 flex-1">
                @if (getCardsForStatus(col.status).length === 0) {
                  <div class="h-36 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-center text-slate-500">
                    <span class="text-[11.5px] font-semibold">Nenhuma OS nesta coluna</span>
                    <span class="text-[10px] text-slate-400 mt-0.5">Cartões avançam conforme as ações são executadas</span>
                  </div>
                }

                @for (occ of getCardsForStatus(col.status); track occ.id) {
                  <article
                    [class]="occ.id === 'OC-PORTAO-A1'
                      ? 'rounded-xl bg-white border border-[#922125] ring-1 ring-[#922125]/25 shadow-sm p-3.5 space-y-3'
                      : 'rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm p-3.5 space-y-3'"
                  >
                    <!-- Linha 1: Código da OS + Contrato + Prioridade -->
                    <div class="flex items-center justify-between gap-1.5 flex-wrap">
                      <div class="flex items-center gap-1.5">
                        <span class="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono font-bold text-[11px]">
                          {{ occ.id }}
                        </span>
                        <span
                          [class]="occ.contractId === 'CTR-A'
                            ? 'px-2 py-0.5 rounded text-[10px] font-bold border bg-red-50 text-[#922125] border-red-200'
                            : 'px-2 py-0.5 rounded text-[10px] font-bold border bg-zinc-100 text-zinc-800 border-zinc-300'"
                        >
                          {{ occ.contractId }}
                        </span>
                      </div>

                      <span
                        [class]="occ.severity === 'Alta'
                          ? 'px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-red-100 text-red-800'
                          : occ.severity === 'Média'
                          ? 'px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-amber-100 text-amber-800'
                          : 'px-2 py-0.5 rounded text-[9.5px] font-bold uppercase bg-slate-100 text-slate-700'"
                      >
                        Prioridade {{ occ.severity }}
                      </span>
                    </div>

                    <!-- Título e Posto -->
                    <div>
                      <h4 class="text-[13px] font-bold text-slate-900 leading-snug">
                        {{ occ.title }}
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">
                        📍 {{ occ.postName }}
                      </p>
                    </div>

                    <!-- Bloco Principal: QUEM FEZ + DATA E HORA EXATAS -->
                    <div class="rounded-lg bg-slate-50 border border-slate-200/90 p-2.5 space-y-1.5 text-[11px]">
                      <div class="flex items-start justify-between gap-2">
                        <span class="text-slate-500 font-semibold">👤 Aberta por:</span>
                        <span class="font-bold text-slate-900 text-right">{{ occ.createdByName }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-slate-500 font-semibold">📅 Data/Hora Abertura:</span>
                        <span class="font-mono font-bold text-slate-800">{{ occ.createdAt }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-slate-500 font-semibold">🕒 Atualização:</span>
                        <span class="font-mono font-semibold text-emerald-800">{{ occ.updatedAt }}</span>
                      </div>

                      @if (occ.assignedResponsibleName) {
                        <div class="pt-1.5 mt-1.5 border-t border-slate-200/80 space-y-1">
                          <div class="flex items-start justify-between gap-2">
                            <span class="text-slate-500 font-semibold">🔧 Quem cuida:</span>
                            <span class="font-bold text-slate-900 text-right">{{ occ.assignedResponsibleName }}</span>
                          </div>
                          @if (occ.deadlineLabel) {
                            <div class="flex items-center justify-between gap-2">
                              <span class="text-slate-500 font-semibold">Prazo SLA:</span>
                              <span class="font-bold text-[#922125]">{{ occ.deadlineLabel }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>

                    <!-- Dados da Visita Técnica (se registrada) -->
                    @if (occ.thirdPartyVisit) {
                      <div class="rounded-lg bg-sky-50/80 border border-sky-200 p-2.5 space-y-1 text-[11px]">
                        <div class="font-bold text-sky-950 flex items-center justify-between">
                          <span>🛠️ Visita ({{ occ.thirdPartyVisit.visitId }})</span>
                          <span class="font-mono text-[10px] text-sky-800">
                            {{ occ.thirdPartyVisit.checkInTime }} → {{ occ.thirdPartyVisit.checkOutTime }}
                          </span>
                        </div>
                        <div class="text-sky-900">
                          <strong>Técnico:</strong> {{ occ.thirdPartyVisit.technicianName }} ({{ occ.thirdPartyVisit.companyName }})
                        </div>
                        <p class="text-[10.5px] text-slate-700 leading-snug pt-0.5">
                          {{ occ.thirdPartyVisit.servicePerformed }}
                        </p>
                      </div>
                    }

                    <!-- Nota Interna Confidencial (Ocultada do Cliente) -->
                    @if (occ.internalNotes && sessionUser.role !== 'cliente') {
                      <div class="rounded-lg bg-amber-50/90 border border-amber-200 p-2 text-[10.5px] text-amber-950">
                        <div class="font-bold uppercase tracking-wider text-[9px] text-amber-800 mb-0.5">
                          🔒 Nota Interna Restrita
                        </div>
                        <p class="line-clamp-2 leading-snug">{{ occ.internalNotes }}</p>
                      </div>
                    }

                    <!-- Histórico Cronológico Retrátil -->
                    <div class="border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        (click)="toggleTimeline(occ.id)"
                        class="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-[#922125] transition-colors"
                      >
                        <span>📜 Trilha da OS ({{ occ.timeline.length }} eventos)</span>
                        <span class="text-[10px] underline">{{ expandedIds[occ.id] ? 'Ocultar' : 'Ver horas' }}</span>
                      </button>

                      @if (expandedIds[occ.id]) {
                        <div class="mt-2 space-y-1.5 pl-2 border-l-2 border-[#922125]">
                          @for (item of occ.timeline; track item.id) {
                            <div class="text-[10.5px] space-y-0.5">
                              <div class="flex items-center justify-between font-mono text-[10px] text-slate-500">
                                <span>{{ item.timestamp }}</span>
                                <span class="font-bold text-slate-700">{{ item.actorName }}</span>
                              </div>
                              <div class="font-bold text-slate-900">{{ item.stepTitle }}</div>
                              <p class="text-slate-600 leading-tight">{{ item.detail }}</p>
                            </div>
                          }
                        </div>
                      }
                    </div>

                    <!-- Botão de Ação Rápida de Avanço -->
                    <div class="pt-2 border-t border-slate-100">
                      @if (occ.status === 'aberta_pelo_lider') {
                        <button
                          type="button"
                          [disabled]="busy"
                          (click)="assignOs.emit(occ.id)"
                          class="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                        >
                          Atribuir Técnico & SLA (Etapa 2) →
                        </button>
                      } @else if (occ.status === 'atribuida_pelo_consultor') {
                        <button
                          type="button"
                          [disabled]="busy"
                          (click)="registerTechVisit.emit(occ.id)"
                          class="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                        >
                          Registrar Visita Técnica (Etapa 3) →
                        </button>
                      } @else if (occ.status === 'visita_registrada_tecnico') {
                        <button
                          type="button"
                          [disabled]="busy"
                          (click)="publishToClient.emit(occ.id)"
                          class="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                        >
                          Publicar ao Cliente (Etapa 4) →
                        </button>
                      } @else if (occ.status === 'publicada_ao_cliente') {
                        <button
                          type="button"
                          [disabled]="busy"
                          (click)="approveClientDecision.emit(occ.id)"
                          class="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
                        >
                          Aprovar Decisão & Concluir (Etapa 5) ✓
                        </button>
                      } @else {
                        <div class="text-center py-1.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          ✓ Ciclo Operacional Concluído & Auditado
                        </div>
                      }
                    </div>
                  </article>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class KanbanComponent {
  @Input({ required: true }) occurrences: OccurrenceRecord[] = [];
  @Input({ required: true }) sessionUser!: MokedUser;
  @Input() busy = false;

  @Output() openGateOs = new EventEmitter<void>();
  @Output() assignOs = new EventEmitter<string>();
  @Output() registerTechVisit = new EventEmitter<string>();
  @Output() publishToClient = new EventEmitter<string>();
  @Output() approveClientDecision = new EventEmitter<string>();

  contractFilter: 'ALL' | ContractId = 'ALL';
  expandedIds: Record<string, boolean> = {
    'OC-PORTAO-A1': true,
    'OC-101': true,
    'OC-204': true,
  };

  columns: KanbanColumnConfig[] = [
    {
      status: 'aberta_pelo_lider',
      stepNumber: 'ETAPA 1',
      title: 'Aberta no Posto',
      subtitle: 'Aguardando triagem',
      headerBorder: 'border-t-[#922125]',
    },
    {
      status: 'atribuida_pelo_consultor',
      stepNumber: 'ETAPA 2',
      title: 'Atribuída & SLA',
      subtitle: 'Técnico e prazo definidos',
      headerBorder: 'border-t-amber-600',
    },
    {
      status: 'visita_registrada_tecnico',
      stepNumber: 'ETAPA 3',
      title: 'Visita Realizada',
      subtitle: 'Check-in/out e laudo',
      headerBorder: 'border-t-sky-600',
    },
    {
      status: 'publicada_ao_cliente',
      stepNumber: 'ETAPA 4',
      title: 'Publicada ao Cliente',
      subtitle: 'Aguardando decisão',
      headerBorder: 'border-t-indigo-600',
    },
    {
      status: 'concluida',
      stepNumber: 'ETAPA 5',
      title: 'Concluída & Auditada',
      subtitle: 'Ciclo encerrado',
      headerBorder: 'border-t-emerald-600',
    },
  ];

  get isManager(): boolean {
    return this.sessionUser?.role === 'alta_gestao' || this.sessionUser?.role === 'consultor';
  }

  get hasGateOs(): boolean {
    return this.occurrences.some((o) => o.id === 'OC-PORTAO-A1');
  }

  setFilter(filter: 'ALL' | ContractId) {
    this.contractFilter = filter;
  }

  getCountForContract(cId: ContractId): number {
    return this.occurrences.filter((o) => o.contractId === cId).length;
  }

  getCardsForStatus(status: OccurrenceStatus): OccurrenceRecord[] {
    return this.occurrences.filter((o) => {
      if (this.contractFilter !== 'ALL' && o.contractId !== this.contractFilter) {
        return false;
      }
      return o.status === status;
    });
  }

  toggleTimeline(id: string) {
    this.expandedIds[id] = !this.expandedIds[id];
  }
}

