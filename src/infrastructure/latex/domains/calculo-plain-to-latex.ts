/** Converte strings dos solvers (texto informal) em LaTeX renderizável pelo KaTeX. */

const UNICODE: [RegExp, string][] = [
  [/Ω/g, "\\Omega"],
  [/∩/g, "\\cap"],
  [/∪/g, "\\cup"],
  [/×/g, "\\times"],
  [/·/g, "\\cdot"],
  [/≤/g, "\\leq"],
  [/≥/g, "\\geq"],
  [/≠/g, "\\neq"],
  [/→/g, "\\to"],
  [/⁻/g, "^-"],
  [/⁺/g, "^+"],
  [/²/g, "^2"],
  [/³/g, "^3"],
  [/ⁿ/g, "^n"],
  [/₀/g, "_0"],
  [/₁/g, "_1"],
  [/₂/g, "_2"],
  [/∫/g, "\\int"],
  [/π/g, "\\pi"],
  [/θ/g, "\\theta"],
  [/−/g, "-"],
  [/≈/g, "\\approx"],
  [/±/g, "\\pm"],
  [/∞/g, "\\infty"],
  [/∂/g, "\\partial"],
  [/°/g, "^\\circ"],
  [/ℝ/g, "\\mathbb{R}"],
];

export function calculoPlainToLatex(input: string | undefined): string | undefined {
  if (!input?.trim()) return undefined;
  let s = input.trim();

  for (const [re, rep] of UNICODE) {
    s = s.replace(re, rep);
  }

  s = s.replace(
    /lim\s*\(\s*x\s*\\to\s*([^)]+?)(?:\^([+-]))?\s*\)/gi,
    (_, dest, side) => {
      const d = String(dest).trim();
      const sup = side ? `^{${side}}` : "";
      return `\\lim_{x \\to ${d}${sup}}`;
    },
  );

  s = s.replace(
    /lim\s*\(\s*x\s*→\s*([^)]+?)(?:([⁺⁻]))?\s*\)/gi,
    (_, dest, mark) => {
      const d = String(dest).trim();
      const side = mark === "⁺" ? "^+" : mark === "⁻" ? "^-" : "";
      return `\\lim_{x \\to ${d}${side}}`;
    },
  );

  s = s.replace(
    /lim\s*\(\s*h\s*→\s*0\s*\)/gi,
    "\\lim_{h \\to 0}",
  );

  s = s.replace(
    /lim\s*\(\s*n\s*→\s*∞\s*\)/gi,
    "\\lim_{n \\to \\infty}",
  );

  s = s.replace(/\bsin\^2\s*\(/g, "\\sin^2\\left(");
  s = s.replace(/\bcos\^2\s*\(/g, "\\cos^2\\left(");
  s = s.replace(/\bsin\(/g, "\\sin\\left(");
  s = s.replace(/\bcos\(/g, "\\cos\\left(");
  s = s.replace(/\btg\(/g, "\\tan\\left(");
  s = s.replace(/\btan\(/g, "\\tan\\left(");
  s = s.replace(/\bln\(/g, "\\ln\\left(");
  s = s.replace(/\barctg\(/g, "\\arctan\\left(");
  s = s.replace(/\barcsen\(/g, "\\arcsin\\left(");
  s = s.replace(/\barccos\(/g, "\\arccos\\left(");

  s = s.replace(/e\^\(([^)]+)\)/g, "e^{$1}");
  s = s.replace(/e\^([0-9a-zA-Z+\-]+)/g, "e^{$1}");

  s = s.replace(/√\(([^)]+)\)/g, "\\sqrt{$1}");
  s = s.replace(/√/g, "\\sqrt");

  s = s.replace(
    /\b(d[xytVhr]|d[xy])\s*\/\s*(d[xytVhr]|d[xy])\b/g,
    "\\frac{$1}{$2}",
  );

  s = s.replace(/(\w)\^(\d+)/g, "$1^{$2}");
  s = s.replace(/(\w)\^([a-zA-Z]+)/g, "$1^{$2}");

  s = s.replace(/(\d+)\/(\d+)/g, (_, a, b) => `\\frac{${a}}{${b}}`);

  s = s.replace(/P\(([^)]+)\)/g, "P\\left($1\\right)");
  s = s.replace(/f'\(([^)]+)\)/g, "f'\\left($1\\right)");
  s = s.replace(/f''\(([^)]+)\)/g, "f''\\left($1\\right)");
  s = s.replace(/h'\(([^)]+)\)/g, "h'\\left($1\\right)");
  s = s.replace(/A'\(([^)]+)\)/g, "A'\\left($1\\right)");
  s = s.replace(/V'\(([^)]+)\)/g, "V'\\left($1\\right)");

  s = s.replace(/\\left\(([^)]*)\\right\)/g, (m) => m);
  s = s.replace(/\\sin\\left\(([^)]*)\)(?!\s*\\right)/g, "\\sin\\left($1\\right)");
  s = s.replace(/\\cos\\left\(([^)]*)\)(?!\s*\\right)/g, "\\cos\\left($1\\right)");
  s = s.replace(/\\tan\\left\(([^)]*)\)(?!\s*\\right)/g, "\\tan\\left($1\\right)");
  s = s.replace(/\\ln\\left\(([^)]*)\)(?!\s*\\right)/g, "\\ln\\left($1\\right)");

  return s;
}

export function calculoExplicacaoToLatex(input: string | undefined): string | undefined {
  if (!input?.trim()) return undefined;
  const s = input.trim();
  const hasMath =
    /lim|f'|f''|h'|∫|\\int|sin|cos|tan|ln|e\^|x\^|\/|→|±|π|∞|dy\/dx|dV\/dt|sec²|P\(|=.*[0-9]/.test(s);
  if (!hasMath) {
    return `\\text{${escapeText(s)}}`;
  }
  return calculoPlainToLatex(s);
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/#/g, "\\#")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/_/g, "\\_");
}
