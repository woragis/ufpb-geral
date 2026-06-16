import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_INTEGRAIS_DEFINIDAS, type IntegraisDefinidasData } from "../entities/types";

export const integraisDefinidasGenerator = {
  topicoId: TOPICO_INTEGRAIS_DEFINIDAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.nextInt(0, 2);
    const b = ctx.rng.nextInt(3, 5);
    const c = ctx.rng.nextInt(1, 4);
    const d = ctx.rng.nextInt(0, 5);

    const dados: IntegraisDefinidasData = { tipo: "integrais-definidas", a, b, c, d };
    const enunciado = `Calcule ∫[${a}→${b}] (${c}x + ${d}) dx.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_INTEGRAIS_DEFINIDAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_INTEGRAIS_DEFINIDAS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
