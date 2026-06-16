import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_LIMITES, type LimitesData } from "../entities/types";

export const limitesSolver: ProblemSolver = {
  topicoId: TOPICO_LIMITES,

  resolver(problema: Problem): Solution {
    const { a, coeficiente, constante } = problema.dados as LimitesData;
    const resultado = 2 * coeficiente * a;

    return {
      problemaId: problema.id,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Verificar indeterminação",
          explicacao:
            "Substituindo x = a, o numerador e denominador se anulam — temos 0/0.",
          calculo: `x = ${a} → (${coeficiente}·${a}² − ${constante}) / (${a} − ${a}) = 0/0`,
        },
        {
          ordem: 2,
          titulo: "Fatorar o numerador",
          explicacao:
            "Reconhecemos uma diferença de quadrados: ax² − c = a(x² − a²) = a(x−a)(x+a).",
          calculo: `${coeficiente}x² − ${constante} = ${coeficiente}(x − ${a})(x + ${a})`,
        },
        {
          ordem: 3,
          titulo: "Simplificar a fração",
          explicacao: "Cancelamos o fator (x − a) comum, válido pois x → a, x ≠ a.",
          calculo: `[${coeficiente}(x − ${a})(x + ${a})] / (x − ${a}) = ${coeficiente}(x + ${a})`,
        },
        {
          ordem: 4,
          titulo: "Calcular o limite",
          explicacao: "Agora podemos substituir x = a diretamente.",
          calculo: `lim(x→${a}) ${coeficiente}(x + ${a}) = ${coeficiente}(${a} + ${a}) = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  },
};
