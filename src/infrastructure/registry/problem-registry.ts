import type { TopicoId } from "@/core/domain/ids";
import type { ProblemGenerator } from "@/core/domain/generator";
import type { ProblemSolver } from "@/core/domain/solver";
import type { DomainModule } from "@/core/domain/domain-module";
import { probabilidadeDomain } from "@/domains/probabilidade";
import { calculoDomain } from "@/domains/calculo";
import { calculoVetorialDomain } from "@/domains/calculo-vetorial";
import { analiseExploratoriaDomain } from "@/domains/analise-exploratoria";

interface RegistryEntry {
  generator: ProblemGenerator;
  solver: ProblemSolver;
}

type RegistryKey = `${TopicoId}@v${number}`;

const registry = new Map<RegistryKey, RegistryEntry>();
const latestVersionByTopico = new Map<TopicoId, number>();

function registryKey(topicoId: TopicoId, version: number): RegistryKey {
  return `${topicoId}@v${version}`;
}

function registerDomain(domain: DomainModule): void {
  for (const entry of domain.entries) {
    const version = entry.generator.version;
    registry.set(registryKey(entry.topicoId, version), {
      generator: entry.generator,
      solver: entry.solver,
    });

    const current = latestVersionByTopico.get(entry.topicoId) ?? 0;
    if (version >= current) {
      latestVersionByTopico.set(entry.topicoId, version);
    }
  }
}

registerDomain(probabilidadeDomain);
registerDomain(calculoDomain);
registerDomain(calculoVetorialDomain);
registerDomain(analiseExploratoriaDomain);

export function getRegistryEntry(
  topicoId: TopicoId,
  version?: number,
): RegistryEntry | undefined {
  const resolvedVersion = version ?? latestVersionByTopico.get(topicoId);
  if (!resolvedVersion) return undefined;
  return registry.get(registryKey(topicoId, resolvedVersion));
}

export function isTopicoImplementado(topicoId: TopicoId): boolean {
  return latestVersionByTopico.has(topicoId);
}

export function getLatestVersion(topicoId: TopicoId): number | undefined {
  return latestVersionByTopico.get(topicoId);
}

export interface RegisteredTopico {
  topicoId: TopicoId;
  version: number;
}

export function listRegisteredTopicos(): RegisteredTopico[] {
  return [...latestVersionByTopico.entries()].map(([topicoId, version]) => ({
    topicoId,
    version,
  }));
}
