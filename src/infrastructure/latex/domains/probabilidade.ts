import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import {
  condProb,
  expectX,
  frac,
  num,
  prob,
  set,
  text,
} from "@/core/presentation/math/latex-helpers";
import { simplificarFracao } from "@/domains/probabilidade/utils/math";
import type {
  CondicionalData,
  EspacoAmostralData,
  EventosData,
  IndependenciaData,
  ProbabilidadeClassicaData,
  VariaveisDiscretasData,
} from "@/domains/probabilidade/entities/types";

function isProb(p: Problem): boolean {
  return p.disciplinaId === "probabilidade";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
}

export const enrichProbabilidadeLatex: DomainLatexEnricher = {
  matches: isProb,

  enunciado(problem) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "espaco-amostral": {
        const x = dados<Extract<EspacoAmostralData, { tipo: "espaco-amostral" }>>(problem);
        const exp =
          x.experimento === "moeda"
            ? text("lançamento de uma moeda")
            : x.experimento === "dado"
              ? text("lançamento de um dado de 6 faces")
              : text("lançamento de dois dados de 6 faces");
        return x.pergunta === "cardinalidade"
          ? `Considere o experimento: ${exp}. Qual é $|\\Omega|$?`
          : `Considere o experimento: ${exp}. Liste $\\Omega$ e informe $|\\Omega|$.`;
      }
      case "probabilidade-classica": {
        const x = dados<Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica" }>>(problem);
        const desc = Object.entries(x.cores)
          .map(([cor, qtd]) => `${num(qtd)}\\;${text(`bola${qtd > 1 ? "s" : ""} ${cor}`)}`)
          .join(",\\,");
        return `Uma urna contém ${desc}. Qual é ${prob(text(`bola ${x.corAlvo}`))}?`;
      }
      case "eventos": {
        const x = dados<Extract<EventosData, { tipo: "eventos" }>>(problem);
        if (x.operacao === "complemento") {
          return `Em $\\Omega$ com $|\\Omega| = ${num(x.nOmega)}$, $|A| = ${num(x.nA)}$ (${text(x.descricaoA)}). Calcule $|A^c|$.`;
        }
        if (x.operacao === "uniao") {
          return `Em $\\Omega$ com $|\\Omega| = ${num(x.nOmega)}$, $|A| = ${num(x.nA)}$, $|B| = ${num(x.nB)}$, $|A \\cap B| = ${num(x.nAinterB)}$. Calcule $|A \\cup B|$.`;
        }
        return `Em $\\Omega$ com $|\\Omega| = ${num(x.nOmega)}$, $|A \\cap B| = ${num(x.nAinterB)}$. Calcule $|A \\cap B|$.`;
      }
      case "condicional": {
        const x = dados<Extract<CondicionalData, { tipo: "condicional" }>>(problem);
        return `Em um grupo de ${num(x.nOmega)} pessoas, ${num(x.nB)} satisfazem ${text(x.descricaoB)} e ${num(x.nAinterB)} satisfazem ${text(x.descricaoA)} e ${text(x.descricaoB)}. Calcule ${condProb("A", "B")}.`;
      }
      case "independencia": {
        const x = dados<Extract<IndependenciaData, { tipo: "independencia" }>>(problem);
        return `Com $|\\Omega| = ${num(x.nOmega)}$, $|A| = ${num(x.nA)}$, $|B| = ${num(x.nB)}$, $|A \\cap B| = ${num(x.nAinterB)}$. Os eventos $A$ e $B$ são independentes?`;
      }
      case "variaveis-discretas": {
        const x = dados<Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas" }>>(problem);
        const tabela = x.valores
          .map((v, i) => `${prob(`X = ${num(v)}`)} = ${num(x.probabilidades[i]!)}`)
          .join(",\\,");
        return x.pergunta === "esperanca"
          ? `Dada a distribuição ${tabela}, calcule ${expectX()}.`
          : `Dada a distribuição ${tabela}, calcule ${prob(`X = ${num(x.valorAlvo!)}`)}.`;
      }
      default:
        return undefined;
    }
  },

  respostaFinal(problem, solution) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "espaco-amostral": {
        const x = dados<Extract<EspacoAmostralData, { tipo: "espaco-amostral" }>>(problem);
        const card =
          x.experimento === "moeda" ? 2 : x.experimento === "dado" ? 6 : 36;
        return num(card);
      }
      case "probabilidade-classica": {
        const x = dados<Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica" }>>(problem);
        const fav = x.cores[x.corAlvo] ?? 0;
        const total = Object.values(x.cores).reduce((a, b) => a + b, 0);
        return frac(fav, total);
      }
      case "condicional": {
        const x = dados<Extract<CondicionalData, { tipo: "condicional" }>>(problem);
        return frac(x.nAinterB, x.nB);
      }
      case "eventos": {
        const x = dados<Extract<EventosData, { tipo: "eventos" }>>(problem);
        if (x.operacao === "complemento") return num(x.nOmega - x.nA);
        if (x.operacao === "uniao") return num(x.nA + x.nB - x.nAinterB);
        return num(x.nAinterB);
      }
      case "independencia": {
        const x = dados<Extract<IndependenciaData, { tipo: "independencia" }>>(problem);
        const indep = x.nAinterB * x.nOmega === x.nA * x.nB;
        return indep ? text("Sim") : text("Não");
      }
      case "variaveis-discretas": {
        const x = dados<Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas" }>>(problem);
        if (x.pergunta === "probabilidade") {
          const idx = x.valores.indexOf(x.valorAlvo!);
          return num(x.probabilidades[idx]!);
        }
        const e = x.valores.reduce(
          (acc, v, i) => acc + v * x.probabilidades[i]!,
          0,
        );
        return num(Math.round(e * 1000) / 1000);
      }
      default:
        return solution.respostaFinal;
    }
  },

  stepCalculo(problem, step) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "probabilidade-classica": {
        const x = dados<Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica" }>>(problem);
        const fav = x.cores[x.corAlvo] ?? 0;
        const total = Object.values(x.cores).reduce((a, b) => a + b, 0);
        if (step.ordem === 1) {
          return `n(\\Omega) = ${Object.values(x.cores).join(" + ")} = ${num(total)}`;
        }
        if (step.ordem === 2) return `n(A) = ${num(fav)}`;
        if (step.ordem === 3) {
          return `${prob("A")} = ${frac("n(A)", "n(\\Omega)")} = ${frac(num(fav), num(total))}`;
        }
        break;
      }
      case "condicional": {
        const x = dados<Extract<CondicionalData, { tipo: "condicional" }>>(problem);
        if (step.ordem === 1) {
          return `${condProb("A", "B")} = ${frac(prob("A \\cap B"), prob("B"))} = ${frac("n(A \\cap B)", "n(B)")}`;
        }
        if (step.ordem === 2) {
          return `n(A \\cap B) = ${num(x.nAinterB)},\\; n(B) = ${num(x.nB)}`;
        }
        if (step.ordem === 3) {
          return `${condProb("A", "B")} = ${frac(num(x.nAinterB), num(x.nB))} = ${simplificarFracao(x.nAinterB, x.nB)}`;
        }
        break;
      }
      case "eventos": {
        const x = dados<Extract<EventosData, { tipo: "eventos" }>>(problem);
        if (x.operacao === "uniao" && step.ordem === 1) {
          return `|A \\cup B| = |A| + |B| - |A \\cap B|`;
        }
        if (x.operacao === "uniao" && step.ordem === 2) {
          const res = x.nA + x.nB - x.nAinterB;
          return `|A \\cup B| = ${num(x.nA)} + ${num(x.nB)} - ${num(x.nAinterB)} = ${num(res)}`;
        }
        if (x.operacao === "complemento" && step.ordem === 1) {
          return `|A^c| = |\\Omega| - |A|`;
        }
        if (x.operacao === "complemento" && step.ordem === 2) {
          return `|A^c| = ${num(x.nOmega)} - ${num(x.nA)} = ${num(x.nOmega - x.nA)}`;
        }
        if (x.operacao === "intersecao" && step.ordem === 1) {
          return `|A \\cap B| = ${num(x.nAinterB)}`;
        }
        break;
      }
      case "espaco-amostral": {
        const x = dados<Extract<EspacoAmostralData, { tipo: "espaco-amostral" }>>(problem);
        const card =
          x.experimento === "moeda" ? 2 : x.experimento === "dado" ? 6 : 36;
        if (step.ordem === 1) {
          if (x.experimento === "moeda") return `\\Omega = ${set(text("Cara"), text("Coroa"))}`;
          if (x.experimento === "dado") return `\\Omega = ${set("1", "2", "3", "4", "5", "6")}`;
          return `\\Omega = ${set("(i,j) \\mid i,j \\in \\{1,\\ldots,6\\}")}`;
        }
        if (step.ordem === 2) return `|\\Omega| = ${num(card)}`;
        break;
      }
      case "variaveis-discretas": {
        const x = dados<Extract<VariaveisDiscretasData, { tipo: "variaveis-discretas" }>>(problem);
        if (x.pergunta === "esperanca" && step.ordem === 1) {
          const terms = x.valores.map(
            (v, i) => `${num(v)} \\cdot ${num(x.probabilidades[i]!)}`,
          );
          return `${expectX()} = ${terms.join(" + ")}`;
        }
        if (x.pergunta === "probabilidade" && step.ordem === 1) {
          const idx = x.valores.indexOf(x.valorAlvo!);
          return `${prob(`X = ${num(x.valorAlvo!)}`)} = ${num(x.probabilidades[idx]!)}`;
        }
        break;
      }
      case "independencia": {
        const x = dados<Extract<IndependenciaData, { tipo: "independencia" }>>(problem);
        const indep = x.nAinterB * x.nOmega === x.nA * x.nB;
        if (step.ordem === 1) {
          return `${prob("A")} = ${frac(num(x.nA), num(x.nOmega))},\\quad ${prob("B")} = ${frac(num(x.nB), num(x.nOmega))}`;
        }
        if (step.ordem === 2) {
          return `${prob("A \\cap B")} = ${frac(num(x.nAinterB), num(x.nOmega))}`;
        }
        if (step.ordem === 3) {
          return `${prob("A")} \\cdot ${prob("B")} = ${frac(num(x.nA), num(x.nOmega))} \\cdot ${frac(num(x.nB), num(x.nOmega))} = ${simplificarFracao(x.nA * x.nB, x.nOmega * x.nOmega)}`;
        }
        if (step.ordem === 4) {
          return indep
            ? `|A \\cap B| \\cdot |\\Omega| = ${num(x.nAinterB)} \\cdot ${num(x.nOmega)} = ${num(x.nA)} \\cdot ${num(x.nB)} = |A| \\cdot |B|`
            : `|A \\cap B| \\cdot |\\Omega| = ${num(x.nAinterB * x.nOmega)} \\neq ${num(x.nA * x.nB)} = |A| \\cdot |B|`;
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
    return enrichProbabilidadeLatex.respostaFinal(problem, {
      problemaId: problem.id,
      respostaFinal: step.resultado,
      steps: [],
    });
  },
};
