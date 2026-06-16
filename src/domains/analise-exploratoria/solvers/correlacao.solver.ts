import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i]! - mx;
    const dy = ys[i]! - my;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  return num / Math.sqrt(denX * denY);
}

export const correlacaoSolver: ProblemSolver = {
  topicoId: TOPICO_CORRELACAO,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CorrelacaoData;
    const r = Math.round(pearson(d.xs, d.ys) * 100) / 100;
    const n = d.xs.length;
    const mx = d.xs.reduce((a, b) => a + b, 0) / n;
    const my = d.ys.reduce((a, b) => a + b, 0) / n;

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
