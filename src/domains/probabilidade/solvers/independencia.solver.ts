import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_INDEPENDENCIA, type IndependenciaData } from "../entities/types";

export const independenciaSolver: ProblemSolver = {
  topicoId: TOPICO_INDEPENDENCIA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as IndependenciaData;
    switch (d.tipo) {
      case "independencia":
        return solveTeste(d, problema.id);
      case "independencia-contraste":
        return solveContraste(d, problema.id);
      case "independencia-prob":
        return solveProb(d, problema.id);
    }
  },
};

function solveTeste(
  d: Extract<IndependenciaData, { tipo: "independencia" }>,
  problemaId: string,
): Solution {
  const indep = d.nAinterB * d.nOmega === d.nA * d.nB;
  const resultado = indep ? "Sim" : "Não";
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Critério",
        explicacao: "A e B são independentes se |A∩B|·|Ω| = |A|·|B|.",
        calculo: `|A∩B|·|Ω| = ${d.nAinterB * d.nOmega}, |A|·|B| = ${d.nA * d.nB}`,
      },
      {
        ordem: 2,
        titulo: "Conclusão",
        explicacao: indep
          ? "A igualdade vale, logo são independentes."
          : "A igualdade não vale, logo não são independentes.",
        calculo: `Resposta: ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveContraste(
  d: Extract<IndependenciaData, { tipo: "independencia-contraste" }>,
  problemaId: string,
): Solution {
  const exclusivo = d.nAinterB === 0;
  const indep = d.nAinterB * d.nOmega === d.nA * d.nB;
  const resultado = `exclusivo=${exclusivo ? "Sim" : "Não"}, independente=${indep ? "Sim" : "Não"}`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Mutuamente exclusivos",
        explicacao: "Exclusivos quando A∩B = ∅, ou seja |A∩B| = 0.",
        calculo: `|A∩B| = ${d.nAinterB} → exclusivo = ${exclusivo ? "Sim" : "Não"}`,
      },
      {
        ordem: 2,
        titulo: "Independência",
        explicacao: "Independentes se |A∩B|·|Ω| = |A|·|B|.",
        calculo: `${d.nAinterB * d.nOmega} ${indep ? "=" : "≠"} ${d.nA * d.nB}`,
      },
      {
        ordem: 3,
        titulo: "Resposta",
        explicacao: "Resumimos os dois critérios.",
        calculo: resultado,
        resultado,
      },
    ],
  };
}

function solveProb(
  d: Extract<IndependenciaData, { tipo: "independencia-prob" }>,
  problemaId: string,
): Solution {
  const indep = Math.abs(d.pAinterB - d.pA * d.pB) < 0.001;
  const resultado = indep ? "Sim" : "Não";
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Critério",
        explicacao: "Independentes se P(A∩B) = P(A)·P(B).",
        calculo: `P(A)·P(B) = ${d.pA}·${d.pB} = ${Math.round(d.pA * d.pB * 1000) / 1000}`,
      },
      {
        ordem: 2,
        titulo: "Comparar",
        explicacao: `P(A∩B) = ${d.pAinterB}.`,
        calculo: `Resposta: ${resultado}`,
        resultado,
      },
    ],
  };
}
