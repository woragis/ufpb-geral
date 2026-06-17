import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { topicoSlugFromId } from "@/infrastructure/catalog/disciplines";

export function buildSeedKey(seed: ExerciseSeed): string {
  return `${seed.topicoId}|${seed.dificuldade}|${seed.seed}|v${seed.generatorVersion}`;
}

export function exercisePath(
  disciplinaId: DisciplinaId,
  seed: ExerciseSeed,
  extra?: { step?: number },
): string {
  const slug = topicoSlugFromId(seed.topicoId);
  const params = new URLSearchParams();
  params.set("s", seed.seed);
  params.set("d", String(seed.dificuldade));
  if (seed.generatorVersion !== 1) {
    params.set("v", String(seed.generatorVersion));
  }
  if (extra?.step !== undefined) {
    params.set("step", String(extra.step));
  }
  return `/${disciplinaId}/${slug}?${params.toString()}`;
}
