import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_MEDIDAS_DISPERSAO,
  type MedidasDispersaoData,
} from "../entities/types";
import { desvioAmostral, media, round2, varianciaAmostral } from "../lib/stats";

export const medidasDispersaoSolver: ProblemSolver = {
  topicoId: TOPICO_MEDIDAS_DISPERSAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as MedidasDispersaoData;
    switch (d.tipo) {
      case "medidas-dispersao":
        return solveBasico(d, problema.id);
      case "medidas-dispersao-cv":
        return solveCv(d, problema.id);
    }
  },
};

function solveBasico(
  d: Extract<MedidasDispersaoData, { tipo: "medidas-dispersao" }>,
  problemaId: string,
): Solution {
  const n = d.valores.length;
  const min = Math.min(...d.valores);
  const max = Math.max(...d.valores);
  const amplitude = max - min;

  if (d.pergunta === "amplitude") {
    return {
      problemaId,
      respostaFinal: String(amplitude),
      steps: [
        {
          ordem: 1,
          titulo: "Identificar extremos",
          explicacao: "Amplitude = máximo − mínimo.",
          calculo: `max = ${max}, min = ${min}`,
        },
        {
          ordem: 2,
          titulo: "Calcular",
          explicacao: "Subtraímos o mínimo do máximo.",
          calculo: `Amplitude = ${max} − ${min} = ${amplitude}`,
          resultado: String(amplitude),
        },
      ],
    };
  }

  const m = media(d.valores);
  const variancia = varianciaAmostral(d.valores);
  const desvio = desvioAmostral(d.valores);

  if (d.pergunta === "variancia") {
    const somaQuadrados = d.valores.reduce((acc, v) => acc + (v - m) ** 2, 0);
    return {
      problemaId,
      respostaFinal: String(variancia),
      steps: [
        {
          ordem: 1,
          titulo: "Calcular a média",
          explicacao: "A variância mede o afastamento em relação à média.",
          calculo: `x̄ = ${m.toFixed(2)}`,
        },
        {
          ordem: 2,
          titulo: "Somar quadrados dos desvios",
          explicacao: "Cada desvio em relação à média é elevado ao quadrado e somado.",
          calculo: `Σ(xᵢ − x̄)² = ${somaQuadrados.toFixed(2)}`,
        },
        {
          ordem: 3,
          titulo: "Dividir por n − 1",
          explicacao: "Usamos a variância amostral (divisor n−1).",
          calculo: `s² = ${somaQuadrados.toFixed(2)}/${n - 1} = ${variancia}`,
          resultado: String(variancia),
        },
      ],
    };
  }

  return {
    problemaId,
    respostaFinal: String(desvio),
    steps: [
      {
        ordem: 1,
        titulo: "Calcular a variância amostral",
        explicacao: "O desvio padrão é a raiz da variância.",
        calculo: `s² = ${variancia}`,
      },
      {
        ordem: 2,
        titulo: "Extrair a raiz quadrada",
        explicacao: "O desvio padrão traz a dispersão de volta à unidade original dos dados.",
        calculo: `s = √${variancia} = ${desvio}`,
        resultado: String(desvio),
      },
    ],
  };
}

function solveCv(
  d: Extract<MedidasDispersaoData, { tipo: "medidas-dispersao-cv" }>,
  problemaId: string,
): Solution {
  const m = media(d.valores);
  const s = desvioAmostral(d.valores);
  const cv = round2((s / m) * 100);
  return {
    problemaId,
    respostaFinal: String(cv),
    steps: [
      {
        ordem: 1,
        titulo: "Calcular média e desvio",
        explicacao: "CV compara o desvio padrão com a média.",
        calculo: `x̄ = ${round2(m)}, s = ${s}`,
      },
      {
        ordem: 2,
        titulo: "Aplicar CV",
        explicacao: "CV = (s / x̄) × 100%",
        calculo: `CV = (${s} / ${round2(m)}) × 100 = ${cv}%`,
        resultado: String(cv),
      },
    ],
  };
}
