"use client";

import type { Step } from "@/core/domain/problem";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { RichMarkdown } from "@/app/components/content/RichMarkdown";

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
      <Button type="button" variant="aiSoft" onClick={handleOpen}>
        Explicar
      </Button>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-ai/25 bg-ai-muted/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-ai-muted-fg">Tutor IA</h3>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Fechar
        </Button>
      </div>

      {loading && !explanation ? (
        <p className="mt-3 text-sm text-fg-muted">Pensando…</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {explanation ? (
        <div className="mt-3 text-sm">
          <RichMarkdown>{explanation}</RichMarkdown>
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase text-fg-subtle">
            Próximas perguntas
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((q) => (
              <Button
                key={q}
                type="button"
                variant="secondary"
                disabled={loading}
                className="!rounded-full !px-3 !py-1 !text-xs"
                onClick={() => ask(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
