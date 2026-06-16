import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_DERIVADAS, type DerivadasData } from "../entities/types";

export const derivadasGenerator = {
  topicoId: TOPICO_DERIVADAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const numTermos = ctx.dificuldade === 1 ? 2 : ctx.dificuldade === 2 ? 3 : 3;
    const expoentes = numTermos === 2
      ? [ctx.rng.nextInt(2, 3), 1]
      : [ctx.rng.nextInt(2, 4), ctx.rng.nextInt(1, 2), 0];
    const coeficientes = expoentes.map(() => ctx.rng.nextInt(1, 5));
    const x0 = ctx.rng.nextInt(1, 4);

    const dados: DerivadasData = { tipo: "derivadas", coeficientes, expoentes, x0 };

    const termos = coeficientes.map((c, i) => {
      const exp = expoentes[i]!;
      if (exp === 0) return String(c);
      if (exp === 1) return `${c}x`;
      return `${c}x^${exp}`;
    });
    const enunciado = `Dada f(x) = ${termos.join(" + ").replace(/\+ -/g, "− ")}, calcule f'(${x0}).`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_DERIVADAS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_DERIVADAS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
