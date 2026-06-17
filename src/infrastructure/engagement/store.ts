import { promises as fs } from "fs";
import path from "path";
import type {
  EngagementPayload,
  EngagementStore,
  RankedSeed,
  SeedEngagement,
} from "@/core/domain/engagement";
import { engagementScore } from "@/core/domain/engagement";
import type { TopicoId } from "@/core/domain/ids";
import { buildSeedKey } from "./seed-key";
import { getCuratedSeedsForTopico } from "./curated-seeds";

const DATA_PATH = path.join(process.cwd(), "data", "engagement.json");

async function readStore(): Promise<EngagementStore> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as EngagementStore;
  } catch {
    return { seeds: {} };
  }
}

async function writeStore(store: EngagementStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function upsertEntry(
  store: EngagementStore,
  payload: EngagementPayload,
): SeedEngagement {
  const seedKey = buildSeedKey(payload);
  const existing = store.seeds[seedKey];
  const now = new Date().toISOString();

  const entry: SeedEngagement = existing ?? {
    seedKey,
    topicoId: payload.topicoId,
    disciplinaId: payload.disciplinaId,
    seed: payload.seed,
    dificuldade: payload.dificuldade,
    generatorVersion: payload.generatorVersion,
    visits: 0,
    likes: 0,
    updatedAt: now,
  };

  store.seeds[seedKey] = entry;
  return entry;
}

export async function recordVisit(
  payload: EngagementPayload,
): Promise<SeedEngagement> {
  const store = await readStore();
  const entry = upsertEntry(store, payload);
  entry.visits += 1;
  entry.updatedAt = new Date().toISOString();
  await writeStore(store);
  return entry;
}

export async function recordLike(
  payload: EngagementPayload,
): Promise<SeedEngagement> {
  const store = await readStore();
  const entry = upsertEntry(store, payload);
  entry.likes += 1;
  entry.updatedAt = new Date().toISOString();
  await writeStore(store);
  return entry;
}

export async function getTopSeedsForTopico(
  topicoId: TopicoId,
  limit = 5,
): Promise<RankedSeed[]> {
  const store = await readStore();
  const curated = getCuratedSeedsForTopico(topicoId);
  const byKey = new Map<string, RankedSeed>();

  for (const c of curated) {
    const seedKey = buildSeedKey(c);
    const stored = store.seeds[seedKey];
    const visits = stored?.visits ?? 0;
    const likes = stored?.likes ?? 0;
    byKey.set(seedKey, {
      seedKey,
      topicoId: c.topicoId,
      disciplinaId: c.disciplinaId,
      seed: c.seed,
      dificuldade: c.dificuldade,
      generatorVersion: c.generatorVersion,
      visits,
      likes,
      score: engagementScore(visits, likes) + (c.boost ?? 10),
      curated: true,
    });
  }

  for (const entry of Object.values(store.seeds)) {
    if (entry.topicoId !== topicoId) continue;
    const score = engagementScore(entry.visits, entry.likes);
    const existing = byKey.get(entry.seedKey);
    if (!existing || score > existing.score) {
      byKey.set(entry.seedKey, {
        seedKey: entry.seedKey,
        topicoId: entry.topicoId,
        disciplinaId: entry.disciplinaId,
        seed: entry.seed,
        dificuldade: entry.dificuldade,
        generatorVersion: entry.generatorVersion,
        visits: entry.visits,
        likes: entry.likes,
        score,
        curated: existing?.curated,
      });
    }
  }

  return [...byKey.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function getTopSeedsForDisciplina(
  disciplinaId: string,
  limitPerTopico = 3,
): Promise<Map<TopicoId, RankedSeed[]>> {
  const store = await readStore();
  const topicIds = new Set<TopicoId>();
  for (const entry of Object.values(store.seeds)) {
    if (entry.disciplinaId === disciplinaId) {
      topicIds.add(entry.topicoId);
    }
  }

  const { disciplinas } = await import("@/infrastructure/catalog/disciplines");
  const disciplina = disciplinas.find((d) => d.id === disciplinaId);
  if (disciplina) {
    for (const modulo of disciplina.modulos) {
      for (const topico of modulo.topicos) {
        if (topico.status === "ativo") {
          topicIds.add(topico.id);
        }
      }
    }
  }

  const result = new Map<TopicoId, RankedSeed[]>();
  for (const topicoId of topicIds) {
    result.set(topicoId, await getTopSeedsForTopico(topicoId, limitPerTopico));
  }
  return result;
}
