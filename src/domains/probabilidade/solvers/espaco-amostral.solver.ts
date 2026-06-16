import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_ESPACO_AMOSTRAL,
  type EspacoAmostralData,
} from "../entities/types";

function espacoMoeda(): string[] {
  return ["C", "K"];
}

function espacoDado(): string[] {
  return ["1", "2", "3", "4", "5", "6"];
}

function espacoDadoDuplo(): string[] {
  const result: string[] = [];
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      result.push(`(${i},${j})`);
    }
  }
  return result;
}

export const espacoAmostralSolver: ProblemSolver = {
  topicoId: TOPICO_ESPACO_AMOSTRAL,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as EspacoAmostralData;

    const espaco =
      dados.experimento === "moeda"
        ? espacoMoeda()
        : dados.experimento === "dado"
          ? espacoDado()
          : espacoDadoDuplo();

    const cardinalidade = espaco.length;
    const lista = espaco.join(", ");

    const steps =
      dados.pergunta === "cardinalidade"
        ? [
            {
              ordem: 1,
              titulo: "Identificar o experimento",
              explicacao:
                "O espaço amostral é o conjunto de todos os resultados possíveis do experimento aleatório.",
              calculo:
                dados.experimento === "moeda"
                  ? "Ω = {Cara, Coroa}"
                  : dados.experimento === "dado"
                    ? "Ω = {1, 2, 3, 4, 5, 6}"
                    : "Ω = {(i,j) | i,j ∈ {1,...,6}}",
            },
            {
              ordem: 2,
              titulo: "Contar os resultados",
              explicacao:
                "A cardinalidade |Ω| é o número de elementos do espaço amostral.",
              calculo: `|Ω| = ${cardinalidade}`,
              resultado: String(cardinalidade),
            },
          ]
        : [
            {
              ordem: 1,
              titulo: "Listar o espaço amostral",
              explicacao:
                "Enumeramos cada resultado possível do experimento, sem repetir nem omitir casos.",
              calculo: `Ω = {${lista}}`,
            },
            {
              ordem: 2,
              titulo: "Contar os elementos",
              explicacao: "Contamos quantos resultados foram listados.",
              calculo: `|Ω| = ${cardinalidade}`,
              resultado: String(cardinalidade),
            },
          ];

    return {
      problemaId: problema.id,
      respostaFinal: String(cardinalidade),
      steps,
    };
  },
};
