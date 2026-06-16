# Fase 4 — Vetores e geometria (Cálculo Vetorial)

## Tópicos cobertos

| Tópico | Figura |
|--------|--------|
| `calculo-vetorial.vetores` | Seta do origem ao ponto |
| `calculo-vetorial.produto-escalar` | Duas setas + ângulo (opcional) |
| `calculo-vetorial.produto-vetorial` | Projeção 3D isométrica de u, v, u×v |
| `calculo-vetorial.retas-planos` | Segmento P→Q no R³ (projeção) |
| `calculo-vetorial.curvas` | Curva paramétrica `(at, t²+b)` |
| `calculo-vetorial.campos` | Campo de setas do gradiente em (x₀,y₀) |

## Componentes

```
src/app/components/figures/vectors-2d.tsx
src/app/components/figures/vectors-3d.tsx
src/app/components/figures/parametric-curve.tsx
```

## Projeção 3D (MVP)

Isométrica simples:

```
x' = x - y
y' = (x + y) / 2 - z
```

Suficiente para intuição; não precisa WebGL na primeira versão.

## Marcadores

- Pontos P, Q rotulados
- Vetores com setas SVG (`marker-end`)
