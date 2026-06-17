import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CONJUNTOS, type ConjuntosData } from "../entities/types";

export const conjuntosSolver: ProblemSolver = {
  topicoId: TOPICO_CONJUNTOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ConjuntosData;
    switch (d.tipo) {
      case "conjuntos-produto-cartesiano":
        return solveProduto(d, problema.id);
      case "conjuntos-pertinencia":
        return solvePertinencia(d, problema.id);
      case "conjuntos-operacao":
        return solveOperacao(d, problema.id);
    }
  },
};

function solveOperacao(
  d: Extract<ConjuntosData, { tipo: "conjuntos-operacao" }>,
  problemaId: string,
): Solution {
  if (d.operacao === "complemento") {
    const resultado = d.nU - d.nA;
    return {
      problemaId,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Complemento",
          explicacao: "|Aᶜ| = |U| − |A|.",
          calculo: `|Aᶜ| = ${d.nU} − ${d.nA} = ${resultado}`,
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
          titulo: "Inclusão-exclusão",
          explicacao: "|A∪B| = |A| + |B| − |A∩B|.",
          calculo: `|A∪B| = ${d.nA} + ${d.nB} − ${d.nAinterB} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  }
  if (d.operacao === "diferenca") {
    const resultado = d.nA - d.nAinterB;
    return {
      problemaId,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Diferença de conjuntos",
          explicacao: "|A\\B| = |A| − |A∩B|.",
          calculo: `|A\\B| = ${d.nA} − ${d.nAinterB} = ${resultado}`,
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
        explicacao: "|A∩B| é dado no enunciado.",
        calculo: `|A∩B| = ${d.nAinterB}`,
        resultado: String(d.nAinterB),
      },
    ],
  };
}

function solveProduto(
  d: Extract<ConjuntosData, { tipo: "conjuntos-produto-cartesiano" }>,
  problemaId: string,
): Solution {
  const resultado = d.nA * d.nB;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Produto cartesiano",
        explicacao: "|A×B| = |A| · |B|.",
        calculo: `|A×B| = ${d.nA} × ${d.nB} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solvePertinencia(
  d: Extract<ConjuntosData, { tipo: "conjuntos-pertinencia" }>,
  problemaId: string,
): Solution {
  return {
    problemaId,
    respostaFinal: String(d.nSatisfaz),
    steps: [
      {
        ordem: 1,
        titulo: "Cardinalidade",
        explicacao: `Contamos quantos elementos de U = {1,…,${d.universo}} satisfazem a propriedade.`,
        calculo: `|A| = ${d.nSatisfaz}`,
        resultado: String(d.nSatisfaz),
      },
    ],
  };
}
