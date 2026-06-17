import type { GeneratorContext } from "@/core/domain/generator";

export function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function modulo(v: number[]): number {
  return Math.sqrt(v.reduce((acc, c) => acc + c * c, 0));
}

export function vec3(
  a: number,
  b: number,
  c: number,
): [number, number, number] {
  return [a, b, c];
}

export function cross(
  u: [number, number, number],
  v: [number, number, number],
): [number, number, number] {
  return [
    u[1] * v[2] - u[2] * v[1],
    -(u[0] * v[2] - u[2] * v[0]),
    u[0] * v[1] - u[1] * v[0],
  ];
}

export function dot(
  u: [number, number, number],
  v: [number, number, number],
): number {
  return u.reduce((acc, ui, i) => acc + ui * v[i]!, 0);
}

export function randVec3(
  rng: GeneratorContext["rng"],
  min = -4,
  max = 4,
): [number, number, number] {
  return [
    rng.nextInt(min, max),
    rng.nextInt(min, max),
    rng.nextInt(min, max),
  ];
}

export function randVec2or3(
  ctx: GeneratorContext,
): { dimensao: 2 | 3; componentes: number[] } {
  const dimensao: 2 | 3 =
    ctx.dificuldade === 1 ? 2 : ctx.rng.pick([2, 3] as const);
  const componentes = Array.from({ length: dimensao }, () =>
    ctx.rng.nextInt(-5, 5),
  );
  return { dimensao, componentes };
}

export function nonZeroVec3(
  rng: GeneratorContext["rng"],
): [number, number, number] {
  let v: [number, number, number];
  do {
    v = randVec3(rng);
  } while (v[0] === 0 && v[1] === 0 && v[2] === 0);
  return v;
}
