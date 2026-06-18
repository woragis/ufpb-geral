import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_CONTINUIDADE, type ContinuidadeData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const CENARIOS: CenarioEntry<ContinuidadeData>[] = [
  { tipo: "continuidade-afim", gerar: gerarAfim },
  { tipo: "continuidade-classificar", gerar: gerarClassificar },
  { tipo: "continuidade-completar", gerar: gerarCompletar },
  { tipo: "continuidade-lateral", gerar: gerarLateral },
  { tipo: "continuidade-tvi", gerar: gerarTvi },
  { tipo: "continuidade-trig-ponto", gerar: gerarTrigPonto },
  { tipo: "continuidade-rolle", gerar: gerarRolle },
];

function gerarAfim(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.nextInt(0, 3);
  const m1 = ctx.rng.nextInt(1, 4);
  const b1 = ctx.rng.nextInt(-3, 3);
  const m2 = ctx.rng.nextInt(1, 4);
  const continua = ctx.rng.next() > (ctx.dificuldade === 1 ? 0.4 : 0.5);
  const b2 = continua ? m1 * a + b1 - m2 * a : ctx.rng.nextInt(-5, 5);
  return { tipo: "continuidade-afim", a, m1, b1, m2, b2, continua };
}

function gerarClassificar(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.nextInt(1, 4);
  const classe = ctx.rng.pick(["removivel", "salto", "infinita"] as const);
  const m = ctx.rng.nextInt(1, 3);
  const b = ctx.rng.nextInt(-2, 2);

  if (classe === "removivel") {
    return { tipo: "continuidade-classificar", a, classe, m: 0, b: 0, valorEsq: 2 * a };
  }
  if (classe === "salto") {
    const valorEsq = m * a + b;
    const valorDir = valorEsq + ctx.rng.pick([2, 3, 4]);
    return { tipo: "continuidade-classificar", a, classe, m, b, valorEsq, valorDir };
  }
  return { tipo: "continuidade-classificar", a, classe, m, b, valorEsq: 0 };
}

function gerarCompletar(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.nextInt(2, 5);
  const r1 = a;
  const r2 = ctx.rng.nextInt(1, 6);
  return { tipo: "continuidade-completar", a, r1, r2 };
}

function gerarLateral(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.nextInt(0, 3);
  const variante = ctx.rng.pick(["inverso", "modulo"] as const);
  return { tipo: "continuidade-lateral", a, variante };
}

function gerarTvi(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.nextInt(0, 2);
  const b = a + ctx.rng.nextInt(2, 4);
  const fa = ctx.rng.nextInt(1, 4);
  const fb = fa + ctx.rng.nextInt(2, 5);
  const k = fa + ctx.rng.nextInt(1, fb - fa - 1);
  return { tipo: "continuidade-tvi", a, b, fa, fb, k };
}

function gerarTrigPonto(ctx: GeneratorContext): ContinuidadeData {
  const funcao = ctx.rng.pick(["sin", "cos"] as const);
  return { tipo: "continuidade-trig-ponto", funcao, x0: 0 };
}

function gerarRolle(ctx: GeneratorContext): ContinuidadeData {
  const a = ctx.rng.pick([-2, -1, 0]);
  const b = -a;
  const coef = ctx.rng.pick([1, 2, 3]);
  return { tipo: "continuidade-rolle", a, b, coef };
}

function enunciado(d: ContinuidadeData): string {
  switch (d.tipo) {
    case "continuidade-afim":
      return `A função f é definida por f(x) = ${d.m1}x ${d.b1 >= 0 ? "+" : "−"} ${Math.abs(d.b1)} para x < ${d.a} e f(x) = ${d.m2}x ${d.b2 >= 0 ? "+" : "−"} ${Math.abs(d.b2)} para x ≥ ${d.a}. A função é contínua em x = ${d.a}?`;
    case "continuidade-classificar":
      if (d.classe === "removivel") {
        return `Classifique a descontinuidade de f(x) = (x² − ${d.a * d.a})/(x − ${d.a}) em x = ${d.a} (considere o limite, não o valor em x = ${d.a}).`;
      }
      if (d.classe === "salto") {
        return `A função f(x) = ${d.m}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)} para x < ${d.a} e f(x) = ${(d.valorDir ?? 0)} para x ≥ ${d.a}. Classifique a descontinuidade em x = ${d.a}.`;
      }
      return `Classifique a descontinuidade de f(x) = 1/(x − ${d.a}) em x = ${d.a}.`;
    case "continuidade-completar": {
      const sum = d.r1 + d.r2;
      const prod = d.r1 * d.r2;
      return `Para que f(x) = (x² − ${sum}x + ${prod})/(x − ${d.a}) seja contínua em x = ${d.a}, qual valor devemos atribuir a f(${d.a})?`;
    }
    case "continuidade-lateral":
      if (d.variante === "inverso") {
        return `Calcule lim(x→${d.a}⁻) 1/(x − ${d.a}) e lim(x→${d.a}⁺) 1/(x − ${d.a}). Os limites laterais existem e são iguais?`;
      }
      return `Calcule lim(x→0⁻) |x|/x e lim(x→0⁺) |x|/x.`;
    case "continuidade-tvi":
      return `Se f é contínua em [${d.a}, ${d.b}], f(${d.a}) = ${d.fa}, f(${d.b}) = ${d.fb} e ${d.k} está entre f(${d.a}) e f(${d.b}), existe c em (${d.a}, ${d.b}) com f(c) = ${d.k}? (T.V.I.)`;
    case "continuidade-trig-ponto":
      return d.funcao === "sin"
        ? `Defina f(x) = sin(x)/x para x ≠ 0 e f(0) = 1. A função é contínua em x = 0?`
        : `A função g(x) = cos(x) é contínua em x = 0? Justifique.`;
    case "continuidade-rolle":
      return `Para f(x) = ${d.coef}x² em [${d.a}, ${d.b}], existe c em (${d.a}, ${d.b}) tal que f'(c) = 0? (Teorema de Rolle)`;
  }
}

export const continuidadeGenerator = {
  topicoId: TOPICO_CONTINUIDADE,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const dados = pickCenarioByTipo(ctx, CENARIOS);
    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_CONTINUIDADE,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_CONTINUIDADE,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
