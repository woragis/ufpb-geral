import { NextResponse } from "next/server";
import type { Step } from "@/core/domain/problem";
import { chatJson } from "@/infrastructure/ai/openai-client";
import { checkRateLimit, clientIp } from "@/infrastructure/ai/rate-limit";

interface ExplainRequestBody {
  topicoId: string;
  disciplinaId: string;
  enunciado: string;
  enunciadoLatex?: string;
  stepsVisiveis?: Step[];
  respostaFinalRevelada?: boolean;
  respostaFinal?: string;
  userQuestion?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

interface ExplainResponse {
  explanation: string;
  suggestedQuestions: string[];
  hintLevel: "conceito" | "dica" | "passo";
}

const EXPLAIN_SYSTEM = `Você é tutor de matemática/estatística da UFPB.
Responda em português claro usando Markdown estruturado (títulos ##, listas -, negrito **).
Use LaTeX apenas entre delimitadores: inline $...$ ou display $$...$$ (nunca \\frac solto fora de $).
Responda JSON: { explanation, suggestedQuestions: string[3-5], hintLevel: "conceito"|"dica"|"passo" }.

Regras:
- Se respostaFinalRevelada for false, NÃO revele a resposta numérica final; dê dicas e conceitos.
- suggestedQuestions devem ser perguntas curtas que o aluno clicaria em seguida.
- Seja didático e objetivo; não cole enunciadoLatex cru — reescreva em notação legível.`;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rate = checkRateLimit(`ai-explain:${ip}`, 30);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Limite de requisições atingido." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as ExplainRequestBody;
    if (!body.enunciado || !body.topicoId) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const stepsText = (body.stepsVisiveis ?? [])
      .map(
        (s) =>
          `Passo ${s.ordem} (${s.titulo}): ${s.explicacao}${s.calculo ? ` | Cálculo: ${s.calculo}` : ""}`,
      )
      .join("\n");

    const userContent = [
      `Tópico: ${body.topicoId}`,
      `Enunciado: ${body.enunciado}`,
      body.enunciadoLatex ? `LaTeX: ${body.enunciadoLatex}` : "",
      stepsText ? `Passos visíveis:\n${stepsText}` : "Nenhum passo revelado ainda.",
      `Resposta final revelada: ${body.respostaFinalRevelada ? "sim" : "não"}`,
      body.respostaFinalRevelada && body.respostaFinal
        ? `Resposta: ${body.respostaFinal}`
        : "",
      body.history?.length
        ? `Histórico:\n${body.history.map((h) => `${h.role}: ${h.content}`).join("\n")}`
        : "",
      body.userQuestion
        ? `Pergunta do aluno: ${body.userQuestion}`
        : "Dê uma explicação inicial do exercício e conceitos necessários.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await chatJson<ExplainResponse>(EXPLAIN_SYSTEM, userContent);

    if (!result.explanation || !Array.isArray(result.suggestedQuestions)) {
      throw new Error("Formato de resposta inválido");
    }

    return NextResponse.json({
      explanation: result.explanation,
      suggestedQuestions: result.suggestedQuestions.slice(0, 5),
      hintLevel: result.hintLevel ?? "conceito",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro no tutor" },
      { status: 500 },
    );
  }
}
