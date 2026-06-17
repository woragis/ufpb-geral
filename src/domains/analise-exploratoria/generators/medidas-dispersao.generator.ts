import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import {
  TOPICO_MEDIDAS_DISPERSAO,
  type MedidasDispersaoData,
} from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => MedidasDispersaoData> = [
  gerarBasico,
  gerarCv,
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

function enunciado(d: MedidasDispersaoData): string {
  const lista = d.valores.join(", ");
  if (d.tipo === "medidas-dispersao-cv") {
    return `Dado o conjunto {${lista}}, calcule o coeficiente de variação CV = (s/x̄)×100% (arredonde para 2 casas decimais).`;
  }
  const labels = {
    variancia: "variância amostral",
    desvio: "desvio padrão amostral",
    amplitude: "amplitude",
  };
  return `Dado o conjunto {${lista}}, calcule a ${labels[d.pergunta]}.`;
}

export const medidasDispersaoGenerator = {
  topicoId: TOPICO_MEDIDAS_DISPERSAO,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool = ctx.dificuldade === 1 ? [gerarBasico] : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

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
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
