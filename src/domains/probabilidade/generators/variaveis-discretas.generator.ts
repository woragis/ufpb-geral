import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_VARIAVEIS_DISCRETAS,
  type VariaveisDiscretasData,
} from "../entities/types";

export const variaveisDiscretasGenerator = {
  topicoId: TOPICO_VARIAVEIS_DISCRETAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const tamanho = ctx.dificuldade === 1 ? 3 : ctx.dificuldade === 2 ? 4 : 5;
    const valores = Array.from({ length: tamanho }, (_, i) =>
      ctx.rng.nextInt(0, ctx.dificuldade === 3 ? 6 : 4),
    );

    let probs = Array.from({ length: tamanho }, () => ctx.rng.nextInt(1, 5));
    const soma = probs.reduce((a, b) => a + b, 0);
    probs = probs.map((p) => Math.round((p / soma) * 100) / 100);

    const somaAjustada = probs.reduce((a, b) => a + b, 0);
    probs[probs.length - 1] =
      Math.round((probs[probs.length - 1]! + (1 - somaAjustada)) * 100) / 100;

    const pergunta: VariaveisDiscretasData["pergunta"] =
      ctx.dificuldade === 1 || ctx.rng.next() > 0.5 ? "esperanca" : "probabilidade";
    const valorAlvo =
      pergunta === "probabilidade" ? ctx.rng.pick(valores) : undefined;

    const dados: VariaveisDiscretasData = {
      tipo: "variaveis-discretas",
      pergunta,
      valores,
      probabilidades: probs,
      valorAlvo,
    };

    const tabela = valores
      .map((v, i) => `P(X=${v}) = ${probs[i]}`)
      .join(", ");

    const enunciado =
      pergunta === "esperanca"
        ? `A variável aleatória discreta X tem distribuição: ${tabela}. Calcule E[X].`
        : `A variável aleatória discreta X tem distribuição: ${tabela}. Calcule P(X = ${valorAlvo}).`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_VARIAVEIS_DISCRETAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_VARIAVEIS_DISCRETAS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
