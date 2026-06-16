import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_OTIMIZACAO, type OtimizacaoData } from "../entities/types";

export const otimizacaoSolver: ProblemSolver = {
  topicoId: TOPICO_OTIMIZACAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as OtimizacaoData;
    const xVertice = -d.b / (2 * d.a);
    const xFormatado = Number.isInteger(xVertice) ? String(xVertice) : xVertice.toFixed(2);

    return {
      problemaId: problema.id,
      respostaFinal: xFormatado,
      steps: [
        {
          ordem: 1,
          titulo: "Derivar a função",
          explicacao: "Para encontrar extremos, derivamos e igualamos a zero.",
          calculo: `f'(x) = ${2 * d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}`,
        },
        {
          ordem: 2,
          titulo: "Igualar a zero",
          explicacao: "Pontos críticos satisfazem f'(x) = 0.",
          calculo: `${2 * d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)} = 0`,
        },
        {
          ordem: 3,
          titulo: "Resolver para x",
          explicacao: `Como a = ${d.a} > 0, o vértice é um mínimo.`,
          calculo: `x = -${d.b}/(2·${d.a}) = ${xFormatado}`,
          resultado: xFormatado,
        },
      ],
    };
  },
};
