import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_REGRA_CADEIA, type RegraCadeiaData } from "../entities/types";

export const regraCadeiaGenerator = {
  topicoId: TOPICO_REGRA_CADEIA,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.nextInt(1, 3);
    const b = ctx.rng.nextInt(1, 5);
    const n = ctx.rng.nextInt(2, ctx.dificuldade === 3 ? 4 : 3);
    const x0 = ctx.rng.nextInt(0, 2);

    const dados: RegraCadeiaData = { tipo: "regra-cadeia", a, b, n, x0 };
    const enunciado = `Seja h(x) = (${a}x + ${b})^${n}. Calcule h'(${x0}).`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_REGRA_CADEIA,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_REGRA_CADEIA, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
