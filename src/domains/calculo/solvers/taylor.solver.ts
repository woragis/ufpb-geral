import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_TAYLOR, type TaylorData } from "../entities/types";

export const taylorSolver: ProblemSolver = {
  topicoId: TOPICO_TAYLOR,

  resolver(problema: Problem): Solution {
    const d = problema.dados as TaylorData;

    if (d.funcao === "exponencial") {
      const resultado = d.grau === 1 ? "1 + x" : "1 + x + x²/2";
      return {
        problemaId: problema.id,
        respostaFinal: resultado,
        steps: [
          {
            ordem: 1,
            titulo: "Derivadas de eˣ em x = 0",
            explicacao: "Todas as derivadas de eˣ são eˣ, valendo 1 em x = 0.",
            calculo: "f(0)=1, f'(0)=1, f''(0)=1",
          },
          {
            ordem: 2,
            titulo: "Montar o polinômio de Taylor",
            explicacao: "P(x) = f(0) + f'(0)x + f''(0)x²/2! + ...",
            calculo: `P(x) = ${resultado}`,
            resultado,
          },
        ],
      };
    }

    const resultado = d.grau === 1 ? "x" : "x − x³/6";
    return {
      problemaId: problema.id,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Derivadas de sen(x) em x = 0",
          explicacao: "sen(0)=0, cos(0)=1, −sen(0)=0, −cos(0)=−1.",
          calculo: "f(0)=0, f'(0)=1, f''(0)=0, f'''(0)=−1",
        },
        {
          ordem: 2,
          titulo: "Montar o polinômio de Taylor",
          explicacao: "Usamos os coeficientes f⁽ⁿ⁾(0)/n! para cada termo.",
          calculo: `P(x) = ${resultado}`,
          resultado,
        },
      ],
    };
  },
};
