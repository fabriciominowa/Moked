import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BudgetApprovalItem } from '../components/workspace/workspace.component';
import { ContractDetail, ContractInfo, OccurrenceRecord } from '../models/moked';

export class ExportService {
  /**
   * 1. Gera e faz o download direto do DRE Operacional Consolidado em PDF
   */
  public static generateDrePdf(contracts: ContractInfo[], budgetItems: BudgetApprovalItem[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const nowStr = new Date().toLocaleString('pt-BR');

    // Cabeçalho Corporativo Vermelho Moked (#922125)
    doc.setFillColor(146, 33, 37); // #922125
    doc.rect(0, 0, 210, 32, 'F');

    // Logo Text MOKED
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('MOKED', 14, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('PORTAL CORPORATIVO DE INTELIGÊNCIA & CCO 24x7', 14, 21);
    doc.text('https://www.moked.com.br', 14, 26);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMONSTRATIVO DE RESULTADO (DRE)', 200, 15, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Emissão: ${nowStr}`, 200, 21, { align: 'right' });
    doc.text('Uso Exclusivo da Alta Gestão · Confidencial', 200, 26, { align: 'right' });

    // Sumário Financeiro Executivo
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('1. Síntese Executiva & Margem EBITDA (Mês Corrente)', 14, 42);

    const dreRows = [
      ['(+) Receita Bruta Recorrente (MRR)', 'R$ 485.000,00', '100,00%'],
      ['    · Contrato Alpha (CTR-A - Alpha Corp Logística)', 'R$ 265.000,00', '54,64%'],
      ['    · Contrato Beta (CTR-B - Beta Logística Intermodal)', 'R$ 220.000,00', '45,36%'],
      ['(-) Impostos e Deduções Tributárias sobre Serviços (ISS/PIS/COFINS)', 'R$ 20.800,00', '4,29%'],
      ['(=) Receita Operacional Líquida', 'R$ 464.200,00', '95,71%'],
      ['(-) Custos Diretos com Efetivo & Vigilância (32 integrantes em escala 12x36)', 'R$ 228.400,00', '47,09%'],
      ['(-) Custos com Terceirizadas Técnicas (Portões, CFTV, Cerca Perimetral)', 'R$ 48.600,00', '10,02%'],
      ['(-) Infraestrutura CCO, Softwares de Monitoramento e Links Dedicados', 'R$ 26.150,00', '5,39%'],
      ['(-) Manutenções Preventivas e Troca Programada de Peças', 'R$ 18.200,00', '3,75%'],
      ['(=) LUCRO OPERACIONAL LÍQUIDO / EBITDA MOKED', 'R$ 142.850,00', '29,45%'],
    ];

    autoTable(doc, {
      startY: 46,
      head: [['Linha de Resultado Operacional', 'Valor Consolidado (R$)', '% Receita']],
      body: dreRows,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 9, 11], // Obsidian #09090B
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 2.2,
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 42, halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 22, halign: 'right' },
      },
      didParseCell: (data) => {
        if (data.row.index === 0 || data.row.index === 4 || data.row.index === 9) {
          data.cell.styles.fontStyle = 'bold';
          if (data.row.index === 9) {
            data.cell.styles.fillColor = [254, 242, 242]; // Red soft
            data.cell.styles.textColor = [146, 33, 37]; // Crimson
          }
        }
      },
    });

    const finalY1 = (doc as any).lastAutoTable.finalY + 8;

    // Tabela 2: Desempenho por Contrato
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Desempenho Operacional e Financeiro por Contrato', 14, finalY1);

    const contractRows = [
      ['CTR-A', 'Alpha Corp Logística', 'R$ 265.000,00', 'R$ 184.200,00', 'R$ 80.800,00 (30,5%)', '18 vig.', '98,6%', 'Adimplente'],
      ['CTR-B', 'Beta Logística Intermodal', 'R$ 220.000,00', 'R$ 157.950,00', 'R$ 62.050,00 (28,2%)', '14 vig.', '96,2%', 'Adimplente'],
      ['TOTAL', 'Consolidação 2 Contratos', 'R$ 485.000,00', 'R$ 342.150,00', 'R$ 142.850,00 (29,45%)', '32 vig.', '97,4%', '100% em dia'],
    ];

