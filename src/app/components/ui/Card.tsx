import type { DisciplinaId } from "@/core/domain/ids";
import type { ComponentProps } from "react";

const accentBorder: Record<DisciplinaId, string> = {
  probabilidade: "border-l-accent-prob",
  calculo: "border-l-accent-calc",
  "calculo-vetorial": "border-l-accent-vet",
  "analise-exploratoria": "border-l-accent-ae",
};

type CardProps = ComponentProps<"div"> & {
  disciplinaId?: DisciplinaId;
  accent?: boolean;
};

export function Card({
  disciplinaId,
  accent = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const accentClass =
    accent && disciplinaId ? `border-l-4 ${accentBorder[disciplinaId]}` : "";

  return (
    <div
      className={`rounded-xl border border-border bg-surface p-4 shadow-sm ${accentClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardAi({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-ai/25 bg-ai-muted/50 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHighlight({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-warning/30 bg-warning-muted/60 p-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
