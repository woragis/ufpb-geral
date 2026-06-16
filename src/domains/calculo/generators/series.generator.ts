import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_SERIES, type SeriesData } from "../entities/types";

export const seriesGenerator = {
  topicoId: TOPICO_SERIES,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a1 = ctx.rng.nextInt(2, 6);
    const r = ctx.rng.pick([0.5, 0.25, 2, 3]);
    const n = ctx.rng.nextInt(3, ctx.dificuldade === 3 ? 6 : 4);

    const dados: SeriesData = { tipo: "series", a1, r, n };
    const enunciado =
      Math.abs(r) < 1
        ? `Calcule a soma da série geométrica infinita com a₁ = ${a1} e razão r = ${r}.`
        : `Calcule a soma dos primeiros ${n} termos da série geométrica com a₁ = ${a1} e r = ${r}.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_SERIES,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_SERIES, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
