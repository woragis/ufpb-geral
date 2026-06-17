import type { Problem, Solution, Step } from "@/core/domain/problem";
import { frac, lim, num, signed, text } from "@/core/presentation/math/latex-helpers";
import type { LimitesData } from "@/domains/calculo/entities/types";
import { fmtNum, fmtPoly } from "@/domains/calculo/lib/format";

function dados<T>(p: Problem): T {
  return p.dados as T;
}

function isLimitesTipo(tipo: string | undefined): boolean {
  return Boolean(tipo?.startsWith("limite-"));
}

export function limitesEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as LimitesData;
  if (!isLimitesTipo(d.tipo)) return undefined;

  const intro = `${text("Calcule ")}`;

  switch (d.tipo) {
    case "limite-algebrico":
      return `${intro}${lim(
        d.a,
        frac(`${num(d.coeficiente)}x^2 ${signed(-d.constante)}`, `x ${signed(-d.a)}`),
      )}.`;
    case "limite-trig":
      switch (d.variante) {
        case "sin-x":
          return `${intro}${lim(0, frac("\\sin x", "x"))}.`;
        case "sin-ax":
          return `${intro}${lim(
            0,
            frac(`\\sin(${num(d.a)}x)`, `${num(d.b ?? 1)}x`),
          )}.`;
        case "tan-x":
          return `${intro}${lim(0, frac("\\tan x", "x"))}.`;
        case "um-menos-cos":
          return `${intro}${lim(0, frac("1 - \\cos x", "x^2"))}.`;
      }
      break;
    case "limite-racional": {
      const sum = d.r1 + d.r2;
      const prod = d.r1 * d.r2;
      return `${intro}${lim(
        d.a,
        frac(`x^2 ${signed(-sum)}x ${signed(prod)}`, `x ${signed(-d.a)}`),
      )}.`;
    }
    case "limite-radical":
      return `${intro}${lim(
        0,
        frac(`\\sqrt{x + ${num(d.k)}} - \\sqrt{${num(d.k)}}`, "x"),
      )}.`;
    case "limite-infinito":
      return `${intro}${lim(
        "\\infty",
        frac(
          `${num(d.numA)}x^2 ${signed(d.numB)}`,
          `${num(d.denA)}x^2 ${signed(d.denB)}`,
        ),
      )}.`;
    case "limite-infinito-neg":
      return `${intro}${lim(
        "-\\infty",
        frac(
          `${num(d.numA)}x^2 ${signed(d.numB)}`,
          `${num(d.denA)}x^2 ${signed(d.denB)}`,
        ),
      )}.`;
    case "limite-exp-log":
      return d.variante === "exp-x"
        ? `${intro}${lim(0, frac("e^x - 1", "x"))}.`
        : `${intro}${lim(0, frac("\\ln(1 + x)", "x"))}.`;
    case "limite-lhopital":
      return d.variante === "exp-menos-x"
        ? `${intro}${lim(0, frac("e^x - 1 - x", "x^2"))}. ${text("Use L'Hôpital.")}`
        : `${intro}${lim(0, frac("\\sin x - x", "x^3"))}. ${text("Use L'Hôpital.")}`;
    case "limite-substituicao":
      return `${intro}${lim(d.a, fmtPolyLatex(d.coeficientes, d.expoentes))}.`;
  }
  return undefined;
}

function fmtPolyLatex(coefs: number[], exps: number[]): string {
  return fmtPoly(coefs, exps)
    .replace(/\^(\d+)/g, "^{$1}")
    .replace(/(\d)x/g, "$1x");
}

export function limitesRespostaFinal(
  problem: Problem,
  solution: Solution,
): string | undefined {
  const d = problem.dados as LimitesData;
  if (!isLimitesTipo(d.tipo)) return undefined;

  switch (d.tipo) {
    case "limite-algebrico":
      return num(2 * d.coeficiente * d.a);
    case "limite-trig":
      switch (d.variante) {
        case "sin-x":
        case "tan-x":
          return num(1);
        case "sin-ax": {
          const res = d.a / (d.b ?? 1);
          return Number.isInteger(res) ? num(res) : num(res);
        }
        case "um-menos-cos":
          return num(0.5);
      }
      break;
    case "limite-racional":
      return num(d.r1 + d.r2);
    case "limite-radical": {
      const res = Math.round((1 / (2 * Math.sqrt(d.k))) * 1000) / 1000;
      return num(res);
    }
    case "limite-infinito":
    case "limite-infinito-neg": {
      const res = Math.round((d.numA / d.denA) * 1000) / 1000;
      return num(res);
    }
    case "limite-exp-log":
      return num(1);
    case "limite-lhopital":
      return d.variante === "exp-menos-x" ? num(0.5) : frac("-1", "6");
    case "limite-substituicao": {
      const valor = d.coeficientes.reduce(
        (acc, c, i) => acc + c * Math.pow(d.a, d.expoentes[i]!),
        0,
      );
      return num(valor);
    }
  }

  return solution.respostaFinal;
}

