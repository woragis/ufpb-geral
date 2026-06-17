import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CONJUNTOS, type ConjuntosData } from "../entities/types";

const DESCRICOES = [
  { a: "números pares", b: "múltiplos de 3" },
  { a: "menores que 15", b: "maiores que 20" },
  { a: "múltiplos de 4", b: "múltiplos de 6" },
  { a: "números primos", b: "divisíveis por 5" },
  { a: "múltiplos de 2", b: "múltiplos de 5" },
];

const CENARIOS: Array<(ctx: GeneratorContext) => ConjuntosData> = [
  gerarOperacao,
  gerarProdutoCartesiano,
  gerarPertinencia,
  gerarDiferenca,
];

function baseContagens(ctx: GeneratorContext) {
  const nU = ctx.rng.pick([24, 30, 36, 40]);
  const nA = ctx.rng.nextInt(5, ctx.dificuldade === 1 ? 10 : 14);
  const nB = ctx.rng.nextInt(5, ctx.dificuldade === 1 ? 10 : 14);
  const nAinterB = ctx.rng.nextInt(1, Math.min(nA, nB) - 1);
  const desc = ctx.rng.pick(DESCRICOES);
  return { nU, nA, nB, nAinterB, descricaoA: desc.a, descricaoB: desc.b };
}

function gerarOperacao(ctx: GeneratorContext): ConjuntosData {
  const base = baseContagens(ctx);
  const ops: Array<"uniao" | "intersecao" | "complemento"> =
    ctx.dificuldade === 1 ? ["uniao", "intersecao"] : ["uniao", "intersecao", "complemento"];
  return { tipo: "conjuntos-operacao", operacao: ctx.rng.pick(ops), ...base };
}

function gerarDiferenca(ctx: GeneratorContext): ConjuntosData {
  const base = baseContagens(ctx);
  return { tipo: "conjuntos-operacao", operacao: "diferenca", ...base };
}

function gerarProdutoCartesiano(ctx: GeneratorContext): ConjuntosData {
  const nA = ctx.rng.pick([3, 4, 5, 6]);
  const nB = ctx.rng.pick([2, 3, 4, 5]);
  const desc = ctx.rng.pick(DESCRICOES);
  return {
    tipo: "conjuntos-produto-cartesiano",
    nA,
    nB,
    descricaoA: desc.a,
    descricaoB: desc.b,
  };
}

function gerarPertinencia(ctx: GeneratorContext): ConjuntosData {
  const universo = ctx.rng.pick([20, 24, 30]);
  const nSatisfaz = ctx.rng.nextInt(3, universo / 2);
  const props = ["números pares", "múltiplos de 3", "números primos", "maiores que 10"];
  return {
    tipo: "conjuntos-pertinencia",
    universo,
    nSatisfaz,
    propriedade: ctx.rng.pick(props),
    pergunta: "cardinalidade",
  };
}

function enunciado(d: ConjuntosData): string {
  switch (d.tipo) {
    case "conjuntos-produto-cartesiano":
      return `Sejam A e B conjuntos finitos com |A|=${d.nA} (${d.descricaoA}) e |B|=${d.nB} (${d.descricaoB}). Calcule |A×B|.`;
    case "conjuntos-pertinencia":
      return `No universo U = {1, 2, …, ${d.universo}}, seja A o conjunto dos elementos que são ${d.propriedade}. Sabendo que |A|=${d.nSatisfaz}, confirme |A| (cardinalidade).`;
    case "conjuntos-operacao": {
      const ctx = `Em U com |U|=${d.nU}, A = "${d.descricaoA}" (|A|=${d.nA}) e B = "${d.descricaoB}" (|B|=${d.nB}), com |A∩B|=${d.nAinterB}.`;
      if (d.operacao === "complemento") {
        return `${ctx} Calcule |Aᶜ|.`;
      }
      if (d.operacao === "uniao") {
        return `${ctx} Calcule |A∪B|.`;
      }
      if (d.operacao === "diferenca") {
        return `${ctx} Calcule |A\\B| (elementos de A que não estão em B).`;
      }
      return `${ctx} Calcule |A∩B|.`;
    }
  }
}

export const conjuntosGenerator = {
  topicoId: TOPICO_CONJUNTOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);
    return {
      id: "",
      disciplinaId: "pre-calculo",
      topicoId: TOPICO_CONJUNTOS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CONJUNTOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
