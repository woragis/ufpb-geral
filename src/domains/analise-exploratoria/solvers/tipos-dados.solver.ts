import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_TIPOS_DADOS, type TiposDadosData } from "../entities/types";

const EXPLICACOES: Record<TiposDadosData["escalaCorreta"], string> = {
  nominal: "Categorias sem ordem natural — apenas classificam.",
  ordinal: "Categorias com ordem, mas diferenças não são uniformes.",
  intervalar: "Diferenças são significativas, mas não há zero absoluto.",
  razao: "Possui zero absoluto — razões entre valores fazem sentido.",
};

export const tiposDadosSolver: ProblemSolver = {
  topicoId: TOPICO_TIPOS_DADOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as TiposDadosData;
    const escala = d.escalaCorreta;

    return {
      problemaId: problema.id,
      respostaFinal: escala.charAt(0).toUpperCase() + escala.slice(1),
      steps: [
        {
          ordem: 1,
          titulo: "Analisar a variável",
          explicacao: `Observamos se há ordem, diferença mensurável e zero absoluto para "${d.variavel}".`,
          calculo: `Exemplos: ${d.exemplos.join(", ")}`,
        },
        {
          ordem: 2,
          titulo: "Classificar a escala",
          explicacao: EXPLICACOES[escala],
          calculo: `Escala: ${escala}`,
          resultado: escala.charAt(0).toUpperCase() + escala.slice(1),
        },
      ],
    };
  },
};
