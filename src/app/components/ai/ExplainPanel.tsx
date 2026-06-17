"use client";

import type { Step } from "@/core/domain/problem";
import { useState } from "react";

interface ExplainPanelProps {
  topicoId: string;
  disciplinaId: string;
  enunciado: string;
  enunciadoLatex?: string;
  stepsVisiveis: Step[];
  respostaFinalRevelada: boolean;
  respostaFinal?: string;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export function ExplainPanel(props: ExplainPanelProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<Turn[]>([]);

  async function ask(userQuestion?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...props,
          userQuestion,
          history: history.slice(-6),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no tutor");

      setExplanation(data.explanation);
      setSuggestions(data.suggestedQuestions ?? []);
      const newHistory: Turn[] = [
        ...history,
        ...(userQuestion
          ? [{ role: "user" as const, content: userQuestion }]
          : []),
        { role: "assistant", content: data.explanation },
      ];
      setHistory(newHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (!explanation && !loading) {
      void ask();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm text-violet-900 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100"
      >
        Explicar
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-violet-900 dark:text-violet-100">
          Tutor IA
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-zinc-600 hover:underline"
        >
          Fechar
        </button>
      </div>

      {loading && !explanation ? (
        <p className="mt-3 text-sm text-zinc-600">Pensando…</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {explanation ? (
        <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
          {explanation}
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase text-zinc-500">
            Próximas perguntas
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={loading}
                onClick={() => ask(q)}
                className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-800 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-black dark:text-zinc-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
