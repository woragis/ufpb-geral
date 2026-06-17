import type { Problem } from "@/core/domain/problem";
import { fmtNum } from "@/domains/calculo/lib/format";
import { num, quadLatex, signed, text } from "./calculo-latex-shared";
import { calculoPlainToLatex } from "./calculo-plain-to-latex";
import type { OtimizacaoData } from "@/domains/calculo/entities/types";

export function otimizacaoEnunciado(problem: Problem): string | undefined {
  const d = problem.dados as OtimizacaoData;
  switch (d.tipo) {
    case "otimizacao-parabola":
      return `${text("Encontre o ")}$x$ ${text("que minimiza ")}$f(x) = ${quadLatex(d.a, d.b, d.c)}$.`;
    case "otimizacao-geometrica":
      return `${text("Retângulo com perímetro ")}${num(d.perimetro)}${text(" cm. Qual largura ")}$x$ ${text("maximiza a área?")}`;
    case "otimizacao-crescimento":
      return `${text("Para ")}$f(x) = x^3 ${signed(d.a)}x$, ${text("em quais intervalos ")}$f$ ${text("é crescente?")}`;
    case "otimizacao-concavidade":
      return `${text("Para ")}$f(x) = x^3 ${signed(d.a)}x$, ${text("onde ")}$f$ ${text("é côncava para cima?")}`;
    case "otimizacao-cilindro":
      return `${text("Cilindro com tampa: área superficial ")}${num(d.area)}\\pi$ ${text("cm². Qual raio maximiza o volume?")}`;
    case "otimizacao-caixa":
      return `${text("Folha quadrada de lado ")}${num(d.lado)}${text(" cm; cortes ")}$x$ ${text("nos cantos. Qual ")}$x$ ${text("maximiza o volume?")}`;
    case "otimizacao-segunda-derivada":
      return `${text("Classifique ")}$x = ${num(d.x0)}$ ${text("para ")}$f(x) = ${num(d.a)}x^3 ${signed(d.b)}x^2$ ${text("usando ")}$f''$.`;
    case "otimizacao-esboco":
      return `${text("Esboce o comportamento de ")}$f(x) = x^3 ${signed(d.a)}x$ ${text("(críticos, crescimento, concavidade).")}`;
  }
}

export function otimizacaoRespostaFinal(problem: Problem, plain: string): string {
  const d = problem.dados as OtimizacaoData;
  if (d.tipo === "otimizacao-parabola") {
    const xv = -d.b / (2 * d.a);
    return num(xv);
  }
  if (d.tipo === "otimizacao-geometrica") {
    return num(d.perimetro / 4);
  }
  if (d.tipo === "otimizacao-crescimento") {
    const delta = Math.sqrt(-d.a / 3);
    return d.a < 0
      ? `x < -${fmtNum(delta)} \\lor x > ${fmtNum(delta)}`
      : text("todos os x");
  }
  if (d.tipo === "otimizacao-concavidade") {
    return "x > 0";
  }
  if (d.tipo === "otimizacao-cilindro") {
    const r = Math.sqrt(d.area / (3 * Math.PI));
    return num(Math.round(r * 1000) / 1000);
  }
  if (d.tipo === "otimizacao-caixa") {
    return num(d.lado / 6);
  }
  if (d.tipo === "otimizacao-segunda-derivada") {
    const fpp = 6 * d.a * d.x0 + 2 * d.b;
    return fpp > 0 ? text("mínimo local") : text("máximo local");
  }
  return calculoPlainToLatex(plain) ?? plain;
}
