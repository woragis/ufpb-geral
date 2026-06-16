import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_EDOS, type EdosData } from "../entities/types";

export const edosGenerator = {
  topicoId: TOPICO_EDOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const k = ctx.rng.pick([2, 3, 4]);
    const y0 = ctx.rng.nextInt(1, 5);
    const x = ctx.rng.nextInt(1, 3);

    const dados: EdosData = { tipo: "edos", k, y0, x };
    const enunciado = `Resolva a EDO dy/dx = ${k}y com condição inicial y(0) = ${y0} e calcule y(${x}).`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_EDOS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_EDOS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
