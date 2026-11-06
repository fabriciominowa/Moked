const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pptx = new pptxgen();

  // WIDESCREEN 16:9 OFICIAL DO POWERPOINT (13.333" x 7.5")
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Moked Segurança & Consultoria Patrimonial';
  pptx.company = 'Moked Brasil';
  pptx.title = 'Moked CRM - Plataforma Integrada de Operações de Segurança';
  pptx.subject = 'Apresentação Executiva do Portal de Inteligência & CCO 24x7 (Dados Mockados)';

  const artifactsDir = 'C:\\Users\\fabricio minowa\\.gemini\\antigravity\\brain\\760078b1-43d6-48be-ab4b-129566241c8e';
  const ccoImg = path.join(artifactsDir, 'cco_hero_1793885473373.jpg');
  const gateImg = path.join(artifactsDir, 'portao_docas_norte_1793885638161.jpg');
  const ctrAImg = path.join(artifactsDir, 'contrato_a_alpha_1793885495535.jpg');
  const ctrBImg = path.join(artifactsDir, 'contrato_b_beta_1793885522182.jpg');

  // PALETA DE CORES MOKED OFICIAL
  const COLOR_BG_DARK = '09090B';       // Deep Obsidian
  const COLOR_CARD_DARK = '18181B';     // Dark Card
  const COLOR_BORDER_DARK = '27272A';   // Dark Border
  const COLOR_CRIMSON = '922125';       // Crimson Moked
  const COLOR_CRIMSON_LIGHT = 'D9383E'; // Crimson Highlight
  const COLOR_CRIMSON_BG = 'FEF2F2';    // Red Soft Background
  const COLOR_CRIMSON_BORDER = 'FECACA';// Red Soft Border
  const COLOR_BG_LIGHT = 'F8FAFC';      // Slate 50
  const COLOR_CARD_LIGHT = 'FFFFFF';    // White Card
  const COLOR_BORDER_LIGHT = 'E2E8F0';  // Slate 200
  const COLOR_TEXT_DARK = '0F172A';     // Slate 900
  const COLOR_TEXT_MUTED = '475569';    // Slate 600
  const COLOR_TEXT_LIGHT = 'FFFFFF';    // White
  const COLOR_TEXT_DIM = '94A3B8';      // Slate 400
  const COLOR_EMERALD = '059669';       // Emerald 600
  const COLOR_BLUE = '2563EB';          // Blue 600
  const COLOR_AMBER = 'D97706';         // Amber 600

  // Helper para cabeçalho padrão dos slides internos
  function addSlideHeader(slide, category, title, rightContext = 'CCO 24x7 · DADOS MOCKADOS') {
    // Barra superior escura
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 1.0,
      fill: { color: COLOR_BG_DARK },
    });

    // Faixa vermelha no topo
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.08,
      fill: { color: COLOR_CRIMSON },
    });

    // Categoria em destaque
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.16,
      w: 8.5,
      h: 0.28,
      fontSize: 9.5,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_CRIMSON_LIGHT,
      charSpacing: 2,
    });

    // Título Principal do Slide
    slide.addText(title, {
      x: 0.8,
      y: 0.44,
      w: 8.5,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_LIGHT,
    });

    // Contexto no canto direito superior
    slide.addText(rightContext, {
      x: 8.5,
      y: 0.35,
      w: 4.033,
      h: 0.4,
      fontSize: 9.5,
      fontFace: 'Arial',
      bold: true,
      align: 'right',
      color: COLOR_TEXT_DIM,
    });

    // Rodapé padrão
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 6.9,
      w: 11.733,
      h: 0.02,
      fill: { color: COLOR_BORDER_LIGHT },
    });

    slide.addText('Moked Segurança & Consultoria Patrimonial · Protótipo Angular 21 (Treva-Admin)', {
      x: 0.8,
      y: 6.98,
      w: 8.0,
      h: 0.35,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: '64748B',
    });

    slide.addText('Dados 100% Fictícios & Mockados · Ambiente Isolado', {
      x: 8.5,
      y: 6.98,
      w: 4.033,
      h: 0.35,
      fontSize: 8.5,
      fontFace: 'Arial',
      align: 'right',
      color: '64748B',
    });
  }

  // =========================================================================
  // SLIDE 1: CAPA EXECUTIVA PREMIUM (16:9 Widescreen)
  // =========================================================================
  const s1 = pptx.addSlide();
  s1.background = { color: COLOR_BG_DARK };

  // Faixa lateral carmesim
  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: 7.5, fill: { color: COLOR_CRIMSON } });

  // Badge de Dados Mockados & Ambiente Isolado no topo
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.9,
    y: 0.55,
    w: 5.8,
    h: 0.32,
    rectRadius: 0.08,
    fill: { color: '18181B' },
    line: { color: COLOR_CRIMSON_LIGHT, width: 1 },
  });
  s1.addText('🔒 AMBIENTE DE TESTES · 100% DADOS MOCKADOS & FICTÍCIOS', {
    x: 1.0,
    y: 0.6,
    w: 5.6,
    h: 0.22,
    fontSize: 8.5,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON_LIGHT,
    charSpacing: 1,
  });

  // Tag Superior
  s1.addText('PORTAL CORPORATIVO DE INTELIGÊNCIA & OPERAÇÕES DE SEGURANÇA 24X7', {
    x: 0.9,
    y: 1.0,
    w: 7.3,
    h: 0.35,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: '94A3B8',
    charSpacing: 2,
  });

  // Título MOKED CRM
  s1.addText('MOKED CRM', {
    x: 0.9,
    y: 1.4,
    w: 7.3,
    h: 1.1,
    fontSize: 46,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_LIGHT,
  });

  // Subtítulo
  s1.addText('Centro de Comando Operacional (CCO 24x7)\nGovernança por Cargos, Rastreabilidade de OS & Gestão Financeira', {
    x: 0.9,
    y: 2.6,
    w: 7.3,
    h: 0.9,
    fontSize: 15,
    fontFace: 'Arial',
    color: 'CBD5E1',
    lineSpacing: 22,
  });

  // Grade de Destaques Técnicos (4 Pílulas Estilizadas)
  const pillsS1 = [
    { text: '✓ Padrão Treva-Admin UI', x: 0.9, y: 3.7 },
    { text: '✓ Angular 21 Standalone + Tailwind', x: 4.4, y: 3.7 },
    { text: '✓ 7 Áreas Operacionais (RBAC)', x: 0.9, y: 4.3 },
    { text: '✓ Cockpit DRE em Tempo Real', x: 4.4, y: 4.3 },
  ];
  pillsS1.forEach(p => {
    s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x,
      y: p.y,
      w: 3.3,
      h: 0.45,
      rectRadius: 0.1,
      fill: { color: '18181B' },
      line: { color: '27272A', width: 1 },
    });
    s1.addText(p.text, {
      x: p.x + 0.15,
      y: p.y + 0.08,
      w: 3.0,
      h: 0.3,
      fontSize: 10.5,
      fontFace: 'Arial',
      bold: true,
      color: 'E2E8F0',
    });
  });

  // Metadados do Projeto
  s1.addText('Finalidade: Demonstração Técnica & Avaliação Prática em Processo Seletivo\nBase de Dados: Fictícia / Local (Sem acesso a produção ou contatos reais)\nVersão: 2.4 Enterprise · Março 2026', {
    x: 0.9,
    y: 5.15,
    w: 7.3,
    h: 1.1,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: '94A3B8',
    lineSpacing: 18,
  });

  // Imagem CCO Hero com moldura profissional
  if (fs.existsSync(ccoImg)) {
    s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.5,
      y: 0.9,
      w: 4.1,
      h: 5.6,
      rectRadius: 0.15,
      fill: { color: '18181B' },
      line: { color: '3F3F46', width: 1.5 },
    });
    s1.addImage({
      path: ccoImg,
      x: 8.55,
      y: 0.95,
      w: 4.0,
      h: 4.6,
      rounding: true,
    });
    s1.addText('CENTRAL DE COMANDO OPERACIONAL (CCO 24X7)', {
      x: 8.6,
      y: 5.65,
      w: 3.9,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
      color: COLOR_CRIMSON_LIGHT,
    });
    s1.addText('Monitoramento e despacho em tempo real', {
      x: 8.6,
      y: 5.92,
      w: 3.9,
      h: 0.3,
      fontSize: 9,
      fontFace: 'Arial',
      align: 'center',
      color: '94A3B8',
    });
  }

  // Rodapé da Capa
  s1.addText('Moked Consultoria de Segurança Patrimonial Ltda. · Protótipo Homologado com Dados Mockados', {
    x: 0.9,
    y: 6.85,
    w: 11.5,
    h: 0.35,
    fontSize: 9,
    fontFace: 'Arial',
    color: '64748B',
  });

  // =========================================================================
  // SLIDE 2: VISÃO GERAL & 3 PILARES ESTRATÉGICOS
  // =========================================================================
  const s2 = pptx.addSlide();
  s2.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s2, 'Visão Geral do Produto', 'A Solução Unificada para Segurança Privada & Consultoria');

  const cardsS2 = [
    {
      num: 'PILAR 01',
      title: 'Isolamento por Cargos (RBAC)',
      desc: 'Estruturação em 7 áreas operacionais com isolamento rigoroso entre contratos.\n\n• Clientes acessam apenas seu contrato.\n• Notas internas e custos são estritamente ocultados.\n• Alta Gestão e Consultores possuem visão global irrestrita.',
      color: COLOR_CRIMSON,
      metric: '7 Perfis Blindados',
      metricSub: 'Isolamento Multi-tenant',
    },
    {
      num: 'PILAR 02',
      title: 'Quadro Kanban de OS (Trello)',
      desc: 'Fluxo em 5 etapas com carimbos auditados de data, hora e autor responsável.\n\n• Registro da falha pelo Líder no posto.\n• Triagem e SLA de 4h pelo Consultor.\n• Check-in/out e laudo pelo Técnico.\n• Validação transparente pelo Cliente.',
      color: COLOR_BLUE,
      metric: '5 Etapas Auditadas',
      metricSub: 'SLA < 4h com Timeline',
    },
    {
      num: 'PILAR 03',
      title: 'Gestão Financeira & DRE',
      desc: 'Centro de comando para a Diretoria acompanhar finanças e margens em tempo real.\n\n• Receita MRR: R$ 485.000,00 (mockado).\n• Margem EBITDA: R$ 142.850,00 (29,45%).\n• Aprovações de verbas em 1 clique.\n• Exportações reais de PDF e Excel.',
      color: COLOR_EMERALD,
      metric: 'R$ 485k MRR (Mock)',
      metricSub: '29,45% Margem EBITDA',
    },
  ];

  cardsS2.forEach((c, idx) => {
    const cardX = 0.8 + idx * 4.04;
    s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: 1.35,
      w: 3.65,
      h: 5.25,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_LIGHT },
      line: { color: COLOR_BORDER_LIGHT, width: 1 },
    });
    s2.addShape(pptx.shapes.RECTANGLE, {
      x: cardX,
      y: 1.35,
      w: 3.65,
      h: 0.12,
      fill: { color: c.color },
    });
    s2.addText(c.num, {
      x: cardX + 0.3,
      y: 1.6,
      w: 3.05,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: c.color,
    });
    s2.addText(c.title, {
      x: cardX + 0.3,
      y: 1.88,
      w: 3.05,
      h: 0.6,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_DARK,
    });
    s2.addText(c.desc, {
      x: cardX + 0.3,
      y: 2.55,
      w: 3.05,
      h: 2.7,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLOR_TEXT_MUTED,
      lineSpacing: 16,
    });
    s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.3,
      y: 5.4,
      w: 3.05,
      h: 0.95,
      rectRadius: 0.08,
      fill: { color: 'F1F5F9' },
      line: { color: 'E2E8F0', width: 1 },
    });
    s2.addText(c.metric, {
      x: cardX + 0.4,
      y: 5.5,
      w: 2.85,
      h: 0.38,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: c.color,
      align: 'center',
    });
    s2.addText(c.metricSub, {
      x: cardX + 0.4,
      y: 5.9,
      w: 2.85,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: '64748B',
      align: 'center',
    });
  });

  // =========================================================================
  // SLIDE 3: ARQUITETURA VISUAL PADRÃO TREVA-ADMIN
  // =========================================================================
  const s3 = pptx.addSlide();
  s3.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s3, 'Design System & Usabilidade', 'Arquitetura Visual no Padrão Treva-Admin');

  const trevaCards = [
    {
      title: '1. Sidebar Vertical Inteligente',
      desc: 'Menu lateral colapsável com navegação agrupada em 3 blocos: Painéis Principais, 7 Áreas Operacionais e Ferramentas CCO. Crachá do usuário fixo no rodapé.',
    },
    {
      title: '2. Topbar com Busca Global (Ctrl+K)',
      desc: 'Pesquisa em tempo real com atalho rápido de teclado. Permite localizar ordens de serviço, postos, vigilantes e técnicos sem recarregar.',
    },
    {
      title: '3. Pílulas de Acesso Rápido a Contratos',
      desc: 'Botoeiras diretas no cabeçalho para Contrato A (Alpha) e Contrato B (Beta), com feedback visual imediato de liberação ou bloqueio por RBAC.',
    },
    {
      title: '4. Seletor de Perfis no Topo',
      desc: 'Dropdown executivo que permite alternar instantaneamente entre os 7 cargos (Alta Gestão, Consultor, Líder, Técnico, Cliente) para demonstração e testes.',
    },
  ];

  trevaCards.forEach((tc, i) => {
    const cardY = 1.35 + i * 1.32;
    s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: cardY,
      w: 6.8,
      h: 1.18,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_LIGHT },
      line: { color: COLOR_BORDER_LIGHT, width: 1 },
    });
    s3.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: cardY,
      w: 0.12,
      h: 1.18,
      fill: { color: COLOR_CRIMSON },
    });
    s3.addText(tc.title, {
      x: 1.1,
      y: cardY + 0.12,
      w: 6.3,
      h: 0.32,
      fontSize: 12,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_DARK,
    });
    s3.addText(tc.desc, {
      x: 1.1,
      y: cardY + 0.45,
      w: 6.3,
      h: 0.65,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLOR_TEXT_MUTED,
      lineSpacing: 14,
    });
  });

  // Lado Direito: Card de Design Tokens & Especificações
  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.9,
    y: 1.35,
    w: 4.633,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_BG_DARK },
    line: { color: COLOR_BORDER_DARK, width: 1 },
  });

  s3.addText('ESPECIFICAÇÕES TÉCNICAS DA UI', {
    x: 8.2,
    y: 1.6,
    w: 4.0,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON_LIGHT,
    charSpacing: 1.5,
  });

  s3.addText('Design Tokens & Framework Oficial', {
    x: 8.2,
    y: 1.95,
    w: 4.0,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_LIGHT,
  });

  const tokens = [
    { label: 'Framework Web:', val: 'Angular 21.1.4 (Standalone Components)' },
    { label: 'Estilização:', val: 'Tailwind CSS 3.4 com Design Tokens' },
    { label: 'Cor Primária:', val: 'Deep Obsidian (#09090B)' },
    { label: 'Cor de Destaque:', val: 'Crimson Moked (#922125)' },
    { label: 'Tipografia:', val: 'Cairo (Google Fonts) + Inter UI' },
    { label: 'Numerais:', val: 'tabular-nums (Alinhamento contábil estrito)' },
    { label: 'Massa de Dados:', val: '100% Mockada / Fictícia (Local Storage)' },
    { label: 'Responsividade:', val: 'Grid flexível para 1080p, 2K e 4K CCO' },
  ];

  tokens.forEach((tk, idx) => {
    const tY = 2.45 + idx * 0.44;
    s3.addText(tk.label, {
      x: 8.2,
      y: tY,
      w: 1.6,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Arial',
      bold: true,
      color: '94A3B8',
    });
    s3.addText(tk.val, {
      x: 9.8,
      y: tY,
      w: 2.5,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: 'F1F5F9',
    });
  });

  // =========================================================================
  // SLIDE 4: DISTRIBUIÇÃO POR CARGO (7 ÁREAS OPERACIONAIS)
  // =========================================================================
  const s4 = pptx.addSlide();
  s4.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s4, 'Governança & Segurança da Informação', 'Distribuição das 7 Áreas Operacionais & Matriz RBAC');

  const rolesRows = [
    ['Área 01', 'Cliente / Contratante', 'Acompanha chamados do seu contrato em tempo real. Notas técnicas internas e custos são estritamente ocultados.', 'Restrito (Somente Leitura)'],
    ['Área 02', 'Consultor Moked', 'Triagem de ocorrências, parametrização de SLA de 4h, designação de terceirizados e publicação de laudos.', 'Operacional Avançado'],
    ['Área 03', 'Líder de Posto', 'Abertura de chamados operacionais no posto, controle de motores/eclusas e apontamento diário de presença/faltas.', 'Campo / Posto'],
    ['Área 04', 'Técnico Terceirizado', 'Registro de check-in, check-out no posto, execução do reparo e elaboração de laudo interno confidencial.', 'Técnico de Campo'],
    ['Área 05', 'Central de Monitoramento', 'Operação remota de CFTV, visualização de mural de câmeras, alarmes de cerca elétrica e acionamento de eclusas.', 'CCO Operacional'],
    ['Área 06', 'Treinamento & Equipe', 'Criação de turmas operacionais, chamada em 1 clique com quórum em tempo real e reposição de faltas em < 15 min.', 'Capacitação / RH'],
    ['Área 07', 'Alta Gestão (Diretoria)', 'ACESSO TOTAL IRRESTRITO: Cockpit financeiro, DRE gerencial, aprovação de orçamentos, todos os contratos e plantas.', 'Master / Diretoria'],
  ];

  s4.addTable(
    [
      [
        { text: 'Área', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'center' } },
        { text: 'Perfil / Cargo', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
        { text: 'Atribuições & Escopo Operacional', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
        { text: 'Nível de Acesso', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'center' } },
      ],
      ...rolesRows.map((r, i) => {
        const isMaster = i === 6;
        const bg = isMaster ? 'FEF2F2' : (i % 2 === 0 ? 'FFFFFF' : 'F8FAFC');
        const textColor = isMaster ? '922125' : '0F172A';
        return [
          { text: r[0], options: { bold: true, align: 'center', fill: bg, color: textColor } },
          { text: r[1], options: { bold: true, fill: bg, color: textColor } },
          { text: r[2], options: { fill: bg, color: isMaster ? '922125' : '334155' } },
          { text: r[3], options: { bold: true, align: 'center', fill: bg, color: isMaster ? '922125' : (i === 0 ? '64748B' : '059669') } },
        ];
      }),
    ],
    {
      x: 0.8,
      y: 1.35,
      w: 11.733,
      colW: [1.1, 2.5, 6.133, 2.0],
      rowH: [0.38, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.72],
      border: { pt: 1, color: 'CBD5E1' },
      fontSize: 9.5,
      fontFace: 'Arial',
    }
  );

  // =========================================================================
  // SLIDE 5: QUADRO KANBAN DE OS ESTILO TRELLO (5 ETAPAS)
  // =========================================================================
  const s5 = pptx.addSlide();
  s5.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s5, 'Centro de Comando Operacional', 'Quadro Kanban de OS estilo Trello com Rastreabilidade de Data, Hora & Autor');

  const kanbanColumns = [
    {
      step: 'ETAPA 01',
      title: 'Aberta no Posto',
      author: 'Líder de Posto',
      os: 'OS OC-PORTAO-A1',
      desc: 'Falha no motor do portão principal das docas norte. Veículos retidos.',
      time: '08:15 (Abertura)',
      color: COLOR_CRIMSON,
    },
    {
      step: 'ETAPA 02',
      title: 'Atribuída & SLA',
      author: 'Consultor Moked',
      os: 'OS OC-PORTAO-A1',
      desc: 'Classificado como Emergencial. SLA de 4h ativado. Técnico acionado.',
      time: '08:42 (Triagem)',
      color: COLOR_AMBER,
    },
    {
      step: 'ETAPA 03',
      title: 'Visita Técnica',
      author: 'Técnico Terceirizado',
      os: 'OS OC-PORTAO-A1',
      desc: 'Check-in 09:30. Troca de capacitor e laudo técnico confidencial.',
      time: '10:45 (Check-out)',
      color: COLOR_BLUE,
    },
    {
      step: 'ETAPA 04',
      title: 'Publicada ao Cliente',
      author: 'Consultor Moked',
      os: 'OS OC-PORTAO-A1',
      desc: 'Laudo limpo emitido. Parecer aprovado e visível no portal do cliente.',
      time: '11:15 (Publicação)',
      color: '6366F1',
    },
    {
      step: 'ETAPA 05',
      title: 'Concluída & Auditada',
      author: 'Cliente / Gestão',
      os: 'OS OC-PORTAO-A1',
      desc: 'Preventiva agendada para 30 dias. Ciclo encerrado com sucesso.',
      time: '11:40 (Fechamento)',
      color: COLOR_EMERALD,
    },
  ];

  kanbanColumns.forEach((col, idx) => {
    const colX = 0.8 + idx * 2.386;
    const colW = 2.18;

    s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: colX,
      y: 1.35,
      w: colW,
      h: 5.25,
      rectRadius: 0.08,
      fill: { color: 'F1F5F9' },
      line: { color: 'CBD5E1', width: 1 },
    });

    s5.addShape(pptx.shapes.RECTANGLE, {
      x: colX,
      y: 1.35,
      w: colW,
      h: 0.8,
      fill: { color: COLOR_BG_DARK },
    });
    s5.addShape(pptx.shapes.RECTANGLE, {
      x: colX,
      y: 1.35,
      w: colW,
      h: 0.08,
      fill: { color: col.color },
    });

    s5.addText(col.step, {
      x: colX + 0.1,
      y: 1.48,
      w: colW - 0.2,
      h: 0.22,
      fontSize: 8,
      fontFace: 'Arial',
      bold: true,
      color: '94A3B8',
    });
    s5.addText(col.title, {
      x: colX + 0.1,
      y: 1.72,
      w: colW - 0.2,
      h: 0.35,
      fontSize: 10.5,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_LIGHT,
    });

    s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: colX + 0.12,
      y: 2.3,
      w: colW - 0.24,
      h: 4.15,
      rectRadius: 0.06,
      fill: { color: COLOR_CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 },
    });

    s5.addText(col.os, {
      x: colX + 0.22,
      y: 2.45,
      w: colW - 0.44,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_CRIMSON,
    });

    s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: colX + 0.22,
      y: 2.75,
      w: colW - 0.44,
      h: 0.32,
      rectRadius: 0.04,
      fill: 'F8FAFC',
      line: { color: 'E2E8F0', width: 1 },
    });
    s5.addText(`Autor: ${col.author}`, {
      x: colX + 0.26,
      y: 2.8,
      w: colW - 0.52,
      h: 0.22,
      fontSize: 8,
      fontFace: 'Arial',
      bold: true,
      color: '334155',
    });

    s5.addText(`⏱ ${col.time}`, {
      x: colX + 0.22,
      y: 3.18,
      w: colW - 0.44,
      h: 0.22,
      fontSize: 8.5,
      fontFace: 'Arial',
      bold: true,
      color: col.color,
    });

    s5.addText(col.desc, {
      x: colX + 0.22,
      y: 3.48,
      w: colW - 0.44,
      h: 1.8,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLOR_TEXT_MUTED,
      lineSpacing: 14,
    });

    s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: colX + 0.22,
      y: 5.85,
      w: colW - 0.44,
      h: 0.45,
      rectRadius: 0.04,
      fill: 'FEF2F2',
      line: { color: 'FECACA', width: 1 },
    });
    s5.addText('✓ Auditado no CCO', {
      x: colX + 0.26,
      y: 5.95,
      w: colW - 0.52,
      h: 0.25,
      fontSize: 8,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
      color: COLOR_CRIMSON,
    });
  });

  // =========================================================================
  // SLIDE 6: CENTRO DE COMANDO DA ALTA GESTÃO & DRE FINANCEIRO (MOCKADO)
  // =========================================================================
  const s6 = pptx.addSlide();
  s6.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s6, 'Alta Gestão & Governança Corporativa', 'Cockpit Financeiro, DRE em Tempo Real & Exportações Reais');

  const kpiFin = [
    { title: 'RECEITA MENSAL (MRR)*', val: 'R$ 485.000,00', sub: '+8.4% vs mês ant. (Alpha + Beta)', color: COLOR_EMERALD },
    { title: 'CUSTOS OPERACIONAIS*', val: 'R$ 342.150,00', sub: 'Efetivo (R$ 228k) + Terceirizados', color: COLOR_CRIMSON },
    { title: 'MARGEM EBITDA*', val: 'R$ 142.850,00', sub: '29,45% de margem (Meta 28,0%)', color: COLOR_EMERALD },
    { title: 'FUNDO CONTINGÊNCIA*', val: 'R$ 35.800,00', sub: 'Saldo para liberação emergencial', color: COLOR_BLUE },
  ];

  kpiFin.forEach((k, idx) => {
    const kX = 0.8 + idx * 3.0;
    s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: kX,
      y: 1.35,
      w: 2.75,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: COLOR_CARD_LIGHT },
      line: { color: COLOR_BORDER_LIGHT, width: 1 },
    });
    s6.addText(k.title, {
      x: kX + 0.2,
      y: 1.48,
      w: 2.35,
      h: 0.22,
      fontSize: 8.5,
      fontFace: 'Arial',
      bold: true,
      color: '64748B',
    });
    s6.addText(k.val, {
      x: kX + 0.2,
      y: 1.72,
      w: 2.35,
      h: 0.45,
      fontSize: 15,
      fontFace: 'Arial',
      bold: true,
      color: k.color,
    });
    s6.addText(k.sub, {
      x: kX + 0.2,
      y: 2.22,
      w: 2.35,
      h: 0.35,
      fontSize: 8,
      fontFace: 'Arial',
      color: '475569',
    });
  });

  s6.addText('Comparativo Consolidado de Contratos (*Valores simulados para demonstração gerencial)', {
    x: 0.8,
    y: 2.85,
    w: 11.733,
    h: 0.3,
    fontSize: 12,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_DARK,
  });

  const tableFin = [
    ['CTR-A', 'Alpha Corp Logística', 'R$ 265.000,00', 'R$ 184.200,00', 'R$ 80.800,00 (30,5%)', '18 vig.', '98,6%', 'Adimplente'],
    ['CTR-B', 'Beta Logística Intermodal', 'R$ 220.000,00', 'R$ 157.950,00', 'R$ 62.050,00 (28,2%)', '14 vig.', '96,2%', 'Adimplente'],
    ['TOTAL', 'Consolidado Geral Moked', 'R$ 485.000,00', 'R$ 342.150,00', 'R$ 142.850,00 (29,45%)', '32 vig.', '97,4%', '100% Em Dia'],
  ];

  s6.addTable(
    [
      [
        { text: 'Contrato', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
        { text: 'Cliente / Unidade', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
        { text: 'Faturamento', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'right' } },
        { text: 'Custos Diretos', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'right' } },
        { text: 'Margem EBITDA', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'right' } },
        { text: 'Efetivo', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'center' } },
        { text: 'SLA Real', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'center' } },
        { text: 'Status', options: { bold: true, fill: '09090B', color: 'FFFFFF', align: 'center' } },
      ],
      ...tableFin.map((row, i) => [
        { text: row[0], options: { bold: true, fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: COLOR_CRIMSON } },
        { text: row[1], options: { bold: true, fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: '0F172A' } },
        { text: row[2], options: { align: 'right', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: '0F172A' } },
        { text: row[3], options: { align: 'right', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: '475569' } },
        { text: row[4], options: { bold: true, align: 'right', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: COLOR_EMERALD } },
        { text: row[5], options: { align: 'center', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: '0F172A' } },
        { text: row[6], options: { align: 'center', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: COLOR_EMERALD, bold: true } },
        { text: row[7], options: { align: 'center', fill: i === 2 ? 'F1F5F9' : 'FFFFFF', color: COLOR_EMERALD, bold: true } },
      ]),
    ],
    {
      x: 0.8,
      y: 3.2,
      w: 11.733,
      colW: [1.2, 3.133, 1.8, 1.6, 2.0, 0.9, 0.9, 1.2],
      rowH: [0.35, 0.42, 0.42, 0.42],
      border: { pt: 1, color: 'CBD5E1' },
      fontSize: 9,
      fontFace: 'Arial',
    }
  );

  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 5.0,
    w: 11.733,
    h: 1.6,
    rectRadius: 0.08,
    fill: { color: COLOR_CRIMSON_BG },
    line: { color: COLOR_CRIMSON_BORDER, width: 1 },
  });

  s6.addText('CENTRAL DE EXPORTAÇÃO REAL · ARQUIVOS DISPONÍVEIS PARA DOWNLOAD IMEDIATO NO PORTAL', {
    x: 1.1,
    y: 5.15,
    w: 11.133,
    h: 0.28,
    fontSize: 10,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON,
    charSpacing: 1,
  });

  const exportPills = [
    { title: '📄 Exportar DRE (PDF)', desc: 'Gera relatório financeiro analítico oficial com faturamento, deduções e margem líquida consolidada.' },
    { title: '📊 Custos dos Contratos (Excel/CSV)', desc: 'Planilha estruturada com BOM UTF-8 e separadores para abertura nativa perfeita no Microsoft Excel.' },
    { title: '📑 Laudo Consolidado (PDF)', desc: 'Dossiê executivo completo da ocorrência com histórico de técnico, SLA e assinaturas de validação.' },
  ];

  exportPills.forEach((ep, idx) => {
    const epX = 1.1 + idx * 3.75;
    s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: epX,
      y: 5.5,
      w: 3.55,
      h: 0.95,
      rectRadius: 0.06,
      fill: { color: 'FFFFFF' },
      line: { color: 'FECACA', width: 1 },
    });
    s6.addText(ep.title, {
      x: epX + 0.15,
      y: 5.58,
      w: 3.25,
      h: 0.25,
      fontSize: 9.5,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_CRIMSON,
    });
    s6.addText(ep.desc, {
      x: epX + 0.15,
      y: 5.85,
      w: 3.25,
      h: 0.55,
      fontSize: 8,
      fontFace: 'Arial',
      color: '475569',
      lineSpacing: 12,
    });
  });

  // =========================================================================
  // SLIDE 7: ABERTURA EFETIVA DE CONTRATOS & DOSSIÊ EM 5 ABAS
  // =========================================================================
  const s7 = pptx.addSlide();
  s7.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s7, 'Gestão de Contratos & Clientes', 'Dossiê Interativo em 5 Abas com Download de Minuta em PDF');

  const contractTabs = [
    ['Aba 1. Partes & Unidade', 'Razão social fictícia, CNPJ simulado, vigência, endereço e contatos diretos do consultor e gestor.'],
    ['Aba 2. Financeiro & Fatura', 'Valor mensal recorrente (R$ 265k / R$ 220k mockados), dia de vencimento, adimplência e reajuste anual pelo IPCA.'],
    ['Aba 3. Postos & Efetivo', 'Dimensionamento de todos os postos 24h, turnos 12x36, total de vigilantes alocados e descrição das rotinas.'],
    ['Aba 4. Ativos & Barreiras', 'Inventário dos equipamentos no local (portão industrial, câmeras IP 4K, eclusas, cerca Speedrite 6J).'],
    ['Aba 5. Regras de SLA & Seguro', 'Metas contratuais de atendimento (< 4h), SLA real auditado de 98,6% e apólice de seguro de R$ 15 milhões.'],
  ];

  s7.addTable(
    [
      [
        { text: 'Aba do Dossiê', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
        { text: 'Informações Apresentadas em Tempo Real no Modal', options: { bold: true, fill: '09090B', color: 'FFFFFF' } },
      ],
      ...contractTabs.map((t) => [
        { text: t[0], options: { bold: true, color: '0F172A', fill: 'FFFFFF' } },
        { text: t[1], options: { color: '334155', fill: 'FFFFFF' } },
      ]),
    ],
    {
      x: 0.8,
      y: 1.35,
      w: 7.6,
      colW: [2.5, 5.1],
      rowH: [0.38, 0.72, 0.72, 0.72, 0.72, 0.72],
      border: { pt: 1, color: 'CBD5E1' },
      fontSize: 9.5,
      fontFace: 'Arial',
    }
  );

  s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.7,
    y: 1.35,
    w: 3.833,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_BG_DARK },
    line: { color: COLOR_BORDER_DARK, width: 1 },
  });

  s7.addText('MINUTA CONTRATUAL EM PDF', {
    x: 9.0,
    y: 1.55,
    w: 3.233,
    h: 0.25,
    fontSize: 9.5,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON_LIGHT,
    charSpacing: 1.5,
  });

  s7.addText('Download da Minuta Oficial', {
    x: 9.0,
    y: 1.82,
    w: 3.233,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_LIGHT,
  });

  s7.addText('Ao clicar em "Baixar Minuta (PDF)" no dossiê, a plataforma compila as cláusulas jurídicas, dimensionamento de efetivo e regras de SLA em um documento formal para impressão ou assinatura.', {
    x: 9.0,
    y: 2.25,
    w: 3.233,
    h: 0.95,
    fontSize: 9,
    fontFace: 'Arial',
    color: 'CBD5E1',
    lineSpacing: 14,
  });

  if (fs.existsSync(ctrAImg)) {
    s7.addImage({
      path: ctrAImg,
      x: 9.0,
      y: 3.3,
      w: 3.233,
      h: 2.2,
      rounding: true,
    });
    s7.addText('UNIDADE CONTRATUAL ALPHA CORP · DOCAS NORTE', {
      x: 9.0,
      y: 5.6,
      w: 3.233,
      h: 0.25,
      fontSize: 8,
      fontFace: 'Arial',
      bold: true,
      align: 'center',
      color: COLOR_CRIMSON_LIGHT,
    });
    s7.addText('Posto 24h ativo com 18 vigilantes (Dados simulados)', {
      x: 9.0,
      y: 5.85,
      w: 3.233,
      h: 0.25,
      fontSize: 8,
      fontFace: 'Arial',
      align: 'center',
      color: '94A3B8',
    });
  }

  // =========================================================================
  // SLIDE 8: TREINAMENTO, QUÓRUM & CANAL WHATSAPP CCO
  // =========================================================================
  const s8 = pptx.addSlide();
  s8.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s8, 'Capacitação & Canais Digitais', 'Academia de Treinamento e Canal WhatsApp Integrado');

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.35,
    w: 5.65,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_LIGHT },
    line: { color: COLOR_BORDER_LIGHT, width: 1 },
  });

  s8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.35,
    w: 5.65,
    h: 0.12,
    fill: { color: '0F766E' },
  });

  s8.addText('🎓 ACADEMIA DE TREINAMENTO (ÁREA 6)', {
    x: 1.1,
    y: 1.65,
    w: 5.05,
    h: 0.3,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: '0F766E',
  });

  s8.addText('Capacitação do Efetivo & Quórum ao Vivo', {
    x: 1.1,
    y: 1.98,
    w: 5.05,
    h: 0.45,
    fontSize: 15,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_DARK,
  });

  const trainPoints = [
    '• Criação de Novas Turmas: Cadastro rápido com contrato vinculado, instrutor responsável, data, hora e carga horária.',
    '• Confirmação em 1 Clique: Lista de presença interativa com cálculo de quórum atualizado em tempo real.',
    '• Reposição Preventiva de Faltas: Disparo automático de alerta quando um vigilante falta para alocação de reserva em < 15 min.',
    '• Trilhas de Certificação: Treinamentos em operação de eclusas, cerca de 6J, controle biométrico e defesa perimetral.',
  ];

  s8.addText(trainPoints.join('\n\n'), {
    x: 1.1,
    y: 2.55,
    w: 5.05,
    h: 3.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    lineSpacing: 16,
  });

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.883,
    y: 1.35,
    w: 5.65,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_LIGHT },
    line: { color: COLOR_BORDER_LIGHT, width: 1 },
  });

  s8.addShape(pptx.shapes.RECTANGLE, {
    x: 6.883,
    y: 1.35,
    w: 5.65,
    h: 0.12,
    fill: { color: COLOR_EMERALD },
  });

  s8.addText('💬 CANAL WHATSAPP CCO INTEGRADO', {
    x: 7.183,
    y: 1.65,
    w: 5.05,
    h: 0.3,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_EMERALD,
  });

  s8.addText('Atendimento Automatizado & Governança', {
    x: 7.183,
    y: 1.98,
    w: 5.05,
    h: 0.45,
    fontSize: 15,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_DARK,
  });

  const zapPoints = [
    '• Reconhecimento por Telefone: O bot identifica instantaneamente o cargo e os contratos autorizados vinculados ao número.',
    '• Consulta em Tempo Real de OS: Colaboradores solicitam status de chamados diretamente pelo WhatsApp sem precisar logar.',
    '• Blindagem Anti-Vazamento: Notas internas confidenciais de terceiros e dados financeiros jamais são enviados a clientes.',
    '• Rastreabilidade Completa: Todas as conversas e comandos ficam arquivados na base de dados com data, hora e autor.',
  ];

  s8.addText(zapPoints.join('\n\n'), {
    x: 7.183,
    y: 2.55,
    w: 5.05,
    h: 3.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    lineSpacing: 16,
  });

  // =========================================================================
  // SLIDE 9: INDICADORES DE IMPACTO & GOVERNANÇA DE RISCO
  // =========================================================================
  const s9 = pptx.addSlide();
  s9.background = { color: COLOR_BG_DARK };

  s9.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: 7.5, fill: { color: COLOR_CRIMSON } });

  s9.addText('INDICADORES DE EXCELÊNCIA OPERACIONAL (DADOS SIMULADOS)', {
    x: 0.9,
    y: 0.8,
    w: 11.5,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON_LIGHT,
    charSpacing: 2,
  });

  s9.addText('Resultados Auditados em Ambos os Contratos Corporativos', {
    x: 0.9,
    y: 1.15,
    w: 11.5,
    h: 0.5,
    fontSize: 24,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_LIGHT,
  });

  const metricsS9 = [
    { num: '0.00%', label: 'SINISTRALIDADE', desc: 'Zero sinistros patrimoniais ou invasões não contidas no trimestre em Alpha e Beta.' },
    { num: '98.4%', label: 'SLA OPERACIONAL', desc: 'Média de cumprimento de chamados muito superior à meta contratual de 95,0%.' },
    { num: '1h 25m', label: 'TEMPO MÉDIO', desc: 'Tempo médio de resposta técnica contra tolerância contratual máxima de 4 horas.' },
    { num: '100%', label: 'CONFORMIDADE', desc: 'Escalas 12x36, descansos intrajornada e quórum de vigilantes rigorosamente em dia.' },
  ];

  metricsS9.forEach((m, idx) => {
    const mX = 0.9 + idx * 2.92;
    s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: mX,
      y: 1.9,
      w: 2.7,
      h: 4.6,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_BORDER_DARK, width: 1 },
    });
    s9.addText(m.num, {
      x: mX + 0.15,
      y: 2.3,
      w: 2.4,
      h: 0.8,
      fontSize: 34,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_CRIMSON_LIGHT,
      align: 'center',
    });
    s9.addText(m.label, {
      x: mX + 0.15,
      y: 3.2,
      w: 2.4,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_LIGHT,
      align: 'center',
      charSpacing: 1.5,
    });
    s9.addText(m.desc, {
      x: mX + 0.2,
      y: 3.75,
      w: 2.3,
      h: 2.4,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: 'A1A1AA',
      lineSpacing: 16,
      align: 'center',
    });
  });

  // =========================================================================
  // SLIDE 10: INSTRUÇÕES BÁSICAS PARA EXECUTAR O PROTÓTIPO
  // =========================================================================
  const s10 = pptx.addSlide();
  s10.background = { color: COLOR_BG_LIGHT };
  addSlideHeader(s10, 'Guia de Instalação & Execução Rápida', 'Instruções Passo a Passo para Rodar e Homologar o Protótipo');

  // Card 1: Como rodar a versão Angular 21 (Recomendada)
  s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.35,
    w: 5.65,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_LIGHT },
    line: { color: COLOR_BORDER_LIGHT, width: 1 },
  });

  s10.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.35,
    w: 5.65,
    h: 0.12,
    fill: { color: COLOR_CRIMSON },
  });

  s10.addText('⚡ PROTÓTIPO PRINCIPAL (ANGULAR 21)', {
    x: 1.1,
    y: 1.65,
    w: 5.05,
    h: 0.28,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON,
  });

  s10.addText('Como Rodar Localmente (Treva-Admin UI)', {
    x: 1.1,
    y: 1.95,
    w: 5.05,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_DARK,
  });

  // Caixa de código terminal
  s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.1,
    y: 2.45,
    w: 5.05,
    h: 1.7,
    rectRadius: 0.06,
    fill: { color: '09090B' },
  });

  s10.addText('# 1. Navegue até a pasta do projeto Angular\ncd moked-angular\n\n# 2. Instale as dependências (se primeira execução)\nnpm install\n\n# 3. Inicie o servidor de desenvolvimento\nnpm start', {
    x: 1.3,
    y: 2.55,
    w: 4.65,
    h: 1.5,
    fontSize: 9.5,
    fontFace: 'Consolas',
    color: '34D399',
    lineSpacing: 14,
  });

  s10.addText('🌐 Acesso Web: http://localhost:4200\n\n• Pré-requisito: Node.js (v18+) e npm instalados.\n• Portas de Rede: O servidor escuta em 0.0.0.0:4200 para acesso via celular na mesma rede Wi-Fi.\n• Hot-Reload: Qualquer alteração é atualizada instantaneamente no navegador.', {
    x: 1.1,
    y: 4.3,
    w: 5.05,
    h: 2.1,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    lineSpacing: 16,
  });

  // Card 2: Como testar os recursos & Versão Next.js
  s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.883,
    y: 1.35,
    w: 5.65,
    h: 5.25,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_LIGHT },
    line: { color: COLOR_BORDER_LIGHT, width: 1 },
  });

  s10.addShape(pptx.shapes.RECTANGLE, {
    x: 6.883,
    y: 1.35,
    w: 5.65,
    h: 0.12,
    fill: { color: COLOR_BLUE },
  });

  s10.addText('🧭 GUIA RÁPIDO DE HOMOLOGAÇÃO & TESTES', {
    x: 7.183,
    y: 1.65,
    w: 5.05,
    h: 0.28,
    fontSize: 10.5,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_BLUE,
  });

  s10.addText('Roteiro Sugerido para Avaliação do Protótipo', {
    x: 7.183,
    y: 1.95,
    w: 5.05,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_DARK,
  });

  const testSteps = [
    '1. Seletor Rápido de Perfis (Topo):\n    Alterne entre os 7 cargos (Alta Gestão, Consultor, Líder, Técnico, Cliente) sem deslogar.',
    '2. Fluxo Ponta a Ponta de OS (Kanban):\n    Acompanhe as 5 etapas desde o registro da falha do portão até a aprovação preventiva pelo cliente.',
    '3. Teste de Isolamento Multi-tenant (Pílulas CTR-A e CTR-B):\n    Clique em CTR-B com usuário do Contrato A e comprove o bloqueio 403.',
    '4. Simulador do Bot de WhatsApp (Botão Verde):\n    Pergunte "Quais pendências vencem hoje?" ou "Qual a situação do portão?".',
    '5. Versão Comparativa Next.js (Porta 3001):\n    cd moked && npm run dev (http://localhost:3001).',
  ];

  s10.addText(testSteps.join('\n\n'), {
    x: 7.183,
    y: 2.45,
    w: 5.05,
    h: 3.95,
    fontSize: 9.2,
    fontFace: 'Arial',
    color: COLOR_TEXT_MUTED,
    lineSpacing: 14,
  });

  // =========================================================================
  // SLIDE 11: AVISO LEGAL · DADOS 100% MOCKADOS & AMBIENTE ISOLADO
  // =========================================================================
  const s11 = pptx.addSlide();
  s11.background = { color: COLOR_BG_DARK };

  s11.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: 7.5, fill: { color: COLOR_CRIMSON } });

  s11.addText('TERMOS DE CONFORMIDADE, PRIVACIDADE & SEGURANÇA DA INFORMAÇÃO', {
    x: 0.9,
    y: 0.8,
    w: 11.5,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_CRIMSON_LIGHT,
    charSpacing: 2,
  });

  s11.addText('Declaração de Dados 100% Mockados & Ambiente Isolado', {
    x: 0.9,
    y: 1.15,
    w: 11.5,
    h: 0.5,
    fontSize: 24,
    fontFace: 'Arial',
    bold: true,
    color: COLOR_TEXT_LIGHT,
  });

  const legalCards = [
    {
      icon: '🎯',
      title: '1. Massa de Dados 100% Fictícia',
      points: [
        '• Todas as empresas citadas (Alpha Corp Logística e Beta BioPharma) são fictícias.',
        '• Valores de faturamento (R$ 485k), custos, alçadas e DRE são números simulados para teste gerencial.',
        '• Nomes de colaboradores, vigilantes, prestadores terceirizados e CNPJs são puramente ilustrativos.',
        '• Todos os registros estão armazenados em base local volátil (LocalStorage), sem persistência externa.',
      ],
      color: COLOR_CRIMSON_LIGHT,
    },
    {
      icon: '🛡️',
      title: '2. Ambiente Estritamente Isolado',
      points: [
        '• O protótipo roda 100% localmente no ambiente de desenvolvimento do avaliador.',
        '• Não há conexão ou integração com sistemas internos corporativos da Moked.',
        '• Nenhuma credencial de produção, chave de API secreta ou banco real foi utilizada.',
        '• Nenhum número de telefone real ou contato verídico é acionado pelo simulador de WhatsApp.',
      ],
      color: COLOR_EMERALD,
    },
    {
      icon: '⚖️',
      title: '3. Finalidade e Termos do Exercício',
      points: [
        '• Exercício prático desenvolvido para demonstração de capacidade técnica e avaliação de arquitetura.',
        '• A participação é voluntária e o exercício não implica compromisso de contratação.',
        '• O material compartilhado será utilizado exclusivamente para avaliação no processo seletivo.',
        '• A entrega do código não transfere direitos patrimoniais ou propriedade intelectual.',
      ],
      color: COLOR_BLUE,
    },
  ];

  legalCards.forEach((lc, idx) => {
    const lX = 0.9 + idx * 3.91;
    s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: lX,
      y: 1.9,
      w: 3.65,
      h: 4.8,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_DARK },
      line: { color: COLOR_BORDER_DARK, width: 1 },
    });

    s11.addText(lc.icon, {
      x: lX + 0.3,
      y: 2.15,
      w: 3.05,
      h: 0.4,
      fontSize: 22,
    });

    s11.addText(lc.title, {
      x: lX + 0.3,
      y: 2.65,
      w: 3.05,
      h: 0.55,
      fontSize: 13,
      fontFace: 'Arial',
      bold: true,
      color: COLOR_TEXT_LIGHT,
    });

    s11.addText(lc.points.join('\n\n'), {
      x: lX + 0.3,
      y: 3.3,
      w: 3.05,
      h: 3.2,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: 'CBD5E1',
      lineSpacing: 15,
    });
  });

  // Salvar em múltiplos locais convenientes
  const rootOutputPath = path.resolve('..', 'Moked_CRM_Apresentacao_Executiva.pptx');
  const angularPublicPath = path.resolve('public', 'Moked_CRM_Apresentacao_Executiva.pptx');
  const mokedPublicPath = path.resolve('..', 'moked', 'public', 'Moked_CRM_Apresentacao_Executiva.pptx');

  await pptx.writeFile({ fileName: rootOutputPath });
  console.log('PPTX gerado na raiz:', rootOutputPath);

  try {
    if (fs.existsSync(path.dirname(angularPublicPath))) {
      fs.copyFileSync(rootOutputPath, angularPublicPath);
      console.log('Copiado para moked-angular/public');
    }
    if (fs.existsSync(path.dirname(mokedPublicPath))) {
      fs.copyFileSync(rootOutputPath, mokedPublicPath);
      console.log('Copiado para moked/public');
    }
  } catch (copyErr) {
    console.warn('Aviso ao copiar:', copyErr.message);
  }
}

createPresentation().catch(err => {
  console.error('Erro fatal ao criar apresentação:', err);
  process.exit(1);
});
