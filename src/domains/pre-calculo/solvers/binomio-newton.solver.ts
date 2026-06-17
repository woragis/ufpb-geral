import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { comb } from "../utils/math";
import { TOPICO_BINOMIO_NEWTON, type BinomioNewtonData } from "../entities/types";

export const binomioNewtonSolver: ProblemSolver = {
  topicoId: TOPICO_BINOMIO_NEWTON,

  resolver(problema: Problem): Solution {
    const d = problema.dados as BinomioNewtonData;
    switch (d.tipo) {
      case "binomio-coeficiente":
        return solveCoeficiente(d, problema.id);
      case "binomio-termo-geral":
        return solveTermoGeral(d, problema.id);
      case "binomio-soma-coeficientes":
        return solveSoma(d, problema.id);
      case "binomio-expansao":
        return solveExpansao(d, problema.id);
    }
  },
};

function solveCoeficiente(
  d: Extract<BinomioNewtonData, { tipo: "binomio-coeficiente" }>,
  problemaId: string,
): Solution {
  const resultado = comb(d.n, d.k) * d.a ** (d.n - d.k) * d.b ** d.k;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Termo geral do binômio",
        explicacao: "O coeficiente de x^k em (ax+b)^n é C(n,k)·a^(n−k)·b^k.",
        calculo: `C(${d.n},${d.k})·${d.a}^${d.n - d.k}·(${d.b})^${d.k} = ${comb(d.n, d.k)}·${d.a ** (d.n - d.k)}·${d.b ** d.k} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveTermoGeral(
  d: Extract<BinomioNewtonData, { tipo: "binomio-termo-geral" }>,
  problemaId: string,
): Solution {
  const k = d.ordem - 1;
  const coef = comb(d.n, k) * d.a ** (d.n - k) * d.b ** k;
  const resposta = `${coef}x^${k}`;
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Termo de ordem r",
        explicacao: "O termo de ordem r corresponde a k = r−1 na potência de x.",
        calculo: `T_${d.ordem} = C(${d.n},${k})·${d.a}^${d.n - k}·x^${k} = ${coef}x^${k}`,
        resultado: resposta,
      },
    ],
  };
}

function solveSoma(
  d: Extract<BinomioNewtonData, { tipo: "binomio-soma-coeficientes" }>,
  problemaId: string,
): Solution {
  const resultado = (d.a + d.b) ** d.n;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Soma dos coeficientes",
        explicacao: "A soma dos coeficientes é P(1): substituímos x = 1.",
        calculo: `(${d.a}·1 + ${d.b})^${d.n} = ${d.a + d.b}^${d.n} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function expandXPlusOne(n: number): string {
  const terms: string[] = [];
  for (let k = 0; k <= n; k++) {
    const c = comb(n, k);
    if (k === 0) terms.push(String(c));
    else if (k === 1) terms.push(`${c}x`);
    else if (k === n) terms.push(`x^${n}`);
    else terms.push(`${c}x^${k}`);
  }
  return terms.join(" + ");
}

function solveExpansao(
  d: Extract<BinomioNewtonData, { tipo: "binomio-expansao" }>,
  problemaId: string,
): Solution {
  const resposta = expandXPlusOne(d.n);
  const linhas: string[] = [];
  for (let k = 0; k <= d.n; k++) {
    linhas.push(`C(${d.n},${k})·x^${k}·1^${d.n - k} = ${comb(d.n, k)}x^${k}`);
  }
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Binômio de Newton",
        explicacao: "(x+1)^n = Σ C(n,k) x^k.",
        calculo: linhas.join("; "),
        resultado: resposta,
      },
    ],
  };
}
