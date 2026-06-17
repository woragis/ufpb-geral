export function fmtNum(n: number, decimals = 3): string {
  if (Number.isInteger(n)) return String(n);
  const r = Math.round(n * 10 ** decimals) / 10 ** decimals;
  return String(r);
}

export function fmtSigned(n: number): string {
  if (n >= 0) return `+ ${n}`;
  return `− ${Math.abs(n)}`;
}

export function fmtPolyTerm(c: number, exp: number): string {
  if (exp === 0) return String(c);
  const coef = c === 1 ? "" : c === -1 ? "−" : String(c);
  if (exp === 1) return `${coef}x`;
  return `${coef}x^${exp}`;
}

export function fmtPoly(coefs: number[], exps: number[]): string {
  return coefs
    .map((c, i) => fmtPolyTerm(c, exps[i]!))
    .join(" + ")
    .replace(/\+ -/g, "− ");
}

export function roundNice(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function trigArg(k: number, b: number): string {
  if (k === 1 && b === 0) return "x";
  if (k === 1) return `x ${fmtSigned(b)}`;
  if (b === 0) return `${k}x`;
  return `${k}x ${fmtSigned(b)}`;
}

export function fmtX(x: number): string {
  if (x === Math.PI) return "π";
  if (x === Math.PI / 2) return "π/2";
  if (x === Math.PI / 4) return "π/4";
  if (x === Math.PI / 3) return "π/3";
  if (Math.abs(x - Math.E) < 0.001) return "e";
  return fmtNum(x);
}

export function trigFn(name: "sin" | "cos" | "tan", k: number, b: number): string {
  const arg = trigArg(k, b);
  const label = name === "sin" ? "sin" : name === "cos" ? "cos" : "tg";
  return `${label}(${arg})`;
}
