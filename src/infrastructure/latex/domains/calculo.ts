import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import {
  frac,
  integral,
  integralIndef,
  lim,
  num,
  piecewise,
  polyLatex,
  signed,
  text,
} from "@/core/presentation/math/latex-helpers";
import type {
  AreaData,
  ContinuidadeData,
  DerivadasData,
  EdosData,
  IntegraisDefinidasData,
  IntegraisIndefinidasData,
  LimitesData,
  OtimizacaoData,
  RegraCadeiaData,
  SequenciasData,
  SeriesData,
  TaylorData,
} from "@/domains/calculo/entities/types";

function isCalculo(p: Problem): boolean {
  return p.disciplinaId === "calculo";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
}

export const enrichCalculoLatex: DomainLatexEnricher = {
  matches: isCalculo,

  enunciado(problem) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "limite-algebrico": {
        const x = dados<LimitesData>(problem);
        return `Calcule ${lim(x.a, frac(`${num(x.coeficiente)}x^2 ${signed(-x.constante)}`, `x ${signed(-x.a)}`))}.`;
      }
      case "continuidade": {
        const x = dados<ContinuidadeData>(problem);
        return `A função abaixo é contínua em $x = ${num(x.a)}$? ${piecewise([
          { expr: `${num(x.m1)}x ${signed(x.b1)}`, cond: `x < ${num(x.a)}` },
          { expr: `${num(x.m2)}x ${signed(x.b2)}`, cond: `x \\geq ${num(x.a)}` },
        ])}`;
      }
      case "derivadas": {
        const x = dados<DerivadasData>(problem);
        return `Dada $f(x) = ${polyLatex(x.coeficientes, x.expoentes)}$, calcule $f'(${num(x.x0)})$.`;
      }
      case "regra-cadeia": {
        const x = dados<RegraCadeiaData>(problem);
        return `Seja $h(x) = (${num(x.a)}x ${signed(x.b)})^{${num(x.n)}}$. Calcule $h'(${num(x.x0)})$.`;
      }
      case "otimizacao": {
        const x = dados<OtimizacaoData>(problem);
        return `Encontre o $x$ que minimiza $f(x) = ${num(x.a)}x^2 ${signed(x.b)}x ${signed(x.c)}$.`;
      }
      case "integrais-indefinidas": {
        const x = dados<IntegraisIndefinidasData>(problem);
        return `Calcule ${integralIndef(`x^{${num(x.n)}}`)}.`;
      }
      case "integrais-definidas": {
        const x = dados<IntegraisDefinidasData>(problem);
        return `Calcule ${integral(x.a, x.b, `${num(x.c)}x ${signed(x.d)}`)}.`;
      }
      case "area": {
        const x = dados<AreaData>(problem);
        return `Calcule a área sob $f(x) = ${num(x.m)}x ${signed(x.b)}$ entre $x = ${num(x.a)}$ e $x = ${num(x.c)}$.`;
      }
      case "sequencias": {
        const x = dados<SequenciasData>(problem);
        return `Calcule $\\displaystyle\\lim_{n \\to \\infty} \\frac{${num(x.numeradorCoef)}n ${signed(x.numeradorConst)}}{${num(x.denominadorCoef)}n ${signed(x.denominadorConst)}}$.`;
      }
      case "series": {
        const x = dados<SeriesData>(problem);
        if (Math.abs(x.r) < 1) {
          return `Calcule a soma da série geométrica infinita com $a_1 = ${num(x.a1)}$ e $r = ${num(x.r)}$.`;
        }
        return `Calcule $S_{${num(x.n)}}$ da série geométrica com $a_1 = ${num(x.a1)}$ e $r = ${num(x.r)}$.`;
      }
      case "taylor": {
        const x = dados<TaylorData>(problem);
        const fn = x.funcao === "exponencial" ? "e^x" : "\\sin(x)";
        return `Escreva o polinômio de Taylor de $${fn}$ de grau ${num(x.grau)} em torno de $x = ${num(x.x0)}$.`;
      }
      case "edos": {
        const x = dados<EdosData>(problem);
        return `Resolva $\\dfrac{dy}{dx} = ${num(x.k)}y$ com $y(0) = ${num(x.y0)}$ e calcule $y(${num(x.x)})$.`;
      }
      default:
        return undefined;
    }
  },

  respostaFinal(problem, solution) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "limite-algebrico": {
        const x = dados<LimitesData>(problem);
        return num(2 * x.coeficiente * x.a);
      }
      case "continuidade": {
        const x = dados<ContinuidadeData>(problem);
        return x.continua ? text("Sim") : text("Não");
      }
      case "otimizacao": {
        const x = dados<OtimizacaoData>(problem);
        const xv = -x.b / (2 * x.a);
        return num(xv);
      }
      case "integrais-indefinidas": {
        const x = dados<IntegraisIndefinidasData>(problem);
        return `\\frac{x^{${num(x.n + 1)}}}{${num(x.n + 1)}} + C`;
      }
      case "taylor": {
        const x = dados<TaylorData>(problem);
        if (x.funcao === "exponencial") {
          return x.grau === 1 ? "1 + x" : "1 + x + \\frac{x^2}{2}";
        }
        return x.grau === 1 ? "x" : "x - \\frac{x^3}{6}";
      }
      case "edos": {
        const x = dados<EdosData>(problem);
        return num(x.y0 * Math.exp(x.k * x.x));
      }
      default:
        return solution.respostaFinal;
    }
  },

  stepCalculo(problem, step) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "limite-algebrico": {
        const x = dados<LimitesData>(problem);
        const res = 2 * x.coeficiente * x.a;
        if (step.ordem === 1) {
          return `x = ${num(x.a)} \\Rightarrow ${frac(`${num(x.coeficiente)} \\cdot ${num(x.a)}^2 ${signed(-x.constante)}`, `${num(x.a)} ${signed(-x.a)}`)} = ${frac("0", "0")}`;
        }
        if (step.ordem === 2) {
          return `${num(x.coeficiente)}x^2 ${signed(-x.constante)} = ${num(x.coeficiente)}(x ${signed(-x.a)})(x ${signed(x.a)})`;
        }
        if (step.ordem === 3) {
          return `${frac(`${num(x.coeficiente)}(x ${signed(-x.a)})(x ${signed(x.a)})`, `x ${signed(-x.a)}`)} = ${num(x.coeficiente)}(x ${signed(x.a)})`;
        }
        if (step.ordem === 4) {
          return `${lim(x.a, `${num(x.coeficiente)}(x ${signed(x.a)})`)} = ${num(x.coeficiente)}(${num(x.a)} ${signed(x.a)}) = ${num(res)}`;
        }
        break;
      }
      case "derivadas": {
        const x = dados<DerivadasData>(problem);
        if (step.ordem === 1) {
          const derivTerms = x.coeficientes.map((c, i) => {
            const n = x.expoentes[i]!;
            if (n === 0) return "0";
            const nc = c * n;
            if (n - 1 === 0) return num(nc);
            return `${num(nc)}x^{${n - 1}}`;
          });
          return `f'(x) = ${derivTerms.join(" + ").replace(/\+ -/g, "- ")}`;
        }
        if (step.ordem === 2) {
          const val = x.coeficientes.reduce(
            (acc, c, i) =>
              acc + c * x.expoentes[i]! * Math.pow(x.x0, x.expoentes[i]! - 1),
            0,
          );
          return `f'(${num(x.x0)}) = ${num(val)}`;
        }
        break;
      }
      case "regra-cadeia": {
        const x = dados<RegraCadeiaData>(problem);
        const gx = x.a * x.x0 + x.b;
        const res = x.n * Math.pow(gx, x.n - 1) * x.a;
        if (step.ordem === 1) {
          return `f(u) = u^{${num(x.n)}},\\quad g(x) = ${num(x.a)}x ${signed(x.b)}`;
        }
        if (step.ordem === 2) {
          return `h'(x) = ${num(x.n)}(${num(x.a)}x ${signed(x.b)})^{${num(x.n - 1)}} \\cdot ${num(x.a)}`;
        }
        if (step.ordem === 3) {
          return `h'(${num(x.x0)}) = ${num(x.n)} \\cdot ${num(gx)}^{${num(x.n - 1)}} \\cdot ${num(x.a)} = ${num(res)}`;
        }
        break;
      }
      case "integrais-definidas": {
        const x = dados<IntegraisDefinidasData>(problem);
        const Fb = (x.c * x.b * x.b) / 2 + x.d * x.b;
        const Fa = (x.c * x.a * x.a) / 2 + x.d * x.a;
        if (step.ordem === 1) return `F(x) = ${frac(`${num(x.c)}x^2`, "2")} ${signed(x.d)}x`;
        if (step.ordem === 2) {
          return `F(${num(x.b)}) - F(${num(x.a)}) = ${num(Fb)} - ${num(Fa)} = ${num(Fb - Fa)}`;
        }
        break;
      }
      case "sequencias": {
        const x = dados<SequenciasData>(problem);
        const res = x.numeradorCoef / x.denominadorCoef;
        if (step.ordem === 1) {
          return `a_n = ${frac(`${num(x.numeradorCoef)}n ${signed(x.numeradorConst)}`, `${num(x.denominadorCoef)}n ${signed(x.denominadorConst)}`)}`;
        }
        if (step.ordem === 2) {
          return `\\lim_{n \\to \\infty} a_n = ${frac(num(x.numeradorCoef), num(x.denominadorCoef))} = ${num(res)}`;
        }
        break;
      }
      case "series": {
        const x = dados<SeriesData>(problem);
        if (Math.abs(x.r) < 1) {
          if (step.ordem === 1) return `S = ${frac("a_1", "1 - r")}`;
          if (step.ordem === 2) {
            const s = x.a1 / (1 - x.r);
            return `S = ${frac(num(x.a1), `1 ${signed(-x.r)}`)} = ${num(s)}`;
          }
        } else {
          const s = (x.a1 * (1 - Math.pow(x.r, x.n))) / (1 - x.r);
          if (step.ordem === 1) return `S_n = ${frac(`a_1(1 - r^n)`, "1 - r")}`;
          if (step.ordem === 2) {
            return `S_{${num(x.n)}} = ${frac(`${num(x.a1)}(1 ${signed(-Math.pow(x.r, x.n))})`, `1 ${signed(-x.r)}`)} = ${num(s)}`;
          }
        }
        break;
      }
      case "taylor": {
        const x = dados<TaylorData>(problem);
        if (x.funcao === "exponencial") {
          if (step.ordem === 1) return `f(0)=1,\\; f'(0)=1,\\; f''(0)=1`;
          if (step.ordem === 2) {
            return x.grau === 1
              ? `P(x) = 1 + x`
              : `P(x) = 1 + x + \\frac{x^2}{2}`;
          }
        } else {
          if (step.ordem === 1) return `f(0)=0,\\; f'(0)=1,\\; f''(0)=0,\\; f'''(0)=-1`;
          if (step.ordem === 2) {
            return x.grau === 1 ? `P(x) = x` : `P(x) = x - \\frac{x^3}{6}`;
          }
        }
        break;
      }
      case "edos": {
        const x = dados<EdosData>(problem);
        const res = x.y0 * Math.exp(x.k * x.x);
        if (step.ordem === 1) return `\\int \\frac{dy}{y} = \\int ${num(x.k)}\\, dx \\Rightarrow \\ln|y| = ${num(x.k)}x + C`;
        if (step.ordem === 2) return `y(x) = C e^{${num(x.k)}x}`;
        if (step.ordem === 3) return `y(0) = ${num(x.y0)} \\Rightarrow C = ${num(x.y0)}`;
        if (step.ordem === 4) {
          return `y(${num(x.x)}) = ${num(x.y0)} e^{${num(x.k)} \\cdot ${num(x.x)}} = ${num(res)}`;
        }
        break;
      }
      default:
        break;
    }
    return undefined;
  },

  stepResultado(problem, step) {
    if (!step.resultado) return undefined;
    return enrichCalculoLatex.respostaFinal(problem, {
      problemaId: problem.id,
      respostaFinal: step.resultado,
      steps: [],
    });
  },

  stepExplicacao(problem, step) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "limite-algebrico": {
        const x = dados<LimitesData>(problem);
        if (step.ordem === 1) {
          return `Substituímos $x = ${num(x.a)}$ e obtemos a forma indeterminada $\\frac{0}{0}$.`;
        }
        if (step.ordem === 2) {
          return `Fatoramos ${num(x.coeficiente)}x^2 ${signed(-x.constante)} usando diferença de quadrados.`;
        }
        break;
      }
      case "derivadas": {
        if (step.ordem === 1) {
          return `Aplicamos a regra da potência: $\\frac{d}{dx}x^n = n x^{n-1}$.`;
        }
        break;
      }
      case "integrais-definidas": {
        if (step.ordem === 1) {
          return `Encontramos uma primitiva $F(x)$ da função integranda.`;
        }
        break;
      }
      default:
        break;
    }
    return undefined;
  },
};
