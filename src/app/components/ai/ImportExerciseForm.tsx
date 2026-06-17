"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/app/components/ui/Button";

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
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-fg outline-none focus:border-ai focus:ring-2 focus:ring-ai/30"
          placeholder="Cole o enunciado do exercício (ex.: Calcule lim x→2 de (2x²−8)/(x−2))..."
        />
        <Button
          type="submit"
          variant="ai"
          disabled={loading || !text.trim()}
        >
          {loading ? "Analisando com IA…" : "Importar com IA"}
        </Button>
      </form>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      {preview ? (
        <div className="rounded-lg border border-ai/25 bg-ai-muted/80 p-3">
          <div className="text-sm font-semibold text-ai-muted-fg">
            Preview — {preview.topicoNome}
            {preview.confidence != null
              ? ` (confiança ${Math.round(preview.confidence * 100)}%)`
              : ""}
          </div>
          <p className="mt-2 text-sm text-fg">{preview.enunciado}</p>
          <p className="mt-1 text-xs text-fg-muted">
            Resposta esperada: {preview.respostaFinal}
          </p>
          {preview.reasoning ? (
            <p className="mt-2 text-xs text-fg-subtle">{preview.reasoning}</p>
          ) : null}
          <Button
            type="button"
            variant="primary"
            className="mt-3"
            onClick={() => router.push(preview.openUrl)}
          >
            Abrir exercício importado
          </Button>
        </div>
      ) : null}
    </div>
  );
}
