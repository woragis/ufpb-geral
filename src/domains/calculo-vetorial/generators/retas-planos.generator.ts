import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_RETAS_PLANOS, type RetasPlanosData } from "../entities/types";

export const retasPlanosGenerator = {
  topicoId: TOPICO_RETAS_PLANOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const p1: [number, number, number] = [
      ctx.rng.nextInt(0, 2),
      ctx.rng.nextInt(0, 2),
      ctx.rng.nextInt(0, 2),
    ];
    const p2: [number, number, number] = [
      p1[0] + ctx.rng.nextInt(1, 3),
      p1[1] + ctx.rng.nextInt(1, 3),
      p1[2] + ctx.rng.nextInt(1, 3),
    ];

    const dados: RetasPlanosData = { tipo: "retas-planos", p1, p2 };
    const enunciado = `Encontre o vetor diretor da reta que passa por P(${p1.join(", ")}) e Q(${p2.join(", ")}).`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_RETAS_PLANOS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_RETAS_PLANOS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
