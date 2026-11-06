import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MokedUser, WhatsAppMessageLog } from '../../models/moked';

@Component({
  selector: 'app-whatsapp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <!-- Cabeçalho WhatsApp Moked CCO -->
        <div class="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              💬
            </div>
            <div>
              <div class="font-bold text-[14px]">CCO Moked · Assistente Operacional WhatsApp</div>
              <div class="text-[11px] text-emerald-200">
                Conectado como: {{ currentUser.name }} ({{ currentUser.whatsappPhone }})
              </div>
            </div>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="text-white/80 hover:text-white text-xl font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <!-- Histórico de Mensagens -->
        <div class="p-4 space-y-3 overflow-y-auto flex-1 bg-[#0D1418] text-[12px]">
          @for (log of logs; track log.id) {
            <div class="space-y-1.5">
              <!-- Mensagem do Usuário (Direita) -->
              <div class="flex justify-end">
                <div class="bg-[#005C4B] text-white p-2.5 rounded-xl rounded-tr-none max-w-[85%] shadow-sm">
                  <div class="font-bold text-[10px] text-emerald-300">{{ log.matchedUserName }} ({{ log.senderPhone }})</div>
                  <div class="mt-0.5">{{ log.question }}</div>
                  <div class="text-[9px] text-emerald-200/70 text-right mt-1">{{ log.timestamp }}</div>
                </div>
              </div>

              <!-- Resposta da Moked CCO (Esquerda) -->
              <div class="flex justify-start">
                <div class="bg-[#202C33] text-zinc-100 p-2.5 rounded-xl rounded-tl-none max-w-[85%] shadow-sm space-y-1">
                  <div class="font-bold text-[10px] text-[#922125] flex items-center justify-between">
                    <span>MOKED CCO BOT</span>
                    <span class="text-zinc-400 font-normal">{{ log.matchedRoleLabel }}</span>
                  </div>
                  <div class="whitespace-pre-line leading-relaxed">{{ log.response }}</div>
                  <div class="text-[9px] text-zinc-500 text-right">{{ log.timestamp }}</div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Formulário de Envio -->
        <div class="p-3 bg-[#202C33] border-t border-zinc-700 flex items-center gap-2">
          <input
            type="text"
            [(ngModel)]="messageText"
            (keyup.enter)="sendMessage()"
            placeholder="Digite sua dúvida ou código de OS (ex: Como está a OS do portão?)..."
            class="flex-1 bg-[#2A3942] text-white placeholder-zinc-400 text-[12.5px] rounded-xl px-3.5 py-2.5 border-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            (click)="sendMessage()"
            class="bg-[#00A884] hover:bg-[#008f6f] text-white font-bold px-4 py-2.5 rounded-xl text-[12px] transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  `,
})
export class WhatsAppModalComponent {
  @Input({ required: true }) currentUser!: MokedUser;
  @Input({ required: true }) logs: WhatsAppMessageLog[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() send = new EventEmitter<{ senderPhone: string; question: string }>();

  messageText = 'Como está o andamento da OS do portão das Docas Norte?';

  sendMessage() {
    if (!this.messageText.trim()) return;
    this.send.emit({
      senderPhone: this.currentUser.whatsappPhone,
      question: this.messageText.trim(),
    });
    this.messageText = '';
  }
}
