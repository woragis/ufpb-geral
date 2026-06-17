import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { topicoSlugFromId } from "@/infrastructure/catalog/disciplines";
import { buildExerciseHref } from "@/core/application/exercise-url";

export function buildSeedKey(seed: ExerciseSeed): string {
  return `${seed.topicoId}|${seed.dificuldade}|${seed.seed}|v${seed.generatorVersion}`;
}

export function exercisePath(
  disciplinaId: DisciplinaId,
  seed: ExerciseSeed,
  extra?: { step?: number },
): string {
  const slug = topicoSlugFromId(seed.topicoId);
  return buildExerciseHref(disciplinaId, slug, {
    seed,
    step: extra?.step,
  });
}
