import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_AREA, type AreaData } from "../entities/types";

export const areaGenerator = {
  topicoId: TOPICO_AREA,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const m = ctx.rng.nextInt(1, 3);
    const b = ctx.rng.nextInt(0, 4);
    const a = 0;
    const c = ctx.rng.nextInt(2, 5);

    const dados: AreaData = { tipo: "area", m, b, a, c };
    const enunciado = `Calcule a área sob a curva f(x) = ${m}x + ${b} entre x = ${a} e x = ${c}.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_AREA,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_AREA, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
