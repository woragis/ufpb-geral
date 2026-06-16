import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CURVAS, type CurvasData } from "../entities/types";

export const curvasGenerator = {
  topicoId: TOPICO_CURVAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.nextInt(1, 3);
    const b = ctx.rng.nextInt(0, 2);
    const t0 = ctx.rng.nextInt(1, 3);

    const dados: CurvasData = { tipo: "curvas", a, b, t0 };
    const enunciado = `A curva r(t) = (${a}t, t² + ${b}) descreve uma trajetória. Calcule a velocidade |r'(t)| em t = ${t0}.`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_CURVAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_CURVAS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
