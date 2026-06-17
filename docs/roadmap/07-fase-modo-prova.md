# Fase 7 — Modo prova

## Objetivo

Simular prova: timer, passos ocultos até o fim, entrega e nota.

## Funcionalidades

- `?mode=prova` na URL do tópico ou fluxo dedicado `/prova/[disciplinaId]`.
- Timer configurável (30/60/90 min).
- N exercícios sorteados (seeds fixadas no início da sessão).
- Passos **nunca** revelados durante a prova.
- Ao final: gabarito + nota (% acertos).

## Estado da sessão

`sessionStorage` — `ufpb-prova:v1`

## Critério de aceite

- Iniciar prova → resolver → ver nota e links para revisão com passos.
