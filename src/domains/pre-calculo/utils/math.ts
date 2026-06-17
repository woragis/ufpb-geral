export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function formatFraction(num: number, den: number): string {
  if (den === 0) return "∅";
  if (num % den === 0) return String(num / den);
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

export function absModular(a: number, b: number, x: number): number {
  return Math.abs(a * x + b);
}
