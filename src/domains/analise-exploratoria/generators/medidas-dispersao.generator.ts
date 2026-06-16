import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_MEDIDAS_DISPERSAO, type MedidasDispersaoData } from "../entities/types";

export const medidasDispersaoGenerator = {
  topicoId: TOPICO_MEDIDAS_DISPERSAO,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const tamanho = ctx.dificuldade === 1 ? 4 : ctx.dificuldade === 2 ? 5 : 6;
    const valores = Array.from({ length: tamanho }, () => ctx.rng.nextInt(2, 15));
    const pergunta: MedidasDispersaoData["pergunta"] =
      ctx.dificuldade === 1 ? "amplitude" : ctx.rng.pick(["variancia", "desvio", "amplitude"] as const);

    const dados: MedidasDispersaoData = { tipo: "medidas-dispersao", valores, pergunta };
    const lista = valores.join(", ");

    const labels = { variancia: "variância amostral", desvio: "desvio padrão amostral", amplitude: "amplitude" };
    const enunciado = `Dado o conjunto {${lista}}, calcule a ${labels[pergunta]}.`;

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_MEDIDAS_DISPERSAO,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_MEDIDAS_DISPERSAO, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
