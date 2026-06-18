import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CAMPOS, type CamposData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<CamposData>[] = [
  { tipo: "campos", gerar: gerarGradiente },
  { tipo: "campos-divergente", gerar: gerarDivergente },
  { tipo: "campos-rotacional", gerar: gerarRotacional },
  { tipo: "campos-gradiente-3d", gerar: gerarGradiente3d },
  { tipo: "campos-divergente-3d", gerar: gerarDivergente3d },
];

function gerarGradiente(ctx: GeneratorContext): CamposData {
  const funcao = ctx.rng.pick(["x2y2", "xy", "x2y"] as const);
  const x0 = ctx.rng.nextInt(1, 3);
  const y0 = ctx.rng.nextInt(1, 3);
  return { tipo: "campos", funcao, x0, y0 };
}

function gerarDivergente(ctx: GeneratorContext): CamposData {
  return {
    tipo: "campos-divergente",
    a: ctx.rng.nextInt(1, 3),
    b: ctx.rng.nextInt(-2, 2),
    c: ctx.rng.nextInt(1, 3),
    d: ctx.rng.nextInt(-2, 2),
  };
}

function gerarRotacional(ctx: GeneratorContext): CamposData {
  return {
    tipo: "campos-rotacional",
    a: ctx.rng.nextInt(-3, 3),
    b: ctx.rng.nextInt(-3, 3),
  };
}

function gerarGradiente3d(ctx: GeneratorContext): CamposData {
  return {
    tipo: "campos-gradiente-3d",
    x0: ctx.rng.nextInt(1, 3),
    y0: ctx.rng.nextInt(1, 3),
    z0: ctx.rng.nextInt(1, 3),
  };
}

function gerarDivergente3d(ctx: GeneratorContext): CamposData {
  return {
    tipo: "campos-divergente-3d",
    a: ctx.rng.nextInt(1, 3),
    b: ctx.rng.nextInt(1, 3),
    c: ctx.rng.nextInt(1, 3),
  };
}

function enunciado(d: CamposData): string {
  switch (d.tipo) {
    case "campos":
      if (d.funcao === "xy") {
        return `Calcule o gradiente ∇f de f(x,y) = xy no ponto (${d.x0}, ${d.y0}).`;
      }
      if (d.funcao === "x2y") {
        return `Calcule o gradiente ∇f de f(x,y) = x²y no ponto (${d.x0}, ${d.y0}).`;
      }
      return `Calcule o gradiente ∇f de f(x,y) = x² + y² no ponto (${d.x0}, ${d.y0}).`;
    case "campos-divergente":
      return `Calcule o divergente do campo vetorial F(x,y) = (${d.a}x + ${d.b}, ${d.c}y + ${d.d}).`;
    case "campos-rotacional":
      return `Calcule o rotacional (escalar em 2D) do campo F(x,y) = (${d.a}y, ${d.b}x).`;
    case "campos-gradiente-3d":
      return `Calcule ∇f de f(x,y,z) = x² + y² + z² no ponto (${d.x0}, ${d.y0}, ${d.z0}).`;
    case "campos-divergente-3d":
      return `Calcule o divergente de F(x,y,z) = (${d.a}x, ${d.b}y, ${d.c}z).`;
  }
}

export const camposGenerator = {
  topicoId: TOPICO_CAMPOS,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["campos", "campos-divergente", "campos-gradiente-3d"].includes(
              c.tipo,
            ),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

    return {
      id: "",
      disciplinaId: "calculo-vetorial",
      topicoId: TOPICO_CAMPOS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CAMPOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
