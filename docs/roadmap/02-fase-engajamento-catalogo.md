# Fase 2 — Engajamento e destaques no catálogo

## Objetivo

Registrar **visitas** e **curtidas** por exercício (identificado pela seed) e exibir os **mais relevantes** no catálogo de cada disciplina/tópico.

## Modelo de dados

```typescript
interface SeedEngagement {
  seedKey: string;       // topicoId|d|seed|v
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  visits: number;
  likes: number;
  updatedAt: string;
}

interface EngagementStore {
  seeds: Record<string, SeedEngagement>;
}
```

### `seedKey`

Chave canônica: `${topicoId}|${dificuldade}|${seed}|v${generatorVersion}`

## Score de ranking

```
score = visits + likes × 5
```

Peso maior em curtidas evita que um link aberto por engano domine o ranking.

## Persistência

| Ambiente | Armazenamento |
|----------|---------------|
| Desenvolvimento local | `data/engagement.json` (leitura/escrita via API) |
| Produção (fase 11) | Vercel KV / Upstash Redis / Supabase |

## API

| Método | Rota | Ação |
|--------|------|------|
| POST | `/api/engagement/visit` | +1 visita (idempotente por sessão opcional) |
| POST | `/api/engagement/like` | +1 curtida (toggle futuro) |
| GET | `/api/engagement/top?topicoId=&limit=5` | Top seeds do tópico |

## UI

1. **Página do exercício**: botão curtir + registro automático de visita.
2. **Página da disciplina**: painel “Destaques” por tópico ativo (top 3 seeds com link).
3. **Seeds curadas**: `curated-seeds.ts` — lista inicial enquanto não há dados reais.

## Bootstrap curado

Enquanto `engagement.json` está vazio, mesclar seeds curadas manualmente (uma por tópico) para o catálogo não ficar vazio.

## Critério de aceite

- Abrir exercício incrementa visitas (reload visível em dev).
- Curtir incrementa likes.
- Catálogo da disciplina lista destaques com links funcionais.
