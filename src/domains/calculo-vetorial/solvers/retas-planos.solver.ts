import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { cross, modulo, round2 } from "../lib/vec";
import { TOPICO_RETAS_PLANOS, type RetasPlanosData } from "../entities/types";

export const retasPlanosSolver: ProblemSolver = {
  topicoId: TOPICO_RETAS_PLANOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as RetasPlanosData;
    switch (d.tipo) {
      case "retas-planos":
        return solveDiretor(d, problema.id);
      case "retas-planos-parametrica":
        return solveParametrica(d, problema.id);
      case "retas-planos-plano":
        return solvePlano(d, problema.id);
      case "retas-planos-distancia":
        return solveDistancia(d, problema.id);
      case "retas-planos-distancia-reta":
        return solveDistanciaReta(d, problema.id);
      case "retas-planos-intersecao":
        return solveIntersecao(d, problema.id);
    }
  },
};

function solveDiretor(
  d: Extract<RetasPlanosData, { tipo: "retas-planos" }>,
  problemaId: string,
): Solution {
  const dir: [number, number, number] = [
    d.p2[0] - d.p1[0],
    d.p2[1] - d.p1[1],
    d.p2[2] - d.p1[2],
  ];
  const resultado = `(${dir.join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Vetor diretor",
        explicacao: "O vetor diretor é PQ = Q − P, paralelo à reta.",
        calculo: `PQ = (${d.p2.join(", ")}) − (${d.p1.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Calcular componentes",
        explicacao: "Subtraímos as coordenadas correspondentes de P e Q.",
        calculo: `PQ = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveParametrica(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-parametrica" }>,
  problemaId: string,
): Solution {
  const ponto = d.p0.map((v, i) => v + d.diretor[i]!) as [number, number, number];
  const resultado = `(${ponto.join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Equação paramétrica",
        explicacao: "r(t) = P₀ + t·v.",
        calculo: `r(t) = (${d.p0.join(", ")}) + t(${d.diretor.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Avaliar em t = 1",
        explicacao: "Substituímos t = 1 na equação paramétrica.",
        calculo: `r(1) = (${d.p0.join(", ")}) + (${d.diretor.join(", ")}) = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solvePlano(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-plano" }>,
  problemaId: string,
): Solution {
  const [a, b, c] = d.normal;
  const dVal = a * d.ponto[0] + b * d.ponto[1] + c * d.ponto[2];
  return {
    problemaId,
    respostaFinal: String(dVal),
    steps: [
      {
        ordem: 1,
        titulo: "Equação do plano",
        explicacao: "ax + by + cz = d, com n = (a, b, c) normal ao plano.",
        calculo: `${a}x + ${b}y + ${c}z = d`,
      },
      {
        ordem: 2,
        titulo: "Substituir o ponto",
        explicacao: "O ponto do plano deve satisfazer a equação.",
        calculo: `d = ${a}·${d.ponto[0]} + ${b}·${d.ponto[1]} + ${c}·${d.ponto[2]} = ${dVal}`,
        resultado: String(dVal),
      },
    ],
  };
}

function solveDistancia(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-distancia" }>,
  problemaId: string,
): Solution {
  const [a, b, c, dPlano] = d.coeficientes;
  const numerador = Math.abs(
    a * d.ponto[0] + b * d.ponto[1] + c * d.ponto[2] - dPlano,
  );
  const denominador = Math.sqrt(a * a + b * b + c * c);
  const dist = round2(numerador / denominador);
  return {
    problemaId,
    respostaFinal: String(dist),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula da distância",
        explicacao: "d = |ax₀ + by₀ + cz₀ − d| / √(a² + b² + c²).",
        calculo: `P = (${d.ponto.join(", ")}), plano: ${a}x + ${b}y + ${c}z = ${dPlano}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Substituímos o ponto e aplicamos a fórmula.",
        calculo: `d = |${a}·${d.ponto[0]} + ${b}·${d.ponto[1]} + ${c}·${d.ponto[2]} − ${dPlano}| / ${round2(denominador)} = ${dist}`,
        resultado: String(dist),
      },
    ],
  };
}

function solveDistanciaReta(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-distancia-reta" }>,
  problemaId: string,
): Solution {
  const ap: [number, number, number] = [
    d.ponto[0] - d.p0[0],
    d.ponto[1] - d.p0[1],
    d.ponto[2] - d.p0[2],
  ];
  const cr = cross(ap, d.diretor);
  const dist = round2(modulo(cr) / modulo(d.diretor));
  return {
    problemaId,
    respostaFinal: String(dist),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula ponto–reta",
        explicacao: "d = |AP × v| / |v|, com A na reta e v diretor.",
        calculo: `AP = (${ap.join(", ")}), v = (${d.diretor.join(", ")})`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Aplicamos produto vetorial e módulos.",
        calculo: `d = ${dist}`,
        resultado: String(dist),
      },
    ],
  };
}

function solveIntersecao(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-intersecao" }>,
  problemaId: string,
): Solution {
  const [a, b, c, dPlano] = d.coeficientes;
  const nv = a * d.diretor[0] + b * d.diretor[1] + c * d.diretor[2];
  const np0 = a * d.p0[0] + b * d.p0[1] + c * d.p0[2];
  const t = (dPlano - np0) / nv;
  const ponto: [number, number, number] = [
    d.p0[0] + t * d.diretor[0],
    d.p0[1] + t * d.diretor[1],
    d.p0[2] + t * d.diretor[2],
  ];
  const resultado = `(${ponto.map((x) => round2(x)).join(", ")})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Substituir reta no plano",
        explicacao: "Substituímos r(t) = P₀ + tv na equação do plano.",
        calculo: `${a}x + ${b}y + ${c}z = ${dPlano}`,
      },
      {
        ordem: 2,
        titulo: "Resolver para t",
        explicacao: "Isolamos o parâmetro t.",
        calculo: `t = (${dPlano} − ${round2(np0)}) / ${nv} = ${round2(t)}`,
      },
      {
        ordem: 3,
        titulo: "Ponto de interseção",
        explicacao: "Substituímos t na equação da reta.",
        calculo: `r(t) = ${resultado}`,
        resultado,
      },
    ],
  };
}
