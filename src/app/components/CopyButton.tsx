"use client";

import { Button } from "@/app/components/ui/Button";
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
    <Button type="button" variant="secondary" onClick={onCopy}>
      {status === "idle" ? label : status === "ok" ? "Copiado!" : "Falha ao copiar"}
    </Button>
  );
}
