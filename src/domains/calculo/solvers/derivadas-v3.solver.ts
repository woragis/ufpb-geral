import type { Solution } from "@/core/domain/problem";
import { fmtNum, fmtX } from "../lib/format";
import type { DerivadasData } from "../entities/types";

export function solveDerivadasV3(
  d: DerivadasData,
  problemaId: string,
): Solution | null {
  switch (d.tipo) {
    case "derivadas-taxa-relacionada":
      return solveTaxa(d, problemaId);
    case "derivadas-implicita":
      return solveImplicita(d, problemaId);
    case "derivadas-aprox-linear":
      return solveAproxLinear(d, problemaId);
    case "derivadas-segunda-teste":
      return solveSegundaTeste(d, problemaId);
    case "derivadas-inversa-trig":
      return solveInversaTrig(d, problemaId);
    default:
      return null;
  }
}

function solveTaxa(
  d: Extract<DerivadasData, { tipo: "derivadas-taxa-relacionada" }>,
  problemaId: string,
): Solution {
  if (d.variante === "escada") {
    const L = d.p1;
    const x = d.p2;
    const dxdt = d.p3;
    const y = Math.sqrt(L * L - x * x);
    const dydt = Math.round((-(x / y) * dxdt) * 1000) / 1000;
    return {
      problemaId,
      respostaFinal: `${fmtNum(dydt)} m/s`,
      steps: [
        {
          ordem: 1,
          titulo: "Relacionar variáveis",
          explicacao: "Escada de comprimento L: x² + y² = L².",
          calculo: `L=${L}, x=${x}, y=√(L²−x²)=${fmtNum(y)}`,
        },
        {
          ordem: 2,
          titulo: "Derivar em relação ao tempo",
          explicacao: "2x(dx/dt) + 2y(dy/dt) = 0.",
          calculo: `dy/dt = −(x/y)(dx/dt)`,
        },
        {
          ordem: 3,
          titulo: "Substituir",
          explicacao: `dx/dt = ${dxdt} m/s.`,
          calculo: `dy/dt = −(${x}/${fmtNum(y)})·${dxdt} = ${fmtNum(dydt)} m/s`,
          resultado: `${fmtNum(dydt)} m/s`,
        },
      ],
    };
  }
  if (d.variante === "balao") {
    const r = d.p1;
    const drdt = d.p2;
    const dVdt = Math.round(4 * Math.PI * r * r * drdt * 1000) / 1000;
    return {
      problemaId,
      respostaFinal: `${fmtNum(dVdt)}π m³/s`,
      steps: [
        {
          ordem: 1,
          titulo: "Volume da esfera",
          explicacao: "V = (4/3)πr³.",
          calculo: `dV/dt = 4πr²(dr/dt)`,
        },
        {
          ordem: 2,
          titulo: "Substituir",
          explicacao: `r=${r}, dr/dt=${drdt}.`,
          calculo: `dV/dt = 4π·${r}²·${drdt} = ${fmtNum(4 * r * r * drdt)}π`,
          resultado: `${fmtNum(4 * r * r * drdt)}π m³/s`,
        },
      ],
    };
  }
  const H = d.p1;
  const h = d.p2;
  const dVdt = d.p3;
  const dhdt = Math.round(((4 * dVdt) / (h * h)) * 1000) / 1000;
  return {
    problemaId,
    respostaFinal: `${fmtNum(dhdt)} m/s`,
    steps: [
      {
        ordem: 1,
        titulo: "Modelo do cone",
        explicacao: "V = (π/3)(Rh/H)²h com R=H no cone equilátero simplificado.",
        calculo: `dV/dt = (πh²/4)(dh/dt) para R=3, H=6`,
      },
      {
        ordem: 2,
        titulo: "Resolver",
        explicacao: `h=${h}, dV/dt=${dVdt}π.`,
        calculo: `dh/dt = ${fmtNum(dhdt)} m/s`,
        resultado: `${fmtNum(dhdt)} m/s`,
      },
    ],
  };
}

