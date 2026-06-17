# Fase 1 — Smoke tests

## Objetivo

Garantir que **todos os tópicos registrados** geram exercício, resolvem e produzem specs visuais sem lançar exceção.

## Escopo

- Script `scripts/smoke-test.ts`
- Comando `npm run smoke`
- 100 seeds sintéticas por tópico (`smoke-0` … `smoke-99`)
- Dificuldades alternadas (1, 2, 3)
- Verificações por iteração:
  - `generateAndSolve` não lança
  - `solution.steps.length >= 1`
  - `solution.respostaFinal` não vazio
  - `resolveVisualSpecs` não lança

## Fora de escopo

- Validar correção matemática dos solvers
- Testes de UI / Playwright (fase futura opcional)

## Implementação

```
scripts/smoke-test.ts
src/infrastructure/registry/problem-registry.ts  → listRegisteredTopicos()
package.json                                     → "smoke": "tsx scripts/smoke-test.ts"
```

## Critério de aceite

```bash
npm run smoke
# exit 0, ~2900 exercícios gerados (29 × 100)
```

## CI (futuro)

Adicionar step no GitHub Actions após deploy doc (fase 11).
