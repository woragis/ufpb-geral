import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<CorrelacaoData>[] = [
  { tipo: "correlacao", gerar: gerarPositiva },
  { tipo: "correlacao-negativa", gerar: gerarNegativa },
  { tipo: "correlacao-fraca", gerar: gerarFraca },
  { tipo: "correlacao-spearman", gerar: gerarSpearman },
  { tipo: "correlacao-interpretacao", gerar: gerarInterpretacao },
  { tipo: "correlacao-covariancia", gerar: gerarCovariancia },
];

function gerarPares(
  ctx: GeneratorContext,
  slope: number,
  ruidoMax: number,
): { xs: number[]; ys: number[] } {
  const n = ctx.dificuldade === 1 ? 4 : 5;
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const ys = xs.map((x) => slope * x + ctx.rng.nextInt(-ruidoMax, ruidoMax));
  return { xs, ys };
}

function gerarPositiva(ctx: GeneratorContext): CorrelacaoData {
  const { xs, ys } = gerarPares(ctx, 2, 1);
  return { tipo: "correlacao", xs, ys };
}

function gerarNegativa(ctx: GeneratorContext): CorrelacaoData {
  const { xs, ys } = gerarPares(ctx, -2, 1);
  return { tipo: "correlacao-negativa", xs, ys };
}

function gerarFraca(ctx: GeneratorContext): CorrelacaoData {
  const n = ctx.dificuldade === 1 ? 4 : 5;
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const ys = xs.map(() => ctx.rng.nextInt(1, 10));
  return { tipo: "correlacao-fraca", xs, ys };
}

function gerarSpearman(ctx: GeneratorContext): CorrelacaoData {
  const n = 5;
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const ys = [...xs].sort(() => ctx.rng.nextInt(0, 1) * 2 - 1);
  return { tipo: "correlacao-spearman", xs, ys };
}

function gerarInterpretacao(ctx: GeneratorContext): CorrelacaoData {
  const r = ctx.rng.pick([0.82, -0.75, 0.45, -0.35, 0.12, -0.18] as const);
  return { tipo: "correlacao-interpretacao", r };
}

function gerarCovariancia(ctx: GeneratorContext): CorrelacaoData {
  const { xs, ys } = gerarPares(ctx, 3, 2);
  return { tipo: "correlacao-covariancia", xs, ys };
}

function enunciado(d: CorrelacaoData): string {
  switch (d.tipo) {
    case "correlacao-interpretacao":
      return `O coeficiente de correlação de Pearson é r = ${d.r}. Classifique a correlação (forte/moderada/fraca e positiva/negativa).`;
    case "correlacao-spearman": {
      const pares = d.xs.map((x, i) => `(${x}, ${d.ys[i]})`).join(", ");
      return `Dados os pares ${pares}, calcule o coeficiente de correlação de Spearman ρ (2 casas decimais).`;
    }
    case "correlacao-covariancia": {
      const pares = d.xs.map((x, i) => `(${x}, ${d.ys[i]})`).join(", ");
      return `Dados os pares ${pares}, calcule a covariância amostral Cov(X,Y) (2 casas decimais).`;
    }
    default: {
      const pares = d.xs.map((x, i) => `(${x}, ${d.ys[i]})`).join(", ");
      return `Dados os pares ${pares}, calcule o coeficiente de correlação de Pearson r (arredonde para 2 casas decimais).`;
    }
  }
}

export const correlacaoGenerator = {
  topicoId: TOPICO_CORRELACAO,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["correlacao", "correlacao-interpretacao"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_CORRELACAO,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CORRELACAO,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
