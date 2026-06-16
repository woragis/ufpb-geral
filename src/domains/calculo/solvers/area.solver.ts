import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_AREA, type AreaData } from "../entities/types";

export const areaSolver: ProblemSolver = {
  topicoId: TOPICO_AREA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as AreaData;
    const F = (x: number) => (d.m * x * x) / 2 + d.b * x;
    const resultado = F(d.c) - F(d.a);

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Montar a integral da área",
          explicacao: "A área sob o gráfico é dada pela integral definida da função.",
          calculo: `A = ∫[${d.a}→${d.c}] (${d.m}x + ${d.b}) dx`,
        },
        {
          ordem: 2,
          titulo: "Calcular a integral",
          explicacao: "Usamos a primitiva e o Teorema Fundamental do Cálculo.",
          calculo: `A = [${d.m}x²/2 + ${d.b}x]_${d.a}^${d.c} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
