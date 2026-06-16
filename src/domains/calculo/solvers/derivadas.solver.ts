import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_DERIVADAS, type DerivadasData } from "../entities/types";

export const derivadasSolver: ProblemSolver = {
  topicoId: TOPICO_DERIVADAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as DerivadasData;

    const derivTermos = d.coeficientes.map((c, i) => {
      const n = d.expoentes[i]!;
      if (n === 0) return { deriv: 0, texto: "0" };
      const newCoef = c * n;
      const newExp = n - 1;
      if (newExp === 0) return { deriv: newCoef, texto: String(newCoef) };
      return { deriv: newCoef, texto: `${newCoef}x^${newExp}` };
    });

    const fLinha = derivTermos.map((t) => t.texto).join(" + ");
    const valor = derivTermos.reduce((acc, t, i) => {
      const n = d.expoentes[i]!;
      if (n === 0) return acc;
      return acc + d.coeficientes[i]! * n * Math.pow(d.x0, n - 1);
    }, 0);

    return {
      problemaId: problema.id,
      respostaFinal: String(valor),
      steps: [
        {
          ordem: 1,
          titulo: "Derivar termo a termo",
          explicacao: "Usamos a regra da potência: (cxⁿ)' = cnxⁿ⁻¹.",
          calculo: `f'(x) = ${fLinha}`,
        },
        {
          ordem: 2,
          titulo: "Substituir x",
          explicacao: `Avaliamos f' no ponto x = ${d.x0}.`,
          calculo: `f'(${d.x0}) = ${valor}`,
          resultado: String(valor),
        },
      ],
    };
  },
};
