import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { simplificarFracao } from "../utils/math";
import { TOPICO_EVENTOS, type EventosData } from "../entities/types";

export const eventosSolver: ProblemSolver = {
  topicoId: TOPICO_EVENTOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as EventosData;
    if (d.tipo === "eventos-exclusivos") {
      return solveExclusivos(d, problema.id);
    }
    if (d.tipo === "eventos-probabilidade") {
      return solveProbabilidade(d, problema.id);
    }
    return solveCardinalidade(d, problema.id);
  },
};

function solveCardinalidade(
  d: Extract<EventosData, { tipo: "eventos" }>,
  problemaId: string,
): Solution {
  if (d.operacao === "complemento") {
    const resultado = d.nOmega - d.nA;
    return {
      problemaId,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Complemento",
          explicacao: "n(Aᶜ) = n(Ω) − n(A).",
          calculo: `n(Aᶜ) = ${d.nOmega} − ${d.nA} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  }
  if (d.operacao === "uniao") {
    const resultado = d.nA + d.nB - d.nAinterB;
    return {
      problemaId,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Princípio da inclusão-exclusão",
          explicacao: "|A∪B| = |A| + |B| − |A∩B|.",
          calculo: `|A∪B| = ${d.nA} + ${d.nB} − ${d.nAinterB} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  }
  return {
    problemaId,
    respostaFinal: String(d.nAinterB),
    steps: [
      {
        ordem: 1,
        titulo: "Interseção",
        explicacao: "|A∩B| é dado diretamente.",
        calculo: `|A∩B| = ${d.nAinterB}`,
        resultado: String(d.nAinterB),
      },
    ],
  };
}

function solveProbabilidade(
  d: Extract<EventosData, { tipo: "eventos-probabilidade" }>,
  problemaId: string,
): Solution {
  if (d.operacao === "complemento") {
    const pA = d.nA / d.nOmega;
    const resultado = simplificarFracao(d.nOmega - d.nA, d.nOmega);
    return {
      problemaId,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Probabilidade do complemento",
          explicacao: "P(Aᶜ) = 1 − P(A) = (n(Ω)−n(A))/n(Ω).",
          calculo: `P(Aᶜ) = (${d.nOmega}−${d.nA})/${d.nOmega} = ${resultado}`,
          resultado,
        },
      ],
    };
  }
  if (d.operacao === "uniao") {
    const num = d.nA + d.nB - d.nAinterB;
    const resultado = simplificarFracao(num, d.nOmega);
    return {
      problemaId,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Fórmula da união",
          explicacao: "P(A∪B) = P(A) + P(B) − P(A∩B).",
          calculo: `P(A∪B) = (${d.nA}+${d.nB}−${d.nAinterB})/${d.nOmega} = ${resultado}`,
          resultado,
        },
      ],
    };
  }
  const resultado = simplificarFracao(d.nAinterB, d.nOmega);
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Probabilidade da interseção",
        explicacao: "P(A∩B) = n(A∩B)/n(Ω) em experimento equiprovável.",
        calculo: `P(A∩B) = ${d.nAinterB}/${d.nOmega} = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveExclusivos(
  d: Extract<EventosData, { tipo: "eventos-exclusivos" }>,
  problemaId: string,
): Solution {
  const resultado = d.nA + d.nB;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Eventos mutuamente exclusivos",
        explicacao: "Se A∩B = ∅, então |A∪B| = |A| + |B|.",
        calculo: `|A∪B| = ${d.nA} + ${d.nB} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}
