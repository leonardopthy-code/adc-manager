// ========================================
// CONFIGURAÇÕES DAS MENSALIDADES ADC
// ========================================

// O controle oficial de mensalidades
// começa em setembro de 2026.

export const INICIO_MENSALIDADES = {
  mes: 8,
  ano: 2026,
};

// Valor padrão atual
export const VALOR_MENSALIDADE = 20;

// ========================================
// NOMES DOS MESES
// ========================================

export const MESES = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// ========================================
// VERIFICAR SE UM MÊS É COBRÁVEL
// ========================================

export function mesEhCobravel(
  mes,
  ano
) {
  if (
    ano <
    INICIO_MENSALIDADES.ano
  ) {
    return false;
  }

  if (
    ano ===
      INICIO_MENSALIDADES.ano &&
    mes <
      INICIO_MENSALIDADES.mes
  ) {
    return false;
  }

  return true;
}

// ========================================
// GERAR MESES COBRÁVEIS
// ========================================

export function gerarMesesCobraveis(
  ateMes,
  ateAno
) {
  const meses = [];

  let mes =
    INICIO_MENSALIDADES.mes;

  let ano =
    INICIO_MENSALIDADES.ano;

  while (
    ano < ateAno ||
    (ano === ateAno &&
      mes <= ateMes)
  ) {
    meses.push({
      mes,
      ano,
      nome: MESES[mes],
    });

    mes++;

    if (mes > 12) {
      mes = 1;
      ano++;
    }
  }

  return meses;
}