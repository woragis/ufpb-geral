import type { ExerciseSeed } from "@/core/domain/seed";

export interface ExerciseUrlOptions {
  seed: ExerciseSeed;
  step?: number;
  examMode?: boolean;
  examMinutes?: number;
  importPayload?: string;
}

export function buildExerciseSearchParams(
  opts: ExerciseUrlOptions,
): URLSearchParams {
  const params = new URLSearchParams();

  if (opts.importPayload) {
    params.set("p", opts.importPayload);
  } else {
    params.set("s", opts.seed.seed);
    params.set("d", String(opts.seed.dificuldade));
    if (opts.seed.generatorVersion !== 1) {
      params.set("v", String(opts.seed.generatorVersion));
    }
  }

  if (opts.examMode) {
    params.set("mode", "prova");
    params.set("minutes", String(opts.examMinutes ?? 30));
  }

  if (opts.step !== undefined && opts.step > 0) {
    params.set("step", String(opts.step));
  }

  return params;
}

export function buildExerciseHref(
  disciplinaId: string,
  topicoSlug: string,
  opts: ExerciseUrlOptions,
): string {
  const qs = buildExerciseSearchParams(opts).toString();
  return `/${disciplinaId}/${topicoSlug}${qs ? `?${qs}` : ""}`;
}

export function toAbsoluteExerciseUrl(
  relativeHref: string,
  origin: string,
): string {
  return new URL(relativeHref, origin.endsWith("/") ? origin : `${origin}/`)
    .href;
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}
