import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_FUNCAO_MODULAR, type FuncaoModularData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => FuncaoModularData> = [
  gerarEquacao,
  gerarInequacao,
  gerarAvaliar,
  gerarInequacaoMaior,
];

function pickCoeffs(ctx: GeneratorContext) {
  const a = ctx.rng.pick([1, 2, 3, -2, -3]);
  const c = ctx.rng.nextInt(2, 12);
  const x1 = ctx.rng.nextInt(-6, 6);
  const b = a * x1 + (ctx.rng.next() > 0.5 ? c : -c);
  return { a, b, c };
}

function gerarEquacao(ctx: GeneratorContext): FuncaoModularData {
  const { a, b, c } = pickCoeffs(ctx);
  return { tipo: "modular-equacao", a, b, c };
}

function gerarInequacao(ctx: GeneratorContext): FuncaoModularData {
  const { a, b, c } = pickCoeffs(ctx);
  return { tipo: "modular-inequacao", a, b, c, operador: "menor" };
}

function gerarInequacaoMaior(ctx: GeneratorContext): FuncaoModularData {
  const { a, b, c } = pickCoeffs(ctx);
  return { tipo: "modular-inequacao", a, b, c, operador: "maior" };
}

function gerarAvaliar(ctx: GeneratorContext): FuncaoModularData {
  const a = ctx.rng.pick([1, 2, 3, -2]);
  const b = ctx.rng.nextInt(-6, 6);
  const x0 = ctx.rng.nextInt(-5, 5);
  return { tipo: "modular-avaliar", a, b, x0 };
}

function fmtMod(a: number, b: number): string {
  const inner =
    b === 0
      ? a === 1
        ? "x"
        : a === -1
          ? "−x"
          : `${a}x`
      : a === 1
        ? `x ${b > 0 ? "+" : "−"} ${Math.abs(b)}`
        : a === -1
          ? `−x ${b > 0 ? "+" : "−"} ${Math.abs(b)}`
          : `${a}x ${b > 0 ? "+" : "−"} ${Math.abs(b)}`;
  return `|${inner}|`;
}

function enunciado(d: FuncaoModularData): string {
  const f = fmtMod(d.a, d.b);
  switch (d.tipo) {
    case "modular-equacao":
      return `Resolva a equação ${f} = ${d.c}. (Informe as soluções separadas por vírgula, em ordem crescente.)`;
    case "modular-inequacao":
      return d.operador === "menor"
        ? `Resolva a inequação ${f} < ${d.c}. (Use notação de intervalo aberto.)`
        : `Resolva a inequação ${f} > ${d.c}. (Use união de intervalos.)`;
    case "modular-avaliar":
      return `Dada f(x) = ${f}, calcule f(${d.x0}).`;
  }
}

export const funcaoModularGenerator = {
  topicoId: TOPICO_FUNCAO_MODULAR,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const pool =
      ctx.dificuldade === 1
        ? [gerarEquacao, gerarAvaliar]
        : CENARIOS;
    const dados = ctx.rng.pick(pool)(ctx);
    return {
      id: "",
      disciplinaId: "pre-calculo",
      topicoId: TOPICO_FUNCAO_MODULAR,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_FUNCAO_MODULAR,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 1,
      },
      geradoEm: "",
    };
  },
};
