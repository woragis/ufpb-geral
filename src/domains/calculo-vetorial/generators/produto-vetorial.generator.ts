import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_PRODUTO_VETORIAL, type ProdutoVetorialData } from "../entities/types";

export const produtoVetorialGenerator = {
  topicoId: TOPICO_PRODUTO_VETORIAL,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const u: [number, number, number] = [
      ctx.rng.nextInt(1, 4),
      ctx.rng.nextInt(-2, 3),
      ctx.rng.nextInt(-2, 3),
    ];
    const v: [number, number, number] = [
      ctx.rng.nextInt(-2, 3),
      ctx.rng.nextInt(1, 4),
      ctx.rng.nextInt(-2, 3),
    ];

    const dados: ProdutoVetorialData = { tipo: "produto-vetorial", u, v };
    const enunciado = `Calcule u × v, onde u = (${u.join(", ")}) e v = (${v.join(", ")}).`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_PRODUTO_VETORIAL,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_PRODUTO_VETORIAL, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
