import type { Dificuldade, TopicoId } from "@/core/domain/ids";
import { findTopicoById } from "@/infrastructure/catalog/disciplines";
import { isTopicoImplementado } from "@/infrastructure/registry/problem-registry";

export interface AiImportResult {
  topicoId: TopicoId;
  dificuldade: Dificuldade;
  dados: Record<string, unknown>;
  confidence?: number;
  reasoning?: string;
}

export function validateAiImport(raw: unknown): AiImportResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Resposta da IA inválida");
  }
  const obj = raw as Record<string, unknown>;
  const topicoId = obj.topicoId;
  const dificuldade = Number(obj.dificuldade ?? 2);
  const dados = obj.dados;

  if (typeof topicoId !== "string") {
    throw new Error("topicoId ausente na resposta da IA");
  }
  if (!isTopicoImplementado(topicoId as TopicoId)) {
    throw new Error(`Tópico não suportado: ${topicoId}`);
  }
  const found = findTopicoById(topicoId as TopicoId);
  if (!found || found.topico.status !== "ativo") {
    throw new Error(`Tópico inativo: ${topicoId}`);
  }
  if (![1, 2, 3].includes(dificuldade)) {
    throw new Error("dificuldade deve ser 1, 2 ou 3");
  }
  if (!dados || typeof dados !== "object") {
    throw new Error("dados ausente na resposta da IA");
  }
  const d = dados as Record<string, unknown>;
  if (typeof d.tipo !== "string") {
    throw new Error("dados.tipo ausente");
  }

  return {
    topicoId: topicoId as TopicoId,
    dificuldade: dificuldade as Dificuldade,
    dados: d,
    confidence: typeof obj.confidence === "number" ? obj.confidence : undefined,
    reasoning: typeof obj.reasoning === "string" ? obj.reasoning : undefined,
  };
}
