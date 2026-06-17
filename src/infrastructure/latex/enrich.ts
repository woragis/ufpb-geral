import type { Problem, Solution, Step } from "@/core/domain/problem";
import { enrichCalculoLatex } from "./domains/calculo";
import { enrichProbabilidadeLatex } from "./domains/probabilidade";
import { enrichCalculoVetorialLatex } from "./domains/calculo-vetorial";
import { enrichAnaliseExploratoriaLatex } from "./domains/analise-exploratoria";

export function enrichProblem(problem: Problem): Problem {
  const enrichers = [
    enrichCalculoLatex,
    enrichProbabilidadeLatex,
    enrichCalculoVetorialLatex,
    enrichAnaliseExploratoriaLatex,
  ];

  for (const enrich of enrichers) {
    if (!enrich.matches(problem)) continue;
    const enunciadoLatex = enrich.enunciado(problem);
    return enunciadoLatex ? { ...problem, enunciadoLatex } : problem;
  }

  return problem;
}

export function enrichSolution(problem: Problem, solution: Solution): Solution {
  const enrichers = [
    enrichCalculoLatex,
    enrichProbabilidadeLatex,
    enrichCalculoVetorialLatex,
    enrichAnaliseExploratoriaLatex,
  ];

  for (const enrich of enrichers) {
    if (!enrich.matches(problem)) continue;
    return {
      ...solution,
      respostaFinalLatex:
        enrich.respostaFinal(problem, solution) ?? solution.respostaFinal,
      steps: solution.steps.map((step) => enrichStep(problem, step, enrich)),
    };
  }

  return solution;
}

function enrichStep(
  problem: Problem,
  step: Step,
  enrich: DomainLatexEnricher,
): Step {
  return {
    ...step,
    explicacaoLatex:
      enrich.stepExplicacao?.(problem, step) ?? step.explicacaoLatex,
    calculoLatex: enrich.stepCalculo(problem, step) ?? step.calculoLatex,
    resultadoLatex: enrich.stepResultado(problem, step) ?? step.resultadoLatex,
  };
}

export interface DomainLatexEnricher {
  matches: (problem: Problem) => boolean;
  enunciado: (problem: Problem) => string | undefined;
  respostaFinal: (problem: Problem, solution: Solution) => string | undefined;
  stepCalculo: (problem: Problem, step: Step) => string | undefined;
  stepResultado: (problem: Problem, step: Step) => string | undefined;
  stepExplicacao?: (problem: Problem, step: Step) => string | undefined;
}
