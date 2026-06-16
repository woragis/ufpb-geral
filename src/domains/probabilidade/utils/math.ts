export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function simplificarFracao(numerador: number, denominador: number): string {
  const divisor = gcd(numerador, denominador);
  const n = numerador / divisor;
  const d = denominador / divisor;
  if (d === 1) return String(n);
  return `${n}/${d}`;
}
