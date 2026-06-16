import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_MEDIDAS_TENDENCIA,
  type MedidasTendenciaData,
} from "../entities/types";

export const medidasTendenciaSolver: ProblemSolver = {
  topicoId: TOPICO_MEDIDAS_TENDENCIA,

  resolver(problema: Problem): Solution {
    const { valores } = problema.dados as MedidasTendenciaData;
    const soma = valores.reduce((a, b) => a + b, 0);
    const n = valores.length;
    const media = soma / n;
    const mediaFormatada =
      Number.isInteger(media) ? String(media) : media.toFixed(2);

    return {
      problemaId: problema.id,
      respostaFinal: mediaFormatada,
      steps: [
        {
          ordem: 1,
          titulo: "Somar os valores",
          explicacao:
            "A média aritmética exige primeiro a soma de todas as observações.",
          calculo: `${valores.join(" + ")} = ${soma}`,
          resultado: String(soma),
        },
        {
          ordem: 2,
          titulo: "Contar as observações",
          explicacao: "n é o número de elementos no conjunto de dados.",
          calculo: `n = ${n}`,
          resultado: String(n),
        },
        {
          ordem: 3,
          titulo: "Aplicar a fórmula da média",
          explicacao: "x̄ = (soma dos valores) / n",
          calculo: `x̄ = ${soma} / ${n} = ${mediaFormatada}`,
          resultado: mediaFormatada,
        },
      ],
    };
  },
};
