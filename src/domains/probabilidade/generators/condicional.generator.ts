import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CONDICIONAL, type CondicionalData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<CondicionalData>[] = [
  { tipo: "condicional", gerar: gerarContagem },
  { tipo: "condicional-bayes", gerar: gerarBayes },
  { tipo: "condicional-tabela", gerar: gerarTabela },
];

const PARES = [
  { a: "estudante aprovado", b: "estudante que fez revisão" },
  { a: "peça defeituosa", b: "peça da linha A" },
  { a: "cliente satisfeito", b: "cliente que comprou online" },
];

function gerarContagem(ctx: GeneratorContext): CondicionalData {
  const nOmega = ctx.rng.nextInt(20, 50);
  const nB = ctx.rng.nextInt(6, ctx.dificuldade === 1 ? 12 : 18);
  const nAinterB = ctx.rng.nextInt(2, Math.min(nB - 1, 8));
  const nA = ctx.rng.nextInt(nAinterB + 1, nAinterB + (ctx.dificuldade === 3 ? 10 : 6));
  const par = ctx.rng.pick(PARES);
  return {
    tipo: "condicional",
    nOmega,
    nA,
    nB,
    nAinterB,
    descricaoA: par.a,
    descricaoB: par.b,
  };
}

function gerarBayes(ctx: GeneratorContext): CondicionalData {
  const pA = ctx.rng.pick([0.2, 0.3, 0.4, 0.5]);
  const pB = ctx.rng.pick([0.3, 0.4, 0.5, 0.6]);
  const pAinter = roundProb(pA * ctx.rng.pick([0.3, 0.5, 0.6, 0.8]));
  const pBA = roundProb(pAinter / pA);
  const par = ctx.rng.pick(PARES);
  return {
    tipo: "condicional-bayes",
    pA,
    pB,
    pBA,
    descricaoA: par.a,
    descricaoB: par.b,
  };
}

function gerarTabela(ctx: GeneratorContext): CondicionalData {
  const pB = ctx.rng.pick([0.25, 0.3, 0.4, 0.5]);
  const pAinterB = roundProb(pB * ctx.rng.pick([0.2, 0.3, 0.4, 0.5]));
  const par = ctx.rng.pick(PARES);
  return {
    tipo: "condicional-tabela",
    pAinterB,
    pB,
    descricaoA: par.a,
    descricaoB: par.b,
  };
}

function roundProb(x: number): number {
  return Math.round(x * 100) / 100;
}

function enunciado(d: CondicionalData): string {
  switch (d.tipo) {
    case "condicional":
      return `Em um grupo de ${d.nOmega} pessoas, ${d.nB} são "${d.descricaoB}" e ${d.nAinterB} são simultaneamente "${d.descricaoA}" e "${d.descricaoB}". Qual é P(${d.descricaoA} | ${d.descricaoB})?`;
    case "condicional-bayes":
      return `Sabe-se que P(A)=${d.pA} (${d.descricaoA}), P(B)=${d.pB} (${d.descricaoB}) e P(B|A)=${d.pBA}. Calcule P(A|B) usando o teorema de Bayes.`;
    case "condicional-tabela":
      return `Dado P(A∩B)=${d.pAinterB} e P(B)=${d.pB}, calcule P(A|B).`;
  }
}

export const condicionalGenerator = {
  topicoId: TOPICO_CONDICIONAL,
  version: 2,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["condicional", "condicional-tabela"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);
    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_CONDICIONAL,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CONDICIONAL,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
