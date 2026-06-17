"use client";

import { useTheme } from "./ThemeProvider";
import type { ThemeMode } from "@/lib/theme";

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="inline-flex rounded-lg border border-border bg-surface p-0.5"
      role="group"
      aria-label="Tema da interface"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setMode(opt.value)}
          aria-pressed={mode === opt.value}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            mode === opt.value
              ? "bg-primary text-primary-fg shadow-sm"
              : "text-fg-muted hover:bg-surface-elevated hover:text-fg active:bg-border"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
