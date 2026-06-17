import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { fmtNum } from "../lib/format";
import { TOPICO_DERIVADAS, type DerivadasData } from "../entities/types";

export const derivadasSolver: ProblemSolver = {
  topicoId: TOPICO_DERIVADAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as DerivadasData;
    switch (d.tipo) {
      case "derivadas-polinomio":
        return solvePolinomio(d, problema.id);
      case "derivadas-trig":
        return solveTrig(d, problema.id);
      case "derivadas-exp-log":
        return solveExpLog(d, problema.id);
      case "derivadas-produto":
        return solveProduto(d, problema.id);
      case "derivadas-quociente":
        return solveQuociente(d, problema.id);
      case "derivadas-tangente":
        return solveTangente(d, problema.id);
      case "derivadas-definicao":
        return solveDefinicao(d, problema.id);
      default:
        throw new Error("Tipo de derivada desconhecido");
    }
  },
};

function solvePolinomio(
  d: Extract<DerivadasData, { tipo: "derivadas-polinomio" }>,
  problemaId: string,
): Solution {
  const derivTermos = d.coeficientes.map((c, i) => {
    const n = d.expoentes[i]!;
    if (n === 0) return { texto: "0" };
    const newCoef = c * n;
    const newExp = n - 1;
    if (newExp === 0) return { texto: String(newCoef) };
    return { texto: `${newCoef}x^${newExp}` };
  });

  const fLinha = derivTermos.map((t) => t.texto).join(" + ");
  const valor = d.coeficientes.reduce((acc, c, i) => {
    const n = d.expoentes[i]!;
    if (n === 0) return acc;
    return acc + c * n * Math.pow(d.x0, n - 1);
  }, 0);

  return {
    problemaId,
    respostaFinal: String(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Derivar termo a termo",
        explicacao: "Regra da potência: (cxⁿ)' = cnxⁿ⁻¹.",
        calculo: `f'(x) = ${fLinha}`,
      },
      {
        ordem: 2,
        titulo: "Substituir x",
        explicacao: `f'(${d.x0}) = ${valor}`,
        calculo: `f'(${d.x0}) = ${valor}`,
        resultado: String(valor),
      },
    ],
  };
}

function evalTrigDeriv(
  funcao: "sin" | "cos" | "tan",
  k: number,
  b: number,
  x: number,
): number {
  const arg = k * x + b;
  switch (funcao) {
    case "sin":
      return k * Math.cos(arg);
    case "cos":
      return -k * Math.sin(arg);
    case "tan": {
      const cos = Math.cos(arg);
      return k / (cos * cos);
    }
  }
}

function trigDerivRule(funcao: "sin" | "cos" | "tan", k: number, b: number): string {
  const inner = k === 1 && b === 0 ? "x" : `${k}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)}`;
  switch (funcao) {
    case "sin":
      return `${k}cos(${inner})`;
    case "cos":
      return `−${k}sin(${inner})`;
    case "tan":
      return `${k}/cos²(${inner})`;
  }
}

function solveTrig(
  d: Extract<DerivadasData, { tipo: "derivadas-trig" }>,
  problemaId: string,
): Solution {
  const valor = Math.round(evalTrigDeriv(d.funcao, d.k, d.b, d.x0) * 1000) / 1000;
  const resposta = fmtNum(valor);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Aplicar regra de derivação",
        explicacao:
          d.funcao === "sin"
            ? "(sin u)' = cos(u)·u'"
            : d.funcao === "cos"
              ? "(cos u)' = −sin(u)·u'"
              : "(tg u)' = sec²(u)·u'",
        calculo: `f'(x) = ${trigDerivRule(d.funcao, d.k, d.b)}`,
      },
      {
        ordem: 2,
        titulo: "Avaliar no ponto",
        explicacao: `Substituímos x = ${d.x0}.`,
        calculo: `f'(${d.x0}) = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveExpLog(
  d: Extract<DerivadasData, { tipo: "derivadas-exp-log" }>,
  problemaId: string,
): Solution {
  const valor =
    d.funcao === "exp"
      ? d.k * Math.exp(d.k * d.x0)
      : d.k / (d.k * d.x0);
  const resposta = fmtNum(Math.round(valor * 1000) / 1000);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Derivar",
        explicacao:
          d.funcao === "exp"
            ? "(e^(kx))' = k·e^(kx)"
            : "(ln(kx))' = 1/x",
        calculo:
          d.funcao === "exp"
            ? `f'(x) = ${d.k}e^(${d.k}x)`
            : `f'(x) = 1/x`,
      },
      {
        ordem: 2,
        titulo: "Avaliar",
        explicacao: `f'(${d.x0}) = ${resposta}`,
        calculo: `f'(${d.x0}) = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveProduto(
  d: Extract<DerivadasData, { tipo: "derivadas-produto" }>,
  problemaId: string,
): Solution {
  const u = (x: number) => d.a * Math.pow(x, d.n);
  const v = (x: number) => d.b * Math.pow(x, d.m) + d.c;
  const uP = (x: number) => d.a * d.n * Math.pow(x, d.n - 1);
  const vP = () => d.b * d.m;
  const valor = Math.round((uP(d.x0) * v(d.x0) + u(d.x0) * vP()) * 1000) / 1000;

  return {
    problemaId,
    respostaFinal: fmtNum(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Identificar fatores",
        explicacao: "f(x) = u(x)·v(x).",
        calculo: `u = ${d.a}x^${d.n}, v = ${d.b}x ${d.c >= 0 ? "+" : "−"} ${Math.abs(d.c)}`,
      },
      {
        ordem: 2,
        titulo: "Regra do produto",
        explicacao: "f' = u'v + uv'.",
        calculo: `u' = ${d.a * d.n}x^${d.n - 1}, v' = ${d.b}`,
      },
      {
        ordem: 3,
        titulo: "Avaliar",
        explicacao: `f'(${d.x0}) = ${valor}`,
        calculo: `f'(${d.x0}) = ${valor}`,
        resultado: fmtNum(valor),
      },
    ],
  };
}

