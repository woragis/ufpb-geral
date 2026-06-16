import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_EDOS, type EdosData } from "../entities/types";

export const edosSolver: ProblemSolver = {
  topicoId: TOPICO_EDOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as EdosData;
    const C = d.y0;
    const resultado = C * Math.exp(d.k * d.x);

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Separar variáveis",
          explicacao: "dy/y = k dx — EDO de variáveis separáveis.",
          calculo: "∫dy/y = ∫k dx → ln|y| = kx + C₁",
        },
        {
          ordem: 2,
          titulo: "Solução geral",
          explicacao: "Exponentiando ambos os lados.",
          calculo: `y(x) = Ce^{${d.k}x}`,
        },
        {
          ordem: 3,
          titulo: "Aplicar condição inicial",
          explicacao: `y(0) = ${d.y0} determina C.`,
          calculo: `C = ${d.y0} → y(x) = ${d.y0}e^{${d.k}x}`,
        },
        {
          ordem: 4,
          titulo: "Calcular y(x)",
          explicacao: `Substituímos x = ${d.x} na solução particular.`,
          calculo: `y(${d.x}) = ${d.y0}·e^{${d.k}·${d.x}} = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
