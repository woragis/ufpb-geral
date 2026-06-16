import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CURVAS, type CurvasData } from "../entities/types";

export const curvasSolver: ProblemSolver = {
  topicoId: TOPICO_CURVAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CurvasData;
    const rx = d.a;
    const ry = 2 * d.t0;
    const modulo = Math.round(Math.sqrt(rx * rx + ry * ry) * 100) / 100;

    return {
      problemaId: problema.id,
      respostaFinal: String(modulo),
      steps: [
        {
          ordem: 1,
          titulo: "Derivar a curva",
          explicacao: "r'(t) = (x'(t), y'(t)).",
          calculo: `r'(t) = (${d.a}, 2t)`,
        },
        {
          ordem: 2,
          titulo: "Avaliar em t = t₀",
          explicacao: `Substituímos t = ${d.t0} nas componentes da derivada.`,
          calculo: `r'(${d.t0}) = (${rx}, ${ry})`,
        },
        {
          ordem: 3,
          titulo: "Calcular o módulo (velocidade escalar)",
          explicacao: "A velocidade escalar é o módulo do vetor velocidade.",
          calculo: `|r'(${d.t0})| = √(${rx}² + ${ry}²) = ${modulo}`,
          resultado: String(modulo),
        },
      ],
    };
  },
};
