import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_RETAS_PLANOS, type RetasPlanosData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => RetasPlanosData> = [
  gerarDiretor,
  gerarParametrica,
  gerarPlano,
  gerarDistancia,
  gerarDistanciaReta,
  gerarIntersecao,
];

function gerarDiretor(ctx: GeneratorContext): RetasPlanosData {
  const p1: [number, number, number] = [
    ctx.rng.nextInt(0, 2),
    ctx.rng.nextInt(0, 2),
    ctx.rng.nextInt(0, 2),
  ];
  const p2: [number, number, number] = [
    p1[0] + ctx.rng.nextInt(1, 3),
    p1[1] + ctx.rng.nextInt(1, 3),
    p1[2] + ctx.rng.nextInt(1, 3),
  ];
  return { tipo: "retas-planos", p1, p2 };
}

function gerarParametrica(ctx: GeneratorContext): RetasPlanosData {
  const p0: [number, number, number] = [
    ctx.rng.nextInt(-1, 2),
    ctx.rng.nextInt(-1, 2),
    ctx.rng.nextInt(-1, 2),
  ];
  const diretor: [number, number, number] = [
    ctx.rng.nextInt(1, 3),
    ctx.rng.nextInt(-2, 2),
    ctx.rng.nextInt(-2, 2),
  ];
  return { tipo: "retas-planos-parametrica", p0, diretor };
}

function gerarPlano(ctx: GeneratorContext): RetasPlanosData {
  const ponto: [number, number, number] = [
    ctx.rng.nextInt(0, 2),
    ctx.rng.nextInt(0, 2),
    ctx.rng.nextInt(0, 2),
  ];
  const normal: [number, number, number] = [
    ctx.rng.pick([1, 2, -1]),
    ctx.rng.pick([1, 2, -1]),
    ctx.rng.pick([1, 2, -1]),
  ];
  return { tipo: "retas-planos-plano", ponto, normal };
}

function gerarDistancia(ctx: GeneratorContext): RetasPlanosData {
  const [a, b, c] = [
    ctx.rng.pick([1, 2, -2]),
    ctx.rng.pick([1, 2, -2]),
    ctx.rng.pick([1, 2, -2]),
  ] as [number, number, number];
  const ponto: [number, number, number] = [
    ctx.rng.nextInt(0, 3),
    ctx.rng.nextInt(0, 3),
    ctx.rng.nextInt(0, 3),
  ];
  const d = a * ponto[0] + b * ponto[1] + c * ponto[2] + ctx.rng.nextInt(1, 4);
  return { tipo: "retas-planos-distancia", ponto, coeficientes: [a, b, c, d] };
}

function gerarDistanciaReta(ctx: GeneratorContext): RetasPlanosData {
  const p0: [number, number, number] = [0, 0, 0];
  const diretor: [number, number, number] = [
    ctx.rng.nextInt(1, 3),
    ctx.rng.nextInt(0, 2),
    ctx.rng.nextInt(0, 2),
  ];
  const ponto: [number, number, number] = [
    ctx.rng.nextInt(1, 4),
    ctx.rng.nextInt(0, 3),
    ctx.rng.nextInt(0, 3),
  ];
  return { tipo: "retas-planos-distancia-reta", ponto, p0, diretor };
}

function gerarIntersecao(ctx: GeneratorContext): RetasPlanosData {
  const diretor: [number, number, number] = [
    1,
    ctx.rng.nextInt(1, 2),
    ctx.rng.nextInt(0, 2),
  ];
  const [a, b, c] = [2, 1, 1] as [number, number, number];
  const p0: [number, number, number] = [0, 0, 0];
  const d = a * p0[0] + b * p0[1] + c * p0[2] + ctx.rng.nextInt(4, 12);
  return {
    tipo: "retas-planos-intersecao",
    p0,
    diretor,
    coeficientes: [a, b, c, d],
  };
}

function enunciado(d: RetasPlanosData): string {
  switch (d.tipo) {
    case "retas-planos":
      return `Encontre o vetor diretor da reta que passa por P(${d.p1.join(", ")}) e Q(${d.p2.join(", ")}).`;
    case "retas-planos-parametrica":
      return `Escreva a equação paramétrica da reta que passa por P(${d.p0.join(", ")}) com vetor diretor v = (${d.diretor.join(", ")}). Qual é o ponto quando t = 1?`;
    case "retas-planos-plano": {
      const [a, b, c] = d.normal;
      const dVal = a * d.ponto[0] + b * d.ponto[1] + c * d.ponto[2];
      return `Encontre a equação do plano com vetor normal n = (${a}, ${b}, ${c}) passando por (${d.ponto.join(", ")}). Use a forma ${a}x + ${b}y + ${c}z = d e calcule d.`;
    }
    case "retas-planos-distancia": {
      const [a, b, c, dPlano] = d.coeficientes;
      return `Calcule a distância do ponto P(${d.ponto.join(", ")}) ao plano ${a}x + ${b}y + ${c}z = ${dPlano}.`;
    }
    case "retas-planos-distancia-reta":
      return `Calcule a distância do ponto P(${d.ponto.join(", ")}) à reta r(t) = (${d.p0.join(", ")}) + t(${d.diretor.join(", ")}).`;
    case "retas-planos-intersecao": {
      const [a, b, c, dPlano] = d.coeficientes;
      return `Encontre o ponto de interseção da reta r(t) = (${d.p0.join(", ")}) + t(${d.diretor.join(", ")}) com o plano ${a}x + ${b}y + ${c}z = ${dPlano}.`;
    }
  }
}

export const retasPlanosGenerator = {
  topicoId: TOPICO_RETAS_PLANOS,
  version: 3,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarDiretor, gerarParametrica]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_RETAS_PLANOS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_RETAS_PLANOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
