import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { modulo, round2 } from "../lib/vec";
import { TOPICO_VETORES, type VetoresData } from "../entities/types";

export const vetoresSolver: ProblemSolver = {
  topicoId: TOPICO_VETORES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as VetoresData;
    switch (d.tipo) {
      case "vetores":
        return solveModulo(d, problema.id);
      case "vetores-soma":
        return solveSoma(d, problema.id);
      case "vetores-escalar":
        return solveEscalar(d, problema.id);
      case "vetores-unitario":
        return solveUnitario(d, problema.id);
      case "vetores-distancia":
        return solveDistancia(d, problema.id);
      case "vetores-paralelo":
        return solveParalelo(d, problema.id);
    }
  },
};

function solveModulo(
  d: Extract<VetoresData, { tipo: "vetores" }>,
  problemaId: string,
): Solution {
  const somaQuadrados = d.componentes.reduce((acc, c) => acc + c * c, 0);
  const mod = round2(modulo(d.componentes));
  const termos = d.componentes.map((c) => `${c}²`).join(" + ");
  return {
    problemaId,
    respostaFinal: String(mod),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula do módulo",
        explicacao: "|v| = √(x² + y² + z²) em R³ (ou √(x² + y²) em R²).",
        calculo: `|v| = √(${termos})`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Extraímos a raiz quadrada da soma dos quadrados.",
        calculo: `|v| = √${somaQuadrados} = ${mod}`,
        resultado: String(mod),
      },
    ],
  };
}

function solveSoma(
  d: Extract<VetoresData, { tipo: "vetores-soma" }>,
  problemaId: string,
): Solution {
  const soma = d.u.map((ui, i) => ui + d.v[i]!);
  const resultado = `(${soma.join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Somar componente a componente",
        explicacao: "u + v = (u₁+v₁, u₂+v₂, ...).",
        calculo: `u + v = (${d.u.join(", ")}) + (${d.v.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Somamos cada coordenada correspondente.",
        calculo: `u + v = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveEscalar(
  d: Extract<VetoresData, { tipo: "vetores-escalar" }>,
  problemaId: string,
): Solution {
  const prod = d.componentes.map((c) => d.k * c);
  const resultado = `(${prod.join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Multiplicar por escalar",
        explicacao: "k·v multiplica cada componente de v por k.",
        calculo: `${d.k}·(${d.componentes.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Aplicamos a multiplicação em cada coordenada.",
        calculo: `${d.k}·v = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveUnitario(
  d: Extract<VetoresData, { tipo: "vetores-unitario" }>,
  problemaId: string,
): Solution {
  const mod = modulo(d.componentes);
  const unit = d.componentes.map((c) => round2(c / mod));
  const resultado = `(${unit.join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Calcular o módulo",
        explicacao: "Primeiro encontramos |v|.",
        calculo: `|v| = ${round2(mod)}`,
      },
      {
        ordem: 2,
        titulo: "Dividir pelo módulo",
        explicacao: "O vetor unitário é v/|v|.",
        calculo: `v/|v| = (${d.componentes.join(", ")})/${round2(mod)}`,
      },
      {
        ordem: 3,
        titulo: "Resultado",
        explicacao: "Cada componente é dividida pelo módulo.",
        calculo: `û = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveDistancia(
  d: Extract<VetoresData, { tipo: "vetores-distancia" }>,
  problemaId: string,
): Solution {
  const dx = d.q[0] - d.p[0];
  const dy = d.q[1] - d.p[1];
  const dz = d.q[2] - d.p[2];
  const dist = round2(Math.sqrt(dx * dx + dy * dy + dz * dz));
  return {
    problemaId,
    respostaFinal: String(dist),
    steps: [
      {
        ordem: 1,
        titulo: "Vetor PQ",
        explicacao: "PQ = Q − P.",
        calculo: `PQ = (${dx}, ${dy}, ${dz})`,
      },
      {
        ordem: 2,
        titulo: "Distância",
        explicacao: "d(P,Q) = |PQ|.",
        calculo: `d = √(${dx}² + ${dy}² + ${dz}²) = ${dist}`,
        resultado: String(dist),
      },
    ],
  };
}

function solveParalelo(
  d: Extract<VetoresData, { tipo: "vetores-paralelo" }>,
  problemaId: string,
): Solution {
  const cr = [
    d.u[1] * d.v[2] - d.u[2] * d.v[1],
    d.u[2] * d.v[0] - d.u[0] * d.v[2],
    d.u[0] * d.v[1] - d.u[1] * d.v[0],
  ];
  const paralelo = cr.every((c) => c === 0);
  const resultado = paralelo ? "Sim" : "Não";
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Critério de paralelismo",
        explicacao: "u e v são paralelos se u × v = 0.",
        calculo: `u × v = (${cr.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Conclusão",
        explicacao: paralelo
          ? "O produto vetorial é nulo, logo são paralelos."
          : "O produto vetorial é não nulo, logo não são paralelos.",
        calculo: `Resposta: ${resultado}`,
        resultado,
      },
    ],
  };
}
