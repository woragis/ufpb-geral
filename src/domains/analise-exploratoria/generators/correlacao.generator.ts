import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CORRELACAO, type CorrelacaoData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => CorrelacaoData> = [
  gerarPositiva,
  gerarNegativa,
  gerarFraca,
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

function enunciado(d: CorrelacaoData): string {
  const pares = d.xs.map((x, i) => `(${x}, ${d.ys[i]})`).join(", ");
  return `Dados os pares ${pares}, calcule o coeficiente de correlação de Pearson r (arredonde para 2 casas decimais).`;
}

export const correlacaoGenerator = {
  topicoId: TOPICO_CORRELACAO,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1 ? [gerarPositiva] : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

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
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
