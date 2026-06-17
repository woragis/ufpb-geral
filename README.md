# UFPB Study — exercícios com seeds

Plataforma de estudos para disciplinas da UFPB: exercícios aleatórios determinísticos, solução passo a passo, LaTeX, figuras SVG, compartilhamento por link/código, engajamento no catálogo e tutor IA.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run smoke    # 2900 exercícios (29 tópicos × 100 seeds)
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

| Variável | Uso |
|----------|-----|
| `OPENAI_API_KEY` | Importação de exercícios e botão **Explicar** |
| `OPENAI_MODEL` | Padrão: `gpt-4o-mini` |
| `ADMIN_TOKEN` | Acesso a `/admin?token=...` |

## Funcionalidades

- **29 tópicos** com gerador + solver
- **Seeds** reproduzíveis (`?s=&d=&v=&step=`)
- **Importação IA** — cole enunciado na home
- **Tutor Explicar** — na página do exercício, com perguntas sugeridas
- **Destaques no catálogo** — visitas e curtidas por seed
- **Histórico / favoritos** — `localStorage`
- **Modo prova** — `?mode=prova&minutes=30`
- **PDF** — rota `/[disciplina]/[topico]/print`

## Roadmap

Ver `docs/roadmap/00-overview.md`.

## Deploy (Vercel)

1. Conecte o repositório na Vercel
2. Configure env vars (`OPENAI_API_KEY`, `ADMIN_TOKEN`)
3. **Nota:** engajamento em `data/engagement.json` é gravável só em dev; em produção use Vercel KV (fase 11 do roadmap)

```bash
git push origin main
```

## Admin

`/admin?token=SEU_ADMIN_TOKEN` — lista seeds curadas e estatísticas.
