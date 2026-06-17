import type { DisciplinaId, TopicoId } from "@/core/domain/ids";
import type { Dificuldade } from "@/core/domain/ids";

const STORAGE_KEY = "ufpb-geral:v1";
const MAX_HISTORY = 50;

export interface PersonalExerciseEntry {
  seedKey: string;
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  seed: string;
  dificuldade: Dificuldade;
  generatorVersion: number;
  visitedAt: string;
  lastStep?: number;
  enunciadoPreview?: string;
  topicoNome?: string;
}

export interface PersonalStore {
  history: PersonalExerciseEntry[];
  favorites: PersonalExerciseEntry[];
}

function emptyStore(): PersonalStore {
  return { history: [], favorites: [] };
}

export function readPersonalStore(): PersonalStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as PersonalStore;
  } catch {
    return emptyStore();
  }
}

export function writePersonalStore(store: PersonalStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function recordPersonalHistory(entry: PersonalExerciseEntry): void {
  const store = readPersonalStore();
  store.history = [
    entry,
    ...store.history.filter((h) => h.seedKey !== entry.seedKey),
  ].slice(0, MAX_HISTORY);
  writePersonalStore(store);
}

export function togglePersonalFavorite(
  entry: PersonalExerciseEntry,
): { favorited: boolean } {
  const store = readPersonalStore();
  const exists = store.favorites.some((f) => f.seedKey === entry.seedKey);
  if (exists) {
    store.favorites = store.favorites.filter((f) => f.seedKey !== entry.seedKey);
    writePersonalStore(store);
    return { favorited: false };
  }
  store.favorites = [entry, ...store.favorites.filter((f) => f.seedKey !== entry.seedKey)];
  writePersonalStore(store);
  return { favorited: true };
}

export function isPersonalFavorite(seedKey: string): boolean {
  return readPersonalStore().favorites.some((f) => f.seedKey === seedKey);
}
