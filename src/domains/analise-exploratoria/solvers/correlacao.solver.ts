import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";
import { media, pearson } from "../lib/stats";

export const correlacaoSolver: ProblemSolver = {
  topicoId: TOPICO_CORRELACAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CorrelacaoData;
    const r = pearson(d.xs, d.ys);
    const mx = media(d.xs);
    const my = media(d.ys);

    return {
      problemaId: problema.id,
      respostaFinal: String(r),
      steps: [
        {
          ordem: 1,
          titulo: "Calcular médias",
          explicacao: "Pearson mede associação linear entre duas variáveis quantitativas.",
          calculo: `x̄ = ${mx.toFixed(2)}, ȳ = ${my.toFixed(2)}`,
        },
        {
          ordem: 2,
          titulo: "Aplicar a fórmula de Pearson",
          explicacao: "r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)² · Σ(yᵢ−ȳ)²]",
          calculo: `r ≈ ${r}`,
          resultado: String(r),
        },
      ],
    };
  },
};
