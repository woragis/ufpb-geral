import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CONTINUIDADE, type ContinuidadeData } from "../entities/types";

export const continuidadeSolver: ProblemSolver = {
  topicoId: TOPICO_CONTINUIDADE,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ContinuidadeData;
    const limEsq = d.m1 * d.a + d.b1;
    const limDir = d.m2 * d.a + d.b2;
    const fA = limDir;

    return {
      problemaId: problema.id,
      respostaFinal: d.continua ? "Sim" : "Não",
      steps: [
        {
          ordem: 1,
          titulo: "Limite à esquerda",
          explicacao: "Avaliamos a expressão válida para x < a no ponto x = a.",
          calculo: `lim(x→${d.a}⁻) f(x) = ${d.m1}·${d.a} ${d.b1 >= 0 ? "+" : "−"} ${Math.abs(d.b1)} = ${limEsq}`,
          resultado: String(limEsq),
        },
        {
          ordem: 2,
          titulo: "Limite à direita e valor da função",
          explicacao: "Para x ≥ a, usamos a segunda expressão. f(a) é dado por ela.",
          calculo: `lim(x→${d.a}⁺) f(x) = f(${d.a}) = ${d.m2}·${d.a} ${d.b2 >= 0 ? "+" : "−"} ${Math.abs(d.b2)} = ${limDir}`,
          resultado: String(limDir),
        },
        {
          ordem: 3,
          titulo: "Verificar continuidade",
          explicacao: "f é contínua em a se limite à esquerda = limite à direita = f(a).",
          calculo: `${limEsq} ${d.continua ? "=" : "≠"} ${limDir}`,
          resultado: d.continua ? "Sim" : "Não",
        },
      ],
    };
  },
};
