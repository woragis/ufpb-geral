# Fase 5 — Estatística e probabilidade

## Análise exploratória

| Tópico | Figura |
|--------|--------|
| `medidas-tendencia` | Gráfico de barras dos valores |
| `medidas-dispersao` | Barras + linha da média |
| `distribuicoes` | Boxplot com Q1, Q2, Q3 |
| `correlacao` | Scatter + pontos (x,y) |

## Probabilidade

| Tópico | Figura |
|--------|--------|
| `probabilidade.eventos` | Diagrama de Venn (A, B, interseção) |
| `probabilidade.classica` | Urna esquemática (bolas coloridas) |
| `espaco-amostral` | Ícones moeda/dado (simples) |

## Componentes

```
src/app/components/figures/box-plot.tsx
src/app/components/figures/scatter-plot.tsx
src/app/components/figures/bar-chart.tsx
src/app/components/figures/venn-diagram.tsx
src/app/components/figures/urn-diagram.tsx
```

## Nota

Boxplot e scatter usam dados numéricos já presentes em `Problem.dados` — não dependem de texto do enunciado.
