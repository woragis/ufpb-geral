import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { nonZeroVec3, randVec2or3 } from "../lib/vec";
import { TOPICO_VETORES, type VetoresData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<VetoresData>[] = [
  { tipo: "vetores", gerar: gerarModulo },
  { tipo: "vetores-soma", gerar: gerarSoma },
  { tipo: "vetores-escalar", gerar: gerarEscalar },
  { tipo: "vetores-unitario", gerar: gerarUnitario },
  { tipo: "vetores-distancia", gerar: gerarDistancia },
  { tipo: "vetores-paralelo", gerar: gerarParalelo },
];

function gerarModulo(ctx: GeneratorContext): VetoresData {
  const { dimensao, componentes } = randVec2or3(ctx);
  return { tipo: "vetores", dimensao, componentes };
}

function gerarSoma(ctx: GeneratorContext): VetoresData {
  const { dimensao, componentes: u } = randVec2or3(ctx);
  const v = Array.from({ length: dimensao }, () => ctx.rng.nextInt(-5, 5));
  return { tipo: "vetores-soma", dimensao, u, v };
}

function gerarEscalar(ctx: GeneratorContext): VetoresData {
  const k = ctx.rng.pick([2, 3, -2, -3, 4]);
  const componentes = Array.from({ length: 3 }, () => ctx.rng.nextInt(-4, 4));
  return { tipo: "vetores-escalar", k, componentes };
}

function gerarUnitario(ctx: GeneratorContext): VetoresData {
  const dimensao: 2 | 3 =
    ctx.dificuldade === 1 ? 2 : ctx.rng.pick([2, 3] as const);
  let componentes = Array.from({ length: dimensao }, () =>
    ctx.rng.nextInt(-5, 5),
  );
  if (componentes.every((c) => c === 0)) {
    componentes = componentes.map((_, i) => (i === 0 ? ctx.rng.nextInt(1, 3) : 0));
  }
  return { tipo: "vetores-unitario", dimensao, componentes };
}

function gerarDistancia(ctx: GeneratorContext): VetoresData {
  const p: [number, number, number] = [
    ctx.rng.nextInt(-3, 3),
    ctx.rng.nextInt(-3, 3),
    ctx.rng.nextInt(-3, 3),
  ];
  const q: [number, number, number] = [
    p[0] + ctx.rng.nextInt(1, 4),
    p[1] + ctx.rng.nextInt(1, 4),
    p[2] + ctx.rng.nextInt(0, 3),
  ];
  return { tipo: "vetores-distancia", p, q };
}

function gerarParalelo(ctx: GeneratorContext): VetoresData {
  if (ctx.rng.next() > 0.5) {
    const u = nonZeroVec3(ctx.rng);
    const k = ctx.rng.pick([2, 3, -2]);
    const v: [number, number, number] = [k * u[0], k * u[1], k * u[2]];
    return { tipo: "vetores-paralelo", u, v };
  }
  const u = nonZeroVec3(ctx.rng);
  const v = nonZeroVec3(ctx.rng);
  return { tipo: "vetores-paralelo", u, v };
}

function enunciado(d: VetoresData): string {
  switch (d.tipo) {
    case "vetores": {
      const not =
        d.dimensao === 2
          ? `(${d.componentes.join(", ")})`
          : `(${d.componentes.join(", ")})`;
      return `Calcule o módulo do vetor v = ${not}.`;
    }
    case "vetores-soma": {
      const fmt = (v: number[]) =>
        d.dimensao === 2 ? `(${v[0]}, ${v[1]})` : `(${v.join(", ")})`;
      return `Calcule u + v, onde u = ${fmt(d.u)} e v = ${fmt(d.v)}.`;
    }
    case "vetores-escalar": {
      return `Calcule ${d.k}·v, onde v = (${d.componentes.join(", ")}).`;
    }
    case "vetores-unitario": {
      const not =
        d.dimensao === 2
          ? `(${d.componentes[0]}, ${d.componentes[1]})`
          : `(${d.componentes.join(", ")})`;
      return `Encontre o vetor unitário na direção de v = ${not}.`;
    }
    case "vetores-distancia":
      return `Calcule a distância entre os pontos P(${d.p.join(", ")}) e Q(${d.q.join(", ")}).`;
    case "vetores-paralelo":
      return `Os vetores u = (${d.u.join(", ")}) e v = (${d.v.join(", ")}) são paralelos? Responda Sim ou Não.`;
  }
}

export const vetoresGenerator = {
  topicoId: TOPICO_VETORES,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) => ["vetores", "vetores-soma"].includes(c.tipo))
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_VETORES,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_VETORES,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
