"use client";

import Link from "next/link";
import { exercisePath } from "@/infrastructure/engagement/seed-key";
import { readPersonalStore } from "@/lib/client/personal-store";
import { useEffect, useState } from "react";

export function PersonalPanels() {
  const [mounted, setMounted] = useState(false);
  const store = mounted ? readPersonalStore() : { history: [], favorites: [] };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const history = store.history.slice(0, 8);
  const favorites = store.favorites.slice(0, 8);

  if (history.length === 0 && favorites.length === 0) return null;

  return (
    <section className="mb-10 grid gap-4 md:grid-cols-2">
      {history.length > 0 ? (
        <Panel title="Continuar estudando">
          {history.map((item) => (
            <EntryLink key={item.seedKey} item={item} />
          ))}
        </Panel>
      ) : null}
      {favorites.length > 0 ? (
        <Panel title="Favoritos">
          {favorites.map((item) => (
            <EntryLink key={item.seedKey} item={item} />
          ))}
        </Panel>
      ) : null}
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

function EntryLink({
  item,
}: {
  item: ReturnType<typeof readPersonalStore>["history"][number];
}) {
  const href = exercisePath(
    item.disciplinaId,
    {
      topicoId: item.topicoId,
      seed: item.seed,
      dificuldade: item.dificuldade,
      generatorVersion: item.generatorVersion,
    },
    { step: item.lastStep },
  );

  return (
    <li>
      <Link href={href} className="block hover:underline">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {item.topicoNome ?? item.topicoId}
        </div>
        <div className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
          {item.enunciadoPreview ?? item.seed}
        </div>
      </Link>
    </li>
  );
}
