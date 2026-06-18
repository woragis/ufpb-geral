import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_MEDIDAS_DISPERSAO,
  type MedidasDispersaoData,
} from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<MedidasDispersaoData>[] = [
  { tipo: "medidas-dispersao", gerar: gerarBasico },
  { tipo: "medidas-dispersao-cv", gerar: gerarCv },
  { tipo: "medidas-dispersao-populacional", gerar: gerarPopulacional },
  { tipo: "medidas-dispersao-mad", gerar: gerarMad },
];

function gerarValores(ctx: GeneratorContext): number[] {
  const tamanho = ctx.dificuldade === 1 ? 4 : ctx.dificuldade === 2 ? 5 : 6;
  return Array.from({ length: tamanho }, () => ctx.rng.nextInt(2, 15));
}

function gerarBasico(ctx: GeneratorContext): MedidasDispersaoData {
  const valores = gerarValores(ctx);
  const pergunta =
    ctx.dificuldade === 1
      ? "amplitude"
      : ctx.rng.pick(["variancia", "desvio", "amplitude"] as const);
  return { tipo: "medidas-dispersao", valores, pergunta };
}

function gerarCv(ctx: GeneratorContext): MedidasDispersaoData {
  return { tipo: "medidas-dispersao-cv", valores: gerarValores(ctx) };
}

function gerarPopulacional(ctx: GeneratorContext): MedidasDispersaoData {
  const valores = gerarValores(ctx);
  const pergunta = ctx.rng.pick(["variancia", "desvio"] as const);
  return { tipo: "medidas-dispersao-populacional", valores, pergunta };
}

function gerarMad(ctx: GeneratorContext): MedidasDispersaoData {
  return { tipo: "medidas-dispersao-mad", valores: gerarValores(ctx) };
}

function enunciado(d: MedidasDispersaoData): string {
  const lista = d.valores.join(", ");
  switch (d.tipo) {
    case "medidas-dispersao-cv":
      return `Dado o conjunto {${lista}}, calcule o coeficiente de variação CV = (s/x̄)×100% (arredonde para 2 casas decimais).`;
    case "medidas-dispersao-populacional": {
      const label = d.pergunta === "variancia" ? "variância populacional σ²" : "desvio padrão populacional σ";
      return `Dado o conjunto {${lista}}, calcule a ${label}.`;
    }
    case "medidas-dispersao-mad":
      return `Dado o conjunto {${lista}}, calcule o desvio médio absoluto (MAD).`;
    case "medidas-dispersao": {
      const labels = {
        variancia: "variância amostral",
        desvio: "desvio padrão amostral",
        amplitude: "amplitude",
      };
      return `Dado o conjunto {${lista}}, calcule a ${labels[d.pergunta]}.`;
    }
  }
}

export const medidasDispersaoGenerator = {
  topicoId: TOPICO_MEDIDAS_DISPERSAO,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["medidas-dispersao", "medidas-dispersao-cv"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_MEDIDAS_DISPERSAO,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_MEDIDAS_DISPERSAO,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
