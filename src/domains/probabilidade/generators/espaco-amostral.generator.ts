import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_ESPACO_AMOSTRAL,
  type EspacoAmostralData,
} from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<EspacoAmostralData>[] = [
  { tipo: "espaco-amostral", gerar: gerarBasico },
  { tipo: "espaco-amostral-baralho", gerar: gerarBaralho },
  { tipo: "espaco-amostral-moeda-dado", gerar: gerarMoedaDado },
  { tipo: "espaco-amostral-modular", gerar: gerarModular },
];

function gerarBasico(ctx: GeneratorContext): EspacoAmostralData {
  const experimentos = ["moeda", "dado", "dado-duplo"] as const;
  let experimento = ctx.rng.pick([...experimentos]);
  if (ctx.dificuldade === 1) {
    experimento = ctx.rng.pick(["moeda", "dado"] as const);
  }
  const pergunta =
    ctx.dificuldade === 3 ? "listar" : "cardinalidade";
  return { tipo: "espaco-amostral", experimento, pergunta };
}

function gerarBaralho(ctx: GeneratorContext): EspacoAmostralData {
  const pergunta = ctx.rng.pick(["cardinalidade", "naipe"] as const);
  const naipeAlvo = pergunta === "naipe"
    ? ctx.rng.pick(["copas", "espadas", "ouros", "paus"] as const)
    : undefined;
  return { tipo: "espaco-amostral-baralho", pergunta, naipeAlvo };
}

function gerarMoedaDado(ctx: GeneratorContext): EspacoAmostralData {
  const pergunta = ctx.dificuldade === 3 ? "listar" : "cardinalidade";
  return { tipo: "espaco-amostral-moeda-dado", pergunta };
}

function gerarModular(ctx: GeneratorContext): EspacoAmostralData {
  const modulo = ctx.rng.pick([3, 4, 5]);
  const resto = ctx.rng.nextInt(0, modulo - 1);
  const pergunta = ctx.rng.pick(["favoraveis", "cardinalidade"] as const);
  return { tipo: "espaco-amostral-modular", modulo, resto, pergunta };
}

function enunciado(d: EspacoAmostralData): string {
  switch (d.tipo) {
    case "espaco-amostral": {
      const labels: Record<string, string> = {
        moeda: "lançamento de uma moeda",
        dado: "lançamento de um dado de 6 faces",
        "dado-duplo": "lançamento de dois dados de 6 faces",
      };
      return d.pergunta === "cardinalidade"
        ? `Considere o experimento: ${labels[d.experimento]}. Qual é a cardinalidade do espaço amostral?`
        : `Considere o experimento: ${labels[d.experimento]}. Liste todos os elementos do espaço amostral e informe sua cardinalidade.`;
    }
    case "espaco-amostral-baralho":
      return d.pergunta === "cardinalidade"
        ? "Um baralho padrão de 52 cartas é embaralhado. Qual é a cardinalidade do espaço amostral ao sortear uma carta?"
        : `Ao sortear uma carta de um baralho de 52, quantos resultados favoráveis há para o naipe de ${d.naipeAlvo}?`;
    case "espaco-amostral-moeda-dado":
      return d.pergunta === "cardinalidade"
        ? "Lança-se uma moeda e um dado de 6 faces. Qual é |Ω|?"
        : "Lança-se uma moeda e um dado. Liste o espaço amostral e informe |Ω|.";
    case "espaco-amostral-modular":
      return d.pergunta === "cardinalidade"
        ? "Dois dados de 6 faces são lançados. Qual é a cardinalidade do espaço amostral?"
        : `Dois dados são lançados. Quantos pares (i,j) têm soma i+j deixando resto ${d.resto} ao dividir por ${d.modulo}?`;
  }
}

export const espacoAmostralGenerator = {
  topicoId: TOPICO_ESPACO_AMOSTRAL,
  version: 2,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["espaco-amostral", "espaco-amostral-moeda-dado"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_ESPACO_AMOSTRAL,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_ESPACO_AMOSTRAL,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
