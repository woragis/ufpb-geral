"use client";

import Link from "next/link";
import { exercisePath } from "@/infrastructure/engagement/seed-key";
import { readPersonalStore } from "@/lib/client/personal-store";
import { Card } from "@/app/components/ui/Card";
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
        <Card>
          <h2 className="font-semibold text-fg">Continuar estudando</h2>
          <ul className="mt-3 space-y-2">
            {history.map((item) => (
              <EntryLink key={item.seedKey} item={item} />
            ))}
          </ul>
        </Card>
      ) : null}
      {favorites.length > 0 ? (
        <Card>
          <h2 className="font-semibold text-fg">Favoritos</h2>
          <ul className="mt-3 space-y-2">
            {favorites.map((item) => (
              <EntryLink key={item.seedKey} item={item} />
            ))}
          </ul>
        </Card>
      ) : null}
    </section>
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
      <Link href={href} className="block hover:text-primary transition-colors">
        <div className="text-sm font-medium text-fg">
          {item.topicoNome ?? item.topicoId}
        </div>
        <div className="text-xs text-fg-muted line-clamp-1">
          {item.enunciadoPreview ?? item.seed}
        </div>
      </Link>
    </li>
  );
}
