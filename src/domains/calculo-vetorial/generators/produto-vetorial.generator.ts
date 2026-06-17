import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_PRODUTO_VETORIAL, type ProdutoVetorialData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => ProdutoVetorialData> = [
  gerarCross,
  gerarArea,
  gerarMisto,
];

function gerarCross(ctx: GeneratorContext): ProdutoVetorialData {
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
  return { tipo: "produto-vetorial", u, v };
}

function gerarArea(ctx: GeneratorContext): ProdutoVetorialData {
  const u: [number, number, number] = [ctx.rng.nextInt(1, 5), 0, 0];
  const v: [number, number, number] = [0, ctx.rng.nextInt(1, 5), 0];
  return { tipo: "produto-vetorial-area", u, v };
}

function gerarMisto(ctx: GeneratorContext): ProdutoVetorialData {
  const u: [number, number, number] = [
    ctx.rng.nextInt(1, 3),
    0,
    0,
  ];
  const v: [number, number, number] = [
    0,
    ctx.rng.nextInt(1, 3),
    0,
  ];
  const w: [number, number, number] = [
    0,
    0,
    ctx.rng.nextInt(1, 3),
  ];
  return { tipo: "produto-vetorial-misto", u, v, w };
}

function enunciado(d: ProdutoVetorialData): string {
  const fmt = (v: [number, number, number]) => `(${v.join(", ")})`;
  if (d.tipo === "produto-vetorial-area") {
    return `Calcule a área do paralelogramo determinado por u = ${fmt(d.u)} e v = ${fmt(d.v)}.`;
  }
  if (d.tipo === "produto-vetorial-misto") {
    return `Calcule o volume do paralelepípedo determinado por u = ${fmt(d.u)}, v = ${fmt(d.v)} e w = ${fmt(d.w)} usando o produto misto |u·(v×w)|.`;
  }
  return `Calcule u × v, onde u = ${fmt(d.u)} e v = ${fmt(d.v)}.`;
}

export const produtoVetorialGenerator = {
  topicoId: TOPICO_PRODUTO_VETORIAL,
  version: 3,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1 ? [gerarCross, gerarArea] : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);
    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_PRODUTO_VETORIAL,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_PRODUTO_VETORIAL,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
