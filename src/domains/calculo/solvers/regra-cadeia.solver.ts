import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_REGRA_CADEIA, type RegraCadeiaData } from "../entities/types";

export const regraCadeiaSolver: ProblemSolver = {
  topicoId: TOPICO_REGRA_CADEIA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as RegraCadeiaData;
    const gx = d.a * d.x0 + d.b;
    const resultado = d.n * Math.pow(gx, d.n - 1) * d.a;

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Identificar a composição",
          explicacao: "Escrevemos h(x) = f(g(x)) com f(u) = uⁿ e g(x) = ax + b.",
          calculo: `f(u) = u^${d.n}, g(x) = ${d.a}x + ${d.b}`,
        },
        {
          ordem: 2,
          titulo: "Aplicar a regra da cadeia",
          explicacao: "h'(x) = f'(g(x))·g'(x).",
          calculo: `h'(x) = ${d.n}(${d.a}x + ${d.b})^${d.n - 1} · ${d.a}`,
        },
        {
          ordem: 3,
          titulo: "Substituir x",
          explicacao: `g(${d.x0}) = ${d.a}·${d.x0} + ${d.b} = ${gx}`,
          calculo: `h'(${d.x0}) = ${d.n}·${gx}^${d.n - 1}·${d.a} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
