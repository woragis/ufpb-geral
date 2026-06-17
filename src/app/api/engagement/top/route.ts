import { NextResponse } from "next/server";
import type { TopicoId } from "@/core/domain/ids";
import { getTopSeedsForTopico } from "@/infrastructure/engagement/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicoId = searchParams.get("topicoId") as TopicoId | null;
  const limit = Number(searchParams.get("limit") ?? "5");

  if (!topicoId) {
    return NextResponse.json({ error: "topicoId obrigatório" }, { status: 400 });
  }

  const seeds = await getTopSeedsForTopico(topicoId, limit);
  return NextResponse.json({ seeds });
}
