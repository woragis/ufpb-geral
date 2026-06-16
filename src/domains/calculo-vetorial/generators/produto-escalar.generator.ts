import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_PRODUTO_ESCULAR, type ProdutoEscalarData } from "../entities/types";

export const produtoEscalarGenerator = {
  topicoId: TOPICO_PRODUTO_ESCULAR,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const u: [number, number, number] = [
      ctx.rng.nextInt(-3, 3),
      ctx.rng.nextInt(-3, 3),
      ctx.rng.nextInt(-3, 3),
    ];
    const v: [number, number, number] = [
      ctx.rng.nextInt(-3, 3),
      ctx.rng.nextInt(-3, 3),
      ctx.rng.nextInt(-3, 3),
    ];

    const dados: ProdutoEscalarData = { tipo: "produto-escalar", u, v };
    const enunciado = `Calcule o produto escalar u·v, onde u = (${u.join(", ")}) e v = (${v.join(", ")}).`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_PRODUTO_ESCULAR,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_PRODUTO_ESCULAR, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
