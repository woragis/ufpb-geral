import type { Problem, Solution } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import { frac, num, text } from "@/core/presentation/math/latex-helpers";
import type {
  CorrelacaoData,
  DistribuicoesData,
  MedidasDispersaoData,
  MedidasTendenciaData,
  TiposDadosData,
} from "@/domains/analise-exploratoria/entities/types";
import {
  contarOutliers,
  desvioAmostral,
  media,
  mediana,
  mediaPonderada,
  moda,
  pearson,
  quartis,
  round2,
  varianciaAmostral,
} from "@/domains/analise-exploratoria/lib/stats";

function isAE(p: Problem): boolean {
  return p.disciplinaId === "analise-exploratoria";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
}

export const enrichAnaliseExploratoriaLatex: DomainLatexEnricher = {
  matches: isAE,

  enunciado(problem) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "tipos-dados": {
        const x = dados<Extract<TiposDadosData, { tipo: "tipos-dados" }>>(problem);
        return `A variável ${text(x.variavel)} pertence a qual escala de medição?`;
      }
      case "tipos-dados-grafico": {
        const x = dados<Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>>(problem);
        return `Para ${text(x.variavel)}, qual gráfico é mais adequado?`;
      }
      case "media-aritmetica": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "media-aritmetica" }>>(problem);
        return `Dado ${setLatex(x.valores)}, calcule a média aritmética $\\bar{x}$.`;
      }
      case "medidas-tendencia-mediana": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-mediana" }>>(problem);
        return `Dado ${setLatex(x.valores)}, calcule a mediana.`;
      }
      case "medidas-tendencia-moda": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-moda" }>>(problem);
        return `Dado ${setLatex(x.valores)}, identifique a moda.`;
      }
      case "medidas-tendencia-ponderada": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-ponderada" }>>(problem);
        return `Calcule a média ponderada de ${setLatex(x.valores)} com pesos ${setLatex(x.pesos)}.`;
      }
      case "medidas-dispersao": {
        const x = dados<Extract<MedidasDispersaoData, { tipo: "medidas-dispersao" }>>(problem);
        const label =
          x.pergunta === "amplitude"
            ? "amplitude"
            : x.pergunta === "variancia"
              ? "variância amostral $s^2$"
              : "desvio padrão amostral $s$";
        return `Dado ${setLatex(x.valores)}, calcule a ${label}.`;
      }
      case "medidas-dispersao-cv": {
        const x = dados<Extract<MedidasDispersaoData, { tipo: "medidas-dispersao-cv" }>>(problem);
        return `Dado ${setLatex(x.valores)}, calcule o coeficiente de variação $\\mathrm{CV}$.`;
      }
      case "distribuicoes": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes" }>>(problem);
        return `Com $Q_1 = ${num(x.q1)}$, $Q_2 = ${num(x.q2)}$, $Q_3 = ${num(x.q3)}$, calcule $\\mathrm{IQR}$.`;
      }
      case "distribuicoes-ler-boxplot": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-ler-boxplot" }>>(problem);
        if (x.pergunta === "mediana") {
          return `Com $Q_2 = ${num(x.q2)}$ no boxplot, qual é a mediana?`;
        }
        return `Com $Q_1 = ${num(x.q1)}$, $Q_2 = ${num(x.q2)}$, $Q_3 = ${num(x.q3)}$, calcule $\\mathrm{IQR}$.`;
      }
      case "distribuicoes-quartis": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>>(problem);
        return `Dado ${setLatex(x.valores)}, calcule $${x.pergunta.toUpperCase()}$.`;
      }
      case "distribuicoes-outliers": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>>(problem);
        return `Dado ${setLatex(x.valores)}, quantos outliers existem (regra $1{,}5\\cdot\\mathrm{IQR}$)?`;
      }
      case "correlacao":
      case "correlacao-negativa":
      case "correlacao-fraca": {
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
        const x = dados<Extract<TiposDadosData, { tipo: "tipos-dados" }>>(problem);
        const labels = {
          nominal: text("Nominal"),
          ordinal: text("Ordinal"),
          intervalar: text("Intervalar"),
          razao: text("Razão"),
        };
        return labels[x.escalaCorreta];
      }
      case "tipos-dados-grafico": {
        const x = dados<Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>>(problem);
        const labels = {
          barras: text("Gráfico de barras"),
          histograma: text("Histograma"),
          linha: text("Gráfico de linhas"),
          boxplot: text("Boxplot"),
        };
        return labels[x.graficoCorreto];
      }
      case "media-aritmetica": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "media-aritmetica" }>>(problem);
        return num(round2(media(x.valores)));
      }
      case "medidas-tendencia-mediana": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-mediana" }>>(problem);
        return num(round2(mediana(x.valores)));
      }
      case "medidas-tendencia-moda": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-moda" }>>(problem);
        return num(moda(x.valores));
      }
      case "medidas-tendencia-ponderada": {
        const x = dados<Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-ponderada" }>>(problem);
        return num(round2(mediaPonderada(x.valores, x.pesos)));
      }
      case "medidas-dispersao": {
        const x = dados<Extract<MedidasDispersaoData, { tipo: "medidas-dispersao" }>>(problem);
        if (x.pergunta === "amplitude") {
          return num(Math.max(...x.valores) - Math.min(...x.valores));
        }
        if (x.pergunta === "variancia") return num(varianciaAmostral(x.valores));
        return num(desvioAmostral(x.valores));
      }
      case "medidas-dispersao-cv": {
        const x = dados<Extract<MedidasDispersaoData, { tipo: "medidas-dispersao-cv" }>>(problem);
        const m = media(x.valores);
        const s = desvioAmostral(x.valores);
        return num(round2((s / m) * 100));
      }
      case "distribuicoes": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes" }>>(problem);
        return num(x.q3 - x.q1);
      }
      case "distribuicoes-ler-boxplot": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-ler-boxplot" }>>(problem);
        if (x.pergunta === "mediana") return num(x.q2);
        return num(x.q3 - x.q1);
      }
      case "distribuicoes-quartis": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>>(problem);
        const q = quartis(x.valores);
        return num(x.pergunta === "q1" ? q.q1 : x.pergunta === "q2" ? q.q2 : q.q3);
      }
      case "distribuicoes-outliers": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>>(problem);
        return num(contarOutliers(x.valores));
      }
      case "correlacao":
      case "correlacao-negativa":
      case "correlacao-fraca": {
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
        const x = dados<Extract<MedidasTendenciaData, { tipo: "media-aritmetica" }>>(problem);
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
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes" }>>(problem);
        if (step.ordem === 1) return `\\mathrm{IQR} = Q_3 - Q_1`;
        if (step.ordem === 2) {
          return `\\mathrm{IQR} = ${num(x.q3)} - ${num(x.q1)} = ${num(x.q3 - x.q1)}`;
        }
        break;
      }
      case "distribuicoes-ler-boxplot": {
        const x = dados<Extract<DistribuicoesData, { tipo: "distribuicoes-ler-boxplot" }>>(problem);
        if (x.pergunta === "mediana") break;
        if (step.ordem === 1) return `\\mathrm{IQR} = Q_3 - Q_1`;
        if (step.ordem === 2) {
          return `\\mathrm{IQR} = ${num(x.q3)} - ${num(x.q1)} = ${num(x.q3 - x.q1)}`;
        }
        break;
      }
      case "correlacao":
      case "correlacao-negativa":
      case "correlacao-fraca": {
        const x = dados<CorrelacaoData>(problem);
        const n = x.xs.length;
        const mx = media(x.xs);
        const my = media(x.ys);
        const r = pearson(x.xs, x.ys);
        if (step.ordem === 1) {
          return `\\bar{x} = ${num(round2(mx))},\\quad \\bar{y} = ${num(round2(my))}`;
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
