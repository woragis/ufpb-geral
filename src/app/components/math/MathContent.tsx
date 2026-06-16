"use client";

import katex from "katex";
import { looksLikeMath, toLatex } from "@/core/presentation/math/to-latex";

interface MathContentProps {
  children: string;
  display?: boolean;
  className?: string;
}

export function MathContent({
  children,
  display = false,
  className = "",
}: MathContentProps) {
  const text = children.trim();
  if (!text) return null;

  if (!looksLikeMath(text)) {
    return <span className={className}>{text}</span>;
  }

  const latex = toLatex(text);

  try {
    const html = katex.renderToString(latex, {
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
