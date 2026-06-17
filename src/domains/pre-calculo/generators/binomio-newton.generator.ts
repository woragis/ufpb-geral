import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_BINOMIO_NEWTON, type BinomioNewtonData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => BinomioNewtonData> = [
  gerarCoeficiente,
  gerarTermoGeral,
  gerarSomaCoeficientes,
  gerarExpansao,
];

function gerarCoeficiente(ctx: GeneratorContext): BinomioNewtonData {
  const n = ctx.rng.nextInt(4, ctx.dificuldade === 1 ? 6 : 8);
  const k = ctx.rng.nextInt(1, n - 1);
  const a = ctx.rng.pick([1, 2, 3]);
  const b = ctx.rng.pick([1, 2, -1]);
  return { tipo: "binomio-coeficiente", n, k, a, b };
}

function gerarTermoGeral(ctx: GeneratorContext): BinomioNewtonData {
  const n = ctx.rng.nextInt(5, 8);
  const ordem = ctx.rng.nextInt(2, n - 1);
  const a = ctx.rng.pick([1, 2]);
  const b = 1;
  return { tipo: "binomio-termo-geral", n, ordem, a, b };
}

function gerarSomaCoeficientes(ctx: GeneratorContext): BinomioNewtonData {
  const n = ctx.rng.nextInt(3, 7);
  const a = ctx.rng.pick([1, 2]);
  const b = ctx.rng.pick([1, 2, 3]);
  return { tipo: "binomio-soma-coeficientes", n, a, b };
}

function gerarExpansao(ctx: GeneratorContext): BinomioNewtonData {
  const n = ctx.rng.nextInt(2, ctx.dificuldade === 1 ? 3 : 4);
  return { tipo: "binomio-expansao", n };
}

function fmtBinomConst(a: number, b: number): string {
  const right = b === 1 ? "x" : b === -1 ? "−x" : `${b}x`;
  return `(${a} + ${right})`;
}

function enunciado(d: BinomioNewtonData): string {
  switch (d.tipo) {
    case "binomio-coeficiente": {
      const base = fmtBinomConst(d.a, d.b);
      return `No desenvolvimento de ${base}^${d.n}, qual é o coeficiente de x^${d.k}?`;
    }
    case "binomio-termo-geral":
      return `Qual é o termo de ordem ${d.ordem} na expansão de (${d.a} + x)^${d.n}? (Use a forma C(n,k)·a^(n−k)·x^k.)`;
    case "binomio-soma-coeficientes":
      return `Qual é a soma de todos os coeficientes na expansão de (${d.a}x + ${d.b})^${d.n}?`;
    case "binomio-expansao":
      return `Expanda (x + 1)^${d.n} usando o binômio de Newton. (Resposta no formato compacto: x^n + … + 1.)`;
  }
}

export const binomioNewtonGenerator = {
  topicoId: TOPICO_BINOMIO_NEWTON,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);
    return {
      id: "",
      disciplinaId: "pre-calculo",
      topicoId: TOPICO_BINOMIO_NEWTON,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_BINOMIO_NEWTON,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
