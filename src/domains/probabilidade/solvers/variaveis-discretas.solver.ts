import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_VARIAVEIS_DISCRETAS,
  type VariaveisDiscretasData,
} from "../entities/types";

export const variaveisDiscretasSolver: ProblemSolver = {
  topicoId: TOPICO_VARIAVEIS_DISCRETAS,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as VariaveisDiscretasData;

    if (dados.pergunta === "probabilidade") {
      const idx = dados.valores.indexOf(dados.valorAlvo!);
      const prob = dados.probabilidades[idx]!;
      return {
        problemaId: problema.id,
        respostaFinal: String(prob),
        steps: [
          {
            ordem: 1,
            titulo: "Ler a tabela de probabilidades",
            explicacao: "P(X = k) está dado diretamente na função de probabilidade.",
            calculo: `P(X = ${dados.valorAlvo}) = ${prob}`,
            resultado: String(prob),
          },
        ],
      };
    }

    const termos = dados.valores.map(
      (v, i) => `${v}·${dados.probabilidades[i]}`,
    );
    const produtos = dados.valores.map(
      (v, i) => v * dados.probabilidades[i]!,
    );
    const esperanca =
      Math.round(produtos.reduce((a, b) => a + b, 0) * 1000) / 1000;

    return {
      problemaId: problema.id,
      respostaFinal: String(esperanca),
      steps: [
        {
          ordem: 1,
          titulo: "Fórmula da esperança",
          explicacao: "Para V.A. discreta, E[X] = Σ xᵢ·P(X = xᵢ).",
          calculo: `E[X] = ${termos.join(" + ")}`,
        },
        {
          ordem: 2,
          titulo: "Calcular cada termo",
          explicacao: "Multiplicamos cada valor pela sua probabilidade e somamos.",
          calculo: produtos.join(" + ") + ` = ${esperanca}`,
          resultado: String(esperanca),
        },
      ],
    };
  },
};
