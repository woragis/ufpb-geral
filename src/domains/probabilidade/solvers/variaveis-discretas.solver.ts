import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  binomialProb,
  comb,
  geometricProb,
  roundProb,
  simplificarFracao,
} from "../utils/math";
import {
  TOPICO_VARIAVEIS_DISCRETAS,
  type VariaveisDiscretasData,
} from "../entities/types";

export const variaveisDiscretasSolver: ProblemSolver = {
  topicoId: TOPICO_VARIAVEIS_DISCRETAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as VariaveisDiscretasData;
    switch (d.tipo) {
      case "variaveis-discretas":
        return d.pergunta === "probabilidade"
          ? solveProb(d, problema.id)
          : solveEsperanca(d, problema.id);
      case "variaveis-discretas-variancia":
        return solveVariancia(d, problema.id);
      case "variaveis-discretas-acumulada":
        return solveAcumulada(d, problema.id);
      case "variaveis-discretas-binomial":
        return solveBinomial(d, problema.id);
      case "variaveis-discretas-geometrica":
        return solveGeometrica(d, problema.id);
    }
  },
};

function solveProb(
  d: Extract<VariaveisDiscretasData, { pergunta: "probabilidade" }>,
  problemaId: string,
): Solution {
  const idx = d.valores.indexOf(d.valorAlvo);
  const prob = d.probabilidades[idx]!;
  return {
    problemaId,
    respostaFinal: String(prob),
    steps: [
      {
        ordem: 1,
        titulo: "Ler a tabela",
        explicacao: "P(X = k) está na função de probabilidade.",
        calculo: `P(X = ${d.valorAlvo}) = ${prob}`,
        resultado: String(prob),
      },
    ],
  };
}

function solveEsperanca(
  d: Extract<VariaveisDiscretasData, { pergunta: "esperanca" }>,
  problemaId: string,
): Solution {
  const produtos = d.valores.map((v, i) => v * d.probabilidades[i]!);
  const esperanca = roundProb(produtos.reduce((a, b) => a + b, 0), 3);
  return {
    problemaId,
    respostaFinal: String(esperanca),
    steps: [
      {
        ordem: 1,
        titulo: "Esperança",
        explicacao: "E[X] = Σ xᵢ·P(X = xᵢ).",
        calculo: d.valores
          .map((v, i) => `${v}·${d.probabilidades[i]}`)
          .join(" + "),
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Somamos os termos.",
        calculo: `E[X] = ${esperanca}`,
        resultado: String(esperanca),
      },
    ],
  };
}

function solveVariancia(
  d: Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas-variancia" }>,
  problemaId: string,
): Solution {
  const eX = d.valores.reduce(
    (acc, v, i) => acc + v * d.probabilidades[i]!,
    0,
  );
  const eX2 = d.valores.reduce(
    (acc, v, i) => acc + v * v * d.probabilidades[i]!,
    0,
  );
  const variancia = roundProb(eX2 - eX * eX, 3);
  return {
    problemaId,
    respostaFinal: String(variancia),
    steps: [
      {
        ordem: 1,
        titulo: "E[X] e E[X²]",
        explicacao: "Var(X) = E[X²] − (E[X])².",
        calculo: `E[X] = ${roundProb(eX, 3)}, E[X²] = ${roundProb(eX2, 3)}`,
      },
      {
        ordem: 2,
        titulo: "Variância",
        explicacao: "Subtraímos o quadrado da esperança.",
        calculo: `Var(X) = ${roundProb(eX2, 3)} − (${roundProb(eX, 3)})² = ${variancia}`,
        resultado: String(variancia),
      },
    ],
  };
}

function solveAcumulada(
  d: Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas-acumulada" }>,
  problemaId: string,
): Solution {
  const prob = roundProb(
    d.valores.reduce(
      (acc, v, i) => (v <= d.limite ? acc + d.probabilidades[i]! : acc),
      0,
    ),
    3,
  );
  return {
    problemaId,
    respostaFinal: String(prob),
    steps: [
      {
        ordem: 1,
        titulo: "Probabilidade acumulada",
        explicacao: "P(X ≤ k) = Σ P(X = xᵢ) para xᵢ ≤ k.",
        calculo: d.valores
          .map((v, i) => (v <= d.limite ? `P(X=${v})=${d.probabilidades[i]}` : null))
          .filter(Boolean)
          .join(" + "),
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Somamos as probabilidades elegíveis.",
        calculo: `P(X ≤ ${d.limite}) = ${prob}`,
        resultado: String(prob),
      },
    ],
  };
}

function solveBinomial(
  d: Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas-binomial" }>,
  problemaId: string,
): Solution {
  const prob = roundProb(binomialProb(d.n, d.k, d.p), 4);
  const coef = comb(d.n, d.k);
  return {
    problemaId,
    respostaFinal: String(prob),
    steps: [
      {
        ordem: 1,
        titulo: "Fórmula binomial",
        explicacao: "P(X=k) = C(n,k)·p^k·(1−p)^(n−k).",
        calculo: `C(${d.n},${d.k}) = ${coef}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Substituímos n, k e p.",
        calculo: `P(X=${d.k}) = ${coef}·${d.p}^${d.k}·${1 - d.p}^${d.n - d.k} ≈ ${prob}`,
        resultado: String(prob),
      },
    ],
  };
}

function solveGeometrica(
  d: Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas-geometrica" }>,
  problemaId: string,
): Solution {
  const prob = roundProb(geometricProb(d.k, d.p), 4);
  return {
    problemaId,
    respostaFinal: String(prob),
    steps: [
      {
        ordem: 1,
        titulo: "Distribuição geométrica",
        explicacao: "P(X=k) = (1−p)^(k−1)·p — primeiro sucesso na k-ésima tentativa.",
        calculo: `P(X=${d.k}) = (1−${d.p})^${d.k - 1}·${d.p}`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Calculamos a potência e multiplicamos.",
        calculo: `P(X=${d.k}) ≈ ${prob}`,
        resultado: String(prob),
      },
    ],
  };
}
