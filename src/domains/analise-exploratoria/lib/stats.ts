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

export function varianciaAmostral(vals: number[]): number {
  const n = vals.length;
  const m = media(vals);
  const sq = vals.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return round2(sq / (n - 1));
}

export function desvioAmostral(vals: number[]): number {
  return round2(Math.sqrt(varianciaAmostral(vals)));
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
