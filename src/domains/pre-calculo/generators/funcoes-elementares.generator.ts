import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_FUNCOES_ELEMENTARES,
  type FuncoesElementaresData,
} from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => FuncoesElementaresData> = [
  gerarAfim,
  gerarQuadratica,
  gerarExponencial,
  gerarLogaritmica,
  gerarAfimRaiz,
  gerarQuadraticaVertice,
];

function gerarAfim(ctx: GeneratorContext): FuncoesElementaresData {
  const a = ctx.rng.pick([2, 3, -2, -3, 4, 5]);
  const b = ctx.rng.nextInt(1, 8) * (ctx.rng.next() > 0.5 ? 1 : -1);
  const x0 = ctx.rng.nextInt(-4, 6);
  return { tipo: "funcao-afim", a, b, pergunta: "avaliar", x0 };
}

function gerarAfimRaiz(ctx: GeneratorContext): FuncoesElementaresData {
  const a = ctx.rng.pick([2, 3, 4, 5]);
  const x0 = ctx.rng.nextInt(1, 6);
  const b = -a * x0;
  return { tipo: "funcao-afim", a, b, pergunta: "raiz", x0 };
}

function gerarQuadratica(ctx: GeneratorContext): FuncoesElementaresData {
  const a = ctx.rng.pick([1, 2, -1, -2]);
  const b = ctx.rng.nextInt(-6, 6);
  const c = ctx.rng.nextInt(-4, 8);
  const x0 = ctx.rng.nextInt(-3, 4);
  const pergunta = ctx.rng.pick(["discriminante", "avaliar"] as const);
  return { tipo: "funcao-quadratica", a, b, c, pergunta, x0 };
}

function gerarQuadraticaVertice(ctx: GeneratorContext): FuncoesElementaresData {
  const a = ctx.rng.pick([1, 2, -1, -2]);
  const b = ctx.rng.nextInt(-8, 8);
  const c = ctx.rng.nextInt(0, 10);
  return { tipo: "funcao-quadratica", a, b, c, pergunta: "vertice", x0: 0 };
}

function gerarExponencial(ctx: GeneratorContext): FuncoesElementaresData {
  const base = ctx.rng.pick([2, 3, 5]);
  const expoente = ctx.rng.nextInt(2, ctx.dificuldade === 1 ? 4 : 6);
  const pergunta = ctx.dificuldade === 1 ? "avaliar" : ctx.rng.pick(["avaliar", "equacao"] as const);
  return { tipo: "funcao-exponencial", base, pergunta, expoente };
}

function gerarLogaritmica(ctx: GeneratorContext): FuncoesElementaresData {
  const base = ctx.rng.pick([2, 3, 10]);
  const expoente = ctx.rng.nextInt(2, ctx.dificuldade === 1 ? 4 : 5);
  const argumento = base ** expoente;
  const pergunta = ctx.dificuldade === 1 ? "avaliar" : ctx.rng.pick(["avaliar", "equacao"] as const);
  return { tipo: "funcao-logaritmica", base, pergunta, argumento, expoente };
}

function fmtLinear(a: number, b: number): string {
  const ax = a === 1 ? "x" : a === -1 ? "−x" : `${a}x`;
  if (b === 0) return ax;
  const sign = b > 0 ? " + " : " − ";
  return `${ax}${sign}${Math.abs(b)}`;
}

function fmtQuad(a: number, b: number, c: number): string {
  const ax2 = a === 1 ? "x²" : a === -1 ? "−x²" : `${a}x²`;
  const bx = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` − ${Math.abs(b)}x`;
  const cc = c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
  return `${ax2}${bx}${cc}`;
}

function enunciado(d: FuncoesElementaresData): string {
  switch (d.tipo) {
    case "funcao-afim":
      if (d.pergunta === "raiz") {
        return `Dada f(x) = ${fmtLinear(d.a, d.b)}, encontre o zero da função (valor de x tal que f(x) = 0).`;
      }
      return `Dada f(x) = ${fmtLinear(d.a, d.b)}, calcule f(${d.x0}).`;
    case "funcao-quadratica":
      if (d.pergunta === "vertice") {
        return `Dada f(x) = ${fmtQuad(d.a, d.b, d.c)}, encontre a abscissa do vértice da parábola.`;
      }
      if (d.pergunta === "discriminante") {
        return `Dada f(x) = ${fmtQuad(d.a, d.b, d.c)}, calcule o discriminante Δ = b² − 4ac.`;
      }
      return `Dada f(x) = ${fmtQuad(d.a, d.b, d.c)}, calcule f(${d.x0}).`;
    case "funcao-exponencial":
      if (d.pergunta === "equacao") {
        const val = d.base ** d.expoente;
        return `Resolva a equação ${d.base}^x = ${val}.`;
      }
      return `Calcule ${d.base}^${d.expoente}.`;
    case "funcao-logaritmica": {
      const logBase = d.base === 10 ? "log" : `log_{${d.base}}`;
      if (d.pergunta === "equacao") {
        return `Resolva ${logBase}(x) = ${d.expoente}.`;
      }
      return `Calcule ${logBase}(${d.argumento}).`;
    }
  }
}

export const funcoesElementaresGenerator = {
  topicoId: TOPICO_FUNCOES_ELEMENTARES,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarAfim, gerarExponencial, gerarLogaritmica]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);
    return {
      id: "",
      disciplinaId: "pre-calculo",
      topicoId: TOPICO_FUNCOES_ELEMENTARES,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_FUNCOES_ELEMENTARES,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
