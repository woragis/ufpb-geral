import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_MEDIDAS_TENDENCIA,
  type MedidasTendenciaData,
} from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => MedidasTendenciaData> = [
  gerarMedia,
  gerarMediana,
  gerarModa,
  gerarPonderada,
  gerarEscolha,
  gerarGeometrica,
];

function tamanho(ctx: GeneratorContext): number {
  return ctx.dificuldade === 1 ? 4 : ctx.dificuldade === 2 ? 6 : 8;
}

function gerarValores(ctx: GeneratorContext): number[] {
  return Array.from({ length: tamanho(ctx) }, () => ctx.rng.nextInt(1, 20));
}

function gerarMedia(ctx: GeneratorContext): MedidasTendenciaData {
  return { tipo: "media-aritmetica", valores: gerarValores(ctx) };
}

function gerarMediana(ctx: GeneratorContext): MedidasTendenciaData {
  return { tipo: "medidas-tendencia-mediana", valores: gerarValores(ctx) };
}

function gerarModa(ctx: GeneratorContext): MedidasTendenciaData {
  const n = tamanho(ctx);
  const moda = ctx.rng.nextInt(3, 12);
  const repeticoes = ctx.dificuldade === 1 ? 2 : 3;
  const valores = Array.from({ length: repeticoes }, () => moda);
  while (valores.length < n) {
    valores.push(ctx.rng.nextInt(1, 20));
  }
  ctx.rng.shuffle(valores);
  return { tipo: "medidas-tendencia-moda", valores };
}

function gerarPonderada(ctx: GeneratorContext): MedidasTendenciaData {
  const n = ctx.dificuldade === 1 ? 3 : 4;
  const valores = Array.from({ length: n }, () => ctx.rng.nextInt(2, 15));
  const pesos = Array.from({ length: n }, () => ctx.rng.nextInt(1, 5));
  return { tipo: "medidas-tendencia-ponderada", valores, pesos };
}

function gerarEscolha(ctx: GeneratorContext): MedidasTendenciaData {
  const base = Array.from({ length: 5 }, () => ctx.rng.nextInt(3, 8));
  base.push(ctx.rng.nextInt(40, 60));
  ctx.rng.shuffle(base);
  return { tipo: "medidas-tendencia-escolha", valores: base, resposta: "mediana" };
}

function gerarGeometrica(ctx: GeneratorContext): MedidasTendenciaData {
  const n = ctx.dificuldade === 1 ? 3 : 4;
  const valores = Array.from({ length: n }, () =>
    roundGrowth(ctx.rng.nextInt(102, 115) / 100),
  );
  return { tipo: "medidas-tendencia-geometrica", valores };
}

function roundGrowth(x: number): number {
  return Math.round(x * 100) / 100;
}

function enunciado(d: MedidasTendenciaData): string {
  switch (d.tipo) {
    case "media-aritmetica":
      return `Dado o conjunto {${d.valores.join(", ")}}, calcule a média aritmética.`;
    case "medidas-tendencia-mediana":
      return `Dado o conjunto {${d.valores.join(", ")}}, calcule a mediana.`;
    case "medidas-tendencia-moda":
      return `Dado o conjunto {${d.valores.join(", ")}}, identifique a moda.`;
    case "medidas-tendencia-ponderada": {
      const pares = d.valores.map((v, i) => `(${v}, peso ${d.pesos[i]})`).join(", ");
      return `Calcule a média ponderada dos pares valor-peso: ${pares}.`;
    }
    case "medidas-tendencia-escolha":
      return `Dado {${d.valores.join(", ")}}, qual medida de tendência central é mais representativa: média ou mediana?`;
    case "medidas-tendencia-geometrica":
      return `Dados os fatores de crescimento {${d.valores.join(", ")}}, calcule a média geométrica (2 casas decimais).`;
  }
}

export const medidasTendenciaGenerator = {
  topicoId: TOPICO_MEDIDAS_TENDENCIA,
  version: 3,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarMedia, gerarMediana]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_MEDIDAS_TENDENCIA,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_MEDIDAS_TENDENCIA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
