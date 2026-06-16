import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_TAYLOR, type TaylorData } from "../entities/types";

export const taylorGenerator = {
  topicoId: TOPICO_TAYLOR,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const funcao = ctx.rng.pick(["exponencial", "seno"] as const);
    const x0 = 0;
    const grau = ctx.dificuldade === 1 ? 1 : 2;

    const dados: TaylorData = { tipo: "taylor", funcao, x0, grau };
    const nome = funcao === "exponencial" ? "eˣ" : "sen(x)";
    const enunciado = `Escreva o polinômio de Taylor de ${nome} de grau ${grau} em torno de x = ${x0}.`;

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_TAYLOR,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_TAYLOR, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
