import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_DISTRIBUICOES,
  type DistribuicoesData,
} from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<DistribuicoesData>[] = [
  { tipo: "distribuicoes", gerar: gerarIqr },
  { tipo: "distribuicoes-quartis", gerar: gerarQuartis },
  { tipo: "distribuicoes-outliers", gerar: gerarOutliers },
  { tipo: "distribuicoes-ler-boxplot", gerar: gerarLerBoxplot },
  { tipo: "distribuicoes-histograma", gerar: gerarHistograma },
  { tipo: "distribuicoes-assimetria", gerar: gerarAssimetria },
  { tipo: "distribuicoes-cinco-numeros", gerar: gerarCincoNumeros },
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
  if (ctx.dificuldade >= 2) base.push(ctx.rng.nextInt(30, 40));
  if (ctx.dificuldade === 3) base.push(ctx.rng.nextInt(1, 3));
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

function gerarHistograma(ctx: GeneratorContext): DistribuicoesData {
  const bins = ["0-10", "10-20", "20-30", "30-40"];
  const frequencias = bins.map(() => ctx.rng.nextInt(1, 8));
  const pergunta = ctx.rng.pick(["classe-moda", "frequencia-total"] as const);
  return { tipo: "distribuicoes-histograma", bins, frequencias, pergunta };
}

function gerarAssimetria(ctx: GeneratorContext): DistribuicoesData {
  const tipo = ctx.rng.pick(["positiva", "negativa", "simetrica"] as const);
  let valores: number[];
  if (tipo === "positiva") {
    valores = Array.from({ length: 8 }, () => ctx.rng.nextInt(2, 6));
    valores.push(ctx.rng.nextInt(18, 25));
  } else if (tipo === "negativa") {
    valores = Array.from({ length: 8 }, () => ctx.rng.nextInt(15, 20));
    valores.push(ctx.rng.nextInt(2, 5));
  } else {
    valores = Array.from({ length: 7 }, () => ctx.rng.nextInt(8, 14));
  }
  ctx.rng.shuffle(valores);
  return { tipo: "distribuicoes-assimetria", valores, assimetria: tipo };
}

function gerarCincoNumeros(ctx: GeneratorContext): DistribuicoesData {
  const valores = Array.from({ length: 7 }, () => ctx.rng.nextInt(5, 40));
  const pergunta = ctx.rng.pick(["min", "max", "amplitude"] as const);
  return { tipo: "distribuicoes-cinco-numeros", valores, pergunta };
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
    case "distribuicoes-histograma": {
      const linhas = d.bins.map((b, i) => `${b}: ${d.frequencias[i]}`).join(", ");
      if (d.pergunta === "frequencia-total") {
        return `No histograma com classes {${linhas}}, qual é a frequência total?`;
      }
      return `No histograma {${linhas}}, qual classe tem maior frequência?`;
    }
    case "distribuicoes-assimetria":
      return `Dado {${d.valores.join(", ")}}, a distribuição é assimétrica positiva, negativa ou simétrica?`;
    case "distribuicoes-cinco-numeros": {
      const labels = { min: "valor mínimo", max: "valor máximo", amplitude: "amplitude (máx − mín)" };
      return `Dado {${d.valores.join(", ")}}, calcule o ${labels[d.pergunta]}.`;
    }
  }
}

export const distribuicoesGenerator = {
  topicoId: TOPICO_DISTRIBUICOES,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            [
              "distribuicoes",
              "distribuicoes-ler-boxplot",
              "distribuicoes-histograma",
            ].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

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
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
