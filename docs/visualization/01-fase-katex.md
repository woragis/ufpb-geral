# Fase 1 — Matemática tipográfica (KaTeX)

## Objetivo

Renderizar enunciados, campos `calculo` e `resultado` dos steps com tipografia matemática.

## Dependência

- `katex` (runtime)
- CSS `katex/dist/katex.min.css` importado no layout ou no componente

## Componentes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/app/components/math/MathContent.tsx` | Client component: normaliza string → LaTeX → HTML |
| `src/core/presentation/math/to-latex.ts` | Heurísticas: `x²` → `x^2`, `→` → `\to`, etc. |

## Normalização (MVP)

Strings dos solvers usam Unicode e notação informal. O normalizador cobre:

- Expoentes unicode (`²`, `³`)
- Setas (`→`, `−`)
- Símbolos (`·`, `∩`, `∪`, `Ω`, `≤`, `≥`)
- Frações simples `a/b` em contexto matemático (fase posterior)

Fallback: se KaTeX falhar, exibir texto original em `<span>`.

## Onde aplicar (fase 6)

- Enunciado do exercício
- `step.calculo` e `step.resultado`
- Resposta final

## Fora do escopo desta fase

- Figuras SVG
- LaTeX explícito nos domínios (`step.latex`)
