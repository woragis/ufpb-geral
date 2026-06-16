import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_OTIMIZACAO, type OtimizacaoData } from "../entities/types";

export const otimizacaoGenerator = {
  topicoId: TOPICO_OTIMIZACAO,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const a = ctx.rng.pick([1, 2, 3]);
    const b = ctx.rng.nextInt(2, 8) * (ctx.rng.next() > 0.5 ? 1 : -1);
    const c = ctx.rng.nextInt(0, 10);

    const dados: OtimizacaoData = { tipo: "otimizacao", a, b, c };
    const enunciado = `Encontre o valor de x que minimiza f(x) = ${a}x² ${b >= 0 ? "+" : "−"} ${Math.abs(b)}x + ${c}.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_OTIMIZACAO,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_OTIMIZACAO, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
