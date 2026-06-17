"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { decodeExerciseSeed } from "@/core/application/seed-codec";
import { Button } from "@/app/components/ui/Button";

export function CopyCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const decoded = decodeExerciseSeed(code);
      const disciplinaId = decoded.topicoId.split(".")[0]!;
      const topicoSlug = decoded.topicoId.split(".").pop()!;

      const params = new URLSearchParams();
      params.set("s", decoded.seed);
      params.set("d", String(decoded.dificuldade));
      if (decoded.generatorVersion !== 1) {
        params.set("v", String(decoded.generatorVersion));
      }

      router.push(`/${disciplinaId}/${topicoSlug}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-fg outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        placeholder="Ex: UFB.eyJ0IjoicHJvY... (cola aqui)"
      />
      <Button type="submit" variant="primary">
        Abrir exercício
      </Button>
      {error ? <div className="text-sm text-destructive">{error}</div> : null}
    </form>
  );
}
