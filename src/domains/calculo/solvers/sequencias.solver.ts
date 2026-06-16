import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_SEQUENCIAS, type SequenciasData } from "../entities/types";

export const sequenciasSolver: ProblemSolver = {
  topicoId: TOPICO_SEQUENCIAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as SequenciasData;
    const resultado = d.numeradorCoef / d.denominadorCoef;
    const resultadoStr = Number.isInteger(resultado) ? String(resultado) : resultado.toFixed(2);

    return {
      problemaId: problema.id,
      respostaFinal: resultadoStr,
      steps: [
        {
          ordem: 1,
          titulo: "Dividir numerador e denominador por n",
          explicacao: "Para n → ∞, dividimos tudo pelo termo de maior grau em n.",
          calculo: `aₙ = (${d.numeradorCoef} + ${d.numeradorConst}/n)/(${d.denominadorCoef} ${d.denominadorConst >= 0 ? "+" : "−"} ${Math.abs(d.denominadorConst)}/n)`,
        },
        {
          ordem: 2,
          titulo: "Avaliar o limite",
          explicacao: "Termos com 1/n tendem a zero quando n → ∞.",
          calculo: `lim aₙ = ${d.numeradorCoef}/${d.denominadorCoef} = ${resultadoStr}`,
          resultado: resultadoStr,
        },
      ],
    };
  },
};
