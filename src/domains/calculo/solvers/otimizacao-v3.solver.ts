import type { Solution } from "@/core/domain/problem";
import { fmtNum } from "../lib/format";
import type { OtimizacaoData } from "../entities/types";

export function solveOtimizacaoV3(
  d: OtimizacaoData,
  problemaId: string,
): Solution | null {
  switch (d.tipo) {
    case "otimizacao-cilindro":
      return solveCilindro(d, problemaId);
    case "otimizacao-caixa":
      return solveCaixa(d, problemaId);
    case "otimizacao-segunda-derivada":
      return solveSegundaDerivada(d, problemaId);
    case "otimizacao-esboco":
      return solveEsboço(d, problemaId);
    default:
      return null;
  }
}

function solveCilindro(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-cilindro" }>,
  problemaId: string,
): Solution {
  const r = Math.sqrt(d.area / (3 * Math.PI));
  const rNice = Math.round(r * 1000) / 1000;
  return {
    problemaId,
    respostaFinal: fmtNum(rNice),
    steps: [
      {
        ordem: 1,
        titulo: "Modelar",
        explicacao: "S = 2πr² + 2πrh fixo. Isolamos h e maximizamos V = πr²h.",
        calculo: `V(r) = r(${d.area}π − 2πr²)/(2)`,
      },
      {
        ordem: 2,
        titulo: "Otimizar",
        explicacao: "V'(r)=0 → r² = S/(3π).",
        calculo: `r = √(S/(3π)) = ${fmtNum(rNice)}`,
        resultado: fmtNum(rNice),
      },
    ],
  };
}

function solveCaixa(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-caixa" }>,
  problemaId: string,
): Solution {
  const x = d.lado / 6;
  return {
    problemaId,
    respostaFinal: String(x),
    steps: [
      {
        ordem: 1,
        titulo: "Volume",
        explicacao: "Cortes x nos cantos: V(x) = x(L−2x)².",
        calculo: `V(x) = x(${d.lado}−2x)²`,
      },
      {
        ordem: 2,
        titulo: "Derivar",
        explicacao: "V'(x)=0 dá x = L/6 no máximo.",
        calculo: `x = ${d.lado}/6 = ${x}`,
        resultado: String(x),
      },
    ],
  };
}

function solveSegundaDerivada(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-segunda-derivada" }>,
  problemaId: string,
): Solution {
  const fpp = 6 * d.x0 + 2 * d.b;
  const tipo = fpp > 0 ? "mínimo local" : "máximo local";
  return {
    problemaId,
    respostaFinal: tipo,
    steps: [
      {
        ordem: 1,
        titulo: "Crítico",
        explicacao: "f'(x)=3ax²+2bx. Em x₀ temos ponto crítico.",
        calculo: `x₀ = ${d.x0}`,
      },
      {
        ordem: 2,
        titulo: "f''(x₀)",
        explicacao: "f''(x)=6ax+2b.",
        calculo: `f''(${d.x0}) = ${fpp}`,
        resultado: tipo,
      },
    ],
  };
}

function solveEsboço(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-esboco" }>,
  problemaId: string,
): Solution {
  const delta = Math.sqrt(-d.a / 3);
  const resposta = `Críticos: x = ±${fmtNum(delta)}; cresce fora dos críticos; côncava para cima em x > 0`;

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "f'(x)=0",
        explicacao: "3x²+a=0.",
        calculo: `x = ±√(−a/3) = ±${fmtNum(delta)}`,
      },
      {
        ordem: 2,
        titulo: "Sinal de f'",
        explicacao: "Parábola 3x²+a abre para cima.",
        calculo: `f' > 0 fora dos críticos`,
      },
      {
        ordem: 3,
        titulo: "f''(x)=6x",
        explicacao: "Concavidade para cima em x > 0.",
        calculo: resposta,
        resultado: resposta,
      },
    ],
  };
}

export function solveConcavidadeFixed(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-concavidade" }>,
  problemaId: string,
): Solution {
  const finalAnswer = "x > 0";

  return {
    problemaId,
    respostaFinal: finalAnswer,
    steps: [
      {
        ordem: 1,
        titulo: "Segunda derivada",
        explicacao: "f''(x) = 6x para f(x)=x³+ax.",
        calculo: `f''(x) = 6x`,
      },
      {
        ordem: 2,
        titulo: "Resolver f'' > 0",
        explicacao: "6x > 0 → x > 0.",
        calculo: finalAnswer,
        resultado: finalAnswer,
      },
    ],
  };
}
