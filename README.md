# Moked CRM — Centro de Comando Operacional & Inteligência de Segurança (Angular 21 + Tailwind CSS)

Plataforma corporativa completa desenvolvida em **Angular 21 (Standalone Components)** com **Tailwind CSS**, inspirada na arquitetura e organização do modelo **Treva-Admin** e na identidade visual oficial da [Moked](https://www.moked.com.br/) (Preto Obsidian `#09090B`, Vermelho Carmim `#922125` e Tipografia Cairo).

---

## 🚀 Como Executar

O projeto já está configurado e rodando:
```bash
cd "moked-angular"
npm start
```
* **Acesso Local:** [http://localhost:4200](http://localhost:4200)
* **Acesso em Rede:** `http://192.168.0.79:4200`

---

## 🏛️ Arquitetura de Design (Base Treva-Admin)

1. **Sidebar Vertical Colapsável (`isSidebarCollapsed`)**:
   * **Marca & CCO 24x7**: Logo em escudo carmesim Moked com indicador de status online em tempo real.
   * **Crachá Digital do Usuário**: Exibição do cargo ativo, e-mail corporativo, iniciais e escopo de contrato (`CTR-A` e `CTR-B`).
   * **Navegação Categorizada**:
     * 📁 **PAINÉIS PRINCIPAIS**: Dashboard Geral & KPIs, Quadro de OS (Trello) e Treinamentos & Equipe.
     * 🛡️ **OPERAÇÕES POR CARGO (7 ÁREAS)**: Acesso direto aos 7 módulos operacionais com isolamento RBAC ou acesso total para gestores.
     * ⚙️ **FERRAMENTAS & SEGURANÇA**: Auditoria de E-mail, Simulador WhatsApp CCO e Reset de Demonstração.

2. **Topbar Corporativa Superior**:
   * **Breadcrumb Dinâmico**: Rastreia a seção ativa (`Moked CRM / [Seção]`).
   * **Busca Global (`Ctrl+K`)**: Filtra ordens de serviço, postos e técnicos instantaneamente.
   * **Pílulas de Acesso a Contratos**: Teste em 1 clique para `CTR-A (Alpha)` e `CTR-B (Beta)` com feedback visual de liberação ou bloqueio 403.
   * **Seletor Rápido de Cargo no Topo**: Permite alternar de perfil em 1 clique (Alta Gestão, Consultor, Líder, Técnico, Cliente) para testar os fluxos sem deslogar.

3. **Painéis Modulares de Conteúdo**:
   * **Painel Executivo da Alta Gestão (Finanças & Governança)**:
     * **Scorecard Financeiro**: MRR de R$ 485.000,00, custos operacionais de R$ 342.150,00, margem líquida EBITDA de 29.45% (R$ 142.850,00) e saldo de contingência.
     * **Comparativo de Contratos**: Visão consolidada de CTR-A (Alpha Corp) vs CTR-B (Beta Logística) com receitas, margens, postos ativos e status de faturamento.
     * **Aprovação de Alçadas & Verbas em 1 Clique**: Aprovação imediata de orçamentos de peças, serviços terceirizados e investimentos CAPEX.
     * **Governança de Risco & Jurídico**: Sinistralidade 0.00%, auditoria trabalhista de escala 100% regular, apólice patrimonial de R$ 15 milhões vigente e SLA médio de 1h25min.
     * **Exportação Executiva**: Download de DRE Consolidado (PDF), Planilha de Custos (CSV/Excel) e Laudo Técnico.
   * **Quadro Kanban de OS (Estilo Trello)**:
     * 5 Etapas: *Aberta no Posto*, *Atribuída & SLA*, *Visita Técnica Realizada*, *Publicada ao Cliente* e *Concluída & Auditada*.
     * **Rastreabilidade Total**: Quem abriu a OS, data e hora exatas de abertura e atualização, check-in e check-out técnico, e trilha histórica com horas de cada transição.
   * **Academia de Treinamento**: Criação de novas turmas operacionais e confirmação de presença em 1 clique com quórum atualizado em tempo real.
   * **Conferência de E-mail & Auditoria**: Validação de escopo e garantia de acesso total e irrestrito para gestores.
   * **Canal WhatsApp CCO**: Simulador com bot automatizado respeitando as permissões do cargo.

---

## 🔒 Aviso de Governança, Dados Mockados & Ambiente Isolado

* **Dados 100% Mockados e Simulados**: Todos os dados exibidos na plataforma (clientes *Alpha Corp Logística* e *Beta BioPharma*, valores contábeis de faturamento de R$ 485.000,00, custos, nomes de vigilantes, postos e ordens de serviço) são **puramente fictícios e simulados** para a realização do exercício prático do processo seletivo.
* **Ambiente Seguro e Isolado**: O protótipo roda 100% localmente em ambiente isolado, sem qualquer conexão com sistemas internos corporativos, sem credenciais de produção, sem APIs de terceiros pagas e sem contatos/telefones reais.
* **Finalidade e Propriedade**: Exercício desenvolvido exclusivamente para fins de avaliação e demonstração técnica. A participação é voluntária e a entrega não transfere direitos sobre o código.

| Perfil / Cargo | E-mail de Demonstração | Permissão e Escopo |
| :--- | :--- | :--- |
| **Alta Gestão** | `diretoria@moked.com.br` | **Acesso Total** aos Contratos A e B, todas as 7 Áreas e Laudos Confidenciais |
| **Consultor Moked** | `consultor@moked.com.br` | Gestão de SLA, Atribuição de Terceirizados e Publicação ao Cliente |
| **Líder de Posto** | `lider@moked.com.br` | Posto Alpha (Contrato A), Abertura de Falhas no Portão e Presença |
| **Terceirizados** | `terceirizado@tecportoes.com.br` | Check-in/out técnico, Laudo Confidencial e Serviço Executado |
| **Cliente** | `cliente@alphalogistica.com.br` | Contrato A (sem notas internas confidenciais) |
