"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copiar",
}: {
  value: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
    >
      {status === "idle" ? label : status === "ok" ? "Copiado!" : "Falha ao copiar"}
    </button>
  );
}

