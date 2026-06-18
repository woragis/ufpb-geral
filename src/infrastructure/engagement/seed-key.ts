import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { topicoSlugFromId, defaultSubtopicoSlug } from "@/infrastructure/catalog/disciplines";
import { buildExerciseHref } from "@/core/application/exercise-url";

export function buildSeedKey(seed: ExerciseSeed): string {
  return [
    seed.topicoId,
    seed.dificuldade,
    seed.seed,
    `v${seed.generatorVersion}`,
    seed.tipo ?? "",
  ].join("|");
}

export function exercisePath(
  disciplinaId: DisciplinaId,
  seed: ExerciseSeed,
  extra?: { step?: number },
): string {
  const slug = topicoSlugFromId(seed.topicoId);
  const subtopicoSlug = defaultSubtopicoSlug(seed.topicoId);
  return buildExerciseHref(disciplinaId, slug, subtopicoSlug, {
    seed,
    step: extra?.step,
  });
}
