import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_INDEPENDENCIA, type IndependenciaData } from "../entities/types";

export const independenciaGenerator = {
  topicoId: TOPICO_INDEPENDENCIA,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const nOmega = ctx.rng.pick([12, 20, 24, 30, 36]);
    const nA = ctx.rng.nextInt(3, 8);
    const nB = ctx.rng.nextInt(3, 8);

    const independente = ctx.rng.next() > (ctx.dificuldade === 1 ? 0.3 : 0.5);
    const nAinterB = independente
      ? Math.round((nA * nB) / nOmega)
      : ctx.rng.nextInt(1, Math.min(nA, nB));

    const pares = [
      { a: "sair cara no 1º lançamento", b: "sair cara no 2º lançamento" },
      { a: "cartão de copas", b: "carta vermelha" },
      { a: "número par", b: "múltiplo de 3" },
    ];
    const par = ctx.rng.pick(pares);

    const dados: IndependenciaData = {
      tipo: "independencia",
      nOmega,
      nA,
      nB,
      nAinterB,
      descricaoA: par.a,
      descricaoB: par.b,
    };

    const enunciado = `Em um experimento equiprovável com |Ω|=${nOmega}, temos |A|=${nA} ("${par.a}"), |B|=${nB} ("${par.b}") e |A∩B|=${nAinterB}. Os eventos A e B são independentes?`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_INDEPENDENCIA,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_INDEPENDENCIA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
