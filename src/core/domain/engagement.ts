import type { DisciplinaId, TopicoId } from "./ids";
import type { ExerciseSeed } from "./seed";

export interface SeedEngagement {
  seedKey: string;
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  seed: string;
  dificuldade: 1 | 2 | 3;
  generatorVersion: number;
  visits: number;
  likes: number;
  updatedAt: string;
}

export interface EngagementStore {
  seeds: Record<string, SeedEngagement>;
}

export interface EngagementPayload {
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  seed: string;
  dificuldade: 1 | 2 | 3;
  generatorVersion: number;
}

export interface RankedSeed {
  seedKey: string;
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  seed: string;
  dificuldade: 1 | 2 | 3;
  generatorVersion: number;
  visits: number;
  likes: number;
  score: number;
  curated?: boolean;
}

export function engagementScore(visits: number, likes: number): number {
  return visits + likes * 5;
}

export function toEngagementPayload(seed: ExerciseSeed, disciplinaId: DisciplinaId): EngagementPayload {
  return {
    topicoId: seed.topicoId,
    disciplinaId,
    seed: seed.seed,
    dificuldade: seed.dificuldade,
    generatorVersion: seed.generatorVersion,
  };
}