export function limitesStepCalculo(problem: Problem, step: Step): string | undefined {
  const d = problem.dados as LimitesData;
  if (!isLimitesTipo(d.tipo)) return undefined;

  switch (d.tipo) {
    case "limite-algebrico":
      return stepCalculoAlgebrico(d, step);
    case "limite-trig":
      return stepCalculoTrig(d, step);
    case "limite-racional":
      return stepCalculoRacional(d, step);
    case "limite-radical":
      return stepCalculoRadical(d, step);
    case "limite-infinito":
    case "limite-infinito-neg":
      return stepCalculoInfinito(d, step);
    case "limite-exp-log":
      return stepCalculoExpLog(d, step);
    case "limite-lhopital":
      return stepCalculoLhopital(d, step);
    case "limite-substituicao":
      return stepCalculoSubstituicao(d, step);
  }
  return undefined;
}

function stepCalculoAlgebrico(
  x: Extract<LimitesData, { tipo: "limite-algebrico" }>,
  step: Step,
): string | undefined {
  const res = 2 * x.coeficiente * x.a;
  if (step.ordem === 1) {
    return `x = ${num(x.a)} \\Rightarrow ${frac("0", "0")}`;
  }
  if (step.ordem === 2) {
    return `${num(x.coeficiente)}x^2 ${signed(-x.constante)} = ${num(x.coeficiente)}(x ${signed(-x.a)})(x ${signed(x.a)})`;
  }
  if (step.ordem === 3) {
    return `${frac(`${num(x.coeficiente)}(x ${signed(-x.a)})(x ${signed(x.a)})`, `x ${signed(-x.a)}`)} = ${num(x.coeficiente)}(x ${signed(x.a)})`;
  }
  if (step.ordem === 4) {
    return `${lim(x.a, `${num(x.coeficiente)}(x ${signed(x.a)})`)} = ${num(res)}`;
  }
  return undefined;
}

function stepCalculoTrig(
  d: Extract<LimitesData, { tipo: "limite-trig" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) {
    return `${text("Substituição direta: ")}${frac("0", "0")}${text(" ou limite fundamental.")}`;
  }

  if (step.ordem === 2) {
    switch (d.variante) {
      case "sin-x":
        return `${lim(0, frac("\\sin x", "x"))} = 1`;
      case "sin-ax": {
        const b = d.b ?? 1;
        return `${frac(`\\sin(${num(d.a)}x)`, `${num(b)}x`)} = ${frac(num(d.a), num(b))} \\cdot ${frac(`\\sin(${num(d.a)}x)`, `${num(d.a)}x`)} \\to ${frac(num(d.a), num(b))}`;
      }
      case "tan-x":
        return `${frac("\\tan x", "x")} = ${frac("\\sin x", "x \\cos x")} \\to ${frac("1", "1")} = 1`;
      case "um-menos-cos":
        return `${lim(0, frac("1 - \\cos x", "x^2"))} = ${frac("1", "2")}`;
    }
  }

  if (step.ordem === 3) {
    const res =
      d.variante === "sin-x" || d.variante === "tan-x"
        ? 1
        : d.variante === "um-menos-cos"
          ? 0.5
          : d.a / (d.b ?? 1);
    return `= ${fmtNum(res)}`;
  }
  return undefined;
}

function stepCalculoRacional(
  d: Extract<LimitesData, { tipo: "limite-racional" }>,
  step: Step,
): string | undefined {
  const sum = d.r1 + d.r2;
  const prod = d.r1 * d.r2;
  const res = d.r1 + d.r2;
  if (step.ordem === 1) return `x = ${num(d.a)} \\Rightarrow ${frac("0", "0")}`;
  if (step.ordem === 2) {
    return `x^2 ${signed(-sum)}x ${signed(prod)} = (x ${signed(-d.r1)})(x ${signed(-d.r2)})`;
  }
  if (step.ordem === 3) {
    return `\\to x ${signed(-d.r2)} \\xrightarrow{x \\to ${num(d.a)}} ${num(res)}`;
  }
  return undefined;
}

function stepCalculoRadical(
  d: Extract<LimitesData, { tipo: "limite-radical" }>,
  step: Step,
): string | undefined {
  const res = Math.round((1 / (2 * Math.sqrt(d.k))) * 1000) / 1000;
  if (step.ordem === 1) return frac("0", "0");
  if (step.ordem === 2) {
    return `\\frac{(\\sqrt{x+${num(d.k)}}-\\sqrt{${num(d.k)}})(\\sqrt{x+${num(d.k)}}+\\sqrt{${num(d.k)}})}{x(\\sqrt{x+${num(d.k)}}+\\sqrt{${num(d.k)}})} = \\frac{x}{x(\\sqrt{x+${num(d.k)}}+\\sqrt{${num(d.k)}})}`;
  }
  if (step.ordem === 3) {
    return `\\frac{1}{\\sqrt{x+${num(d.k)}}+\\sqrt{${num(d.k)}}}`;
  }
  if (step.ordem === 4) {
    return `\\xrightarrow{x \\to 0} \\frac{1}{2\\sqrt{${num(d.k)}}} = ${num(res)}`;
  }
  return undefined;
}

