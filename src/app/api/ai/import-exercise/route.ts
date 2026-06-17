import { NextResponse } from "next/server";
import { encodeImportPayload } from "@/core/application/import-payload-codec";
import { solveFromDados } from "@/core/application/solve-from-dados";
import { topicoSlugFromId, findTopicoById } from "@/infrastructure/catalog/disciplines";
import { chatJson } from "@/infrastructure/ai/openai-client";
import { checkRateLimit, clientIp } from "@/infrastructure/ai/rate-limit";
import { AI_TOPIC_CATALOG } from "@/infrastructure/ai/topic-catalog";
import { validateAiImport } from "@/infrastructure/ai/validate-import";
import { getRegistryEntry } from "@/infrastructure/registry/problem-registry";

const IMPORT_SYSTEM = `Você extrai exercícios de matemática/estatística para JSON.
Escolha o topicoId mais adequado e preencha dados com números corretos extraídos do texto.
Responda APENAS JSON com: topicoId, dificuldade (1-3), dados (objeto com tipo), confidence (0-1), reasoning (breve).

${AI_TOPIC_CATALOG}

Regras:
- dados deve ser compatível com o solver do tópico
- para limites algébricos: constante = coeficiente * a * a
- use apenas tópicos listados`;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rate = checkRateLimit(`ai-import:${ip}`, 15);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Limite de requisições atingido. Tente mais tarde." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as { text?: string };
    if (!body.text?.trim()) {
      return NextResponse.json({ error: "text obrigatório" }, { status: 400 });
    }

    const raw = await chatJson<unknown>(IMPORT_SYSTEM, body.text.trim());
    const parsed = validateAiImport(raw);
    const found = findTopicoById(parsed.topicoId);
    if (!found) {
      return NextResponse.json({ error: "Tópico não encontrado" }, { status: 400 });
    }

    const version = getRegistryEntry(parsed.topicoId)?.generator.version ?? 1;
    const preview = solveFromDados({
      topicoId: parsed.topicoId,
      disciplinaId: found.disciplina.id,
      dificuldade: parsed.dificuldade,
      dados: parsed.dados,
      generatorVersion: version,
      revealSteps: 0,
    });

    const payload = encodeImportPayload({
      topicoId: parsed.topicoId,
      dificuldade: parsed.dificuldade,
      dados: parsed.dados,
      generatorVersion: version,
    });

    const slug = topicoSlugFromId(parsed.topicoId);
    const openUrl = `/${found.disciplina.id}/${slug}?p=${payload}`;

    return NextResponse.json({
      ok: true,
      topicoId: parsed.topicoId,
      topicoNome: found.topico.nome,
      disciplinaId: found.disciplina.id,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      enunciado: preview.problem.enunciado,
      enunciadoLatex: preview.problem.enunciadoLatex,
      respostaFinal: preview.solution.respostaFinal,
      payload,
      openUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao importar" },
      { status: 500 },
    );
  }
}
