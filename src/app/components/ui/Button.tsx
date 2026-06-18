import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants = {
  primary:
    "bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "border border-border bg-surface text-fg hover:bg-surface-elevated active:bg-border",
  ghost:
    "text-fg-muted hover:bg-surface-elevated hover:text-fg active:bg-border",
  ai: "bg-ai text-ai-fg hover:bg-ai-hover active:bg-ai-active",
  aiSoft:
    "border border-ai/30 bg-ai-muted text-ai-muted-fg hover:bg-ai/10 active:bg-ai/20",
  warning:
    "bg-warning text-warning-fg hover:bg-warning-hover active:bg-warning-active",
  warningSoft:
    "border border-warning/40 bg-warning-muted text-warning-muted-fg hover:bg-warning/10 active:bg-warning/20",
} as const;

type Variant = keyof typeof variants;

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  scroll = true,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      scroll={scroll}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