function stepCalculoInfinito(
  d: Extract<LimitesData, { tipo: "limite-infinito" | "limite-infinito-neg" }>,
  step: Step,
): string | undefined {
  const res = Math.round((d.numA / d.denA) * 1000) / 1000;
  const x0 = d.tipo === "limite-infinito-neg" ? "-\\infty" : "\\infty";
  if (step.ordem === 1) return `${frac("\\infty", "\\infty")}`;
  if (step.ordem === 2) {
    return `${lim(
      x0,
      frac(
        `${num(d.numA)} + ${num(d.numB)}/x^2`,
        `${num(d.denA)} + ${num(d.denB)}/x^2`,
      ),
    )}`;
  }
  if (step.ordem === 3) return `${frac(num(d.numA), num(d.denA))} = ${num(res)}`;
  return undefined;
}

function stepCalculoExpLog(
  d: Extract<LimitesData, { tipo: "limite-exp-log" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return frac("0", "0");
  if (step.ordem === 2) {
    return d.variante === "exp-x"
      ? `${lim(0, frac("e^x - 1", "x"))} = 1`
      : `${lim(0, frac("\\ln(1+x)", "x"))} = 1`;
  }
  if (step.ordem === 3) return "= 1";
  return undefined;
}

function stepCalculoLhopital(
  d: Extract<LimitesData, { tipo: "limite-lhopital" }>,
  step: Step,
): string | undefined {
  if (d.variante === "exp-menos-x") {
    if (step.ordem === 1) return frac("0", "0");
    if (step.ordem === 2) {
      return `${lim(0, frac("e^x - 1", "2x"))} = ${frac("0", "0")}`;
    }
    if (step.ordem === 3) {
      return `${lim(0, frac("e^x", "2"))} = ${frac("1", "2")}`;
    }
    return undefined;
  }

  if (step.ordem === 1) return frac("0", "0");
  if (step.ordem === 2) {
    return `${lim(0, frac("\\cos x - 1", "3x^2"))} = ${frac("0", "0")}`;
  }
  if (step.ordem === 3) {
    return `${lim(0, frac("-\\sin x", "6x"))} = ${frac("-1", "6")}`;
  }
  return undefined;
}

function stepCalculoSubstituicao(
  d: Extract<LimitesData, { tipo: "limite-substituicao" }>,
  step: Step,
): string | undefined {
  const valor = d.coeficientes.reduce(
    (acc, c, i) => acc + c * Math.pow(d.a, d.expoentes[i]!),
    0,
  );
  if (step.ordem === 1) {
    return `f(x) = ${fmtPolyLatex(d.coeficientes, d.expoentes)}`;
  }
  if (step.ordem === 2) {
    return `f(${num(d.a)}) = ${num(valor)}`;
  }
  return undefined;
}

export function limitesStepExplicacao(problem: Problem, step: Step): string | undefined {
  const d = problem.dados as LimitesData;
  if (!isLimitesTipo(d.tipo)) return undefined;

  if (d.tipo === "limite-algebrico") {
    const x = dados<Extract<LimitesData, { tipo: "limite-algebrico" }>>(problem);
    if (step.ordem === 1) {
      return `Substituímos $x = ${num(x.a)}$ e obtemos a forma indeterminada $\\frac{0}{0}$.`;
    }
    if (step.ordem === 2) {
      return `Fatoramos ${num(x.coeficiente)}x^2 ${signed(-x.constante)} usando diferença de quadrados.`;
    }
  }

  if (d.tipo === "limite-trig" && step.ordem === 2) {
    switch (d.variante) {
      case "sin-x":
        return text("Limite fundamental: ") + `${lim(0, frac("\\sin x", "x"))} = 1.`;
      case "sin-ax":
        return text("Reescrevemos a fração para isolar o limite fundamental.");
      case "tan-x":
        return text("Usamos ") + `\\tan x = ${frac("\\sin x", "\\cos x")}` + text(" e os limites de sin e cos em zero.");
      case "um-menos-cos":
        return text("Limite clássico obtido por identidade trigonométrica ou série.");
    }
  }

  if (d.tipo === "limite-exp-log" && step.ordem === 2) {
    return d.variante === "exp-x"
      ? text("Este limite define a derivada de ") + "e^x" + text(" em zero.")
      : text("Limite padrão do logaritmo natural em zero.");
  }

  if (d.tipo === "limite-lhopital") {
    if (step.ordem === 2) {
      return text("Derivamos numerador e denominador separadamente (regra de L'Hôpital).");
    }
    if (step.ordem === 3) {
      return text("Aplicamos L'Hôpital novamente ou usamos série de Taylor até obter o valor.");
    }
  }

  return undefined;
}
