import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_RETAS_PLANOS, type RetasPlanosData } from "../entities/types";

export const retasPlanosSolver: ProblemSolver = {
  topicoId: TOPICO_RETAS_PLANOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as RetasPlanosData;
    const dir: [number, number, number] = [
      d.p2[0] - d.p1[0],
      d.p2[1] - d.p1[1],
      d.p2[2] - d.p1[2],
    ];
    const resultado = `(${dir.join(", ")})`;

    return {
      problemaId: problema.id,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Vetor diretor",
          explicacao: "O vetor diretor é PQ = Q − P, paralelo à reta.",
          calculo: `PQ = (${d.p2.join(", ")}) − (${d.p1.join(", ")})`,
        },
        {
          ordem: 2,
          titulo: "Calcular componentes",
          explicacao: "Subtraímos as coordenadas correspondentes de P e Q.",
          calculo: `PQ = ${resultado}`,
          resultado,
        },
      ],
    };
  },
};
