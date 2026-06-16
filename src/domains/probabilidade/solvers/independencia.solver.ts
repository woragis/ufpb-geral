import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { simplificarFracao } from "../utils/math";
import { TOPICO_INDEPENDENCIA, type IndependenciaData } from "../entities/types";

export const independenciaSolver: ProblemSolver = {
  topicoId: TOPICO_INDEPENDENCIA,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as IndependenciaData;
    const pA = dados.nA / dados.nOmega;
    const pB = dados.nB / dados.nOmega;
    const pAinterB = dados.nAinterB / dados.nOmega;
    const produto = (dados.nA * dados.nB) / dados.nOmega;
    const independente = dados.nAinterB * dados.nOmega === dados.nA * dados.nB;

    return {
      problemaId: problema.id,
      respostaFinal: independente ? "Sim" : "Não",
      steps: [
        {
          ordem: 1,
          titulo: "Calcular P(A) e P(B)",
          explicacao: "Usamos a definição clássica em experimento equiprovável.",
          calculo: `P(A) = ${dados.nA}/${dados.nOmega}, P(B) = ${dados.nB}/${dados.nOmega}`,
        },
        {
          ordem: 2,
          titulo: "Calcular P(A∩B)",
          explicacao: "Probabilidade da interseção usando a definição clássica.",
          calculo: `P(A∩B) = ${dados.nAinterB}/${dados.nOmega} = ${pAinterB.toFixed(4).replace(/\.?0+$/, "")}`,
        },
        {
          ordem: 3,
          titulo: "Verificar critério de independência",
          explicacao:
            "A e B são independentes se e somente se P(A∩B) = P(A)·P(B), ou equivalentemente |A∩B|·|Ω| = |A|·|B|.",
          calculo: `P(A)·P(B) = (${dados.nA}/${dados.nOmega})·(${dados.nB}/${dados.nOmega}) = ${simplificarFracao(dados.nA * dados.nB, dados.nOmega * dados.nOmega)}`,
        },
        {
          ordem: 4,
          titulo: "Comparar",
          explicacao: independente
            ? "O produto |A|·|B|/|Ω| coincide com |A∩B| — os eventos são independentes."
            : "O produto não coincide — os eventos são dependentes.",
          calculo: independente
            ? `|A∩B|·|Ω| = ${dados.nAinterB}·${dados.nOmega} = ${dados.nA}·${dados.nB} = |A|·|B| → independentes`
            : `|A∩B|·|Ω| = ${dados.nAinterB * dados.nOmega} ≠ ${dados.nA * dados.nB} = |A|·|B| → dependentes`,
          resultado: independente ? "Sim" : "Não",
        },
      ],
    };
  },
};
