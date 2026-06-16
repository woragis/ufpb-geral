import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_ESPACO_AMOSTRAL,
  type EspacoAmostralData,
} from "../entities/types";

export const espacoAmostralGenerator = {
  topicoId: TOPICO_ESPACO_AMOSTRAL,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const experimentos: EspacoAmostralData["experimento"][] = [
      "moeda",
      "dado",
      "dado-duplo",
    ];

    let experimento = ctx.rng.pick(experimentos);
    if (ctx.dificuldade === 1) {
      experimento = ctx.rng.pick(["moeda", "dado"] as const);
    }

    const pergunta: EspacoAmostralData["pergunta"] =
      ctx.dificuldade === 3 ? "listar" : "cardinalidade";

    const dados: EspacoAmostralData = {
      tipo: "espaco-amostral",
      experimento,
      pergunta,
    };

    const labels: Record<EspacoAmostralData["experimento"], string> = {
      moeda: "lançamento de uma moeda",
      dado: "lançamento de um dado de 6 faces",
      "dado-duplo": "lançamento de dois dados de 6 faces",
    };

    const enunciado =
      pergunta === "cardinalidade"
        ? `Considere o experimento: ${labels[experimento]}. Qual é a cardinalidade do espaço amostral?`
        : `Considere o experimento: ${labels[experimento]}. Liste todos os elementos do espaço amostral e informe sua cardinalidade.`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_ESPACO_AMOSTRAL,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_ESPACO_AMOSTRAL,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
