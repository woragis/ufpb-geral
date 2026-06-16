import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_LIMITES, type LimitesData } from "../entities/types";

export const limitesGenerator = {
  topicoId: TOPICO_LIMITES,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 9 : 5);
    const coeficiente = ctx.rng.pick([1, 2, 3]);
    const constante = coeficiente * a * a;

    const dados: LimitesData = {
      tipo: "limite-algebrico",
      a,
      coeficiente,
      constante,
    };

    const enunciado = `Calcule o limite: lim(x→${a}) [(${coeficiente}x² − ${constante}) / (x − ${a})]`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_LIMITES,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_LIMITES,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
