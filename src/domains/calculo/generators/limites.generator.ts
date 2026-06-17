import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_LIMITES, type LimitesData } from "../entities/types";

const CENARIOS: Array<(ctx: GeneratorContext) => LimitesData> = [
  gerarAlgebrico,
  gerarTrig,
  gerarRacional,
  gerarRadical,
  gerarInfinito,
  gerarSubstituicao,
];

function gerarAlgebrico(ctx: GeneratorContext): LimitesData {
  const a = ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 9 : 5);
  const coeficiente = ctx.rng.pick([1, 2, 3, 4]);
  return {
    tipo: "limite-algebrico",
    a,
    coeficiente,
    constante: coeficiente * a * a,
  };
}

function gerarTrig(ctx: GeneratorContext): LimitesData {
  const variante = ctx.rng.pick([
    "sin-x",
    "sin-ax",
    "tan-x",
    "um-menos-cos",
  ] as const);
  const a = ctx.rng.pick([2, 3, 4, 5]);
  if (variante === "sin-ax") {
    const b = ctx.rng.pick([1, 2, 3]);
    return { tipo: "limite-trig", variante, a, b };
  }
  return { tipo: "limite-trig", variante, a };
}

function gerarRacional(ctx: GeneratorContext): LimitesData {
  const a = ctx.rng.nextInt(1, 5);
  const r1 = a;
  const r2 = ctx.rng.nextInt(1, 6);
  return { tipo: "limite-racional", a, r1, r2 };
}

function gerarRadical(ctx: GeneratorContext): LimitesData {
  const k = ctx.rng.pick([1, 4, 9, 16, 25]);
  return { tipo: "limite-radical", k };
}

function gerarInfinito(ctx: GeneratorContext): LimitesData {
  const numA = ctx.rng.pick([2, 3, 4, 5]);
  const denA = ctx.rng.pick([1, 2, 3]);
  const numB = ctx.rng.nextInt(0, 5);
  const denB = ctx.rng.nextInt(0, 5);
  return { tipo: "limite-infinito", numA, numB, denA, denB };
}

function gerarSubstituicao(ctx: GeneratorContext): LimitesData {
  const a = ctx.rng.nextInt(1, 4);
  const templates = [
    { coeficientes: [1, 2], expoentes: [2, 1] },
    { coeficientes: [2, 3], expoentes: [3, 1] },
    { coeficientes: [1, 1, 3], expoentes: [2, 1, 0] },
  ];
  const t = ctx.rng.pick(templates);
  const coeficientes = t.coeficientes.map((c) =>
    ctx.rng.nextInt(1, ctx.dificuldade === 3 ? 5 : 3),
  );
  return {
    tipo: "limite-substituicao",
    a,
    coeficientes,
    expoentes: t.expoentes,
  };
}

function enunciado(d: LimitesData): string {
  switch (d.tipo) {
    case "limite-algebrico":
      return `Calcule o limite: lim(x→${d.a}) [(${d.coeficiente}x² − ${d.constante}) / (x − ${d.a})]`;
    case "limite-trig":
      switch (d.variante) {
        case "sin-x":
          return "Calcule o limite: lim(x→0) [sin(x) / x]";
        case "sin-ax":
          return `Calcule o limite: lim(x→0) [sin(${d.a}x) / (${d.b ?? 1}x)]`;
        case "tan-x":
          return "Calcule o limite: lim(x→0) [tg(x) / x]";
        case "um-menos-cos":
          return "Calcule o limite: lim(x→0) [(1 − cos(x)) / x²]";
      }
      break;
    case "limite-racional": {
      const sum = d.r1 + d.r2;
      const prod = d.r1 * d.r2;
      return `Calcule o limite: lim(x→${d.a}) [(x² − ${sum}x + ${prod}) / (x − ${d.a})]`;
    }
    case "limite-radical":
      return `Calcule o limite: lim(x→0) [(√(x + ${d.k}) − √${d.k}) / x]`;
    case "limite-infinito":
      return `Calcule o limite: lim(x→∞) [(${d.numA}x² ${d.numB >= 0 ? "+" : "−"} ${Math.abs(d.numB)}) / (${d.denA}x² ${d.denB >= 0 ? "+" : "−"} ${Math.abs(d.denB)})]`;
    case "limite-substituicao": {
      const terms = d.coeficientes.map((c, i) => {
        const exp = d.expoentes[i]!;
        if (exp === 0) return String(c);
        if (exp === 1) return `${c}x`;
        return `${c}x^${exp}`;
      });
      return `Calcule o limite: lim(x→${d.a}) [${terms.join(" + ")}]`;
    }
  }
  return "Calcule o limite.";
}

export const limitesGenerator = {
  topicoId: TOPICO_LIMITES,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);

    return {
      id: "",
      disciplinaId: "calculo",
      topicoId: TOPICO_LIMITES,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_LIMITES,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
