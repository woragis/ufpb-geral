/** Utilitários para construir LaTeX formal a partir de dados tipados. */

export function num(n: number, decimals?: number): string {
  if (decimals !== undefined) {
    return n.toFixed(decimals).replace(/\.?0+$/, "");
  }
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
}

export function frac(a: number | string, b: number | string): string {
  return `\\frac{${a}}{${b}}`;
}

export function text(t: string): string {
  return `\\text{${t}}`;
}

export function vec(...components: (number | string)[]): string {
  return `\\begin{pmatrix}${components.join(" \\\\ ")}\\end{pmatrix}`;
}

export function vecInline(...components: (number | string)[]): string {
  return `\\langle ${components.join(",\\,")} \\rangle`;
}

export function lim(x0: number | string, expr: string): string {
  return `\\lim_{x \\to ${x0}} \\left(${expr}\\right)`;
}

export function deriv(expr: string): string {
  return `\\frac{d}{dx}\\left(${expr}\\right)`;
}

export function partial(expr: string, varName = "x"): string {
  return `\\frac{\\partial}{\\partial ${varName}} \\left(${expr}\\right)`;
}

export function polyTerm(coef: number, exp: number, varName = "x"): string {
  if (exp === 0) return num(coef);
  const c = coef === 1 ? "" : coef === -1 ? "-" : num(coef);
  if (exp === 1) return `${c}${varName}`;
  return `${c}${varName}^{${exp}}`;
}

export function polyLatex(coefs: number[], exps: number[], varName = "x"): string {
  const terms = coefs.map((c, i) => polyTerm(c, exps[i]!));
  return terms.join(" + ").replace(/\+ -/g, "- ");
}

export function sqrtLatex(n: number | string): string {
  return `\\sqrt{${n}}`;
}

export function set(...elements: string[]): string {
  return `\\left\\{${elements.join(",\\,")}\\right\\}`;
}

export function prob(event: string): string {
  return `P\\left(${event}\\right)`;
}

export function condProb(a: string, b: string): string {
  return `P\\left(${a} \\mid ${b}\\right)`;
}

export function expectX(expr = "X"): string {
  return `\\mathbb{E}\\left[${expr}\\right]`;
}

export function integral(a: number | string, b: number | string, expr: string): string {
  return `\\int_{${a}}^{${b}} ${expr} \\, dx`;
}

export function integralIndef(expr: string): string {
  return `\\int ${expr} \\, dx`;
}

export function piecewise(
  branches: { cond: string; expr: string }[],
): string {
  const body = branches
    .map((b) => `${b.expr} & ${b.cond}`)
    .join(" \\\\ ");
  return `f(x) = \\begin{cases} ${body} \\end{cases}`;
}

export function sign(n: number): string {
  return n >= 0 ? `+ ${num(Math.abs(n))}` : `- ${num(Math.abs(n))}`;
}

export function signed(n: number): string {
  return n >= 0 ? `+ ${num(n)}` : `- ${num(Math.abs(n))}`;
}
