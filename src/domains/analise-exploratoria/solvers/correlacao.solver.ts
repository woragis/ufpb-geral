import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";
import {
  covarianciaAmostral,
  interpretarCorrelacao,
  labelInterpretacao,
  media,
  pearson,
  spearman,
} from "../lib/stats";

export const correlacaoSolver: ProblemSolver = {
  topicoId: TOPICO_CORRELACAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CorrelacaoData;
    switch (d.tipo) {
      case "correlacao":
      case "correlacao-negativa":
      case "correlacao-fraca":
        return solvePearson(d, problema.id);
      case "correlacao-spearman":
        return solveSpearman(d, problema.id);
      case "correlacao-interpretacao":
        return solveInterpretacao(d, problema.id);
      case "correlacao-covariancia":
        return solveCovariancia(d, problema.id);
    }
  },
};

function solvePearson(
  d: Extract<CorrelacaoData, { tipo: "correlacao" | "correlacao-negativa" | "correlacao-fraca" }>,
  problemaId: string,
): Solution {
  const r = pearson(d.xs, d.ys);
  const mx = media(d.xs);
  const my = media(d.ys);
  return {
    problemaId,
    respostaFinal: String(r),
    steps: [
      {
        ordem: 1,
        titulo: "Calcular médias",
        explicacao: "Pearson mede associação linear entre duas variáveis quantitativas.",
        calculo: `x̄ = ${mx.toFixed(2)}, ȳ = ${my.toFixed(2)}`,
      },
      {
        ordem: 2,
        titulo: "Aplicar a fórmula de Pearson",
        explicacao: "r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)² · Σ(yᵢ−ȳ)²]",
        calculo: `r ≈ ${r}`,
        resultado: String(r),
      },
    ],
  };
}

function solveSpearman(
  d: Extract<CorrelacaoData, { tipo: "correlacao-spearman" }>,
  problemaId: string,
): Solution {
  const rho = spearman(d.xs, d.ys);
  return {
    problemaId,
    respostaFinal: String(rho),
    steps: [
      {
        ordem: 1,
        titulo: "Atribuir postos",
        explicacao: "Spearman usa os postos (ranks) de X e Y.",
        calculo: `Pares: ${d.xs.map((x, i) => `(${x}, ${d.ys[i]})`).join(", ")}`,
      },
      {
        ordem: 2,
        titulo: "Correlação de postos",
        explicacao: "ρ é Pearson aplicado aos postos.",
        calculo: `ρ ≈ ${rho}`,
        resultado: String(rho),
      },
    ],
  };
}

function solveInterpretacao(
  d: Extract<CorrelacaoData, { tipo: "correlacao-interpretacao" }>,
  problemaId: string,
): Solution {
  const interp = interpretarCorrelacao(d.r);
  const resposta = labelInterpretacao(interp);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Analisar |r|",
        explicacao: "|r| ≥ 0,7 forte; ≥ 0,4 moderada; caso contrário fraca.",
        calculo: `r = ${d.r}, |r| = ${Math.abs(d.r).toFixed(2)}`,
      },
      {
        ordem: 2,
        titulo: "Classificar",
        explicacao: "Incluímos o sinal (positiva/negativa).",
        calculo: resposta,
        resultado: resposta,
      },
    ],
  };
}

function solveCovariancia(
  d: Extract<CorrelacaoData, { tipo: "correlacao-covariancia" }>,
  problemaId: string,
): Solution {
  const cov = covarianciaAmostral(d.xs, d.ys);
  return {
    problemaId,
    respostaFinal: String(cov),
    steps: [
      {
        ordem: 1,
        titulo: "Médias",
        explicacao: "Covariância mede variação conjunta em relação às médias.",
        calculo: `x̄ = ${media(d.xs).toFixed(2)}, ȳ = ${media(d.ys).toFixed(2)}`,
      },
      {
        ordem: 2,
        titulo: "Fórmula amostral",
        explicacao: "Cov(X,Y) = Σ(xᵢ−x̄)(yᵢ−ȳ) / (n−1).",
        calculo: `Cov(X,Y) = ${cov}`,
        resultado: String(cov),
      },
    ],
  };
}
