import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_PRODUTO_ESCULAR, type ProdutoEscalarData } from "../entities/types";

export const produtoEscalarSolver: ProblemSolver = {
  topicoId: TOPICO_PRODUTO_ESCULAR,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ProdutoEscalarData;
    const termos = d.u.map((ui, i) => `${ui}·${d.v[i]}`);
    const resultado = d.u.reduce((acc, ui, i) => acc + ui * d.v[i]!, 0);

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Fórmula do produto escalar",
          explicacao: "u·v = u₁v₁ + u₂v₂ + u₃v₃.",
          calculo: `u·v = ${termos.join(" + ")}`,
        },
        {
          ordem: 2,
          titulo: "Calcular",
          explicacao: "Somamos os produtos das componentes correspondentes.",
          calculo: `u·v = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
