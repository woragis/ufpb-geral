# Fase 6 — Integração na UI

## Alterações em `TopicPage`

1. Importar `resolveVisualSpecs(problem)`
2. Renderizar `<ExerciseFigures specs={specs} />` abaixo do enunciado
3. Substituir `<pre>` por `<MathContent>` nos steps
4. `MathContent` na resposta final

## Layout

```
┌─────────────────────────────────┐
│ Enunciado (MathContent)         │
├─────────────────────────────────┤
│ [Figura(s) SVG]                 │
├─────────────────────────────────┤
│ Passo 1 …                       │
│   Cálculo (MathContent)         │
└─────────────────────────────────┘
```

## Componente dispatcher

`ExerciseFigures.tsx` — `switch (spec.kind)` → componente correto.

## Acessibilidade

- `role="img"` + `aria-label` descritivo em cada figura
- Texto alternativo com mesmos números do exercício

## Performance

- Figuras são client components leves (SVG estático)
- Sem re-render ao revelar steps (specs dependem só de `problem`)
