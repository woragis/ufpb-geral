import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_SERIES, type SeriesData } from "../entities/types";

export const seriesSolver: ProblemSolver = {
  topicoId: TOPICO_SERIES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as SeriesData;

    if (Math.abs(d.r) < 1) {
      const resultado = d.a1 / (1 - d.r);
      const resultadoStr = Number.isInteger(resultado) ? String(resultado) : resultado.toFixed(2);
      return {
        problemaId: problema.id,
        respostaFinal: resultadoStr,
        steps: [
          {
            ordem: 1,
            titulo: "Fórmula da série geométrica infinita",
            explicacao: "Converge quando |r| < 1.",
            calculo: `S = a₁/(1 − r)`,
          },
          {
            ordem: 2,
            titulo: "Substituir",
            explicacao: "Inserimos a₁ e r na fórmula.",
            calculo: `S = ${d.a1}/(1 − ${d.r}) = ${resultadoStr}`,
            resultado: resultadoStr,
          },
        ],
      };
    }

    const resultado = (d.a1 * (1 - Math.pow(d.r, d.n))) / (1 - d.r);
    const resultadoStr = Number.isInteger(resultado) ? String(resultado) : resultado.toFixed(2);

    return {
      problemaId: problema.id,
      respostaFinal: resultadoStr,
      steps: [
        {
          ordem: 1,
          titulo: "Fórmula da soma parcial",
          explicacao: "Para série geométrica finita com r ≠ 1.",
          calculo: `Sₙ = a₁(1 − rⁿ)/(1 − r)`,
        },
        {
          ordem: 2,
          titulo: "Calcular",
          explicacao: "Substituímos n, a₁ e r na fórmula da soma parcial.",
          calculo: `S_${d.n} = ${d.a1}(1 − ${d.r}^${d.n})/(1 − ${d.r}) = ${resultadoStr}`,
          resultado: resultadoStr,
        },
      ],
    };
  },
};
