"use client";

import { buildExerciseHref } from "@/core/application/exercise-url";
import type { ExerciseSeed } from "@/core/domain/seed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ExerciseUrlSyncProps {
  disciplinaId: string;
  topicoSlug: string;
  exerciseSeed: ExerciseSeed;
  currentStep: number;
  examMode: boolean;
  examMinutes: number;
  importPayloadParam?: string;
}

export function ExerciseUrlSync({
  disciplinaId,
  topicoSlug,
  exerciseSeed,
  currentStep,
  examMode,
  examMinutes,
  importPayloadParam,
}: ExerciseUrlSyncProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (importPayloadParam) return;

    const urlSeed = searchParams.get("s");
    const urlD = searchParams.get("d") ?? "2";
    const urlV = searchParams.get("v");
    const urlStep = searchParams.get("step") ?? "0";
    const urlMode = searchParams.get("mode");
    const urlMinutes = searchParams.get("minutes");

    const versionOk =
      exerciseSeed.generatorVersion === 1
        ? !urlV || urlV === "1"
        : urlV === String(exerciseSeed.generatorVersion);

    const needsSync =
      urlSeed !== exerciseSeed.seed ||
      urlD !== String(exerciseSeed.dificuldade) ||
      !versionOk ||
      urlStep !== String(currentStep) ||
      (examMode ? urlMode !== "prova" : urlMode === "prova") ||
      (examMode && urlMinutes !== String(examMinutes));

    if (!needsSync) return;

    const href = buildExerciseHref(disciplinaId, topicoSlug, {
      seed: exerciseSeed,
      step: currentStep,
      examMode,
      examMinutes,
    });

    router.replace(href, { scroll: false });
  }, [
    currentStep,
    disciplinaId,
    examMode,
    examMinutes,
    exerciseSeed,
    importPayloadParam,
    pathname,
    router,
    searchParams,
    topicoSlug,
  ]);

  return null;
}
