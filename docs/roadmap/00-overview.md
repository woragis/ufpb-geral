# Roadmap — UFPB Geral (plataforma de estudos)

Visão geral do produto, decisões de escopo e ordem de implementação.

## Contexto

Plataforma Next.js para organizar conteúdo da UFPB: domínios/tópicos, exercícios aleatórios com solução passo a passo, compartilhamento por seed (link/código reproduzível), LaTeX formal e figuras SVG.

Escopo intencionalmente **baixo** (projeto de faculdade): sem autenticação obrigatória, sem banco relacional na v1, foco em utilidade real para revisão.

## Ideias consolidadas

| Ideia | Avaliação | Abordagem recomendada |
|-------|-----------|------------------------|
| Seeds mais visitadas/gostadas no catálogo | **Excelente** | Híbrido: estatísticas agregadas (visitas/curtidas) + lista curada inicial |
| Histórico / favoritos pessoais | **Complementar** | `localStorage` no cliente; não misturar com ranking global |
| IA: texto → exercício | **Alto valor** | Structured output → validação Zod → preview antes de salvar |
| Botão **Explicar** com perguntas sugeridas | **Ideal para faculdade** | Tutor contextual por exercício; chips de follow-up |
| Smoke tests (100 seeds/tópico) | **Essencial** | Script CI-local antes de cada release |
| Modo prova, PDF, admin | **Fase posterior** | Depois de estabilizar núcleo |

## Princípio: catálogo com seeds em destaque

Em vez de só listar tópicos, o catálogo pode mostrar **exercícios exemplares** por tópico:

```
Tópico: Limites
  ★ Destaques (por curtidas + visitas)
  - seed abc123 — 42 visitas, 8 curtidas
  - seed def456 — ...
```

**Por que funciona bem**

- Seeds são determinísticas: um link bom serve para toda a turma.
- Estudantes descobrem exercícios “bons” sem gerar à sorte.
- Combina mérito coletivo (likes) com uso real (visitas).

**Score sugerido** (documentado na fase 2):

```
score = visitas × 1 + curtidas × 5 + (nota média × 2 se houver avaliação)
```

**Separação clara**

| Camada | Onde vive | O que guarda |
|--------|-----------|--------------|
| Pessoal | `localStorage` | Histórico, favoritos, último passo |
| Coletivo | API + `data/engagement.json` (dev) / KV (prod) | Visitas, curtidas por `seedKey` |

## Tutor IA — botão “Explicar”

Fluxo desejado na página do exercício:

1. Usuário clica **Explicar**.
2. Painel lateral abre com explicação em linguagem natural (sem revelar resposta final de imediato, se modo estudo).
3. Abaixo, **chips de perguntas sugeridas**: “Por que fatorar?”, “O que é descontinuidade removível?”, etc.
4. Cada clique envia contexto (enunciado, passos visíveis, tópico) + pergunta à API.
5. Modelo barato (`gpt-4o-mini` / `gpt-4.1-nano`) com system prompt fixo por disciplina.

Ver [05-fase-ia-tutor-explicar.md](./05-fase-ia-tutor-explicar.md).

## Fases de implementação

| Fase | Documento | Entrega principal |
|------|-----------|-------------------|
| 1 | [01-fase-smoke-tests.md](./01-fase-smoke-tests.md) | Script `npm run smoke` |
| 2 | [02-fase-engajamento-catalogo.md](./02-fase-engajamento-catalogo.md) | Visitas, curtidas, destaques no catálogo |
| 3 | [03-fase-historico-favoritos.md](./03-fase-historico-favoritos.md) | Histórico e favoritos locais |
| 4 | [04-fase-ia-importacao.md](./04-fase-ia-importacao.md) | Colar texto → exercício estruturado |
| 5 | [05-fase-ia-tutor-explicar.md](./05-fase-ia-tutor-explicar.md) | Botão Explicar + perguntas sugeridas |
| 6 | [06-fase-variacao-geradores.md](./06-fase-variacao-geradores.md) | Mais templates por tópico |
| 7 | [07-fase-modo-prova.md](./07-fase-modo-prova.md) | Timer, esconder passos, nota |
| 8 | [08-fase-export-pdf.md](./08-fase-export-pdf.md) | PDF enunciado + figuras + solução |
| 9 | [09-fase-painel-admin.md](./09-fase-painel-admin.md) | CRUD de questões sem código |
| 10 | [10-fase-latex-explicacoes.md](./10-fase-latex-explicacoes.md) | `explicacaoLatex` completo |
| 11 | [11-fase-deploy.md](./11-fase-deploy.md) | Vercel, env, persistência em produção |

## Estado atual (baseline)

- 29 tópicos ativos com gerador + solver
- LaTeX formal via enrichers
- Figuras SVG por domínio
- Compartilhamento por seed (`s`, `d`, `v`, `step`)

## Convenções de commit

Um commit por fase ou sub-feature implementada, incluindo documentação da fase.