    autoTable(doc, {
      startY: finalY1 + 4,
      head: [['Código', 'Cliente / Unidade', 'Faturamento', 'Custos Diretos', 'Margem Líquida', 'Efetivo', 'SLA', 'Status']],
      body: contractRows,
      theme: 'grid',
      headStyles: {
        fillColor: [146, 33, 37],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 7.8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold' },
        1: { cellWidth: 44 },
        2: { cellWidth: 26, halign: 'right' },
        3: { cellWidth: 24, halign: 'right' },
        4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
        5: { cellWidth: 16, halign: 'center' },
        6: { cellWidth: 14, halign: 'center' },
        7: { cellWidth: 21, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.row.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [241, 245, 249];
        }
      },
    });

    const finalY2 = (doc as any).lastAutoTable.finalY + 8;

    // Tabela 3: Alçadas de Verba & Aprovações da Gestão
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Alçadas de Decisão Financeira e Verbas Aprovadas', 14, finalY2);

    const budgetRows = budgetItems.map((b) => [
      b.id,
      b.contractCode,
      b.title,
      b.supplier,
      `R$ ${b.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      b.urgency,
      b.status.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: finalY2 + 4,
      head: [['ID', 'Contrato', 'Descrição do Gasto', 'Fornecedor', 'Valor', 'Urgência', 'Situação']],
      body: budgetRows,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 9, 11],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 7.8,
        cellPadding: 1.8,
      },
      columnStyles: {
        0: { cellWidth: 16, fontStyle: 'bold' },
        1: { cellWidth: 16 },
        2: { cellWidth: 55 },
        3: { cellWidth: 42 },
        4: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
        5: { cellWidth: 16, halign: 'center' },
        6: { cellWidth: 23, halign: 'center', fontStyle: 'bold' },
      },
    });

    // Rodapé de Autenticidade e Auditoria
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Moked Segurança & Consultoria Patrimonial · Relatório Gerado Automaticamente pelo Centro de Comando (CCO) · Página ' +
          i +
          ' de ' +
          pageCount,
        14,
        290
      );
    }

    doc.save('DRE_Operacional_Consolidado_Moked_2026.pdf');
  }

  /**
   * 2. Gera e faz o download direto da Planilha de Custos e Auditoria (CSV/Excel com BOM UTF-8)
   */
  public static generateCostsCsv(budgetItems: BudgetApprovalItem[]): void {
    const nowStr = new Date().toLocaleString('pt-BR');

    const lines: string[] = [
      'MOKED SEGURANCA & CONSULTORIA PATRIMONIAL - RELATORIO ANALITICO DE CUSTOS E CONTRATOS',
      `Data de Emissao;${nowStr};Ambiente;Centro de Comando CCO Moked`,
      '',
      '--- 1. COMPARATIVO FINANCEIRO DE CONTRATOS ---',
      'Codigo;Cliente / Unidade;Faturamento Mensal (R$);Custos Operacionais (R$);Margem EBITDA (R$);Margem Líquida (%);Efetivo (Vigilantes);Postos 24h;Indice SLA (%);Status Financeiro',
      'CTR-A;Alpha Corp Logistica - Docas Norte;265000,00;184200,00;80800,00;30,49%;18;4;98,6%;Adimplente',
      'CTR-B;Beta Logistica Intermodal - CD Sul;220000,00;157950,00;62050,00;28,20%;14;3;96,2%;Adimplente',
      'TOTAL;Consolidado 2 Contratos;485000,00;342150,00;142850,00;29,45%;32;7;97,4%;100% Em Dia',
      '',
      '--- 2. DETALHAMENTO DO DRE OPERACIONAL ---',
      'Rubrica Operacional;Categoria;Valor Mensal (R$);% sobre Receita',
      'Receita Bruta Recorrente (MRR);Receita;485000,00;100,00%',
      'Impostos e Deducoes Fiscais;Deducao;20800,00;4,29%',
      'Folha Salarial Efetivo de Vigilancia (32 vigilantes);Custo Direto;228400,00;47,09%',
      'Terceirizadas Especializadas (Portoes, CFTV, Sensores);Custo Direto;48600,00;10,02%',
      'Infraestrutura CCO, Softwares e Conectividade;Custo Indireto;26150,00;5,39%',
      'Manutencoes Preventivas e PDM;Manutencao;18200,00;3,75%',
      'LUCRO OPERACIONAL / EBITDA CONSOLIDADO;Resultado Liquido;142850,00;29,45%',
      '',
      '--- 3. ALCADAS DE VERBAS E APROVACOES ORCAMENTARIAS ---',
      'ID;Contrato;Titulo do Gasto;Fornecedor;Valor (R$);Categoria;Urgencia;Situacao;Solicitante;Data da Solicitacao',
    ];

    for (const b of budgetItems) {
      lines.push(
        `${b.id};${b.contractCode};"${b.title}";"${b.supplier}";${b.amount.toFixed(2).replace('.', ',')};"${b.category}";${b.urgency};${b.status.toUpperCase()};"${b.requester}";${b.date}`
      );
    }

    lines.push('');
    lines.push('--- 4. GOVERNANCA E CONFORMIDADE ---');
    lines.push('Indicador;Resultado;Meta Contratual;Status');
    lines.push('Taxa de Sinistralidade Patrimonial;0,00%;Zero Perdas;Conforme (Zero Ocorrencias)');
    lines.push('Auditoria Trabalhista e Ponto Eletronico;100% Regular;100% CLT;Conforme (Zero Passivo)');
    lines.push('Apolice de Responsabilidade Civil Operacional;R$ 15.000.000,00;R$ 10.000.000,00;Vigente ate 12/2026');
    lines.push('Tempo Medio de Resposta a Chamados (SLA);1h25min;< 4h00min;Superado');

    // BOM UTF-8 (\uFEFF) para compatibilidade perfeita com Excel no Windows
    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'Auditoria_Custos_Contratos_Moked_2026.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 3. Gera e faz o download direto do Laudo Consolidado de Auditoria Executiva em PDF
   */
  public static generateLaudoConsolidadoPdf(occurrences: OccurrenceRecord[], contracts: ContractInfo[]): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const nowStr = new Date().toLocaleString('pt-BR');

    // Topo Vermelho Carmim Moked
    doc.setFillColor(146, 33, 37);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('MOKED', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CONSULTORIA & OPERAÇÕES INTEGRADAS DE SEGURANÇA', 14, 23);
    doc.text('Laudo de Auditoria Executiva, Risco & Eficiência Operacional', 14, 29);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE GOVERNANÇA', 200, 16, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${nowStr}`, 200, 22, { align: 'right' });
    doc.text('Destinatário: Alta Gestão & Diretoria', 200, 28, { align: 'right' });

    let y = 46;

    // Seção 1: Parecer da Diretoria de Operações
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('1. Sumário Executivo & Parecer de Segurança Patrimonial', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const summaryText =
      'A consultoria técnica da Moked atesta que as operações de segurança patrimonial nos Contratos Alpha (CTR-A) e Beta (CTR-B) encontram-se em estágio pleno de conformidade operacional. No presente trimestre, a taxa de sinistralidade manteve-se em 0,00%, com 100% das rondas eletrônicas e bastões vigia cumpridos dentro dos itinerários previstos. O índice global de atendimento de SLA atingiu 98,4%, garantindo tempo médio de resposta técnica de 1 hora e 25 minutos.';
    const splitSummary = doc.splitTextToSize(summaryText, 182);
    doc.text(splitSummary, 14, y);
    y += splitSummary.length * 4.5 + 4;

    // Seção 2: Auditoria de Ordens de Serviço Críticas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('2. Ordens de Serviço & Rastreabilidade de Intervenções Técnicas', 14, y);
    y += 4;

    const occRows = occurrences.map((o) => [
      o.id,
      o.contractId,
      o.title,
      o.createdByName,
      o.createdAt,
      o.statusLabel,
      o.assignedResponsibleName || 'Triagem CCO',
    ]);

    autoTable(doc, {
      startY: y,
      head: [['OS', 'Contrato', 'Descrição da Ocorrência', 'Aberta Por', 'Data/Hora Abertura', 'Situação Atual', 'Responsável']],
      body: occRows,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 9, 11],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      styles: {
        fontSize: 7.2,
        cellPadding: 1.8,
      },
      columnStyles: {
        0: { cellWidth: 16, fontStyle: 'bold' },
        1: { cellWidth: 14 },
        2: { cellWidth: 55 },
        3: { cellWidth: 26 },
        4: { cellWidth: 25, fontSize: 6.8 },
        5: { cellWidth: 23, fontStyle: 'bold' },
        6: { cellWidth: 23 },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // Seção 3: Auditoria do Portão Principal das Docas Norte (Caso Prático)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('3. Dossiê de Intervenção Técnica: Portão Docas Norte (OC-PORTAO-A1)', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const gateText =
      '• Evento: Falha mecânica e travamento de motor deslizante após impacto indireto.\n' +
      '• Resposta de Campo: Eclusa convertida para operação assistida por 2 vigilantes em menos de 8 minutos.\n' +
      '• Execução Técnica (TecPortões): Entrada às 10:15, saída às 11:40 (1h25 de atendimento). Substituição da placa inversora de comando e realinhamento de trilho.\n' +
      '• Recomendação Confidencial: Aprovada substituição preventiva de engrenagem secundária no valor de R$ 680,00, evitando colapso futuro.\n' +
      '• Parecer ao Cliente: Operação normalizada sem interrupção de fluxo logístico de carretas.';
    const splitGate = doc.splitTextToSize(gateText, 182);
    doc.text(splitGate, 14, y);
    y += splitGate.length * 4.5 + 6;

    // Seção 4: Conclusão & Assinaturas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. Conclusão da Auditoria & Parecer Executivo', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const conclusao =
      'Recomendamos a manutenção dos protocolos ativos e a homologação do plano diretor de segurança para o próximo ciclo contratual. A governança da Alta Gestão mantém controle irrestrito sobre as contas Alpha e Beta com transparência e integridade financeira comprovadas.';
    const splitConc = doc.splitTextToSize(conclusao, 182);
    doc.text(splitConc, 14, y);
    y += splitConc.length * 4.5 + 12;

    // Assinaturas
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 90, y);
    doc.line(120, y, 190, y);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Capitão Roberto Silva', 55, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Diretor de Operações · Moked Brasil', 55, y + 8, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text('Carlos Eduardo Consultoria', 155, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Consultor Chefe de Segurança Patrimonial', 155, y + 8, { align: 'center' });

    // Numeração de página
    const totalPages = doc.getNumberOfPages();
    for (let j = 1; j <= totalPages; j++) {
      doc.setPage(j);
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Moked Segurança & Consultoria Patrimonial · Laudo de Auditoria Consolidado · Página ' +
          j +
          ' de ' +
          totalPages,
        14,
        290
      );
    }

    doc.save('Parecer_Executivo_Alta_Gestao_Moked.pdf');
  }

  /**
   * 4. Gera e faz o download direto da Minuta e Dossiê Completo do Contrato em PDF
   */
  public static generateContractDossierPdf(contract: ContractDetail): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const nowStr = new Date().toLocaleString('pt-BR');

    // Cabeçalho Oficial Vermelho Carmim Moked
    doc.setFillColor(146, 33, 37); // #922125
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('MOKED', 14, 16);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS', 14, 23);
    doc.text('Gestão Integrada de Segurança Patrimonial, CFTV & Eclusas', 14, 29);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`CONTRATO ${contract.code}`, 200, 16, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Emissão Oficial: ${nowStr}`, 200, 22, { align: 'right' });
    doc.text(`Vigência: ${contract.startDate} a ${contract.endDate}`, 200, 28, { align: 'right' });

    let y = 46;

    // Seção 1: Qualificação das Partes
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. Qualificação das Partes Contratantes', 14, y);
    y += 5;

    const partiesRows = [
      ['CONTRATADA:', 'Moked Consultoria e Operações de Segurança Patrimonial Ltda. - CNPJ 45.987.654/0001-32'],
      ['CONTRATANTE:', `${contract.corporateName} - CNPJ ${contract.cnpj}`],
      ['UNIDADE OPERACIONAL:', contract.unitAddress],
      ['CONSULTOR RESPONSÁVEL:', `${contract.consultantName} (${contract.consultantEmail} / ${contract.consultantPhone})`],
      ['GESTOR DO CLIENTE:', `${contract.clientManagerName} - ${contract.clientManagerRole} (${contract.clientManagerEmail})`],
    ];

    autoTable(doc, {
      startY: y,
      body: partiesRows,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 48, fontStyle: 'bold', textColor: [100, 116, 139] },
        1: { cellWidth: 134, fontStyle: 'bold', textColor: [15, 23, 42] },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Seção 2: Condições Financeiras e Faturamento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. Condições Comerciais, Valor Mensal & Faturamento', 14, y);
    y += 5;

    const finRows = [
      ['Valor Mensal Recorrente (MRR):', `R$ ${contract.monthlyValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Dia de Vencimento da Fatura:', `Todo dia ${contract.paymentDueDay} de cada mês civil`],
      ['Índice de Reajuste Anual:', 'IPCA / IBGE acumulado nos últimos 12 meses'],
      ['Status Financeiro Atual:', `${contract.billingStatus} (Zero pendências financeiras)`],
    ];

    autoTable(doc, {
      startY: y,
      body: finRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: 'bold', fillColor: [248, 250, 252] },
        1: { cellWidth: 117, fontStyle: 'bold', textColor: [146, 33, 37] },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Seção 3: Postos de Serviço e Escala de Efetivo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Postos de Serviço e Alocação de Efetivo Operacional', 14, y);
    y += 4;

    const postRows = contract.activePosts.map((p) => [
      p.code,
      p.name,
      p.schedule,
      `${p.headcount} vigilantes`,
      p.description,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Posto', 'Identificação', 'Escala', 'Efetivo', 'Atribuições Principais']],
      body: postRows,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 9, 11],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.8,
      },
      styles: { fontSize: 7.4, cellPadding: 1.8 },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' },
        1: { cellWidth: 42 },
        2: { cellWidth: 26 },
        3: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 74 },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Seção 4: Equipamentos e Ativos Técnicos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. Equipamentos, Ativos e Barreiras Físicas sob Gestão', 14, y);
    y += 4;

    const assetRows = contract.technicalAssets.map((a) => [
      a.tag,
      a.name,
      a.location,
      a.status,
      a.lastMaintenance,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['TAG Ativo', 'Equipamento', 'Localização', 'Status Atual', 'Última Manutenção']],
      body: assetRows,
      theme: 'grid',
      headStyles: {
        fillColor: [146, 33, 37],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.8,
      },
      styles: { fontSize: 7.4, cellPadding: 1.8 },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 55 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 33, halign: 'center' },
      },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Seção 5: SLA e Seguro
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('5. SLA Contratual e Cobertura Securitária', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const slaSummary = `• Meta Contratual de SLA: ${contract.slaTarget} | Saúde Atual Auditada: ${contract.slaCurrent}\n• Tempo Máximo de Resposta Emergencial: ${contract.maxResponseTime} | Média Praticada: ${contract.avgResponseTime}\n• Apólice de Responsabilidade Civil Operacional: ${contract.insuranceCoverage} (Apólice nº ${contract.policyNumber})`;
    const splitSla = doc.splitTextToSize(slaSummary, 182);
    doc.text(splitSla, 14, y);
    y += splitSla.length * 4.2 + 10;

    // Assinaturas Digitais
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 90, y);
    doc.line(120, y, 190, y);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('MOKED CONSULTORIA DE SEGURANÇA LTDA.', 55, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Assinado Digitalmente por Certificado ICP-Brasil', 55, y + 7.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(contract.corporateName.toUpperCase(), 155, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Por: ${contract.clientManagerName} (${contract.clientManagerRole})`, 155, y + 7.5, { align: 'center' });

    // Numeração de página
    const totalPages = doc.getNumberOfPages();
    for (let j = 1; j <= totalPages; j++) {
      doc.setPage(j);
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Moked Consultoria Patrimonial · Dossiê Oficial Contrato ${contract.code} · Página ${j} de ${totalPages}`,
        14,
        290
      );
    }

    doc.save(`Contrato_Oficial_Moked_${contract.code}.pdf`);
  }
}

