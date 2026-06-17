import type { Problem } from "@/core/domain/problem";
import {
  frac,
  integral,
  integralIndef,
  num,
  signed,
  text,
} from "./calculo-latex-shared";
import { calculoPlainToLatex } from "./calculo-plain-to-latex";
import type {
  AreaData,
  EdosData,
  IntegraisDefinidasData,
  IntegraisIndefinidasData,
  SequenciasData,
  SeriesData,
  TaylorData,
} from "@/domains/calculo/entities/types";

export function calculoRestEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as { tipo?: string };
  switch (d.tipo) {
    case "integrais-indefinidas": {
      const x = d as IntegraisIndefinidasData;
      return `${text("Calcule ")}${integralIndef(`x^{${num(x.n)}}`)}.`;
    }
    case "integrais-definidas": {
      const x = d as IntegraisDefinidasData;
      return `${text("Calcule ")}${integral(x.a, x.b, `${num(x.c)}x ${signed(x.d)}`)}.`;
    }
    case "area": {
      const x = d as AreaData;
      return `${text("Calcule a área sob ")}$f(x) = ${num(x.m)}x ${signed(x.b)}$ ${text("entre ")}$x = ${num(x.a)}$ ${text("e ")}$x = ${num(x.c)}$.`;
    }
    case "sequencias": {
      const x = d as SequenciasData;
      return `${text("Calcule ")}$\\displaystyle\\lim_{n \\to \\infty} ${frac(`${num(x.numeradorCoef)}n ${signed(x.numeradorConst)}`, `${num(x.denominadorCoef)}n ${signed(x.denominadorConst)}`)}$.`;
    }
    case "series": {
      const x = d as SeriesData;
      if (Math.abs(x.r) < 1) {
        return `${text("Calcule a soma da série geométrica infinita com ")}$a_1 = ${num(x.a1)}$ ${text("e ")}$r = ${num(x.r)}$.`;
      }
      return `${text("Calcule ")}$S_{${num(x.n)}}$ ${text("da série geométrica com ")}$a_1 = ${num(x.a1)}$, $r = ${num(x.r)}$.`;
    }
    case "taylor": {
      const x = d as TaylorData;
      const fn = x.funcao === "exponencial" ? "e^x" : "\\sin(x)";
      return `${text("Escreva o polinômio de Taylor de ")}$${fn}$ ${text("de grau ")}${num(x.grau)}$ ${text("em torno de ")}$x = ${num(x.x0)}$.`;
    }
    case "edos": {
      const x = d as EdosData;
      return `${text("Resolva ")}$\\dfrac{dy}{dx} = ${num(x.k)}y$ ${text("com ")}$y(0) = ${num(x.y0)}$ ${text("e calcule ")}$y(${num(x.x)})$.`;
    }
  }
  return undefined;
}

export function calculoRestRespostaFinal(problem: Problem, plain: string): string {
  const d = problem.dados as { tipo?: string };
  switch (d.tipo) {
    case "integrais-indefinidas": {
      const x = d as IntegraisIndefinidasData;
      return `\\frac{x^{${num(x.n + 1)}}}{${num(x.n + 1)}} + C`;
    }
    case "integrais-definidas": {
      return calculoPlainToLatex(plain) ?? plain;
    }
    case "area":
      return calculoPlainToLatex(plain) ?? plain;
    case "sequencias": {
      const x = d as SequenciasData;
      return num(x.numeradorCoef / x.denominadorCoef);
    }
    case "series":
    case "taylor": {
      const x = d as TaylorData;
      if (d.tipo === "taylor") {
        if (x.funcao === "exponencial") {
          return x.grau === 1 ? "1 + x" : "1 + x + \\frac{x^2}{2}";
        }
        return x.grau === 1 ? "x" : "x - \\frac{x^3}{6}";
      }
      return calculoPlainToLatex(plain) ?? plain;
    }
    case "edos": {
      const x = d as EdosData;
      return num(x.y0 * Math.exp(x.k * x.x));
    }
  }
  return calculoPlainToLatex(plain) ?? plain;
}
