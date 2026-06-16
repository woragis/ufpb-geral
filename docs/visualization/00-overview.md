# Visualização — visão geral

A plataforma hoje exibe enunciados, cálculos e passos como **texto puro**. Este plano adiciona uma camada de **apresentação visual** separada da lógica de domínio (geradores/solvers), seguindo Clean Architecture.

## Objetivos

1. **Fórmulas tipográficas** — limites, derivadas, integrais, probabilidade, etc.
2. **Figuras SVG** — gráficos de funções, áreas, vetores, retas, boxplots, scatter.
3. **Derivação dos dados** — figuras geradas a partir de `Problem.dados`, não duplicando lógica nos solvers.
4. **Progressive enhancement** — se não houver spec visual, a UI continua funcionando só com texto.

## Princípio de dependência

```
domains (dados tipados)
    ↓
core/presentation/visual (VisualSpec)
    ↓
app/components (MathContent, ExerciseFigures)
```

Domínios **não** importam componentes React. Builders de visual vivem em `infrastructure/visual/builders/`.

## Modelo VisualSpec

```typescript
type VisualSpec =
  | { kind: "function-plot"; ... }
  | { kind: "piecewise-plot"; ... }
  | { kind: "area-plot"; ... }
  | { kind: "vectors-2d"; ... }
  | { kind: "vectors-3d"; ... }
  | { kind: "parametric-curve"; ... }
  | { kind: "box-plot"; ... }
  | { kind: "scatter-plot"; ... }
  | { kind: "bar-chart"; ... }
  | { kind: "venn"; ... };
```

`resolveVisualSpecs(problem)` retorna `VisualSpec[]` (0..n figuras por exercício).

## Fases de implementação

| Fase | Documento | Entrega |
|------|-----------|---------|
| 1 | [01-fase-katex.md](./01-fase-katex.md) | KaTeX, `MathContent`, CSS |
| 2 | [02-fase-visual-spec.md](./02-fase-visual-spec.md) | Tipos, resolver, registry de builders |
| 3 | [03-fase-graficos-funcoes.md](./03-fase-graficos-funcoes.md) | Parábolas, retas, área, piecewise |
| 4 | [04-fase-vetores-geometria.md](./04-fase-vetores-geometria.md) | Vetores, retas 3D, curvas, gradiente |
| 5 | [05-fase-estatistica-probabilidade.md](./05-fase-estatistica-probabilidade.md) | Boxplot, scatter, barras, Venn |
| 6 | [06-fase-integracao-ui.md](./06-fase-integracao-ui.md) | Página do tópico, steps com math |

## Critérios de pronto por fase

- Build TypeScript sem erros
- Tópico representativo da fase exibe figura + fórmula na UI
- Commit git isolado por fase
