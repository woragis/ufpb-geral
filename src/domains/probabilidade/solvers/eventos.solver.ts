import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_EVENTOS, type EventosData } from "../entities/types";

export const eventosSolver: ProblemSolver = {
  topicoId: TOPICO_EVENTOS,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as EventosData;

    if (dados.operacao === "complemento") {
      const resultado = dados.nOmega - dados.nA;
      return {
        problemaId: problema.id,
        respostaFinal: String(resultado),
        steps: [
          {
            ordem: 1,
            titulo: "Definir o complemento",
            explicacao: "Aᶜ contém todos os elementos de Ω que não estão em A.",
            calculo: `n(Aᶜ) = n(Ω) − n(A)`,
          },
          {
            ordem: 2,
            titulo: "Substituir os valores",
            explicacao: "Subtraímos os elementos de A do total do espaço amostral.",
            calculo: `n(Aᶜ) = ${dados.nOmega} − ${dados.nA} = ${resultado}`,
            resultado: String(resultado),
          },
        ],
      };
    }

    if (dados.operacao === "uniao") {
      const resultado = dados.nA + dados.nB - dados.nAinterB;
      return {
        problemaId: problema.id,
        respostaFinal: String(resultado),
        steps: [
          {
            ordem: 1,
            titulo: "Princípio da inclusão-exclusão",
            explicacao:
              "Na união, somamos A e B, mas subtraímos a interseção para não contar duas vezes.",
            calculo: `|A∪B| = |A| + |B| − |A∩B|`,
          },
          {
            ordem: 2,
            titulo: "Calcular",
            explicacao: "Substituímos as cardinalidades na fórmula.",
            calculo: `|A∪B| = ${dados.nA} + ${dados.nB} − ${dados.nAinterB} = ${resultado}`,
            resultado: String(resultado),
          },
        ],
      };
    }

    return {
      problemaId: problema.id,
      respostaFinal: String(dados.nAinterB),
      steps: [
        {
          ordem: 1,
          titulo: "Identificar a interseção",
          explicacao:
            "A∩B são os resultados que pertencem simultaneamente a A e a B.",
          calculo: `|A∩B| = ${dados.nAinterB}`,
          resultado: String(dados.nAinterB),
        },
      ],
    };
  },
};
