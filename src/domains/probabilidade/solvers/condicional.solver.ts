import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { simplificarFracao } from "../utils/math";
import { TOPICO_CONDICIONAL, type CondicionalData } from "../entities/types";

export const condicionalSolver: ProblemSolver = {
  topicoId: TOPICO_CONDICIONAL,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as CondicionalData;
    const fracao = simplificarFracao(dados.nAinterB, dados.nB);

    return {
      problemaId: problema.id,
      respostaFinal: fracao,
      steps: [
        {
          ordem: 1,
          titulo: "Definição de probabilidade condicional",
          explicacao:
            "P(A|B) é a probabilidade de A sabendo que B já ocorreu — restringimos o espaço a B.",
          calculo: `P(A|B) = P(A∩B) / P(B) = n(A∩B) / n(B)`,
        },
        {
          ordem: 2,
          titulo: "Identificar casos favoráveis e possíveis em B",
          explicacao: `Dado B, há ${dados.nB} casos possíveis e ${dados.nAinterB} também satisfazem A.`,
          calculo: `n(A∩B) = ${dados.nAinterB}, n(B) = ${dados.nB}`,
        },
        {
          ordem: 3,
          titulo: "Calcular P(A|B)",
          explicacao: "Dividimos os casos favoráveis pelo total de casos em B.",
          calculo: `P(A|B) = ${dados.nAinterB}/${dados.nB} = ${fracao}`,
          resultado: fracao,
        },
      ],
    };
  },
};
