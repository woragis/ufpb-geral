/**
 * Heurísticas para converter strings informais dos solvers em LaTeX renderizável.
 */
export function toLatex(input: string): string {
  let s = input.trim();

  const replacements: [RegExp | string, string][] = [
    [/Ω/g, "\\Omega"],
    [/∩/g, "\\cap"],
    [/∪/g, "\\cup"],
    [/×/g, "\\times"],
    [/·/g, "\\cdot"],
    [/≤/g, "\\leq"],
    [/≥/g, "\\geq"],
    [/≠/g, "\\neq"],
    [/→/g, "\\to"],
    [/⁻/g, "^-"],
    [/⁺/g, "^+"],
    [/²/g, "^2"],
    [/³/g, "^3"],
    [/ⁿ/g, "^n"],
    [/₀/g, "_0"],
    [/₁/g, "_1"],
    [/₂/g, "_2"],
    [/ᵢ/g, "_i"],
    [/Σ/g, "\\sum"],
    [/∫/g, "\\int"],
    [/√/g, "\\sqrt"],
    [/π/g, "\\pi"],
    [/−/g, "-"],
    [/≈/g, "\\approx"],
    [/±/g, "\\pm"],
    [/∞/g, "\\infty"],
    [/∇/g, "\\nabla"],
    [/∂/g, "\\partial"],
    [/̄/g, "\\bar"],
    [/ᵃ/g, "^a"],
    [/ᶜ/g, "^c"],
  ];

  for (const [from, to] of replacements) {
    s = s.replace(from as RegExp, to);
  }

  // lim(x→a) → \lim_{x \to a}
  s = s.replace(
    /lim\s*\(\s*x\s*\\to\s*([^)]+)\)/gi,
    (_, a) => `\\lim_{x \\to ${a.trim()}}`,
  );

  // P(A|B) já ok; n(Ω) → n(\Omega) handled above

  return s;
}

export function looksLikeMath(text: string): boolean {
  if (/\\/.test(text)) return true;
  if (
    /\b(Calcule|limite|Substitui|Derivamos|Multiplicamos|Ainda|Forma|indeterminada|Resultado|Verificar|Conclusão|aplicação)\b/i.test(
      text,
    )
  ) {
    return false;
  }
  return /[=^∫Σ√×·∩∪→²³ⁿ₀₁₂∂∇]|\d+\/\d+|lim\s*\(|P\(|f'|f\(/.test(text);
}
