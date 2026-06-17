# Fase 11 — Deploy

## Objetivo

Publicar na Vercel com persistência de engajamento e chaves de IA.

## Checklist

- [ ] Push dos commits para `origin/main`
- [ ] Projeto Vercel conectado ao repositório
- [ ] Env: `OPENAI_API_KEY`, `ADMIN_TOKEN`
- [ ] Persistência engajamento: Vercel KV ou Upstash (substituir `data/engagement.json`)
- [ ] Domínio customizado (opcional)
- [ ] GitHub Action: `npm run build` + `npm run smoke`

## Limitações conhecidas em serverless

- Filesystem do deploy é read-only — engagement file-based só funciona em dev.
- Migrar store da fase 2 para KV antes de go-live coletivo.

## Critério de aceite

- URL pública abre home, gera exercício, compartilha link, curtidas persistem entre usuários.
