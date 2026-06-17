import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { roundProb, simplificarFracao } from "../utils/math";
import { TOPICO_CONDICIONAL, type CondicionalData } from "../entities/types";

export const condicionalSolver: ProblemSolver = {
  topicoId: TOPICO_CONDICIONAL,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CondicionalData;
    switch (d.tipo) {
      case "condicional":
        return solveContagem(d, problema.id);
      case "condicional-bayes":
        return solveBayes(d, problema.id);
      case "condicional-tabela":
        return solveTabela(d, problema.id);
    }
  },
};

function solveContagem(
  d: Extract<CondicionalData, { tipo: "condicional" }>,
  problemaId: string,
): Solution {
  const fracao = simplificarFracao(d.nAinterB, d.nB);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Definição",
        explicacao: "P(A|B) = n(A∩B)/n(B) em experimento equiprovável.",
        calculo: `P(A|B) = ${d.nAinterB}/${d.nB}`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Simplificamos a fração.",
        calculo: `P(A|B) = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveBayes(
  d: Extract<CondicionalData, { tipo: "condicional-bayes" }>,
  problemaId: string,
): Solution {
  const pAB = roundProb(d.pBA * d.pA);
  const resultado = roundProb(pAB / d.pB);
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Bayes",
        explicacao: "P(A|B) = P(B|A)·P(A) / P(B).",
        calculo: `P(A∩B) = P(B|A)·P(A) = ${d.pBA}·${d.pA} = ${pAB}`,
      },
      {
        ordem: 2,
        titulo: "Calcular P(A|B)",
        explicacao: "Dividimos pela probabilidade de B.",
        calculo: `P(A|B) = ${pAB}/${d.pB} ≈ ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveTabela(
  d: Extract<CondicionalData, { tipo: "condicional-tabela" }>,
  problemaId: string,
): Solution {
  const resultado = roundProb(d.pAinterB / d.pB);
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Definição",
        explicacao: "P(A|B) = P(A∩B)/P(B).",
        calculo: `P(A|B) = ${d.pAinterB}/${d.pB}`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Dividimos as probabilidades.",
        calculo: `P(A|B) ≈ ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}
