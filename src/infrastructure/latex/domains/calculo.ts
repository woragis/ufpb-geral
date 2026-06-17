import type { Problem, Solution, Step } from "@/core/domain/problem";
import {
  continuidadeEnunciado,
  continuidadeRespostaFinal,
} from "./calculo-continuidade";
import { derivadasEnunciado, derivadasRespostaFinal } from "./calculo-derivadas";
import {
  limitesEnunciado,
  limitesRespostaFinal,
  limitesStepCalculo,
  limitesStepExplicacao,
} from "./calculo-limites";
import {
  calculoExplicacaoToLatex,
  calculoPlainToLatex,
} from "./calculo-plain-to-latex";
import { otimizacaoEnunciado, otimizacaoRespostaFinal } from "./calculo-otimizacao";
import {
  calculoRestEnunciado,
  calculoRestRespostaFinal,
} from "./calculo-rest";
import {
  regraCadeiaEnunciado,
  regraCadeiaRespostaFinal,
} from "./calculo-regra-cadeia";
import type { DomainLatexEnricher } from "../enrich";

function isCalculo(p: Problem): boolean {
  return p.disciplinaId === "calculo";
}

export const enrichCalculoLatex: DomainLatexEnricher = {
  matches: isCalculo,

  enunciado(problem) {
    const tipo = (problem.dados as { tipo?: string }).tipo;
    if (tipo?.startsWith("limite-")) {
      return limitesEnunciado(problem);
    }
    if (tipo?.startsWith("continuidade-")) {
      return continuidadeEnunciado(problem);
    }
    if (tipo?.startsWith("derivadas-")) {
      return derivadasEnunciado(problem);
    }
    if (tipo?.startsWith("regra-cadeia-")) {
      return regraCadeiaEnunciado(problem);
    }
    if (tipo?.startsWith("otimizacao-")) {
      return otimizacaoEnunciado(problem);
    }
    return calculoRestEnunciado(problem);
  },

  respostaFinal(problem, solution) {
    const tipo = (problem.dados as { tipo?: string }).tipo;
    if (tipo?.startsWith("limite-")) {
      return limitesRespostaFinal(problem, solution);
    }
    if (tipo?.startsWith("continuidade-")) {
      return continuidadeRespostaFinal(problem, solution.respostaFinal);
    }
    if (tipo?.startsWith("derivadas-")) {
      return derivadasRespostaFinal(problem, solution.respostaFinal);
    }
    if (tipo?.startsWith("regra-cadeia-")) {
      return regraCadeiaRespostaFinal(solution.respostaFinal);
    }
    if (tipo?.startsWith("otimizacao-")) {
      return otimizacaoRespostaFinal(problem, solution.respostaFinal);
    }
    return calculoRestRespostaFinal(problem, solution.respostaFinal);
  },

  stepCalculo(problem, step) {
    const tipo = (problem.dados as { tipo?: string }).tipo;
    if (tipo?.startsWith("limite-")) {
      return limitesStepCalculo(problem, step);
    }
    return calculoPlainToLatex(step.calculo);
  },

  stepResultado(problem, step) {
    if (!step.resultado) return undefined;
    const converted = calculoPlainToLatex(step.resultado);
    if (converted) return converted;
    return enrichCalculoLatex.respostaFinal(problem, {
      problemaId: problem.id,
      respostaFinal: step.resultado,
      steps: [],
    });
  },

  stepExplicacao(problem, step) {
    const tipo = (problem.dados as { tipo?: string }).tipo;
    if (tipo?.startsWith("limite-")) {
      return limitesStepExplicacao(problem, step) ?? calculoExplicacaoToLatex(step.explicacao);
    }
    return calculoExplicacaoToLatex(step.explicacao);
  },
};
