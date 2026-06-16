import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_MEDIDAS_TENDENCIA,
  type MedidasTendenciaData,
} from "../entities/types";

export const medidasTendenciaGenerator = {
  topicoId: TOPICO_MEDIDAS_TENDENCIA,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const tamanho =
      ctx.dificuldade === 1 ? 4 : ctx.dificuldade === 2 ? 6 : 8;
    const valores = Array.from({ length: tamanho }, () =>
      ctx.rng.nextInt(1, 20),
    );

    const dados: MedidasTendenciaData = {
      tipo: "media-aritmetica",
      valores,
    };

    const lista = valores.join(", ");
    const enunciado = `Dado o conjunto de dados: {${lista}}. Calcule a média aritmética.`;

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_MEDIDAS_TENDENCIA,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_MEDIDAS_TENDENCIA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
