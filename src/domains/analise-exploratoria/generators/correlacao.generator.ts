import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";

export const correlacaoGenerator = {
  topicoId: TOPICO_CORRELACAO,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const n = ctx.dificuldade === 1 ? 4 : 5;
    const xs = Array.from({ length: n }, (_, i) => i + 1);
    const ys = xs.map((x) => {
      const ruido = ctx.rng.nextInt(-1, 1);
      return 2 * x + ruido;
    });

    const dados: CorrelacaoData = { tipo: "correlacao", xs, ys };
    const pares = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
    const enunciado = `Dados os pares ${pares}, calcule o coeficiente de correlação de Pearson r (arredonde para 2 casas decimais).`;

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_CORRELACAO,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_CORRELACAO, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
