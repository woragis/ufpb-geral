/**
 * KaTeX `renderToString` espera LaTeX puro — não Markdown com `$...$`.
 * Converte strings mistas (prosa + matemática) em entrada válida para o KaTeX.
 */
export function prepareKaTeX(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (!trimmed.includes("$")) return trimmed;

  const onlyPair = trimmed.match(/^\$([^$]+)\$$/);
  if (onlyPair) return onlyPair[1]!;

  const out: string[] = [];
  const regex = /\$([^$]+)\$/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(trimmed)) !== null) {
    appendSegment(out, trimmed.slice(last, match.index));
    out.push(match[1]!);
    last = regex.lastIndex;
  }
  appendSegment(out, trimmed.slice(last));

  return out.join("");
}

function appendSegment(parts: string[], raw: string): void {
  const segment = raw.trim();
  if (!segment) return;
  if (containsLatexCommand(segment)) {
    parts.push(segment);
    return;
  }
  parts.push(wrapText(segment));
}

function containsLatexCommand(s: string): boolean {
  return /\\[a-zA-Z@]+/.test(s) || /\\[^a-zA-Z\s]/.test(s);
}

function wrapText(s: string): string {
  const escaped = s
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/#/g, "\\#")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
  return `\\text{${escaped}}`;
}
