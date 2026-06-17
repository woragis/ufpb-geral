export function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function media(vals: number[]): number {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function mediana(vals: number[]): number {
  const sorted = [...vals].sort((a, b) => a - b);
  const n = sorted.length;
  if (n % 2 === 1) return sorted[(n - 1) / 2]!;
  return (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
}

export function moda(vals: number[]): number {
  const freq = new Map<number, number>();
  for (const v of vals) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  let best = vals[0]!;
  let maxF = 0;
  for (const [v, f] of freq) {
    if (f > maxF) {
      maxF = f;
      best = v;
    }
  }
  return best;
}

export function mediaPonderada(valores: number[], pesos: number[]): number {
  const somaPesos = pesos.reduce((a, b) => a + b, 0);
  const soma = valores.reduce((acc, v, i) => acc + v * pesos[i]!, 0);
  return soma / somaPesos;
}

export function mediaGeometrica(vals: number[]): number {
  const prod = vals.reduce((acc, v) => acc * v, 1);
  return round2(Math.pow(prod, 1 / vals.length));
}

export function varianciaAmostral(vals: number[]): number {
  const n = vals.length;
  const m = media(vals);
  const sq = vals.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return round2(sq / (n - 1));
}

export function varianciaPopulacional(vals: number[]): number {
  const n = vals.length;
  const m = media(vals);
  const sq = vals.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return round2(sq / n);
}

export function desvioAmostral(vals: number[]): number {
  return round2(Math.sqrt(varianciaAmostral(vals)));
}

export function desvioPopulacional(vals: number[]): number {
  return round2(Math.sqrt(varianciaPopulacional(vals)));
}

export function desvioMedioAbsoluto(vals: number[]): number {
  const m = media(vals);
  const mad = vals.reduce((acc, v) => acc + Math.abs(v - m), 0) / vals.length;
  return round2(mad);
}

export function quartis(vals: number[]): { q1: number; q2: number; q3: number } {
  const sorted = [...vals].sort((a, b) => a - b);
  const n = sorted.length;
  const q2 = mediana(sorted);
  const lower = sorted.slice(0, Math.floor(n / 2));
  const upper = n % 2 === 1 ? sorted.slice(Math.floor(n / 2) + 1) : sorted.slice(n / 2);
  return {
    q1: mediana(lower.length ? lower : sorted),
    q2,
    q3: mediana(upper.length ? upper : sorted),
  };
}

export function contarOutliers(vals: number[]): number {
  const { q1, q3 } = quartis(vals);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  return vals.filter((v) => v < lo || v > hi).length;
}

function rank(vals: number[]): number[] {
  const indexed = vals.map((v, i) => ({ v, i }));
  indexed.sort((a, b) => a.v - b.v);
  const ranks = new Array<number>(vals.length);
  for (let r = 0; r < indexed.length; r++) {
    ranks[indexed[r]!.i] = r + 1;
  }
  return ranks;
}

export function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = media(xs);
  const my = media(ys);
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i]! - mx;
    const dy = ys[i]! - my;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  if (denX === 0 || denY === 0) return 0;
  return round2(num / Math.sqrt(denX * denY));
}

export function spearman(xs: number[], ys: number[]): number {
  return pearson(rank(xs), rank(ys));
}

export function covarianciaAmostral(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = media(xs);
  const my = media(ys);
  const sum = xs.reduce((acc, x, i) => acc + (x - mx) * (ys[i]! - my), 0);
  return round2(sum / (n - 1));
}

export type InterpretacaoCorrelacao = {
  forca: "forte" | "moderada" | "fraca";
  sinal: "positiva" | "negativa";
};

export function interpretarCorrelacao(r: number): InterpretacaoCorrelacao {
  const abs = Math.abs(r);
  const forca = abs >= 0.7 ? "forte" : abs >= 0.4 ? "moderada" : "fraca";
  const sinal = r >= 0 ? "positiva" : "negativa";
  return { forca, sinal };
}

export function labelInterpretacao(i: InterpretacaoCorrelacao): string {
  const forcaLabel = { forte: "Forte", moderada: "Moderada", fraca: "Fraca" };
  const sinalLabel = { positiva: "positiva", negativa: "negativa" };
  return `${forcaLabel[i.forca]} ${sinalLabel[i.sinal]}`;
}

export function assimetriaPorMediaMediana(
  vals: number[],
): "positiva" | "negativa" | "simetrica" {
  const m = media(vals);
  const med = mediana(vals);
  const diff = m - med;
  if (Math.abs(diff) < 0.5) return "simetrica";
  return diff > 0 ? "positiva" : "negativa";
}
