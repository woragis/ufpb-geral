import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_EVENTOS, type EventosData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<EventosData>[] = [
  { tipo: "eventos", gerar: gerarCardinalidade },
  { tipo: "eventos-probabilidade", gerar: gerarProbabilidade },
  { tipo: "eventos-exclusivos", gerar: gerarExclusivos },
];

const DESCRICOES = [
  { a: "número par", b: "número maior que 10" },
  { a: "múltiplo de 3", b: "múltiplo de 5" },
  { a: "menor que 8", b: "maior que 12" },
  { a: "número primo", b: "divisível por 4" },
  { a: "face par no dado", b: "face ímpar no dado" },
];

function baseContagens(ctx: GeneratorContext) {
  const nOmega = ctx.rng.pick([20, 24, 30, 36]);
  const nA = ctx.rng.nextInt(4, ctx.dificuldade === 1 ? 8 : 10);
  const nB = ctx.rng.nextInt(4, ctx.dificuldade === 1 ? 8 : 12);
  const nAinterB = ctx.rng.nextInt(1, Math.min(nA, nB) - 1);
  const desc = ctx.rng.pick(DESCRICOES);
  return { nOmega, nA, nB, nAinterB, descricaoA: desc.a, descricaoB: desc.b };
}

function gerarCardinalidade(ctx: GeneratorContext): EventosData {
  const base = baseContagens(ctx);
  const operacoes: Array<"uniao" | "intersecao" | "complemento"> =
    ctx.dificuldade === 1
      ? ["uniao", "intersecao"]
      : ["uniao", "intersecao", "complemento"];
  return { tipo: "eventos", operacao: ctx.rng.pick(operacoes), ...base };
}

function gerarProbabilidade(ctx: GeneratorContext): EventosData {
  const base = baseContagens(ctx);
  const operacoes: Array<"uniao" | "intersecao" | "complemento"> =
    ctx.dificuldade === 1 ? ["uniao"] : ["uniao", "intersecao", "complemento"];
  return {
    tipo: "eventos-probabilidade",
    operacao: ctx.rng.pick(operacoes),
    ...base,
  };
}

function gerarExclusivos(ctx: GeneratorContext): EventosData {
  const nOmega = ctx.rng.pick([20, 24, 30]);
  const nA = ctx.rng.nextInt(4, 10);
  const nB = ctx.rng.nextInt(4, 10);
  const desc = ctx.rng.pick(DESCRICOES);
  return {
    tipo: "eventos-exclusivos",
    nOmega,
    nA,
    nB,
    descricaoA: desc.a,
    descricaoB: desc.b,
  };
}

function enunciado(d: EventosData): string {
  if (d.tipo === "eventos-exclusivos") {
    return `Em Ω com ${d.nOmega} resultados equiprováveis, A e B são mutuamente exclusivos com |A|=${d.nA} ("${d.descricaoA}") e |B|=${d.nB} ("${d.descricaoB}"). Calcule |A∪B|.`;
  }

  const prob = d.tipo === "eventos-probabilidade";
  const prefix = `Em Ω com ${d.nOmega} resultados equiprováveis`;

  if (d.operacao === "complemento") {
    return prob
      ? `${prefix}, P(A) = ${d.nA}/${d.nOmega} para A = "${d.descricaoA}". Calcule P(Aᶜ).`
      : `${prefix}, o evento A é "${d.descricaoA}" com ${d.nA} elementos. Qual é n(Aᶜ)?`;
  }
  if (d.operacao === "uniao") {
    return prob
      ? `${prefix}, |A|=${d.nA}, |B|=${d.nB}, |A∩B|=${d.nAinterB}. Calcule P(A∪B).`
      : `${prefix}, A = "${d.descricaoA}" (|A|=${d.nA}) e B = "${d.descricaoB}" (|B|=${d.nB}), com |A∩B|=${d.nAinterB}. Calcule |A∪B|.`;
  }
  return prob
    ? `${prefix}, |A∩B|=${d.nAinterB}. Calcule P(A∩B).`
    : `${prefix}, A = "${d.descricaoA}" (|A|=${d.nA}) e B = "${d.descricaoB}" (|B|=${d.nB}), com |A∩B|=${d.nAinterB}. Calcule |A∩B|.`;
}

export const eventosGenerator = {
  topicoId: TOPICO_EVENTOS,
  version: 2,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const dados = pickCenarioByTipo(ctx, CENARIOS);
    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_EVENTOS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_EVENTOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
