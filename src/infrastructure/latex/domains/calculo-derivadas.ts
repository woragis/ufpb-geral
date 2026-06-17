import type { Problem } from "@/core/domain/problem";
import {
  frac,
  num,
  polyLatex,
  signed,
  text,
  trigLatex,
  xLatex,
} from "./calculo-latex-shared";
import { calculoPlainToLatex } from "./calculo-plain-to-latex";
import type { DerivadasData } from "@/domains/calculo/entities/types";

export function derivadasEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as DerivadasData;
  switch (d.tipo) {
    case "derivadas-polinomio":
      return `${text("Dada ")}$f(x) = ${polyLatex(d.coeficientes, d.expoentes)}$, ${text("calcule ")}$f'(${xLatex(d.x0)})$.`;
    case "derivadas-trig": {
      const fn = trigLatex(d.funcao === "tan" ? "tan" : d.funcao, d.k, d.b);
      return `${text("Dada ")}$f(x) = ${fn}$, ${text("calcule ")}$f'(x)$ ${text("e avalie em ")}$x = ${xLatex(d.x0)}$.`;
    }
    case "derivadas-exp-log":
      return d.funcao === "exp"
        ? `${text("Dada ")}$f(x) = e^{${num(d.k)}x}$, ${text("calcule ")}$f'(${xLatex(d.x0)})$.`
        : `${text("Dada ")}$f(x) = \\ln(${num(d.k)}x)$, ${text("calcule ")}$f'(${xLatex(d.x0)})$.`;
    case "derivadas-produto":
      return `${text("Dada ")}$f(x) = (${num(d.a)}x^{${num(d.n)}}) \\cdot (${num(d.b)}x ${signed(d.c)})$, ${text("calcule ")}$f'(${num(d.x0)})$.`;
    case "derivadas-quociente":
      return `${text("Dada ")}$f(x) = ${frac(`x^{${num(d.n)}}`, `x + ${num(d.c)}`)}$, ${text("calcule ")}$f'(${num(d.x0)})$.`;
    case "derivadas-tangente":
      return `${text("Encontre a equação da reta tangente a ")}$f(x) = ${num(d.a)}x^{${num(d.n)}}$ ${text("no ponto ")}$x = ${num(d.x0)}$.`;
    case "derivadas-definicao":
      return `${text("Use a definição de derivada para calcular ")}$f'(${num(d.x0)})$ ${text("quando ")}$f(x) = ${num(d.a)}x^{${num(d.n)}}$.`;
    case "derivadas-taxa-relacionada":
      if (d.variante === "escada") {
        return `${text("Escada de ")}${num(d.p1)}${text(" m; pé a ")}${num(d.p2)}${text(" m da parede afasta-se a ")}${num(d.p3)}${text(" m/s. Velocidade do topo?")}`;
      }
      if (d.variante === "balao") {
        return `${text("Balão esférico: raio ")}${num(d.p1)}${text(" m, ")}$\\frac{dr}{dt} = ${num(d.p2)}$${text(" m/s. Taxa de variação do volume?")}`;
      }
      return `${text("Cone: altura ")}${num(d.p1)}${text(" m; quando ")}$h = ${num(d.p2)}$${text(" m, ")}$\\frac{dV}{dt} = ${num(d.p3)}\\pi$${text(" m³/s. Encontre ")}$\\frac{dh}{dt}$.`;
    case "derivadas-implicita":
      return `${text("Na curva ")}$x^2 + y^2 = ${num(d.r)}^2$, ${text("encontre ")}$\\frac{dy}{dx}$ ${text("em ")}$(${num(d.x0)}, ${num(d.y0)})$.`;
    case "derivadas-aprox-linear":
      return `${text("Aproxime ")}$f(${xLatex(d.x0 + d.dx)})$ ${text("para ")}$f(x) = ${num(d.a)}x^{${num(d.n)}}$ ${text("pela linearização em ")}$x = ${num(d.x0)}$.`;
    case "derivadas-segunda-teste":
      return `${text("Classifique ")}$x = ${num(d.x0)}$ ${text("de ")}$f(x) = x^3 ${signed(d.a)}x$ ${text("(máximo ou mínimo local).")}`;
    case "derivadas-inversa-trig":
      return d.funcao === "arctan"
        ? `${text("Calcule ")}$\\frac{d}{dx}\\arctan(x)$ ${text("em ")}$x = ${xLatex(d.x0)}$.`
        : `${text("Calcule ")}$\\frac{d}{dx}\\arcsin(x)$ ${text("em ")}$x = ${xLatex(d.x0)}$.`;
  }
}

export function derivadasRespostaFinal(problem: Problem, plain: string): string {
  const d = problem.dados as DerivadasData;
  if (d.tipo === "derivadas-tangente") {
    const y0 = d.a * Math.pow(d.x0, d.n);
    const m = d.a * d.n * Math.pow(d.x0, d.n - 1);
    const b = y0 - m * d.x0;
    return `y = ${num(m)}x ${signed(b)}`;
  }
  if (d.tipo === "derivadas-segunda-teste") {
    const fpp = 6 * d.x0;
    return fpp > 0 ? text("mínimo local") : text("máximo local");
  }
  return calculoPlainToLatex(plain) ?? plain;
}
