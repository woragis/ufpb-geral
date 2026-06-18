import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { nonZeroVec3, randVec3 } from "../lib/vec";
import { TOPICO_PRODUTO_ESCULAR, type ProdutoEscalarData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<ProdutoEscalarData>[] = [
  { tipo: "produto-escalar", gerar: gerarDot },
  { tipo: "produto-escalar-angulo", gerar: gerarAngulo },
  { tipo: "produto-escalar-projecao", gerar: gerarProjecao },
  { tipo: "produto-escalar-ortogonal", gerar: gerarOrtogonal },
];

function gerarDot(ctx: GeneratorContext): ProdutoEscalarData {
  return { tipo: "produto-escalar", u: randVec3(ctx.rng), v: randVec3(ctx.rng) };
}

function gerarAngulo(ctx: GeneratorContext): ProdutoEscalarData {
  const u = nonZeroVec3(ctx.rng);
  const v = nonZeroVec3(ctx.rng);
  return { tipo: "produto-escalar-angulo", u, v };
}

function gerarProjecao(ctx: GeneratorContext): ProdutoEscalarData {
  const u = randVec3(ctx.rng);
  const v = nonZeroVec3(ctx.rng);
  return { tipo: "produto-escalar-projecao", u, v };
}

function gerarOrtogonal(ctx: GeneratorContext): ProdutoEscalarData {
  if (ctx.rng.next() > 0.5) {
    const u = nonZeroVec3(ctx.rng);
    const v: [number, number, number] = [
      -u[1],
      u[0],
      0,
    ];
    return { tipo: "produto-escalar-ortogonal", u, v };
  }
  const u = nonZeroVec3(ctx.rng);
  const v = randVec3(ctx.rng);
  return { tipo: "produto-escalar-ortogonal", u, v };
}

function enunciado(d: ProdutoEscalarData): string {
  const fmt = (v: [number, number, number]) => `(${v.join(", ")})`;
  switch (d.tipo) {
    case "produto-escalar":
      return `Calcule o produto escalar u·v, onde u = ${fmt(d.u)} e v = ${fmt(d.v)}.`;
    case "produto-escalar-angulo":
      return `Calcule o ângulo θ entre u = ${fmt(d.u)} e v = ${fmt(d.v)} (em graus, arredondado).`;
    case "produto-escalar-projecao":
      return `Calcule a projeção escalar de u sobre v, onde u = ${fmt(d.u)} e v = ${fmt(d.v)}.`;
    case "produto-escalar-ortogonal":
      return `Os vetores u = ${fmt(d.u)} e v = ${fmt(d.v)} são ortogonais? Responda Sim ou Não.`;
  }
}

export const produtoEscalarGenerator = {
  topicoId: TOPICO_PRODUTO_ESCULAR,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["produto-escalar", "produto-escalar-angulo"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_PRODUTO_ESCULAR,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_PRODUTO_ESCULAR,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
