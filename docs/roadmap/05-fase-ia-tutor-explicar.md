# Fase 5 — IA: botão “Explicar” + perguntas sugeridas

## Objetivo

Tutor contextual na página do exercício: explica sem substituir o solver determinístico, com **chips de perguntas** para aprofundar.

## UX

```
┌─────────────────────────────────────┐
│ Enunciado + figuras + passos        │
│ [Explicar] [Curtir] [Favoritar]     │
└─────────────────────────────────────┘
         │
         ▼
┌─ Painel tutor ──────────────────────┐
│ Resposta em linguagem natural       │
│                                     │
│ Próximas perguntas:                 │
│ [Por que fatorar o numerador?]      │
│ [O que significa 0/0?]              │
│ [Mostre um exemplo parecido]        │
└─────────────────────────────────────┘
```

## Contexto enviado à API

```typescript
interface TutorRequest {
  topicoId: TopicoId;
  disciplinaId: DisciplinaId;
  enunciado: string;
  enunciadoLatex?: string;
  stepsVisiveis: Step[];
  respostaFinalRevelada: boolean;
  userQuestion?: string;  // chip clicado ou texto livre
}
```

## Resposta estruturada

```typescript
interface TutorResponse {
  explanation: string;           // markdown ou texto
  suggestedQuestions: string[];  // 3–5 chips para próximo turno
  hintLevel: "conceito" | "dica" | "passo";
}
```

## Regras do system prompt

- Não revelar resposta final se `respostaFinalRevelada === false` (modo estudo).
- Sempre sugerir perguntas **relacionadas ao tópico atual**.
- Preferir analogias e definições do currículo UFPB.
- Citar notação LaTeX quando útil.

## Modelo

Mesmo tier barato da fase 4. Conversa stateless: histórico enviado no body (últimos 3 turnos).

## API

`POST /api/ai/explain`

## Critério de aceite

- Botão abre painel com explicação + ≥3 chips clicáveis.
- Clicar chip gera nova resposta contextualizada.
