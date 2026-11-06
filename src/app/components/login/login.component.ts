import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MokedUser, RoleId } from '../../models/moked';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#09090B] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans">
      <!-- Topo Brand Header -->
      <header class="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-[#922125] flex items-center justify-center shadow-lg shadow-[#922125]/30 border border-white/20 relative">
            <span class="font-black text-[22px] tracking-tighter text-white">M</span>
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black"></span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-[20px] tracking-[0.16em] uppercase text-white">MOKED</span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sistema Seguro"></span>
            </div>
            <p class="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              Portal de Inteligência · Centro de Comando Operacional (CCO)
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-[12px] bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-lg">
          <span class="text-zinc-400">Framework:</span>
          <span class="font-bold text-red-400 font-mono">Angular 21 + Tailwind CSS</span>
          <span class="text-zinc-600">|</span>
          <span class="text-emerald-400 font-bold">RBAC 7 Cargos Ativo</span>
        </div>
      </header>

      <!-- Centro: Formulário e Seletor dos 7 Cargos -->
      <main class="max-w-6xl w-full mx-auto my-auto py-8 space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="px-3 py-1 rounded-full bg-[#922125]/20 text-red-400 border border-[#922125]/50 text-[11px] font-bold uppercase tracking-widest inline-block">
            Acesso Restrito & Auditado
          </span>
          <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
            Autenticação Segura por Cargo & E-mail
          </h1>
          <p class="text-[13px] text-zinc-400">
            Selecione um dos 7 perfis operacionais abaixo ou digite seu e-mail corporativo para carregar as permissões e o escopo de contrato correspondente.
          </p>
        </div>

        <!-- Seletor em Grade dos 7 Cargos Pré-Configurados -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          @for (user of users; track user.id) {
            <button
              type="button"
              (click)="selectUser(user)"
              [class]="selectedUser?.id === user.id
                ? 'bg-zinc-900 border-2 border-[#922125] ring-2 ring-[#922125]/30 shadow-lg text-left p-3.5 rounded-xl transition-all'
                : 'bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left p-3.5 rounded-xl transition-all'"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-[#922125]/20 border border-[#922125]/40 text-red-400 font-bold text-[11px] flex items-center justify-center">
                  {{ user.avatarInitials }}
                </span>
                <span
                  [class]="user.role === 'alta_gestao' || user.role === 'consultor'
                    ? 'px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300'"
                >
                  {{ user.role === 'alta_gestao' || user.role === 'consultor' ? 'Acesso Total' : user.authorizedContractIds.join(' · ') }}
                </span>
              </div>
              <div class="font-bold text-[13px] text-white truncate">{{ user.name }}</div>
              <div class="text-[11px] text-[#d9383e] font-semibold mt-0.5">{{ user.roleLabel }}</div>
              <div class="text-[10px] text-zinc-500 font-mono truncate mt-1">{{ user.email }}</div>
            </button>
          }
        </div>

        <!-- Formulário de Entrada Direta por E-mail -->
        <div class="max-w-xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="space-y-1.5">
            <label for="email" class="block text-[11.5px] font-bold uppercase tracking-wider text-zinc-300">
              E-mail Corporativo ou Alias
            </label>
            <div class="relative">
              <input
                id="email"
                type="email"
                [(ngModel)]="emailInput"
                (input)="onEmailInputChange()"
                placeholder="ex: diretoria@moked.com.br ou consultor@moked.com.br"
                class="w-full bg-black border border-zinc-700 focus:border-[#922125] focus:ring-1 focus:ring-[#922125] rounded-xl px-4 py-3 text-[13.5px] font-mono text-white placeholder-zinc-500 transition-colors"
              />
            </div>
            @if (detectedRoleMessage) {
              <div class="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
                <span>✓</span>
                <span>{{ detectedRoleMessage }}</span>
              </div>
            }
          </div>

          <button
            type="button"
            (click)="handleLogin()"
            class="w-full bg-[#922125] hover:bg-[#7a1b1e] text-white font-extrabold uppercase tracking-wider text-[13px] py-3.5 rounded-xl shadow-lg shadow-[#922125]/40 transition-all flex items-center justify-center gap-2"
          >
            <span>Entrar no Centro de Comando Moked</span>
            <span>→</span>
          </button>
        </div>
      </main>

      <!-- Rodapé com Tabela de Credenciais de Auditoria -->
      <footer class="max-w-6xl w-full mx-auto pt-6 border-t border-zinc-800/80 text-[11.5px] text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="font-semibold text-zinc-400">Moked Segurança & Consultoria Patrimonial © 2026</span>
          <span class="mx-2">·</span>
          <span>Plataforma RBAC de 7 Áreas + Rastreabilidade de OS</span>
        </div>
        <div class="text-zinc-400 font-mono text-[11px]">
          Ambiente: Angular 21 Standalone · Cairo UI
        </div>
      </footer>
    </div>
  `,
})
export class LoginComponent {
  @Input({ required: true }) users: MokedUser[] = [];
  @Output() loginSuccess = new EventEmitter<{ user: MokedUser; email: string }>();

  selectedUser: MokedUser | null = null;
  emailInput = 'diretoria@moked.com.br';
  detectedRoleMessage = 'Alta Gestão detectada · Acesso Total Liberado (Contratos A e B + 7 Áreas)';

  ngOnInit() {
    if (this.users.length > 0) {
      const defaultUser = this.users.find((u) => u.role === 'alta_gestao') ?? this.users[0];
      this.selectUser(defaultUser);
    }
  }

  selectUser(user: MokedUser) {
    this.selectedUser = user;
    this.emailInput = user.email;
    this.updateRoleMessage(user.role);
  }

  onEmailInputChange() {
    const norm = this.emailInput.trim().toLowerCase();
    const matched = this.users.find((u) => u.email.toLowerCase() === norm);
    if (matched) {
      this.selectedUser = matched;
      this.updateRoleMessage(matched.role);
    } else if (norm.includes('gestao') || norm.includes('diretoria')) {
      this.detectedRoleMessage = 'Alta Gestão detectada · Acesso Total aos Contratos A e B';
    } else if (norm.includes('consultor')) {
      this.detectedRoleMessage = 'Consultor detectado · Gestão de SLA e Atribuição de OS';
    } else if (norm.includes('lider')) {
      this.detectedRoleMessage = 'Líder de Posto detectado · Abertura de Ocorrências no Posto';
    } else if (norm.includes('tecnico') || norm.includes('terceirizad')) {
      this.detectedRoleMessage = 'Técnico Terceirizado detectado · Check-in e Laudo Técnico';
    } else if (norm.includes('cliente')) {
      this.detectedRoleMessage = 'Cliente detectado · Acesso Restrito ao Contrato Alpha (sem notas internas)';
    } else {
      this.detectedRoleMessage = '';
    }
  }

  updateRoleMessage(role: RoleId) {
    if (role === 'alta_gestao' || role === 'consultor') {
      this.detectedRoleMessage = 'Perfil Gestor · Acesso Total Liberado aos Contratos A e B (sem bloqueio 403)';
    } else if (role === 'cliente') {
      this.detectedRoleMessage = 'Perfil Cliente · Visão Exclusiva do Contrato A (Notas internas protegidas)';
    } else {
      this.detectedRoleMessage = `Perfil Operacional · Vinculado ao Contrato A`;
    }
  }

  handleLogin() {
    const norm = this.emailInput.trim().toLowerCase();
    let targetUser = this.selectedUser;

    if (!targetUser) {
      targetUser = this.users.find((u) => u.email.toLowerCase() === norm) ??
        this.users.find((u) => u.role === 'alta_gestao') ??
        this.users[0];
    }

    this.loginSuccess.emit({
      user: targetUser,
      email: this.emailInput,
    });
  }
}

