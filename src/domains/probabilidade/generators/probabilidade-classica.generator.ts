import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { comporEventoDadoDuplo } from "../lib/compose";
import {
  TOPICO_PROBABILIDADE_CLASSICA,
  type ProbabilidadeClassicaData,
  type ProbabilidadeClassicaUrnaData,
} from "../entities/types";

const CORES = [
  { nome: "vermelhas", cor: "vermelha" },
  { nome: "azuis", cor: "azul" },
  { nome: "verdes", cor: "verde" },
  { nome: "amarelas", cor: "amarela" },
] as const;

function gerarComposta(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const evento = comporEventoDadoDuplo(ctx);
  return {
    tipo: "probabilidade-classica-composta",
    descricao: evento.descricao,
    favoraveis: evento.favoraveis,
    total: evento.total,
  };
}

const CENARIOS: Array<(ctx: GeneratorContext) => ProbabilidadeClassicaData> = [
  gerarUrna,
  gerarSemReposicao,
  gerarDadoSoma,
  gerarBaralho,
  gerarComites,
  gerarModular,
  gerarComposta,
];

function gerarUrna(ctx: GeneratorContext): ProbabilidadeClassicaUrnaData {
  const numCores = ctx.dificuldade === 1 ? 2 : ctx.dificuldade === 2 ? 3 : 4;
  const selecionadas = ctx.rng.shuffle(CORES).slice(0, numCores);
  const cores: Record<string, number> = {};
  for (const item of selecionadas) {
    cores[item.cor] = ctx.rng.nextInt(
      ctx.dificuldade === 1 ? 1 : 2,
      ctx.dificuldade === 3 ? 8 : 6,
    );
  }
  const corAlvo = ctx.rng.pick(selecionadas).cor;
  return { tipo: "probabilidade-classica", corAlvo, cores };
}

function gerarSemReposicao(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const urna = gerarUrna(ctx);
  return {
    tipo: "probabilidade-classica-sem-reposicao",
    corAlvo: urna.corAlvo,
    cores: urna.cores,
    retiradas: 2,
  };
}

function gerarDadoSoma(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const somaAlvo = ctx.rng.nextInt(2, 12);
  return { tipo: "probabilidade-classica-dado-soma", somaAlvo };
}

function gerarBaralho(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const evento = ctx.rng.pick(["naipe", "figura", "as"] as const);
  const naipeAlvo =
    evento === "naipe"
      ? ctx.rng.pick(["copas", "espadas", "ouros", "paus"] as const)
      : undefined;
  return { tipo: "probabilidade-classica-baralho", evento, naipeAlvo };
}

function gerarComites(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const n = ctx.rng.pick([8, 10, 12]);
  const k = ctx.rng.nextInt(2, Math.min(4, n - 1));
  const obrigatorio = ctx.rng.next() > 0.5;
  return { tipo: "probabilidade-classica-comites", n, k, obrigatorio };
}

function gerarModular(ctx: GeneratorContext): ProbabilidadeClassicaData {
  const modulo = ctx.rng.pick([3, 4, 5]);
  const resto = ctx.rng.nextInt(0, modulo - 1);
  const transformacao = ctx.rng.pick([
    "soma",
    "abs-soma",
    "produto",
  ] as const);
  return {
    tipo: "probabilidade-classica-modular",
    modulo,
    resto,
    transformacao,
  };
}

function enunciadoUrna(d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica" }>): string {
  const descricaoUrna = Object.entries(d.cores)
    .map(([cor, qtd]) => `${qtd} bola${qtd > 1 ? "s" : ""} ${cor}${qtd > 1 ? "s" : ""}`)
    .join(", ");
  return `Uma urna contém ${descricaoUrna}. Uma bola é sorteada ao acaso. Qual é a probabilidade de sair uma bola ${d.corAlvo}?`;
}

function enunciado(d: ProbabilidadeClassicaData): string {
  switch (d.tipo) {
    case "probabilidade-classica":
      return enunciadoUrna(d);
    case "probabilidade-classica-sem-reposicao": {
      const descricaoUrna = Object.entries(d.cores)
        .map(([cor, qtd]) => `${qtd} bola${qtd > 1 ? "s" : ""} ${cor}${qtd > 1 ? "s" : ""}`)
        .join(", ");
      return `Uma urna contém ${descricaoUrna}. Duas bolas são sorteadas sem reposição. Qual é a probabilidade de ambas serem ${d.corAlvo}?`;
    }
    case "probabilidade-classica-dado-soma":
      return `Dois dados de 6 faces são lançados. Qual é a probabilidade da soma ser ${d.somaAlvo}?`;
    case "probabilidade-classica-baralho":
      if (d.evento === "as") {
        return "Uma carta é sorteada de um baralho de 52. Qual é a probabilidade de ser um ás?";
      }
      if (d.evento === "figura") {
        return "Uma carta é sorteada de um baralho de 52. Qual é a probabilidade de ser uma figura (J, Q ou K)?";
      }
      return `Uma carta é sorteada de um baralho de 52. Qual é a probabilidade de ser de ${d.naipeAlvo}?`;
    case "probabilidade-classica-comites":
      return d.obrigatorio
        ? `De ${d.n} pessoas, quantas comissões de ${d.k} pessoas incluem uma pessoa específica? Qual a probabilidade de ela estar na comissão sorteada uniformemente entre todas as comissões possíveis?`
        : `De ${d.n} pessoas, uma comissão de ${d.k} é sorteada uniformemente entre todas as comissões possíveis. Qual é a probabilidade de uma pessoa específica estar na comissão?`;
    case "probabilidade-classica-modular": {
      const rotulo =
        d.transformacao === "soma"
          ? "soma"
          : d.transformacao === "abs-soma"
            ? "valor absoluto da soma"
            : "produto";
      return `Dois dados são lançados. Qual é a probabilidade de o ${rotulo} deixar resto ${d.resto} ao dividir por ${d.modulo}?`;
    }
    case "probabilidade-classica-composta":
      return `Dois dados são lançados. Qual é a probabilidade de ${d.descricao}?`;
  }
}

export const probabilidadeClassicaGenerator = {
  topicoId: TOPICO_PROBABILIDADE_CLASSICA,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarUrna, gerarDadoSoma, gerarBaralho]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_PROBABILIDADE_CLASSICA,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_PROBABILIDADE_CLASSICA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
