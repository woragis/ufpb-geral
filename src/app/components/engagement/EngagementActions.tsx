"use client";

import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { toEngagementPayload } from "@/core/domain/engagement";
import { buildSeedKey } from "@/infrastructure/engagement/seed-key";
import { useEffect, useState } from "react";

interface EngagementActionsProps {
  disciplinaId: DisciplinaId;
  exerciseSeed: ExerciseSeed;
}

export function EngagementActions({
  disciplinaId,
  exerciseSeed,
}: EngagementActionsProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  const payload = toEngagementPayload(exerciseSeed, disciplinaId);
  const seedKey = buildSeedKey(exerciseSeed);

  useEffect(() => {
    const sessionKey = `ufpb-visit:${seedKey}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, "1");

    fetch("/api/engagement/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
    // payload derivado de exerciseSeed estável por seedKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedKey]);

  async function handleLike() {
    if (liked || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/engagement/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.entry.likes);
        setLiked(true);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || pending}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
        aria-pressed={liked}
      >
        {liked ? "Curtido" : "Curtir"}
        {likes > 0 ? ` (${likes})` : ""}
      </button>
    </div>
  );
}
