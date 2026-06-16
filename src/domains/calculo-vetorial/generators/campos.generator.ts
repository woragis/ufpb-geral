import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CAMPOS, type CamposData } from "../entities/types";

export const camposGenerator = {
  topicoId: TOPICO_CAMPOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const x0 = ctx.rng.nextInt(1, 3);
    const y0 = ctx.rng.nextInt(1, 3);

    const dados: CamposData = { tipo: "campos", x0, y0 };
    const enunciado = `Calcule o gradiente ∇f do campo escalar f(x,y) = x² + y² no ponto (${x0}, ${y0}).`;

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_CAMPOS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_CAMPOS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
