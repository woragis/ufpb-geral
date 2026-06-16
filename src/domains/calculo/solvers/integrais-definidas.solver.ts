import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_INTEGRAIS_DEFINIDAS, type IntegraisDefinidasData } from "../entities/types";

export const integraisDefinidasSolver: ProblemSolver = {
  topicoId: TOPICO_INTEGRAIS_DEFINIDAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as IntegraisDefinidasData;
    const Fb = (d.c * d.b * d.b) / 2 + d.d * d.b;
    const Fa = (d.c * d.a * d.a) / 2 + d.d * d.a;
    const resultado = Fb - Fa;

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Encontrar a primitiva",
          explicacao: "Integramos termo a termo.",
          calculo: `F(x) = ${d.c}x²/2 + ${d.d}x`,
        },
        {
          ordem: 2,
          titulo: "Aplicar o Teorema Fundamental do Cálculo",
          explicacao: "∫[a→b] f(x)dx = F(b) − F(a).",
          calculo: `F(${d.b}) − F(${d.a}) = (${Fb}) − (${Fa}) = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
