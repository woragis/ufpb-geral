import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CURVAS, type CurvasData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => CurvasData> = [
  gerarVelocidadeModulo,
  gerarVelocidadeVetor,
  gerarTangente,
  gerarCirculo,
  gerarComprimento,
  gerarHelice,
];

function gerarVelocidadeModulo(ctx: GeneratorContext): CurvasData {
  const a = ctx.rng.nextInt(1, 3);
  const b = ctx.rng.nextInt(0, 2);
  const t0 = ctx.rng.nextInt(1, 3);
  return { tipo: "curvas", familia: "parabola", a, b, t0 };
}

function gerarVelocidadeVetor(ctx: GeneratorContext): CurvasData {
  const familia = ctx.rng.pick(["parabola", "reta"] as const);
  const a = ctx.rng.nextInt(1, 3);
  const b = ctx.rng.nextInt(0, 2);
  const c = familia === "reta" ? ctx.rng.nextInt(1, 3) : undefined;
  const t0 = ctx.rng.nextInt(1, 3);
  return { tipo: "curvas-velocidade-vetor", familia, a, b, c, t0 };
}

function gerarTangente(ctx: GeneratorContext): CurvasData {
  const a = ctx.rng.nextInt(1, 3);
  const b = ctx.rng.nextInt(0, 2);
  const t0 = ctx.rng.nextInt(1, 3);
  return { tipo: "curvas-tangente", familia: "parabola", a, b, t0 };
}

function gerarCirculo(ctx: GeneratorContext): CurvasData {
  return { tipo: "curvas-circulo", t0: ctx.rng.pick([0, Math.PI / 2, Math.PI]) };
}

function gerarComprimento(ctx: GeneratorContext): CurvasData {
  const a = ctx.rng.pick([3, 4]);
  const b = ctx.rng.pick([0, 4]);
  const t1 = 0;
  const t2 = ctx.rng.pick([2, 3]);
  return { tipo: "curvas-comprimento", a, b, t1, t2 };
}

function gerarHelice(ctx: GeneratorContext): CurvasData {
  return { tipo: "curvas-helice", t0: ctx.rng.nextInt(1, 3) };
}

function enunciado(d: CurvasData): string {
  switch (d.tipo) {
    case "curvas":
      return `A curva r(t) = (${d.a}t, t² + ${d.b}) descreve uma trajetória. Calcule a velocidade |r'(t)| em t = ${d.t0}.`;
    case "curvas-velocidade-vetor":
      if (d.familia === "reta") {
        return `Para r(t) = (${d.a}t, ${d.c}t + ${d.b}), calcule o vetor velocidade r'(${d.t0}).`;
      }
      return `Para r(t) = (${d.a}t, t² + ${d.b}), calcule o vetor velocidade r'(${d.t0}).`;
    case "curvas-tangente":
      return `Para r(t) = (${d.a}t, t² + ${d.b}), encontre o vetor tangente r'(${d.t0}) à curva.`;
    case "curvas-circulo":
      return `Para r(t) = (cos(t), sin(t)), calcule |r'(t)| em t = ${d.t0} (use π se necessário).`;
    case "curvas-comprimento":
      return `Para a reta paramétrica r(t) = (${d.a}t, ${d.b}t), calcule o comprimento do arco de t = ${d.t1} a t = ${d.t2}.`;
    case "curvas-helice":
      return `Para a hélice r(t) = (cos(t), sin(t), t), calcule |r'(t)| em t = ${d.t0}.`;
  }
}

export const curvasGenerator = {
  topicoId: TOPICO_CURVAS,
  version: 3,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarVelocidadeModulo, gerarCirculo, gerarComprimento]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);
    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_CURVAS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CURVAS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
