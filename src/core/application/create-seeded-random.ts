import type { ExerciseSeed } from "@/core/domain/seed";
import type { SeededRandom } from "@/core/domain/seeded-random";
import { hashString } from "./hash";
import { mulberry32 } from "./prng/mulberry32";

function seedKey(exercise: ExerciseSeed): string {
  return `${exercise.topicoId}|${exercise.dificuldade}|${exercise.seed}|v${exercise.generatorVersion}`;
}

export function createSeededRandom(exercise: ExerciseSeed): SeededRandom {
  const next = mulberry32(hashString(seedKey(exercise)));

  return {
    next,
    nextInt(min: number, max: number) {
      const lo = Math.ceil(min);
      const hi = Math.floor(max);
      return Math.floor(next() * (hi - lo + 1)) + lo;
    },
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error("Cannot pick from an empty array");
      }
      return items[Math.floor(next() * items.length)]!;
    },
    shuffle<T>(items: readonly T[]): T[] {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j]!, copy[i]!];
      }
      return copy;
    },
  };
}
