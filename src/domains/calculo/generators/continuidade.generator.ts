import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CONTINUIDADE, type ContinuidadeData } from "../entities/types";

export const continuidadeGenerator = {
  topicoId: TOPICO_CONTINUIDADE,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.nextInt(0, 3);
    const m1 = ctx.rng.nextInt(1, 4);
    const b1 = ctx.rng.nextInt(-3, 3);
    const m2 = ctx.rng.nextInt(1, 4);

    const continua = ctx.rng.next() > (ctx.dificuldade === 1 ? 0.4 : 0.5);
    const b2 = continua ? m1 * a + b1 - m2 * a : ctx.rng.nextInt(-5, 5);

    const dados: ContinuidadeData = {
      tipo: "continuidade",
      a,
      m1,
      b1,
      m2,
      b2,
      continua,
    };

    const enunciado = `A função f é definida por f(x) = ${m1}x ${b1 >= 0 ? "+" : "−"} ${Math.abs(b1)} para x < ${a} e f(x) = ${m2}x ${b2 >= 0 ? "+" : "−"} ${Math.abs(b2)} para x ≥ ${a}. A função é contínua em x = ${a}?`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_CONTINUIDADE,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_CONTINUIDADE, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
