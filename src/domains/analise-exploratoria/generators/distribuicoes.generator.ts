import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_DISTRIBUICOES, type DistribuicoesData } from "../entities/types";

export const distribuicoesGenerator = {
  topicoId: TOPICO_DISTRIBUICOES,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const q2 = ctx.rng.nextInt(10, 20);
    const q1 = q2 - ctx.rng.nextInt(3, 6);
    const q3 = q2 + ctx.rng.nextInt(3, 6);

    const dados: DistribuicoesData = { tipo: "distribuicoes", q1, q2, q3 };
    const enunciado = `Um boxplot apresenta Q1 = ${q1}, Q2 (mediana) = ${q2} e Q3 = ${q3}. Calcule a amplitude interquartil (IQR).`;

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_DISTRIBUICOES,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_DISTRIBUICOES, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
