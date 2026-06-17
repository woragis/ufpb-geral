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
    [/√\(([^)]+)\)/g, "\\sqrt{$1}"],
    [/√/g, "\\sqrt"],
    [/π/g, "\\pi"],
    [/θ/g, "\\theta"],
    [/−/g, "-"],
    [/≈/g, "\\approx"],
    [/±/g, "\\pm"],
    [/∞/g, "\\infty"],
    [/∇/g, "\\nabla"],
    [/∂/g, "\\partial"],
    [/̄/g, "\\bar"],
    [/ᵃ/g, "^a"],
    [/ᶜ/g, "^c"],
    [/°/g, "^\\circ"],
    [/î/g, "\\mathbf{i}"],
    [/ĵ/g, "\\mathbf{j}"],
    [/k̂/g, "\\mathbf{k}"],
  ];

  for (const [from, to] of replacements) {
    s = s.replace(from as RegExp, to);
  }

  s = s.replace(
    /lim\s*\(\s*x\s*\\to\s*([^)]+)\)/gi,
    (_, a) => `\\lim_{x \\to ${a.trim()}}`,
  );

  s = s.replace(/\|([a-zA-Z])\|/g, "\\lvert $1 \\rvert");
  s = s.replace(/\|([^|]+)\|/g, "\\left\\lvert $1 \\right\\rvert");

  s = s.replace(/\br'(\([^)]*\))?/g, (_, arg) =>
    arg ? `\\mathbf{r}'${arg}` : "\\mathbf{r}'",
  );

  return s;
}

export function looksLikeMath(text: string): boolean {
  if (/\\/.test(text)) return true;
  if (
    /\b(Calcule|limite|Substitui|Derivamos|Multiplicamos|Ainda|Forma|indeterminada|Resultado|Verificar|Conclusão|aplicação|Fórmula|Somar|módulos|Critério|Encontre|Escreva|Montar|Expandir|Conclusão|área|volume|distância|ponto|plano|reta|vetor|componente|parâmetro|interseção|ortogonais|paralelos|unitário|diretor|normal|tangente|comprimento|gradiente|divergente|rotacional|produto|projeção|ângulo|graus|Passo)\b/i.test(
      text,
    )
  ) {
    return false;
  }
  return /[=^∫Σ√×·∩∪→²³ⁿ₀₁₂∂∇θ°]|\d+\/\d+|lim\s*\(|P\(|f'|f\(/.test(text);
}
