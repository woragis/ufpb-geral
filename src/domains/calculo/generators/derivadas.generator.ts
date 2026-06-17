import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_DERIVADAS, type DerivadasData } from "../entities/types";

const POLINOMIOS: { coeficientes: number[]; expoentes: number[]; label: string }[] = [
  { coeficientes: [3, 2], expoentes: [2, 1], label: "quadrática" },
  { coeficientes: [2, 4, 1], expoentes: [3, 2, 1], label: "cúbica" },
  { coeficientes: [5, 3, 2], expoentes: [2, 1, 0], label: "com termo constante" },
  { coeficientes: [4, 1], expoentes: [4, 2], label: "quarta potência" },
];

export const derivadasGenerator = {
  topicoId: TOPICO_DERIVADAS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const template = ctx.rng.pick(POLINOMIOS);
    const coeficientes = template.coeficientes.map((c) =>
      ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 6 : 4),
    );
    const x0 = ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 6 : 4);

    const dados: DerivadasData = {
      tipo: "derivadas",
      coeficientes,
      expoentes: template.expoentes,
      x0,
    };

    const termos = coeficientes.map((c, i) => {
      const exp = template.expoentes[i]!;
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
      seed: {
        topicoId: TOPICO_DERIVADAS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
