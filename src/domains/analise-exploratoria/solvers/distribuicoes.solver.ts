import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_DISTRIBUICOES, type DistribuicoesData } from "../entities/types";

export const distribuicoesSolver: ProblemSolver = {
  topicoId: TOPICO_DISTRIBUICOES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as DistribuicoesData;
    const iqr = d.q3 - d.q1;

    return {
      problemaId: problema.id,
      respostaFinal: String(iqr),
      steps: [
        {
          ordem: 1,
          titulo: "Definir IQR",
          explicacao: "A amplitude interquartil mede a dispersão dos 50% centrais dos dados.",
          calculo: `IQR = Q3 − Q1`,
        },
        {
          ordem: 2,
          titulo: "Substituir os quartis",
          explicacao: "Usamos os valores lidos do boxplot.",
          calculo: `IQR = ${d.q3} − ${d.q1} = ${iqr}`,
          resultado: String(iqr),
        },
      ],
    };
  },
};
