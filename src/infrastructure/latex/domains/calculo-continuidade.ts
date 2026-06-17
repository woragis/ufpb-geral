import type { Problem } from "@/core/domain/problem";
import {
  afimLatex,
  frac,
  limLateralLatex,
  num,
  piecewise,
  signed,
  text,
} from "./calculo-latex-shared";
import type { ContinuidadeData } from "@/domains/calculo/entities/types";

export function continuidadeEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as ContinuidadeData;
  switch (d.tipo) {
    case "continuidade-afim":
      return `${text("A função abaixo é contínua em ")}$x = ${num(d.a)}$${text("? ")}${piecewise([
        { expr: afimLatex(d.m1, d.b1), cond: `x < ${num(d.a)}` },
        { expr: afimLatex(d.m2, d.b2), cond: `x \\geq ${num(d.a)}` },
      ])}`;
    case "continuidade-classificar":
      if (d.classe === "removivel") {
        return `${text("Classifique a descontinuidade de ")}$f(x) = ${frac(`x^2 - ${num(d.a * d.a)}`, `x - ${num(d.a)}`)}$ ${text("em ")}$x = ${num(d.a)}$${text(".")}`;
      }
      if (d.classe === "salto") {
        return `${text("Para ")}$x < ${num(d.a)}$: $f(x) = ${afimLatex(d.m, d.b)}$; ${text("para ")}$x \\geq ${num(d.a)}$: $f(x) = ${num(d.valorDir ?? 0)}$. ${text("Classifique em ")}$x = ${num(d.a)}$.`;
      }
      return `${text("Classifique a descontinuidade de ")}$f(x) = ${frac("1", `x - ${num(d.a)}`)}$ ${text("em ")}$x = ${num(d.a)}$.`;
    case "continuidade-completar": {
      const sum = d.r1 + d.r2;
      const prod = d.r1 * d.r2;
      return `${text("Para que ")}$f(x) = ${frac(`x^2 ${signed(-sum)}x ${signed(prod)}`, `x - ${num(d.a)}`)}$ ${text("seja contínua em ")}$x = ${num(d.a)}$${text(", qual valor atribuir a ")}$f(${num(d.a)})$${text("?")}`;
    }
    case "continuidade-lateral":
      if (d.variante === "inverso") {
        return `${text("Calcule ")}$${limLateralLatex(d.a, "-")} ${frac("1", `x - ${num(d.a)}`)}$ ${text("e ")}$${limLateralLatex(d.a, "+")} ${frac("1", `x - ${num(d.a)}`)}$. ${text("Os limites laterais existem e são iguais?")}`;
      }
      return `${text("Calcule ")}$${limLateralLatex(0, "-")} ${frac("|x|", "x")}$ ${text("e ")}$${limLateralLatex(0, "+")} ${frac("|x|", "x")}$.`;
    case "continuidade-tvi":
      return `${text("Se ")}$f$ ${text("é contínua em ")}$[${num(d.a)}, ${num(d.b)}]$, $f(${num(d.a)}) = ${num(d.fa)}$, $f(${num(d.b)}) = ${num(d.fb)}$ ${text("e ")}$k = ${num(d.k)}$ ${text("está entre ")}$f(${num(d.a)})$ ${text("e ")}$f(${num(d.b)})$${text(", existe ")}$c \\in (${num(d.a)}, ${num(d.b)})$ ${text("com ")}$f(c) = k$${text("? (T.V.I.)")}`;
    case "continuidade-trig-ponto":
      return d.funcao === "sin"
        ? `${text("Defina ")}$f(x) = ${frac("\\sin x", "x")}$ ${text("para ")}$x \\neq 0$ ${text("e ")}$f(0) = 1$. ${text("É contínua em ")}$x = 0$${text("?")}`
        : `${text("A função ")}$g(x) = \\cos x$ ${text("é contínua em ")}$x = 0$${text("?")}`;
    case "continuidade-rolle":
      return `${text("Para ")}$f(x) = ${num(d.coef)}x^2$ ${text("em ")}$[${num(d.a)}, ${num(d.b)}]$, ${text("existe ")}$c \\in (${num(d.a)}, ${num(d.b)})$ ${text("com ")}$f'(c) = 0$${text("? (Rolle)")}`;
  }
}

export function continuidadeRespostaFinal(problem: Problem, plain: string): string {
  const d = problem.dados as ContinuidadeData;
  if (d.tipo === "continuidade-afim") {
    return d.continua ? text("Sim") : text("Não");
  }
  if (d.tipo === "continuidade-classificar") {
    const labels = {
      removivel: text("Removível"),
      salto: text("Salto"),
      infinita: text("Infinita"),
    };
    return labels[d.classe];
  }
  if (d.tipo === "continuidade-completar") {
    return num(d.r1 + d.r2);
  }
  if (d.tipo === "continuidade-lateral") {
    return text("Não");
  }
  if (d.tipo === "continuidade-tvi" || d.tipo === "continuidade-trig-ponto") {
    return text("Sim");
  }
  if (d.tipo === "continuidade-rolle") {
    return `${text("Sim, ")}c = 0`;
  }
  return plain;
}
