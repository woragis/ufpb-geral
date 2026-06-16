# Fase 3 — Gráficos de funções (Cálculo)

## Tópicos cobertos

| Tópico | Figura |
|--------|--------|
| `calculo.limites` | Função racional + ponto removido em `x = a` |
| `calculo.continuidade` | Função por partes (duas retas) |
| `calculo.derivadas` | Polinômio + ponto `x₀` |
| `calculo.otimizacao` | Parábola + vértice |
| `calculo.integrais-definidas` | Reta sob intervalo `[a,b]` |
| `calculo.area` | Área sombreada |
| `calculo.edos` | Curva solução exponencial (amostragem) |

## Componentes SVG

```
src/app/components/figures/plot-canvas.tsx   # eixos, grid, padding
src/app/components/figures/function-plot.tsx
src/app/components/figures/piecewise-plot.tsx
src/app/components/figures/area-plot.tsx
```

## Implementação

- Amostragem de 100–200 pontos por curva
- Coordenadas matemáticas → pixels via escala linear
- Cores: curva (foreground), área (fill opacity), marcadores (accent)

## Dados do builder

Lê `LimitesData`, `ContinuidadeData`, `OtimizacaoData`, etc. e produz pontos pré-calculados no spec (evita reimplementar fórmulas no componente).
