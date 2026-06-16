import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_INTEGRAIS_INDEFINIDAS, type IntegraisIndefinidasData } from "../entities/types";

export const integraisIndefinidasSolver: ProblemSolver = {
  topicoId: TOPICO_INTEGRAIS_INDEFINIDAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as IntegraisIndefinidasData;
    const novoExp = d.n + 1;
    const resultado = `x^${novoExp}/${novoExp} + C`;

    return {
      problemaId: problema.id,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Regra da potência para integrais",
          explicacao: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C, para n ≠ −1.",
          calculo: `∫ x^${d.n} dx = x^${novoExp}/${novoExp} + C`,
          resultado,
        },
      ],
    };
  },
};
