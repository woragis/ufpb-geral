# Fase 3 — Histórico e favoritos (local)

## Objetivo

Permitir que o estudante **retome** exercícios e marque **favoritos**, sem conta/login.

## Armazenamento

`localStorage` chave `ufpb-geral:v1`

```typescript
interface PersonalStore {
  history: PersonalExerciseEntry[];  // max 50, mais recente primeiro
  favorites: PersonalExerciseEntry[];
}

interface PersonalExerciseEntry {
  seedKey: string;
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  seed: string;
  dificuldade: 1 | 2 | 3;
  generatorVersion: number;
  visitedAt: string;
  lastStep?: number;
  enunciadoPreview?: string;
}
```

## UI

- **Home**: seção “Continuar estudando” + “Favoritos”.
- **Página do exercício**: ícone estrela (favoritar/desfavoritar).
- Ao visitar: append no histórico (deduplicar por `seedKey`, mover ao topo).

## Relação com catálogo coletivo

| Pessoal | Coletivo |
|---------|----------|
| O que **eu** vi/gostei | O que a **turma** curtiu/visitou |
| `localStorage` | API + engagement store |

Não misturar os dois rankings.

## Critério de aceite

- Favoritar persiste após reload.
- Histórico mostra últimos 10 com link direto ao exercício (com `step` salvo).
