import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_SEQUENCIAS, type SequenciasData } from "../entities/types";

export const sequenciasGenerator = {
  topicoId: TOPICO_SEQUENCIAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const numeradorCoef = ctx.rng.nextInt(2, 5);
    const numeradorConst = ctx.rng.nextInt(1, 4);
    const denominadorCoef = ctx.rng.nextInt(2, 5);
    const denominadorConst = ctx.rng.nextInt(-2, 3);

    const dados: SequenciasData = {
      tipo: "sequencias",
      numeradorCoef,
      numeradorConst,
      denominadorCoef,
      denominadorConst,
    };

    const enunciado = `Calcule o limite da sequência aₙ = (${numeradorCoef}n + ${numeradorConst})/(${denominadorCoef}n ${denominadorConst >= 0 ? "+" : "−"} ${Math.abs(denominadorConst)}) quando n → ∞.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_SEQUENCIAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_SEQUENCIAS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
