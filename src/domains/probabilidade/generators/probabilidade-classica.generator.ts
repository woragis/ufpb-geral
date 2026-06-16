import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_PROBABILIDADE_CLASSICA,
  type ProbabilidadeClassicaData,
} from "../entities/types";

const CORES = [
  { nome: "vermelhas", cor: "vermelha" },
  { nome: "azuis", cor: "azul" },
  { nome: "verdes", cor: "verde" },
  { nome: "amarelas", cor: "amarela" },
] as const;

export const probabilidadeClassicaGenerator = {
  topicoId: TOPICO_PROBABILIDADE_CLASSICA,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const numCores =
      ctx.dificuldade === 1 ? 2 : ctx.dificuldade === 2 ? 3 : 4;

    const selecionadas = ctx.rng.shuffle(CORES).slice(0, numCores);
    const cores: Record<string, number> = {};

    for (const item of selecionadas) {
      const min = ctx.dificuldade === 1 ? 1 : 2;
      const max = ctx.dificuldade === 3 ? 8 : 6;
      cores[item.cor] = ctx.rng.nextInt(min, max);
    }

    const corAlvo = ctx.rng.pick(selecionadas).cor;
    const descricaoUrna = selecionadas
      .map((c) => `${cores[c.cor]} bola${cores[c.cor]! > 1 ? "s" : ""} ${c.nome}`)
      .join(", ");

    const dados: ProbabilidadeClassicaData = {
      tipo: "probabilidade-classica",
      corAlvo,
      cores,
    };

    const enunciado = `Uma urna contém ${descricaoUrna}. Uma bola é sorteada ao acaso e de forma uniforme. Qual é a probabilidade de sair uma bola ${corAlvo}?`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_PROBABILIDADE_CLASSICA,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_PROBABILIDADE_CLASSICA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
