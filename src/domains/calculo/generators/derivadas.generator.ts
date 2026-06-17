import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { fmtPoly, trigFn } from "../lib/format";
import { TOPICO_DERIVADAS, type DerivadasData } from "../entities/types";

const POLINOMIOS = [
  { coeficientes: [3, 2], expoentes: [2, 1] },
  { coeficientes: [2, 4, 1], expoentes: [3, 2, 1] },
  { coeficientes: [5, 3, 2], expoentes: [2, 1, 0] },
  { coeficientes: [4, 1], expoentes: [4, 2] },
];

const CENARIOS: Array<(ctx: GeneratorContext) => DerivadasData> = [
  gerarPolinomio,
  gerarTrig,
  gerarExpLog,
  gerarProduto,
  gerarQuociente,
  gerarTangente,
  gerarDefinicao,
];

function gerarPolinomio(ctx: GeneratorContext): DerivadasData {
  const template = ctx.rng.pick(POLINOMIOS);
  const coeficientes = template.coeficientes.map((c) =>
    ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 6 : 4),
  );
  const x0 = ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 6 : 4);
  return { tipo: "derivadas-polinomio", coeficientes, expoentes: template.expoentes, x0 };
}

function gerarTrig(ctx: GeneratorContext): DerivadasData {
  const funcao = ctx.rng.pick(["sin", "cos", "tan"] as const);
  const k = ctx.rng.pick([1, 2, 3]);
  const b = ctx.rng.pick([0, 1, 2]);
  const x0 = ctx.rng.pick([0, Math.PI / 4, Math.PI / 2, Math.PI]);
  return { tipo: "derivadas-trig", funcao, k, b, x0 };
}

function gerarExpLog(ctx: GeneratorContext): DerivadasData {
  const funcao = ctx.rng.pick(["exp", "ln"] as const);
  const k = ctx.rng.pick([1, 2, 3]);
  const x0 = funcao === "exp" ? ctx.rng.pick([0, 1, 2]) : ctx.rng.pick([1, 2, Math.E]);
  return { tipo: "derivadas-exp-log", funcao, k, x0 };
}

function gerarProduto(ctx: GeneratorContext): DerivadasData {
  const a = ctx.rng.nextInt(1, 3);
  const n = ctx.rng.pick([1, 2]);
  const b = ctx.rng.nextInt(1, 3);
  const m = 1;
  const c = ctx.rng.nextInt(1, 4);
  const x0 = ctx.rng.nextInt(1, 3);
  return { tipo: "derivadas-produto", a, n, b, m, c, x0 };
}

function gerarQuociente(ctx: GeneratorContext): DerivadasData {
  const n = ctx.rng.pick([2, 3]);
  const c = ctx.rng.nextInt(1, 4);
  const x0 = ctx.rng.nextInt(1, 3);
  return { tipo: "derivadas-quociente", n, c, x0 };
}

function gerarTangente(ctx: GeneratorContext): DerivadasData {
  const a = ctx.rng.nextInt(1, 3);
  const n = ctx.rng.pick([2, 3]);
  const x0 = ctx.rng.nextInt(1, 4);
  return { tipo: "derivadas-tangente", a, n, x0 };
}

function gerarDefinicao(ctx: GeneratorContext): DerivadasData {
  const a = ctx.rng.nextInt(1, 3);
  const n = 2;
  const x0 = ctx.rng.nextInt(1, 4);
  return { tipo: "derivadas-definicao", a, n, x0 };
}

function enunciado(d: DerivadasData): string {
  switch (d.tipo) {
    case "derivadas-polinomio": {
      const terms = d.coeficientes.map((c, i) => {
        const exp = d.expoentes[i]!;
        if (exp === 0) return String(c);
        if (exp === 1) return `${c}x`;
        return `${c}x^${exp}`;
      });
      return `Dada f(x) = ${terms.join(" + ")}, calcule f'(${d.x0}).`;
    }
    case "derivadas-trig":
      return `Dada f(x) = ${trigFn(d.funcao, d.k, d.b)}, calcule f'(x) e avalie em x = ${fmtX0(d.x0)}.`;
    case "derivadas-exp-log":
      return d.funcao === "exp"
        ? `Dada f(x) = e^(${d.k}x), calcule f'(${fmtX0(d.x0)}).`
        : `Dada f(x) = ln(${d.k}x), calcule f'(${fmtX0(d.x0)}).`;
    case "derivadas-produto":
      return `Dada f(x) = (${d.a}x^${d.n})·(${d.b}x ${d.c >= 0 ? "+" : "−"} ${Math.abs(d.c)}), calcule f'(${d.x0}).`;
    case "derivadas-quociente":
      return `Dada f(x) = x^${d.n}/(x + ${d.c}), calcule f'(${d.x0}).`;
    case "derivadas-tangente":
      return `Encontre a equação da reta tangente a f(x) = ${d.a}x^${d.n} no ponto x = ${d.x0}.`;
    case "derivadas-definicao":
      return `Use a definição de derivada para calcular f'(${d.x0}) quando f(x) = ${d.a}x^${d.n}.`;
  }
}

function fmtX0(x: number): string {
  if (x === Math.PI) return "π";
  if (x === Math.PI / 2) return "π/2";
  if (x === Math.PI / 4) return "π/4";
  if (Math.abs(x - Math.E) < 0.01) return "e";
  return String(x);
}

export const derivadasGenerator = {
  topicoId: TOPICO_DERIVADAS,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.slice(0, 3)
        : ctx.dificuldade === 2
          ? CENARIOS.slice(0, 6)
          : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_DERIVADAS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_DERIVADAS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};

// re-export fmtPoly for solver if needed
export { fmtPoly };
