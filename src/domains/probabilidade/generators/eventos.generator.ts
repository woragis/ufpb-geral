import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_EVENTOS, type EventosData } from "../entities/types";

export const eventosGenerator = {
  topicoId: TOPICO_EVENTOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const nOmega = 20;
    const nA = ctx.rng.nextInt(4, ctx.dificuldade === 1 ? 8 : 10);
    let nB = ctx.rng.nextInt(4, ctx.dificuldade === 1 ? 8 : 10);
    let nAinterB = ctx.rng.nextInt(1, Math.min(nA, nB) - 1);

    if (ctx.dificuldade === 3) {
      nB = ctx.rng.nextInt(6, 12);
      nAinterB = ctx.rng.nextInt(2, Math.min(nA, nB));
    }

    const operacoes: EventosData["operacao"][] =
      ctx.dificuldade === 1
        ? ["uniao", "intersecao"]
        : ["uniao", "intersecao", "complemento"];
    const operacao = ctx.rng.pick(operacoes);

    const descricoes = [
      { a: "número par", b: "número maior que 10" },
      { a: "múltiplo de 3", b: "múltiplo de 5" },
      { a: "menor que 8", b: "maior que 12" },
      { a: "número primo", b: "divisível por 4" },
      { a: "face par no dado", b: "face ímpar no dado" },
    ];
    const desc = ctx.rng.pick(descricoes);

    const dados: EventosData = {
      tipo: "eventos",
      operacao,
      nOmega,
      nA,
      nB,
      nAinterB,
      descricaoA: desc.a,
      descricaoB: desc.b,
    };

    const enunciado =
      operacao === "complemento"
        ? `Em um experimento com espaço amostral de ${nOmega} resultados equiprováveis, o evento A é "${desc.a}" com ${nA} elementos. Qual é n(Aᶜ)?`
        : operacao === "uniao"
          ? `Em Ω com ${nOmega} resultados equiprováveis, A = "${desc.a}" (|A|=${nA}) e B = "${desc.b}" (|B|=${nB}), com |A∩B|=${nAinterB}. Calcule |A∪B|.`
          : `Em Ω com ${nOmega} resultados equiprováveis, A = "${desc.a}" (|A|=${nA}) e B = "${desc.b}" (|B|=${nB}), com |A∩B|=${nAinterB}. Calcule |A∩B|.`;

    return {
      id: "",
      disciplinaId: "probabilidade",
      topicoId: TOPICO_EVENTOS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_EVENTOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
