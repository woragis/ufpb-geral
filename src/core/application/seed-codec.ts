import type { Dificuldade, TopicoId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";

const PREFIX = "UFB";

function base64UrlEncodeUtf8(input: string): string {
  // Node (server)
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf-8").toString("base64url");
  }

  // Browser (client)
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeUtf8(base64url: string): string {
  // Node (server)
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64url, "base64url").toString("utf-8");
  }

  // Browser (client)
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

interface SeedPayload {
  t: TopicoId;
  d: Dificuldade;
  s: string;
  v: number;
}

export function encodeExerciseSeed(seed: ExerciseSeed): string {
  const payload: SeedPayload = {
    t: seed.topicoId,
    d: seed.dificuldade,
    s: seed.seed,
    v: seed.generatorVersion,
  };
  const json = JSON.stringify(payload);
  const base64url = base64UrlEncodeUtf8(json);
  return `${PREFIX}.${base64url}`;
}

export function decodeExerciseSeed(code: string): ExerciseSeed {
  const trimmed = code.trim();
  const parts = trimmed.split(".");

  if (parts.length === 2 && parts[0] === PREFIX) {
    const json = base64UrlDecodeUtf8(parts[1]!);
    const payload = JSON.parse(json) as SeedPayload;
    return {
      topicoId: payload.t,
      dificuldade: payload.d,
      seed: payload.s,
      generatorVersion: payload.v,
    };
  }

  throw new Error("Código de exercício inválido");
}

export function toShareableUrl(
  seed: ExerciseSeed,
  baseUrl: string,
  topicoSlug: string,
): string {
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${topicoSlug}`);
  url.searchParams.set("s", seed.seed);
  url.searchParams.set("d", String(seed.dificuldade));
  if (seed.generatorVersion !== 1) {
    url.searchParams.set("v", String(seed.generatorVersion));
  }
  return url.toString();
}

export function parseSeedFromSearchParams(
  topicoId: TopicoId,
  params: URLSearchParams,
  defaultVersion: number,
): ExerciseSeed | null {
  const seed = params.get("s");
  if (!seed) return null;

  const dificuldade = Number(params.get("d") ?? "2") as Dificuldade;
  const version = Number(params.get("v") ?? String(defaultVersion));

  if (![1, 2, 3].includes(dificuldade)) {
    throw new Error("Dificuldade inválida");
  }

  return {
    topicoId,
    dificuldade,
    seed,
    generatorVersion: version,
  };
}
