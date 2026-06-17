# Fase 4 — IA: texto → exercício

## Objetivo

Usuário cola texto (PDF, caderno, WhatsApp) e o sistema propõe um exercício no **formato interno** do site.

## Fluxo

```
Texto livre
  → POST /api/ai/import-exercise
  → OpenAI structured output (JSON schema)
  → Validação Zod (topicoId + dados tipados)
  → Preview na UI (enunciado + passos estimados)
  → [Confirmar] → gera seed fixa ou salva como custom
```

## Schema de saída (exemplo)

```json
{
  "topicoId": "calculo.limites",
  "dificuldade": 2,
  "dados": {
    "tipo": "limite-algebrico",
    "a": 2,
    "coeficiente": 2,
    "constante": 8
  },
  "confidence": 0.92,
  "reasoning": "..."
}
```

## Validação pós-IA

1. `topicoId` existe e está ativo.
2. `dados` passa no schema do tópico.
3. Opcional: rodar solver com dados injetados e checar consistência.

## Modelo

- `gpt-4o-mini` ou `gpt-4.1-nano` — barato, suficiente para extração estruturada.
- System prompt com lista de tópicos + exemplos de `dados` por tipo.

## Segurança

- `OPENAI_API_KEY` só no servidor.
- Rate limit por IP (ex.: 10 req/h).

## Fora de escopo v1

- OCR de imagem
- Exercícios fora dos 29 tópicos (fase custom solver)

## Critério de aceite

- Colar enunciado de limite → preview correto → link reproduzível.
