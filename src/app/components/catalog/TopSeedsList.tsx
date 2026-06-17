import Link from "next/link";
import type { DisciplinaId, TopicoId } from "@/core/domain/ids";
import type { RankedSeed } from "@/core/domain/engagement";
import { exercisePath } from "@/infrastructure/engagement/seed-key";
import { getTopSeedsForTopico } from "@/infrastructure/engagement/store";
import { getCuratedSeedsForTopico } from "@/infrastructure/engagement/curated-seeds";

interface TopSeedsListProps {
  topicoId: TopicoId;
  topicoNome: string;
  disciplinaId: DisciplinaId;
  limit?: number;
}

export async function TopSeedsList({
  topicoId,
  topicoNome,
  disciplinaId,
  limit = 3,
}: TopSeedsListProps) {
  const seeds = await getTopSeedsForTopico(topicoId, limit);
  if (seeds.length === 0) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-200/80 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
        Destaques — {topicoNome}
      </div>
      <ul className="mt-2 space-y-1">
        {seeds.map((item) => (
          <SeedRow key={item.seedKey} item={item} disciplinaId={disciplinaId} />
        ))}
      </ul>
    </div>
  );
}

function SeedRow({
  item,
  disciplinaId,
}: {
  item: RankedSeed;
  disciplinaId: DisciplinaId;
}) {
  const href = exercisePath(disciplinaId, {
    topicoId: item.topicoId,
    seed: item.seed,
    dificuldade: item.dificuldade,
    generatorVersion: item.generatorVersion,
  });

  const curated = getCuratedSeedsForTopico(item.topicoId).find(
    (c) => c.seed === item.seed,
  );

  return (
    <li className="flex items-center justify-between gap-2 text-sm">
      <Link href={href} className="text-zinc-900 hover:underline dark:text-zinc-50">
        {curated?.label ?? `seed ${item.seed}`}
        {item.curated ? " ★" : ""}
      </Link>
      <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
        {item.visits} visitas · {item.likes} curtidas
      </span>
    </li>
  );
}
