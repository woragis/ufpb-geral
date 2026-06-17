"use client";

import type { DisciplinaId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";
import { toEngagementPayload } from "@/core/domain/engagement";
import { buildSeedKey } from "@/infrastructure/engagement/seed-key";
import { Button } from "@/app/components/ui/Button";
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
    <Button
      type="button"
      variant={liked ? "primary" : "secondary"}
      onClick={handleLike}
      disabled={liked || pending}
      aria-pressed={liked}
    >
      {liked ? "Curtido" : "Curtir"}
      {likes > 0 ? ` (${likes})` : ""}
    </Button>
  );
}