function solveImplicita(
  d: Extract<DerivadasData, { tipo: "derivadas-implicita" }>,
  problemaId: string,
): Solution {
  const dydx = Math.round((-d.x0 / d.y0) * 1000) / 1000;
  return {
    problemaId,
    respostaFinal: fmtNum(dydx),
    steps: [
      {
        ordem: 1,
        titulo: "Derivar implicitamente",
        explicacao: "x² + y² = r² → 2x + 2y(dy/dx) = 0.",
        calculo: `dy/dx = −x/y`,
      },
      {
        ordem: 2,
        titulo: "No ponto",
        explicacao: `(${d.x0}, ${d.y0}) no círculo x²+y²=${d.r}².`,
        calculo: `dy/dx = −${d.x0}/${d.y0} = ${fmtNum(dydx)}`,
        resultado: fmtNum(dydx),
      },
    ],
  };
}

function solveAproxLinear(
  d: Extract<DerivadasData, { tipo: "derivadas-aprox-linear" }>,
  problemaId: string,
): Solution {
  const fx0 = d.a * Math.pow(d.x0, d.n);
  const fpx0 = d.a * d.n * Math.pow(d.x0, d.n - 1);
  const approx = Math.round((fx0 + fpx0 * d.dx) * 1000) / 1000;
  return {
    problemaId,
    respostaFinal: fmtNum(approx),
    steps: [
      {
        ordem: 1,
        titulo: "Linearização",
        explicacao: "L(x) = f(x₀) + f'(x₀)(x − x₀).",
        calculo: `f(${d.x0})=${fx0}, f'(${d.x0})=${fpx0}`,
      },
      {
        ordem: 2,
        titulo: "Aproximar",
        explicacao: `f(${fmtNum(d.x0 + d.dx)}) ≈ L(${fmtNum(d.x0 + d.dx)}).`,
        calculo: `${fx0} + ${fpx0}·${d.dx} = ${fmtNum(approx)}`,
        resultado: fmtNum(approx),
      },
    ],
  };
}

function solveSegundaTeste(
  d: Extract<DerivadasData, { tipo: "derivadas-segunda-teste" }>,
  problemaId: string,
): Solution {
  const fpp = 6 * d.x0;
  const tipo = fpp > 0 ? "mínimo local" : fpp < 0 ? "máximo local" : "inconclusivo";
  return {
    problemaId,
    respostaFinal: tipo,
    steps: [
      {
        ordem: 1,
        titulo: "Primeira derivada",
        explicacao: "f'(x)=3x²+a. Em x₀ o ponto é crítico.",
        calculo: `f'(${d.x0}) = 0`,
      },
      {
        ordem: 2,
        titulo: "Segunda derivada",
        explicacao: "f''(x)=6x.",
        calculo: `f''(${d.x0}) = ${fpp}`,
      },
      {
        ordem: 3,
        titulo: "Classificar",
        explicacao: fpp > 0 ? "f''>0 → côncava para cima → mínimo." : "f''<0 → máximo.",
        calculo: tipo,
        resultado: tipo,
      },
    ],
  };
}

function solveInversaTrig(
  d: Extract<DerivadasData, { tipo: "derivadas-inversa-trig" }>,
  problemaId: string,
): Solution {
  const valor =
    d.funcao === "arctan"
      ? 1 / (1 + d.x0 * d.x0)
      : 1 / Math.sqrt(1 - d.x0 * d.x0);
  const resposta = fmtNum(Math.round(valor * 1000) / 1000);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Derivada conhecida",
        explicacao:
          d.funcao === "arctan"
            ? "(arctg x)' = 1/(1+x²)"
            : "(arcsen x)' = 1/√(1−x²)",
        calculo: `f'(${fmtX(d.x0)})`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Substituímos o ponto.",
        calculo: `= ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}
