import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { cross, dot, modulo, round2 } from "../lib/vec";
import { TOPICO_PRODUTO_VETORIAL, type ProdutoVetorialData } from "../entities/types";

export const produtoVetorialSolver: ProblemSolver = {
  topicoId: TOPICO_PRODUTO_VETORIAL,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ProdutoVetorialData;
    if (d.tipo === "produto-vetorial-area") {
      return solveArea(d, problema.id);
    }
    if (d.tipo === "produto-vetorial-misto") {
      return solveMisto(d, problema.id);
    }
    return solveCross(d, problema.id);
  },
};

function solveCross(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>,
  problemaId: string,
): Solution {
  const [u1, u2, u3] = d.u;
  const [v1, v2, v3] = d.v;
  const [i, j, k] = cross(d.u, d.v);
  const resultado = `(${i}, ${j}, ${k})`;

  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Montar o determinante simbólico",
        explicacao: "u × v pode ser calculado via determinante com î, ĵ, k̂.",
        calculo: `| î  ĵ  k̂ |\n| ${u1} ${u2} ${u3} |\n| ${v1} ${v2} ${v3} |`,
      },
      {
        ordem: 2,
        titulo: "Expandir",
        explicacao: "Componente i: u₂v₃ − u₃v₂, j: −(u₁v₃ − u₃v₁), k: u₁v₂ − u₂v₁.",
        calculo: `u × v = (${u2}·${v3} − ${u3}·${v2}, −(${u1}·${v3} − ${u3}·${v1}), ${u1}·${v2} − ${u2}·${v1})`,
      },
      {
        ordem: 3,
        titulo: "Resultado",
        explicacao: "O vetor resultante é perpendicular a u e a v.",
        calculo: `u × v = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveArea(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial-area" }>,
  problemaId: string,
): Solution {
  const cr = cross(d.u, d.v);
  const area = round2(modulo(cr));
  return {
    problemaId,
    respostaFinal: String(area),
    steps: [
      {
        ordem: 1,
        titulo: "Área via produto vetorial",
        explicacao: "A área do paralelogramo é |u × v|.",
        calculo: `u × v = (${cr.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Calcular o módulo",
        explicacao: "Tomamos o módulo do vetor produto vetorial.",
        calculo: `|u × v| = ${area}`,
        resultado: String(area),
      },
    ],
  };
}

function solveMisto(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial-misto" }>,
  problemaId: string,
): Solution {
  const cr = cross(d.v, d.w);
  const volume = Math.abs(dot(d.u, cr));
  return {
    problemaId,
    respostaFinal: String(volume),
    steps: [
      {
        ordem: 1,
        titulo: "Produto misto",
        explicacao: "Volume = |u · (v × w)|.",
        calculo: `v × w = (${cr.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Calcular volume",
        explicacao: "Aplicamos o produto escalar com u.",
        calculo: `|u · (v × w)| = ${volume}`,
        resultado: String(volume),
      },
    ],
  };
}
