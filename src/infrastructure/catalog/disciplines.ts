import type { DisciplinaId, TopicoId } from "@/core/domain/ids";
import type { DisciplinaMeta, TopicoMeta } from "@/core/domain/catalog";
import { probabilidadeDomain } from "@/domains/probabilidade";
import { preCalculoDomain } from "@/domains/pre-calculo";
import { calculoDomain } from "@/domains/calculo";
import { calculoVetorialDomain } from "@/domains/calculo-vetorial";
import { analiseExploratoriaDomain } from "@/domains/analise-exploratoria";

const domains = [
  probabilidadeDomain,
  preCalculoDomain,
  calculoDomain,
  calculoVetorialDomain,
  analiseExploratoriaDomain,
];

export const disciplinas: DisciplinaMeta[] = domains.map((d) => ({
  id: d.disciplinaId,
  nome: d.nome,
  descricao: d.descricao,
  modulos: d.modulos,
}));

export function getDisciplina(id: DisciplinaId): DisciplinaMeta | undefined {
  return disciplinas.find((d) => d.id === id);
}

export function getTopico(
  disciplinaId: DisciplinaId,
  topicoSlug: string,
): TopicoMeta | undefined {
  const disciplina = getDisciplina(disciplinaId);
  if (!disciplina) return undefined;

  for (const modulo of disciplina.modulos) {
    const topico = modulo.topicos.find((t) => topicoSlugFromId(t.id) === topicoSlug);
    if (topico) return topico;
  }
  return undefined;
}

export function topicoSlugFromId(topicoId: TopicoId): string {
  const parts = topicoId.split(".");
  return parts[parts.length - 1] ?? topicoId;
}

export function topicoPath(
  disciplinaId: DisciplinaId,
  topicoId: TopicoId,
): string {
  return `/${disciplinaId}/${topicoSlugFromId(topicoId)}`;
}

export function findTopicoById(topicoId: TopicoId): {
  disciplina: DisciplinaMeta;
  topico: TopicoMeta;
} | null {
  for (const disciplina of disciplinas) {
    for (const modulo of disciplina.modulos) {
      const topico = modulo.topicos.find((t) => t.id === topicoId);
      if (topico) {
        return { disciplina, topico };
      }
    }
  }
  return null;
}
