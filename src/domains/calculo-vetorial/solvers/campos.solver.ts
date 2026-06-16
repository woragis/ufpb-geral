import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CAMPOS, type CamposData } from "../entities/types";

export const camposSolver: ProblemSolver = {
  topicoId: TOPICO_CAMPOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CamposData;
    const fx = 2 * d.x0;
    const fy = 2 * d.y0;
    const resultado = `(${fx}, ${fy})`;

    return {
      problemaId: problema.id,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Derivadas parciais",
          explicacao: "∇f = (∂f/∂x, ∂f/∂y).",
          calculo: `∂f/∂x = 2x, ∂f/∂y = 2y`,
        },
        {
          ordem: 2,
          titulo: "Avaliar no ponto",
          explicacao: `Substituímos x = ${d.x0} e y = ${d.y0} nas derivadas parciais.`,
          calculo: `∇f(${d.x0}, ${d.y0}) = (2·${d.x0}, 2·${d.y0}) = ${resultado}`,
          resultado,
        },
      ],
    };
  },
};