function solveQuociente(
  d: Extract<DerivadasData, { tipo: "derivadas-quociente" }>,
  problemaId: string,
): Solution {
  const x = d.x0;
  const num = d.n * Math.pow(x, d.n - 1) * (x + d.c) - Math.pow(x, d.n);
  const den = (x + d.c) ** 2;
  const valor = Math.round((num / den) * 1000) / 1000;

  return {
    problemaId,
    respostaFinal: fmtNum(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Regra do quociente",
        explicacao: "f = u/v, f' = (u'v − uv')/v².",
        calculo: `u = x^${d.n}, v = x + ${d.c}`,
      },
      {
        ordem: 2,
        titulo: "Derivadas",
        explicacao: "u' = nx^(n−1), v' = 1.",
        calculo: `f'(x) = (${d.n}x^${d.n - 1}(x+${d.c}) − x^${d.n})/(x+${d.c})²`,
      },
      {
        ordem: 3,
        titulo: "Avaliar",
        explicacao: `f'(${d.x0}) = ${valor}`,
        calculo: `f'(${d.x0}) = ${valor}`,
        resultado: fmtNum(valor),
      },
    ],
  };
}

function solveTangente(
  d: Extract<DerivadasData, { tipo: "derivadas-tangente" }>,
  problemaId: string,
): Solution {
  const y0 = d.a * Math.pow(d.x0, d.n);
  const m = d.a * d.n * Math.pow(d.x0, d.n - 1);
  const b = y0 - m * d.x0;
  const eq = `y = ${fmtNum(m)}x ${b >= 0 ? "+" : "−"} ${fmtNum(Math.abs(b))}`;

  return {
    problemaId,
    respostaFinal: eq,
    steps: [
      {
        ordem: 1,
        titulo: "Ponto na curva",
        explicacao: `f(${d.x0}) = ${y0}.`,
        calculo: `P = (${d.x0}, ${y0})`,
      },
      {
        ordem: 2,
        titulo: "Inclinação",
        explicacao: "m = f'(x₀).",
        calculo: `f'(x) = ${d.a * d.n}x^${d.n - 1} → m = ${m}`,
      },
      {
        ordem: 3,
        titulo: "Equação da reta",
        explicacao: "y − y₀ = m(x − x₀).",
        calculo: eq,
        resultado: eq,
      },
    ],
  };
}

function solveDefinicao(
  d: Extract<DerivadasData, { tipo: "derivadas-definicao" }>,
  problemaId: string,
): Solution {
  const valor = d.a * d.n * Math.pow(d.x0, d.n - 1);

  return {
    problemaId,
    respostaFinal: String(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Definição",
        explicacao: "f'(x₀) = lim(h→0) [f(x₀+h) − f(x₀)]/h.",
        calculo: `f(x) = ${d.a}x^${d.n}`,
      },
      {
        ordem: 2,
        titulo: "Expandir",
        explicacao: "Desenvolvemos (x₀+h)^n e cancelamos termos.",
        calculo: `→ ${d.a * d.n}x₀^${d.n - 1} (após simplificar h)`,
      },
      {
        ordem: 3,
        titulo: "Resultado",
        explicacao: `f'(${d.x0}) = ${valor}`,
        calculo: `f'(${d.x0}) = ${valor}`,
        resultado: String(valor),
      },
    ],
  };
}
