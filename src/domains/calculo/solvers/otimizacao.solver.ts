import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { fmtNum } from "../lib/format";
import { solveOtimizacaoV3, solveConcavidadeFixed } from "./otimizacao-v3.solver";
import { TOPICO_OTIMIZACAO, type OtimizacaoData } from "../entities/types";

export const otimizacaoSolver: ProblemSolver = {
  topicoId: TOPICO_OTIMIZACAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as OtimizacaoData;
    switch (d.tipo) {
      case "otimizacao-parabola":
        return solveParabola(d, problema.id);
      case "otimizacao-geometrica":
        return solveGeometrica(d, problema.id);
      case "otimizacao-crescimento":
        return solveCrescimento(d, problema.id);
      case "otimizacao-concavidade":
        return solveConcavidadeFixed(d, problema.id);
      default: {
        const v3 = solveOtimizacaoV3(d, problema.id);
        if (v3) return v3;
        throw new Error("Tipo de otimização desconhecido");
      }
    }
  },
};

function solveParabola(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-parabola" }>,
  problemaId: string,
): Solution {
  const xVertice = -d.b / (2 * d.a);
  const xFormatado = Number.isInteger(xVertice) ? String(xVertice) : fmtNum(xVertice);

  return {
    problemaId,
    respostaFinal: xFormatado,
    steps: [
      {
        ordem: 1,
        titulo: "Derivar",
        explicacao: "f'(x) = 0 nos pontos críticos.",
        calculo: `f'(x) = ${2 * d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}`,
      },
      {
        ordem: 2,
        titulo: "Igualar a zero",
        explicacao: "Como a > 0, o vértice é um mínimo.",
        calculo: `x = -${d.b}/(2·${d.a}) = ${xFormatado}`,
        resultado: xFormatado,
      },
    ],
  };
}

function solveGeometrica(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-geometrica" }>,
  problemaId: string,
): Solution {
  const xMax = d.perimetro / 4;
  const areaMax = xMax * (d.perimetro / 2 - xMax);

  return {
    problemaId,
    respostaFinal: String(xMax),
    steps: [
      {
        ordem: 1,
        titulo: "Modelar a área",
        explicacao: "Com perímetro P, lados x e (P/2 − x).",
        calculo: `A(x) = x(${d.perimetro}/2 − x) = −x² + ${d.perimetro / 2}x`,
      },
      {
        ordem: 2,
        titulo: "Derivar e igualar a zero",
        explicacao: "A'(x) = −2x + P/2 = 0.",
        calculo: `x = ${d.perimetro}/4 = ${xMax}`,
      },
      {
        ordem: 3,
        titulo: "Área máxima",
        explicacao: "Quadrado maximiza a área (x = P/4).",
        calculo: `A_max = ${areaMax} cm²`,
        resultado: String(xMax),
      },
    ],
  };
}

function solveCrescimento(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-crescimento" }>,
  problemaId: string,
): Solution {
  const delta = Math.sqrt(-d.a / 3);
  const resposta =
    d.a < 0
      ? `x < −${fmtNum(delta)} ou x > ${fmtNum(delta)}`
      : `todos os x ∈ ℝ`;

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Derivada",
        explicacao: "f cresce onde f'(x) > 0.",
        calculo: `f'(x) = 3x² ${d.a >= 0 ? "+" : "−"} ${Math.abs(d.a)}`,
      },
      {
        ordem: 2,
        titulo: "Resolver f' > 0",
        explicacao:
          d.a < 0
            ? "3x² > |a| → |x| > √(−a/3)."
            : "3x² + a > 0 para todo x (a > 0).",
        calculo: resposta,
        resultado: resposta,
      },
    ],
  };
}
