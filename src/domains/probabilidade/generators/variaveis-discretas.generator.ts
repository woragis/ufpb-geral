import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_VARIAVEIS_DISCRETAS,
  type VariaveisDiscretasData,
} from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => VariaveisDiscretasData> = [
  gerarEsperanca,
  gerarProbabilidade,
  gerarVariancia,
  gerarAcumulada,
  gerarBinomial,
  gerarGeometrica,
];

function gerarTabela(ctx: GeneratorContext) {
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
  return { valores, probabilidades: probs };
}

function gerarEsperanca(ctx: GeneratorContext): VariaveisDiscretasData {
  const { valores, probabilidades } = gerarTabela(ctx);
  return { tipo: "variaveis-discretas", pergunta: "esperanca", valores, probabilidades };
}

function gerarProbabilidade(ctx: GeneratorContext): VariaveisDiscretasData {
  const { valores, probabilidades } = gerarTabela(ctx);
  const valorAlvo = ctx.rng.pick(valores);
  return {
    tipo: "variaveis-discretas",
    pergunta: "probabilidade",
    valores,
    probabilidades,
    valorAlvo,
  };
}

function gerarVariancia(ctx: GeneratorContext): VariaveisDiscretasData {
  const { valores, probabilidades } = gerarTabela(ctx);
  return { tipo: "variaveis-discretas-variancia", valores, probabilidades };
}

function gerarAcumulada(ctx: GeneratorContext): VariaveisDiscretasData {
  const { valores, probabilidades } = gerarTabela(ctx);
  const limite = ctx.rng.pick(valores);
  return { tipo: "variaveis-discretas-acumulada", valores, probabilidades, limite };
}

function gerarBinomial(ctx: GeneratorContext): VariaveisDiscretasData {
  const n = ctx.rng.pick([4, 5, 6, 8, 10]);
  const p = ctx.rng.pick([0.2, 0.3, 0.4, 0.5]);
  const k = ctx.rng.nextInt(0, n);
  return { tipo: "variaveis-discretas-binomial", n, p, k };
}

function gerarGeometrica(ctx: GeneratorContext): VariaveisDiscretasData {
  const p = ctx.rng.pick([0.2, 0.25, 0.3, 0.4, 0.5]);
  const k = ctx.rng.nextInt(1, 5);
  return { tipo: "variaveis-discretas-geometrica", p, k };
}

function tabelaStr(valores: number[], probs: number[]): string {
  return valores.map((v, i) => `P(X=${v}) = ${probs[i]}`).join(", ");
}

function enunciado(d: VariaveisDiscretasData): string {
  switch (d.tipo) {
    case "variaveis-discretas":
      return d.pergunta === "esperanca"
        ? `A variável X tem distribuição: ${tabelaStr(d.valores, d.probabilidades)}. Calcule E[X].`
        : `A variável X tem distribuição: ${tabelaStr(d.valores, d.probabilidades)}. Calcule P(X = ${d.valorAlvo}).`;
    case "variaveis-discretas-variancia":
      return `A variável X tem distribuição: ${tabelaStr(d.valores, d.probabilidades)}. Calcule Var(X).`;
    case "variaveis-discretas-acumulada":
      return `A variável X tem distribuição: ${tabelaStr(d.valores, d.probabilidades)}. Calcule P(X ≤ ${d.limite}).`;
    case "variaveis-discretas-binomial":
      return `X ~ Binomial(n=${d.n}, p=${d.p}). Calcule P(X = ${d.k}).`;
    case "variaveis-discretas-geometrica":
      return `X segue distribuição geométrica com P(sucesso)=${d.p} em cada tentativa. Calcule P(X = ${d.k}), ou seja, o primeiro sucesso ocorrer na ${d.k}ª tentativa.`;
  }
}

export const variaveisDiscretasGenerator = {
  topicoId: TOPICO_VARIAVEIS_DISCRETAS,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarEsperanca, gerarProbabilidade, gerarBinomial]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);
    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_VARIAVEIS_DISCRETAS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_VARIAVEIS_DISCRETAS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
