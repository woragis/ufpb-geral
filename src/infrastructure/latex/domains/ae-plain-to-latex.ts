import { calculoPlainToLatex } from "./calculo-plain-to-latex";

const UNICODE: [RegExp, string][] = [
  [/x̄/g, "\\bar{x}"],
  [/ȳ/g, "\\bar{y}"],
  [/xᵢ/g, "x_i"],
  [/yᵢ/g, "y_i"],
  [/σ²/g, "\\sigma^2"],
  [/σ/g, "\\sigma"],
  [/ρ/g, "\\rho"],
  [/Σ/g, "\\sum"],
  [/−/g, "-"],
  [/·/g, "\\cdot"],
  [/≤/g, "\\leq"],
  [/≥/g, "\\geq"],
  [/°/g, "^\\circ"],
];

export function aePlainToLatex(input: string | undefined): string | undefined {
  if (!input?.trim()) return undefined;
  let s = input.trim();

  for (const [re, rep] of UNICODE) {
    s = s.replace(re, rep);
  }

  s = s.replace(/\bs²\b/g, "s^2");
  s = s.replace(/\bCV\b/g, "\\mathrm{CV}");
  s = s.replace(/\bMAD\b/g, "\\mathrm{MAD}");
  s = s.replace(/\bIQR\b/g, "\\mathrm{IQR}");
  s = s.replace(/\bMG\b/g, "\\mathrm{MG}");
  s = s.replace(/Cov\(X,Y\)/g, "\\mathrm{Cov}(X,Y)");
  s = s.replace(/Q1/g, "Q_1");
  s = s.replace(/Q2/g, "Q_2");
  s = s.replace(/Q3/g, "Q_3");
  s = s.replace(/\{([^}]+)\}/g, (_, inner) => {
    if (/^\d/.test(inner) || inner.includes(",") || inner.includes("+")) {
      return `\\{${inner}\\}`;
    }
    return `\\{${inner}\\}`;
  });

  s = s.replace(/(\d+(?:[.,]\d+)?)\s*\+\s*/g, "$1 + ");
  s = s.replace(/(\d+)\/(\d+)/g, (_, a, b) => `\\frac{${a}}{${b}}`);

  return calculoPlainToLatex(s);
}

export function aeExplicacaoToLatex(input: string | undefined): string | undefined {
  if (!input?.trim()) return undefined;
  const s = input.trim();
  const hasMath =
    /x̄|ȳ|σ|ρ|Σ|IQR|CV|MAD|Cov|Q[123]|s²|MG|\/|≥|≤|·|\{.*\}|=.*\d/.test(s);
  if (!hasMath) {
    return `\\text{${escapeText(s)}}`;
  }
  return aePlainToLatex(s);
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/#/g, "\\#")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/_/g, "\\_");
}
