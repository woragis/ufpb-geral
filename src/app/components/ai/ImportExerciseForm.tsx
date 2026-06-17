"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface ImportPreview {
  topicoNome: string;
  enunciado: string;
  respostaFinal: string;
  confidence?: number;
  reasoning?: string;
  openUrl: string;
}

export function ImportExerciseForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  async function onAnalyze(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const res = await fetch("/api/ai/import-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha na importação");
      setPreview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={onAnalyze} className="flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
          placeholder="Cole o enunciado do exercício (ex.: Calcule lim x→2 de (2x²−8)/(x−2))..."
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="rounded-lg bg-violet-700 px-4 py-2 text-white hover:bg-violet-600 disabled:opacity-60"
        >
          {loading ? "Analisando com IA…" : "Importar com IA"}
        </button>
      </form>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      {preview ? (
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/30">
          <div className="text-sm font-semibold text-violet-900 dark:text-violet-100">
            Preview — {preview.topicoNome}
            {preview.confidence != null
              ? ` (confiança ${Math.round(preview.confidence * 100)}%)`
              : ""}
          </div>
          <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
            {preview.enunciado}
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Resposta esperada: {preview.respostaFinal}
          </p>
          {preview.reasoning ? (
            <p className="mt-2 text-xs text-zinc-500">{preview.reasoning}</p>
          ) : null}
          <button
            type="button"
            onClick={() => router.push(preview.openUrl)}
            className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-50 dark:text-black"
          >
            Abrir exercício importado
          </button>
        </div>
      ) : null}
    </div>
  );
}
