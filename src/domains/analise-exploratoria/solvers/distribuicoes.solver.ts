import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_DISTRIBUICOES,
  type DistribuicoesData,
} from "../entities/types";
import { contarOutliers, quartis } from "../lib/stats";

export const distribuicoesSolver: ProblemSolver = {
  topicoId: TOPICO_DISTRIBUICOES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as DistribuicoesData;
    switch (d.tipo) {
      case "distribuicoes":
        return solveIqr(d, problema.id);
      case "distribuicoes-quartis":
        return solveQuartis(d, problema.id);
      case "distribuicoes-outliers":
        return solveOutliers(d, problema.id);
      case "distribuicoes-ler-boxplot":
        return solveLerBoxplot(d, problema.id);
    }
  },
};

function solveIqr(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes" }>,
  problemaId: string,
): Solution {
  const iqr = d.q3 - d.q1;
  return {
    problemaId,
    respostaFinal: String(iqr),
    steps: [
      {
        ordem: 1,
        titulo: "Definir IQR",
        explicacao: "A amplitude interquartil mede a dispersão dos 50% centrais dos dados.",
        calculo: `IQR = Q3 − Q1`,
      },
      {
        ordem: 2,
        titulo: "Substituir os quartis",
        explicacao: "Usamos os valores lidos do boxplot.",
        calculo: `IQR = ${d.q3} − ${d.q1} = ${iqr}`,
        resultado: String(iqr),
      },
    ],
  };
}

function solveQuartis(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>,
  problemaId: string,
): Solution {
  const q = quartis(d.valores);
  const valor = d.pergunta === "q1" ? q.q1 : d.pergunta === "q2" ? q.q2 : q.q3;
  const label = d.pergunta.toUpperCase();
  return {
    problemaId,
    respostaFinal: String(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Ordenar os dados",
        explicacao: "Quartis exigem dados ordenados.",
        calculo: `{${[...d.valores].sort((a, b) => a - b).join(", ")}}`,
      },
      {
        ordem: 2,
        titulo: `Calcular ${label}`,
        explicacao: "Dividimos o conjunto em quartis.",
        calculo: `${label} = ${valor}`,
        resultado: String(valor),
      },
    ],
  };
}

function solveOutliers(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>,
  problemaId: string,
): Solution {
  const { q1, q3 } = quartis(d.valores);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const n = contarOutliers(d.valores);
  return {
    problemaId,
    respostaFinal: String(n),
    steps: [
      {
        ordem: 1,
        titulo: "Calcular IQR e limites",
        explicacao: "Outliers ficam fora de [Q1−1,5·IQR, Q3+1,5·IQR].",
        calculo: `Q1=${q1}, Q3=${q3}, IQR=${iqr}, limites: [${lo.toFixed(2)}, ${hi.toFixed(2)}]`,
      },
      {
        ordem: 2,
        titulo: "Contar outliers",
        explicacao: "Valores abaixo do limite inferior ou acima do superior.",
        calculo: `Outliers = ${n}`,
        resultado: String(n),
      },
    ],
  };
}

function solveLerBoxplot(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-ler-boxplot" }>,
  problemaId: string,
): Solution {
  if (d.pergunta === "mediana") {
    return {
      problemaId,
      respostaFinal: String(d.q2),
      steps: [
        {
          ordem: 1,
          titulo: "Ler o boxplot",
          explicacao: "A linha central da caixa é a mediana (Q2).",
          calculo: `Mediana = ${d.q2}`,
          resultado: String(d.q2),
        },
      ],
    };
  }
  const iqr = d.q3 - d.q1;
  return {
    problemaId,
    respostaFinal: String(iqr),
    steps: [
      {
        ordem: 1,
        titulo: "Definir IQR",
        explicacao: "A amplitude interquartil mede a dispersão dos 50% centrais dos dados.",
        calculo: `IQR = Q3 − Q1`,
      },
      {
        ordem: 2,
        titulo: "Substituir os quartis",
        explicacao: "Usamos os valores lidos do boxplot.",
        calculo: `IQR = ${d.q3} − ${d.q1} = ${iqr}`,
        resultado: String(iqr),
      },
    ],
  };
}
