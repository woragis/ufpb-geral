# Fase 6 — Mais variação nos geradores

## Objetivo

Cada tópico deve sortear entre **múltiplos templates** (cenários), não um único padrão fixo.

## Padrão técnico

```typescript
const CENARIOS: LimitesData[] = [ /* ... */ ];

gerar(ctx) {
  const cenario = ctx.rng.pick(CENARIOS);
  return { ...problema, dados: { ...cenario, /* random params */ } };
}
```

## Meta por domínio

| Domínio | Mín. cenários/tópico |
|---------|---------------------|
| Probabilidade | 4 |
| Cálculo | 4 |
| Cálculo Vetorial | 3 |
| Análise Exploratória | 3 |

## Smoke test

Após esta fase, smoke test deve continuar passando; opcionalmente assert de diversidade (≥N `dados` distintos em 100 seeds).

## Critério de aceite

- Gerar 20 exercícios do mesmo tópico produz pelo menos 3 enunciados claramente diferentes.
