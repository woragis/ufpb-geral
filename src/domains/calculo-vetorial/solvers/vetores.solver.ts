import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_VETORES, type VetoresData } from "../entities/types";

export const vetoresSolver: ProblemSolver = {
  topicoId: TOPICO_VETORES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as VetoresData;
    const somaQuadrados = d.componentes.reduce((acc, c) => acc + c * c, 0);
    const modulo = Math.round(Math.sqrt(somaQuadrados) * 100) / 100;
    const termos = d.componentes.map((c) => `${c}²`).join(" + ");

    return {
      problemaId: problema.id,
      respostaFinal: String(modulo),
      steps: [
        {
          ordem: 1,
          titulo: "Fórmula do módulo",
          explicacao: "|v| = √(x² + y² + z²) em R³ (ou √(x² + y²) em R²).",
          calculo: `|v| = √(${termos})`,
        },
        {
          ordem: 2,
          titulo: "Calcular",
          explicacao: "Extraímos a raiz quadrada da soma dos quadrados.",
          calculo: `|v| = √${somaQuadrados} = ${modulo}`,
          resultado: String(modulo),
        },
      ],
    };
  },
};
