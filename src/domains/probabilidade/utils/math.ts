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

export function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function roundProb(x: number, casas = 4): number {
  return Math.round(x * 10 ** casas) / 10 ** casas;
}

export function countDadoSomaIgual(soma: number): number {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      if (i + j === soma) count++;
    }
  }
  return count;
}

export function countDadoTransformacao(
  transformacao: "soma" | "abs-soma" | "produto",
  predicate: (valor: number) => boolean,
): number {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      const valor =
        transformacao === "soma"
          ? i + j
          : transformacao === "abs-soma"
            ? Math.abs(i + j)
            : i * j;
      if (predicate(valor)) count++;
    }
  }
  return count;
}

export function countDadoSomaModulo(modulo: number, resto: number): number {
  return countDadoTransformacao("soma", (v) => v % modulo === resto);
}

export function binomialProb(n: number, k: number, p: number): number {
  return comb(n, k) * p ** k * (1 - p) ** (n - k);
}

export function geometricProb(k: number, p: number): number {
  return (1 - p) ** (k - 1) * p;
}
