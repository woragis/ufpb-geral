import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { dot, modulo, round2 } from "../lib/vec";
import { TOPICO_PRODUTO_ESCULAR, type ProdutoEscalarData } from "../entities/types";

export const produtoEscalarSolver: ProblemSolver = {
  topicoId: TOPICO_PRODUTO_ESCULAR,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ProdutoEscalarData;
    switch (d.tipo) {
      case "produto-escalar":
        return solveDot(d, problema.id);
      case "produto-escalar-angulo":
        return solveAngulo(d, problema.id);
      case "produto-escalar-projecao":
        return solveProjecao(d, problema.id);
      case "produto-escalar-ortogonal":
        return solveOrtogonal(d, problema.id);
    }
  },
};

function solveDot(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>,
  problemaId: string,
): Solution {
  const termos = d.u.map((ui, i) => `${ui}·${d.v[i]}`);
  const resultado = dot(d.u, d.v);
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula do produto escalar",
        explicacao: "u·v = u₁v₁ + u₂v₂ + u₃v₃.",
        calculo: `u·v = ${termos.join(" + ")}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Somamos os produtos das componentes correspondentes.",
        calculo: `u·v = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveAngulo(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-angulo" }>,
  problemaId: string,
): Solution {
  const uv = dot(d.u, d.v);
  const mu = modulo(d.u);
  const mv = modulo(d.v);
  const cosTheta = uv / (mu * mv);
  const graus = round2((Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) / Math.PI);
  return {
    problemaId,
    respostaFinal: String(graus),
    steps: [
      {
        ordem: 1,
        titulo: "Produto escalar e módulos",
        explicacao: "cos θ = (u·v) / (|u||v|).",
        calculo: `u·v = ${uv}, |u| = ${round2(mu)}, |v| = ${round2(mv)}`,
      },
      {
        ordem: 2,
        titulo: "Calcular cos θ",
        explicacao: "Dividimos o produto escalar pelo produto dos módulos.",
        calculo: `cos θ = ${uv}/(${round2(mu)}·${round2(mv)}) = ${round2(cosTheta)}`,
      },
      {
        ordem: 3,
        titulo: "Ângulo em graus",
        explicacao: "θ = arccos(cos θ), convertido para graus.",
        calculo: `θ ≈ ${graus}°`,
        resultado: String(graus),
      },
    ],
  };
}

function solveProjecao(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-projecao" }>,
  problemaId: string,
): Solution {
  const uv = dot(d.u, d.v);
  const mv = modulo(d.v);
  const proj = round2(uv / mv);
  return {
    problemaId,
    respostaFinal: String(proj),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula da projeção escalar",
        explicacao: "proj_v(u) = (u·v) / |v|.",
        calculo: `u·v = ${uv}, |v| = ${round2(mv)}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Dividimos o produto escalar pelo módulo de v.",
        calculo: `proj_v(u) = ${uv}/${round2(mv)} = ${proj}`,
        resultado: String(proj),
      },
    ],
  };
}

function solveOrtogonal(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-ortogonal" }>,
  problemaId: string,
): Solution {
  const uv = dot(d.u, d.v);
  const ort = uv === 0;
  const resultado = ort ? "Sim" : "Não";
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Critério de ortogonalidade",
        explicacao: "u e v são ortogonais se e somente se u·v = 0.",
        calculo: `u·v = ${uv}`,
      },
      {
        ordem: 2,
        titulo: "Conclusão",
        explicacao: ort
          ? "O produto escalar é zero, logo os vetores são ortogonais."
          : "O produto escalar é diferente de zero, logo não são ortogonais.",
        calculo: `Resposta: ${resultado}`,
        resultado,
      },
    ],
  };
}
