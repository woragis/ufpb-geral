import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import { expectX, frac, num, text } from "@/core/presentation/math/latex-helpers";
import type {
  CorrelacaoData,
  DistribuicoesData,
  MedidasDispersaoData,
  MedidasTendenciaData,
  TiposDadosData,
} from "@/domains/analise-exploratoria/entities/types";

function isAE(p: Problem): boolean {
  return p.disciplinaId === "analise-exploratoria";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
}

function media(vals: number[]): number {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i]! - mx;
    const dy = ys[i]! - my;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  return Math.round((num / Math.sqrt(denX * denY)) * 100) / 100;
}

export const enrichAnaliseExploratoriaLatex: DomainLatexEnricher = {
  matches: isAE,

  enunciado(problem) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "tipos-dados": {
        const x = dados<TiposDadosData>(problem);
        return `A variável ${text(x.variavel)} pertence a qual escala de medição?`;
      }
      case "media-aritmetica": {
        const x = dados<MedidasTendenciaData>(problem);
        return `Dado ${setLatex(x.valores)}, calcule a média aritmética $\\bar{x}$.`;
      }
      case "medidas-dispersao": {
        const x = dados<MedidasDispersaoData>(problem);
        const label =
          x.pergunta === "amplitude"
            ? "amplitude"
            : x.pergunta === "variancia"
              ? "variância amostral $s^2$"
              : "desvio padrão amostral $s$";
        return `Dado ${setLatex(x.valores)}, calcule a ${label}.`;
      }
      case "distribuicoes": {
        const x = dados<DistribuicoesData>(problem);
        return `Com $Q_1 = ${num(x.q1)}$, $Q_2 = ${num(x.q2)}$, $Q_3 = ${num(x.q3)}$, calcule $\\mathrm{IQR}$.`;
      }
      case "correlacao": {
        const x = dados<CorrelacaoData>(problem);
        const pares = x.xs.map((xi, i) => `(${num(xi)}, ${num(x.ys[i]!)})`).join(",\\,");
        return `Dados os pares ${pares}, calcule o coeficiente de correlação de Pearson $r$.`;
      }
      default:
        return undefined;
    }
  },

  respostaFinal(problem, solution) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "tipos-dados": {
        const x = dados<TiposDadosData>(problem);
        const labels = {
          nominal: text("Nominal"),
          ordinal: text("Ordinal"),
          intervalar: text("Intervalar"),
          razao: text("Razão"),
        };
        return labels[x.escalaCorreta];
      }
      case "media-aritmetica": {
        const x = dados<MedidasTendenciaData>(problem);
        const m = media(x.valores);
        return num(Number.isInteger(m) ? m : Math.round(m * 100) / 100);
      }
      case "medidas-dispersao": {
        const x = dados<MedidasDispersaoData>(problem);
        const n = x.valores.length;
        const m = media(x.valores);
        if (x.pergunta === "amplitude") {
          return num(Math.max(...x.valores) - Math.min(...x.valores));
        }
        const sq = x.valores.reduce((acc, v) => acc + (v - m) ** 2, 0);
        const variancia = Math.round((sq / (n - 1)) * 100) / 100;
        if (x.pergunta === "variancia") return num(variancia);
        return num(Math.round(Math.sqrt(variancia) * 100) / 100);
      }
      case "distribuicoes": {
        const x = dados<DistribuicoesData>(problem);
        return num(x.q3 - x.q1);
      }
      case "correlacao": {
        const x = dados<CorrelacaoData>(problem);
        return num(pearson(x.xs, x.ys));
      }
      default:
        return solution.respostaFinal;
    }
  },

  stepCalculo(problem, step) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "media-aritmetica": {
        const x = dados<MedidasTendenciaData>(problem);
        const soma = x.valores.reduce((a, b) => a + b, 0);
        const m = soma / x.valores.length;
        if (step.ordem === 1) return `${x.valores.join(" + ")} = ${num(soma)}`;
        if (step.ordem === 2) return `n = ${num(x.valores.length)}`;
        if (step.ordem === 3) {
          return `\\bar{x} = ${frac(num(soma), num(x.valores.length))} = ${num(m)}`;
        }
        break;
      }
      case "distribuicoes": {
        const x = dados<DistribuicoesData>(problem);
        if (step.ordem === 1) return `\\mathrm{IQR} = Q_3 - Q_1`;
        if (step.ordem === 2) {
          return `\\mathrm{IQR} = ${num(x.q3)} - ${num(x.q1)} = ${num(x.q3 - x.q1)}`;
        }
        break;
      }
      case "correlacao": {
        const x = dados<CorrelacaoData>(problem);
        const n = x.xs.length;
        const mx = x.xs.reduce((a, b) => a + b, 0) / n;
        const my = x.ys.reduce((a, b) => a + b, 0) / n;
        const r = pearson(x.xs, x.ys);
        if (step.ordem === 1) {
          return `\\bar{x} = ${num(Math.round(mx * 100) / 100)},\\quad \\bar{y} = ${num(Math.round(my * 100) / 100)}`;
        }
        if (step.ordem === 2) {
          return `r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}} = ${num(r)}`;
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
    return enrichAnaliseExploratoriaLatex.respostaFinal(problem, {
      problemaId: problem.id,
      respostaFinal: step.resultado,
      steps: [],
    });
  },
};

function setLatex(vals: number[]): string {
  return `\\{${vals.map(num).join(",\\,")}\\}`;
}
