import type { Dificuldade, TopicoId } from "@/core/domain/ids";

export interface ImportPayload {
  topicoId: TopicoId;
  dificuldade: Dificuldade;
  dados: unknown;
  generatorVersion: number;
}

function toBase64Url(json: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeImportPayload(payload: ImportPayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeImportPayload(encoded: string): ImportPayload | null {
  try {
    const json = fromBase64Url(encoded);
    const data = JSON.parse(json) as ImportPayload;
    if (!data.topicoId || !data.dados) return null;
    return data;
  } catch {
    return null;
  }
}
