"use client";

import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { buildSeedKey } from "@/infrastructure/engagement/seed-key";
import {
  isPersonalFavorite,
  recordPersonalHistory,
  togglePersonalFavorite,
  type PersonalExerciseEntry,
} from "@/lib/client/personal-store";
import { useEffect, useState } from "react";

interface PersonalExerciseTrackerProps {
  disciplinaId: DisciplinaId;
  exerciseSeed: ExerciseSeed;
  topicoNome: string;
  enunciadoPreview: string;
  currentStep: number;
}

export function PersonalExerciseTracker({
  disciplinaId,
  exerciseSeed,
  topicoNome,
  enunciadoPreview,
  currentStep,
}: PersonalExerciseTrackerProps) {
  const seedKey = buildSeedKey(exerciseSeed);
  const [favorited, setFavorited] = useState(false);

  const entry: PersonalExerciseEntry = {
    seedKey,
    topicoId: exerciseSeed.topicoId,
    disciplinaId,
    seed: exerciseSeed.seed,
    dificuldade: exerciseSeed.dificuldade,
    generatorVersion: exerciseSeed.generatorVersion,
    visitedAt: new Date().toISOString(),
    lastStep: currentStep,
    enunciadoPreview: enunciadoPreview.slice(0, 120),
    topicoNome,
  };

  useEffect(() => {
    recordPersonalHistory(entry);
    setFavorited(isPersonalFavorite(seedKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey, currentStep]);

  function handleFavorite() {
    const result = togglePersonalFavorite(entry);
    setFavorited(result.favorited);
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
      aria-pressed={favorited}
    >
      {favorited ? "★ Favorito" : "☆ Favoritar"}
    </button>
  );
}
