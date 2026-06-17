import {
  frac,
  integral,
  integralIndef,
  lim,
  num,
  piecewise,
  polyLatex,
  signed,
  sqrtLatex,
  text,
} from "@/core/presentation/math/latex-helpers";

export function xLatex(x: number): string {
  if (x === Math.PI) return "\\pi";
  if (Math.abs(x - Math.PI / 2) < 1e-9) return "\\pi/2";
  if (Math.abs(x - Math.PI / 4) < 1e-9) return "\\pi/4";
  if (Math.abs(x - Math.PI / 3) < 1e-9) return "\\pi/3";
  if (Math.abs(x - Math.E) < 0.001) return "e";
  return num(x);
}

export function innerArgLatex(k: number, b: number): string {
  if (k === 1 && b === 0) return "x";
  if (k === 1) return `x ${signed(b)}`;
  if (b === 0) return `${num(k)}x`;
  return `${num(k)}x ${signed(b)}`;
}

export function trigLatex(
  name: "sin" | "cos" | "tan",
  k: number,
  b: number,
): string {
  const cmd = name === "sin" ? "\\sin" : name === "cos" ? "\\cos" : "\\tan";
  return `${cmd}\\left(${innerArgLatex(k, b)}\\right)`;
}

export function afimLatex(a: number, b: number): string {
  const ax = a === 1 ? "x" : a === -1 ? "-x" : `${num(a)}x`;
  if (b === 0) return ax;
  return `${ax} ${signed(b)}`;
}

export function quadLatex(a: number, b: number, c: number): string {
  const ax2 = a === 1 ? "x^2" : a === -1 ? "-x^2" : `${num(a)}x^2`;
  const bx = b === 0 ? "" : ` ${signed(b)}x`;
  const cc = c === 0 ? "" : ` ${signed(c)}`;
  return `${ax2}${bx}${cc}`;
}

export function limLateralLatex(a: number, side: "-" | "+"): string {
  return `\\lim_{x \\to ${num(a)}^{${side}}}`;
}

export function limToLatex(a: number | string, side?: "-" | "+"): string {
  const sup = side ? `^{${side}}` : "";
  return `\\lim_{x \\to ${a}${sup}}`;
}

export { frac, lim, num, polyLatex, signed, sqrtLatex, text, piecewise, integral, integralIndef };
