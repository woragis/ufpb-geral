"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { decodeExerciseSeed } from "@/core/application/seed-codec";

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
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
        placeholder="Ex: UFB.eyJ0IjoicHJvY... (cola aqui)"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black"
      >
        Abrir exercício
      </button>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
    </form>
  );
}

