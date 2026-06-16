import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CONDICIONAL, type CondicionalData } from "../entities/types";

export const condicionalGenerator = {
  topicoId: TOPICO_CONDICIONAL,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const nOmega = ctx.rng.nextInt(20, 50);
    const nB = ctx.rng.nextInt(6, ctx.dificuldade === 1 ? 12 : 18);
    const nAinterB = ctx.rng.nextInt(2, Math.min(nB - 1, 8));
    const nA = ctx.rng.nextInt(nAinterB + 1, nAinterB + (ctx.dificuldade === 3 ? 10 : 6));

    const pares = [
      { a: "estudante aprovado", b: "estudante que fez revisão" },
      { a: "peça defeituosa", b: "peça da linha A" },
      { a: "cliente satisfeito", b: "cliente que comprou online" },
    ];
    const par = ctx.rng.pick(pares);

    const dados: CondicionalData = {
      tipo: "condicional",
      nOmega,
      nA,
      nB,
      nAinterB,
      descricaoA: par.a,
      descricaoB: par.b,
    };

    const enunciado = `Em um grupo de ${nOmega} pessoas, ${nB} são "${par.b}" e ${nAinterB} são simultaneamente "${par.a}" e "${par.b}". Qual é P(${par.a} | ${par.b})?`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_CONDICIONAL,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CONDICIONAL,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
