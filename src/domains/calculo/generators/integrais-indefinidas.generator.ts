import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_INTEGRAIS_INDEFINIDAS, type IntegraisIndefinidasData } from "../entities/types";

export const integraisIndefinidasGenerator = {
  topicoId: TOPICO_INTEGRAIS_INDEFINIDAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const n = ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 5 : 4);
    const dados: IntegraisIndefinidasData = { tipo: "integrais-indefinidas", n };
    const enunciado = `Calcule ∫ x^${n} dx.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_INTEGRAIS_INDEFINIDAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_INTEGRAIS_INDEFINIDAS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
