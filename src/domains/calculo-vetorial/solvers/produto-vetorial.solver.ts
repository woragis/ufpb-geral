import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_PRODUTO_VETORIAL, type ProdutoVetorialData } from "../entities/types";

export const produtoVetorialSolver: ProblemSolver = {
  topicoId: TOPICO_PRODUTO_VETORIAL,

  resolver(problema: Problem): Solution {
    const [u1, u2, u3] = (problema.dados as ProdutoVetorialData).u;
    const [v1, v2, v3] = (problema.dados as ProdutoVetorialData).v;

    const i = u2 * v3 - u3 * v2;
    const j = -(u1 * v3 - u3 * v1);
    const k = u1 * v2 - u2 * v1;
    const resultado = `(${i}, ${j}, ${k})`;

    return {
      problemaId: problema.id,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Montar o determinante simbólico",
          explicacao: "u × v pode ser calculado via determinante com î, ĵ, k̂.",
          calculo: `| î  ĵ  k̂ |\n| ${u1} ${u2} ${u3} |\n| ${v1} ${v2} ${v3} |`,
        },
        {
          ordem: 2,
          titulo: "Expandir pelo método de Sarrus",
          explicacao: "Componente i: u₂v₃ − u₃v₂, j: −(u₁v₃ − u₃v₁), k: u₁v₂ − u₂v₁.",
          calculo: `u × v = (${u2}·${v3} − ${u3}·${v2}, −(${u1}·${v3} − ${u3}·${v1}), ${u1}·${v2} − ${u2}·${v1})`,
        },
        {
          ordem: 3,
          titulo: "Resultado",
          explicacao: "O vetor resultante é perpendicular a u e a v.",
          calculo: `u × v = ${resultado}`,
          resultado,
        },
      ],
    };
  },
};
