import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_INDEPENDENCIA, type IndependenciaData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<IndependenciaData>[] = [
  { tipo: "independencia", gerar: gerarTeste },
  { tipo: "independencia-contraste", gerar: gerarContraste },
  { tipo: "independencia-prob", gerar: gerarProb },
];

const PARES = [
  { a: "sair cara no 1º lançamento", b: "sair cara no 2º lançamento" },
  { a: "cartão de copas", b: "carta vermelha" },
  { a: "número par", b: "múltiplo de 3" },
];

function gerarTeste(ctx: GeneratorContext): IndependenciaData {
  const nOmega = ctx.rng.pick([12, 20, 24, 30, 36]);
  const nA = ctx.rng.nextInt(3, 8);
  const nB = ctx.rng.nextInt(3, 8);
  const independente = ctx.rng.next() > (ctx.dificuldade === 1 ? 0.3 : 0.5);
  const nAinterB = independente
    ? Math.round((nA * nB) / nOmega)
    : ctx.rng.nextInt(1, Math.min(nA, nB));
  const par = ctx.rng.pick(PARES);
  return {
    tipo: "independencia",
    nOmega,
    nA,
    nB,
    nAinterB,
    descricaoA: par.a,
    descricaoB: par.b,
  };
}

function gerarContraste(ctx: GeneratorContext): IndependenciaData {
  const nOmega = ctx.rng.pick([12, 20, 24]);
  const nA = ctx.rng.nextInt(4, 8);
  const nB = ctx.rng.nextInt(4, 8);
  const exclusivos = ctx.rng.next() > 0.5;
  const nAinterB = exclusivos ? 0 : ctx.rng.nextInt(1, 3);
  return {
    tipo: "independencia-contraste",
    nOmega,
    nA,
    nB,
    nAinterB,
    descricaoA: "evento A",
    descricaoB: "evento B",
  };
}

function gerarProb(ctx: GeneratorContext): IndependenciaData {
  const pA = ctx.rng.pick([0.2, 0.3, 0.4, 0.5]);
  const pB = ctx.rng.pick([0.3, 0.4, 0.5]);
  const independente = ctx.rng.next() > 0.5;
  const pAinterB = independente
    ? Math.round(pA * pB * 100) / 100
    : Math.round(pA * pB * 0.5 * 100) / 100;
  const par = ctx.rng.pick(PARES);
  return {
    tipo: "independencia-prob",
    pA,
    pB,
    pAinterB,
    descricaoA: par.a,
    descricaoB: par.b,
  };
}

function enunciado(d: IndependenciaData): string {
  switch (d.tipo) {
    case "independencia":
      return `Em um experimento equiprovável com |Ω|=${d.nOmega}, temos |A|=${d.nA} ("${d.descricaoA}"), |B|=${d.nB} ("${d.descricaoB}") e |A∩B|=${d.nAinterB}. Os eventos A e B são independentes?`;
    case "independencia-contraste":
      return `Com |Ω|=${d.nOmega}, |A|=${d.nA}, |B|=${d.nB} e |A∩B|=${d.nAinterB}: A e B são mutuamente exclusivos? São independentes? Responda exclusivo=Sim/Não e independente=Sim/Não.`;
    case "independencia-prob":
      return `Dado P(A)=${d.pA}, P(B)=${d.pB} e P(A∩B)=${d.pAinterB}, os eventos A e B são independentes?`;
  }
}

export const independenciaGenerator = {
  topicoId: TOPICO_INDEPENDENCIA,
  version: 2,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const dados = pickCenarioByTipo(ctx, CENARIOS);
    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_INDEPENDENCIA,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_INDEPENDENCIA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
