"use client";

import { Button } from "@/app/components/ui/Button";
import {
  buildWhatsAppShareUrl,
  toAbsoluteExerciseUrl,
} from "@/core/application/exercise-url";
import { useEffect, useState } from "react";

interface ShareExerciseButtonProps {
  relativeHref: string;
  title: string;
  text: string;
  shareCode?: string | null;
}

export function ShareExerciseButton({
  relativeHref,
  title,
  text,
  shareCode,
}: ShareExerciseButtonProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  function absoluteUrl(): string {
    return toAbsoluteExerciseUrl(relativeHref, window.location.origin);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl());
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 1200);
      setOpen(false);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  async function copyCode() {
    if (!shareCode) return;
    try {
      await navigator.clipboard.writeText(shareCode);
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 1200);
      setOpen(false);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  function shareWhatsApp() {
    const url = buildWhatsAppShareUrl(text, absoluteUrl());
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  async function nativeShare() {
    const url = absoluteUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setOpen(false);
        return;
      } catch {
        // usuário cancelou ou API indisponível
      }
    }
    await copyLink();
  }

  const statusLabel =
    status === "ok" ? "Copiado!" : status === "error" ? "Falha" : null;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {statusLabel ?? "Compartilhar"}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 min-w-[12rem] rounded-lg border border-border bg-surface-elevated py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-fg hover:bg-surface"
              onClick={() => void copyLink()}
            >
              Copiar link completo
            </button>
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-fg hover:bg-surface"
              onClick={shareWhatsApp}
            >
              Enviar no WhatsApp
            </button>
            {canNativeShare ? (
              <button
                type="button"
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm text-fg hover:bg-surface"
                onClick={() => void nativeShare()}
              >
                Compartilhar…
              </button>
            ) : null}
            {shareCode ? (
              <button
                type="button"
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm text-fg hover:bg-surface"
                onClick={() => void copyCode()}
              >
                Copiar código
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
