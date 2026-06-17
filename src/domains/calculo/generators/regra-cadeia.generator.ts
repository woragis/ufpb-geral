import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_REGRA_CADEIA, type RegraCadeiaData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => RegraCadeiaData> = [
  gerarPotencia,
  gerarTrig,
  gerarExpLog,
];

function gerarPotencia(ctx: GeneratorContext): RegraCadeiaData {
  const a = ctx.rng.nextInt(1, 3);
  const b = ctx.rng.nextInt(1, 5);
  const n = ctx.rng.nextInt(2, ctx.dificuldade === 3 ? 4 : 3);
  const x0 = ctx.rng.nextInt(0, 2);
  return { tipo: "regra-cadeia-potencia", a, b, n, x0 };
}

function gerarTrig(ctx: GeneratorContext): RegraCadeiaData {
  const funcao = ctx.rng.pick(["sin", "cos"] as const);
  const a = ctx.rng.pick([1, 2, 3]);
  const b = ctx.rng.pick([0, 1, 2]);
  const x0 = ctx.rng.pick([0, 1, 2]);
  return { tipo: "regra-cadeia-trig", funcao, a, b, x0 };
}

function gerarExpLog(ctx: GeneratorContext): RegraCadeiaData {
  const funcao = ctx.rng.pick(["exp", "ln"] as const);
  const a = ctx.rng.pick([1, 2, 3]);
  const b = ctx.rng.pick([1, 2, 3]);
  const x0 = ctx.rng.nextInt(1, 3);
  return { tipo: "regra-cadeia-exp-log", funcao, a, b, x0 };
}

function enunciado(d: RegraCadeiaData): string {
  switch (d.tipo) {
    case "regra-cadeia-potencia":
      return `Seja h(x) = (${d.a}x + ${d.b})^${d.n}. Calcule h'(${d.x0}).`;
    case "regra-cadeia-trig":
      return d.funcao === "sin"
        ? `Seja h(x) = sin(${d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}). Calcule h'(${d.x0}).`
        : `Seja h(x) = cos(${d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}). Calcule h'(${d.x0}).`;
    case "regra-cadeia-exp-log":
      return d.funcao === "exp"
        ? `Seja h(x) = e^(${d.a}x + ${d.b}). Calcule h'(${d.x0}).`
        : `Seja h(x) = ln(${d.a}x + ${d.b}). Calcule h'(${d.x0}).`;
  }
}

export const regraCadeiaGenerator = {
  topicoId: TOPICO_REGRA_CADEIA,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);
    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_REGRA_CADEIA,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_REGRA_CADEIA,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
