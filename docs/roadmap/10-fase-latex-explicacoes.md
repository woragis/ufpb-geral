# Fase 10 — LaTeX nas explicações

## Objetivo

Completar `explicacaoLatex` nos enrichers para que **todos** os blocos de texto matemático usem KaTeX formal.

## Trabalho

- Auditar solvers: quais `explicacao` contêm símbolos matemáticos.
- Estender `DomainLatexEnricher` com `stepExplicacao(problem, step)`.
- Fallback: manter texto plano quando não houver LaTeX.

## Critério de aceite

- ≥90% dos passos dos 29 tópicos renderizam explicação com LaTeX quando aplicável.
