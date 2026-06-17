import { NextResponse } from "next/server";
import type { EngagementPayload } from "@/core/domain/engagement";
import { recordVisit } from "@/infrastructure/engagement/store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EngagementPayload;
    if (!body.topicoId || !body.disciplinaId || !body.seed) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }
    const entry = await recordVisit(body);
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 },
    );
  }
}
