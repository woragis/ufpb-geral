import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_DISTRIBUICOES,
  type DistribuicoesData,
} from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => DistribuicoesData> = [
  gerarIqr,
  gerarQuartis,
  gerarOutliers,
  gerarLerBoxplot,
];

function gerarIqr(ctx: GeneratorContext): DistribuicoesData {
  const q2 = ctx.rng.nextInt(10, 20);
  const q1 = q2 - ctx.rng.nextInt(3, 6);
  const q3 = q2 + ctx.rng.nextInt(3, 6);
  return { tipo: "distribuicoes", q1, q2, q3 };
}

function gerarQuartis(ctx: GeneratorContext): DistribuicoesData {
  const n = ctx.dificuldade === 1 ? 5 : 7;
  const valores = Array.from({ length: n }, () => ctx.rng.nextInt(5, 30));
  const pergunta = ctx.rng.pick(["q1", "q2", "q3"] as const);
  return { tipo: "distribuicoes-quartis", valores, pergunta };
}

function gerarOutliers(ctx: GeneratorContext): DistribuicoesData {
  const base = Array.from({ length: 6 }, () => ctx.rng.nextInt(10, 15));
  if (ctx.dificuldade >= 2) {
    base.push(ctx.rng.nextInt(30, 40));
  }
  if (ctx.dificuldade === 3) {
    base.push(ctx.rng.nextInt(1, 3));
  }
  ctx.rng.shuffle(base);
  return { tipo: "distribuicoes-outliers", valores: base };
}

function gerarLerBoxplot(ctx: GeneratorContext): DistribuicoesData {
  const q2 = ctx.rng.nextInt(12, 18);
  const q1 = q2 - ctx.rng.nextInt(3, 5);
  const q3 = q2 + ctx.rng.nextInt(3, 5);
  const pergunta = ctx.rng.pick(["iqr", "mediana"] as const);
  return { tipo: "distribuicoes-ler-boxplot", q1, q2, q3, pergunta };
}

function enunciado(d: DistribuicoesData): string {
  switch (d.tipo) {
    case "distribuicoes":
      return `Um boxplot apresenta Q1 = ${d.q1}, Q2 (mediana) = ${d.q2} e Q3 = ${d.q3}. Calcule a amplitude interquartil (IQR).`;
    case "distribuicoes-quartis": {
      const labels = { q1: "primeiro quartil (Q1)", q2: "mediana (Q2)", q3: "terceiro quartil (Q3)" };
      return `Dado o conjunto {${d.valores.join(", ")}}, calcule o ${labels[d.pergunta]}.`;
    }
    case "distribuicoes-outliers":
      return `Dado o conjunto {${d.valores.join(", ")}}, quantos outliers existem pela regra de 1,5·IQR?`;
    case "distribuicoes-ler-boxplot":
      return d.pergunta === "iqr"
        ? `Um boxplot apresenta Q1 = ${d.q1}, Q2 = ${d.q2} e Q3 = ${d.q3}. Qual é o IQR?`
        : `Um boxplot apresenta Q1 = ${d.q1}, Q2 = ${d.q2} e Q3 = ${d.q3}. Qual é a mediana?`;
  }
}

export const distribuicoesGenerator = {
  topicoId: TOPICO_DISTRIBUICOES,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarIqr, gerarLerBoxplot]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_DISTRIBUICOES,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_DISTRIBUICOES,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
