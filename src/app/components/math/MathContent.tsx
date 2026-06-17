"use client";

import katex from "katex";
import { looksLikeMath, toLatex } from "@/core/presentation/math/to-latex";

interface MathContentProps {
  children: string;
  /** LaTeX formal pré-computado; tem prioridade sobre heurísticas em `children`. */
  latex?: string;
  display?: boolean;
  className?: string;
}

export function MathContent({
  children,
  latex,
  display = false,
  className = "",
}: MathContentProps) {
  const text = children.trim();
  if (!text && !latex) return null;

  const source = latex?.trim() || text;
  const isExplicitLatex = Boolean(latex?.trim());

  if (!isExplicitLatex && !looksLikeMath(text)) {
    return <span className={className}>{text}</span>;
  }

  const renderedLatex = isExplicitLatex ? source : toLatex(text);

  try {
    const html = katex.renderToString(renderedLatex, {
      throwOnError: false,
      displayMode: display,
      output: "html",
    });
    return (
      <span
        className={`math-content ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={className}>{text}</span>;
  }
}
