import type { Problem } from "@/core/domain/problem";
import { afimLatex, num, sqrtLatex, text } from "./calculo-latex-shared";
import { calculoPlainToLatex } from "./calculo-plain-to-latex";
import type { RegraCadeiaData } from "@/domains/calculo/entities/types";

export function regraCadeiaEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as RegraCadeiaData;
  switch (d.tipo) {
    case "regra-cadeia-potencia":
      return `${text("Seja ")}$h(x) = (${afimLatex(d.a, d.b)})^{${num(d.n)}}$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
    case "regra-cadeia-trig":
      return d.funcao === "sin"
        ? `${text("Seja ")}$h(x) = \\sin(${afimLatex(d.a, d.b)})$. ${text("Calcule ")}$h'(${num(d.x0)})$.`
        : `${text("Seja ")}$h(x) = \\cos(${afimLatex(d.a, d.b)})$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
    case "regra-cadeia-exp-log":
      return d.funcao === "exp"
        ? `${text("Seja ")}$h(x) = e^{${afimLatex(d.a, d.b)}}$. ${text("Calcule ")}$h'(${num(d.x0)})$.`
        : `${text("Seja ")}$h(x) = \\ln(${afimLatex(d.a, d.b)})$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
    case "regra-cadeia-avancada":
      switch (d.variante) {
        case "sin-quadrado":
          return `${text("Seja ")}$h(x) = \\sin^2(x)$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
        case "exp-quadrado":
          return `${text("Seja ")}$h(x) = e^{x^2}$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
        case "ln-quadrado":
          return `${text("Seja ")}$h(x) = \\ln(x^2 + 1)$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
        case "sqrt-composta":
          return `${text("Seja ")}$h(x) = ${sqrtLatex(`1 + x^2`)}$. ${text("Calcule ")}$h'(${num(d.x0)})$.`;
      }
  }
}

export function regraCadeiaRespostaFinal(plain: string): string {
  return calculoPlainToLatex(plain) ?? plain;
}
