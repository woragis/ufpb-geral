import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_OTIMIZACAO, type OtimizacaoData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => OtimizacaoData> = [
  gerarParabola,
  gerarGeometrica,
  gerarCrescimento,
  gerarConcavidade,
];

function gerarParabola(ctx: GeneratorContext): OtimizacaoData {
  const a = ctx.rng.pick([1, 2, 3]);
  const b = ctx.rng.nextInt(2, 8) * (ctx.rng.next() > 0.5 ? 1 : -1);
  const c = ctx.rng.nextInt(0, 10);
  return { tipo: "otimizacao-parabola", a, b, c };
}

function gerarGeometrica(ctx: GeneratorContext): OtimizacaoData {
  const perimetro = ctx.rng.pick([20, 24, 32, 40, 48]);
  return { tipo: "otimizacao-geometrica", perimetro };
}

function gerarCrescimento(ctx: GeneratorContext): OtimizacaoData {
  const a = ctx.rng.pick([-3, -2, -1, 1, 2, 3]);
  return { tipo: "otimizacao-crescimento", a };
}

function gerarConcavidade(ctx: GeneratorContext): OtimizacaoData {
  const a = ctx.rng.pick([-3, -2, -1, 1, 2, 3]);
  return { tipo: "otimizacao-concavidade", a };
}

function enunciado(d: OtimizacaoData): string {
  switch (d.tipo) {
    case "otimizacao-parabola":
      return `Encontre o valor de x que minimiza f(x) = ${d.a}x² ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}x + ${d.c}.`;
    case "otimizacao-geometrica":
      return `Um retângulo tem perímetro ${d.perimetro} cm. Qual largura x maximiza a área? (Seja x um lado e o outro lado ( ${d.perimetro}/2 − x ).)`;
    case "otimizacao-crescimento":
      return `Dada f(x) = x³ ${d.a >= 0 ? "+" : "−"} ${Math.abs(d.a)}x, em quais intervalos f é crescente?`;
    case "otimizacao-concavidade":
      return `Dada f(x) = x³ ${d.a >= 0 ? "+" : "−"} ${Math.abs(d.a)}x, onde f é côncava para cima (f'' > 0)?`;
  }
}

export const otimizacaoGenerator = {
  topicoId: TOPICO_OTIMIZACAO,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);
    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_OTIMIZACAO,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_OTIMIZACAO,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
