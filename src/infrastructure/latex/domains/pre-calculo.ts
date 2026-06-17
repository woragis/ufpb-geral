import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";

function isPreCalc(p: Problem): boolean {
  return p.disciplinaId === "pre-calculo";
}

export const enrichPreCalculoLatex: DomainLatexEnricher = {
  matches: isPreCalc,

  enunciado() {
    return undefined;
  },

  respostaFinal(_problem, solution) {
    return solution.respostaFinal;
  },

  stepCalculo(_problem, step) {
    return step.calculo;
  },

  stepResultado(_problem, step) {
    return step.resultado;
  },
};
