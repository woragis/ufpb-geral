"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface RichMarkdownProps {
  children: string;
  className?: string;
}

export function RichMarkdown({ children, className = "" }: RichMarkdownProps) {
  if (!children.trim()) return null;

  return (
    <div
      className={`rich-markdown prose prose-sm max-w-none text-fg prose-headings:text-fg prose-p:text-fg prose-strong:text-fg prose-li:text-fg prose-code:text-fg prose-pre:bg-surface-elevated prose-pre:text-fg ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
