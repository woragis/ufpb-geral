import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_VETORES, type VetoresData } from "../entities/types";

export const vetoresGenerator = {
  topicoId: TOPICO_VETORES,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const dimensao: 2 | 3 = ctx.dificuldade === 1 ? 2 : ctx.rng.pick([2, 3] as const);
    const componentes = Array.from({ length: dimensao }, () =>
      ctx.rng.nextInt(-5, 5),
    );

    const dados: VetoresData = { tipo: "vetores", dimensao, componentes };
    const notacao =
      dimensao === 2
        ? `(${componentes[0]}, ${componentes[1]})`
        : `(${componentes[0]}, ${componentes[1]}, ${componentes[2]})`;
    const enunciado = `Calcule o módulo do vetor v = ${notacao}.`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_VETORES,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_VETORES, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
