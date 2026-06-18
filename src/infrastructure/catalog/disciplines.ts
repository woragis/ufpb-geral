import type { DisciplinaId, TopicoId } from "@/core/domain/ids";
import type {
  DisciplinaMeta,
  ModuloMeta,
  SubtopicoMeta,
  TopicoMeta,
} from "@/core/domain/catalog";
import { probabilidadeDomain } from "@/domains/probabilidade";
import { preCalculoDomain } from "@/domains/pre-calculo";
import { calculoDomain } from "@/domains/calculo";
import { calculoVetorialDomain } from "@/domains/calculo-vetorial";
import { analiseExploratoriaDomain } from "@/domains/analise-exploratoria";
import { calculoSubtopicos } from "@/domains/calculo/catalog/subtopicos";
import { preCalculoSubtopicos } from "@/domains/pre-calculo/catalog/subtopicos";
import { analiseExploratoriaSubtopicos } from "@/domains/analise-exploratoria/catalog/subtopicos";
import { calculoVetorialSubtopicos } from "@/domains/calculo-vetorial/catalog/subtopicos";
import { probabilidadeSubtopicos } from "@/domains/probabilidade/catalog/subtopicos";

const domains = [
  probabilidadeDomain,
  preCalculoDomain,
  calculoDomain,
  calculoVetorialDomain,
  analiseExploratoriaDomain,
];

const subtopicosByTopico: Partial<Record<TopicoId, SubtopicoMeta[]>> = {
  ...calculoSubtopicos,
  ...preCalculoSubtopicos,
  ...analiseExploratoriaSubtopicos,
  ...calculoVetorialSubtopicos,
  ...probabilidadeSubtopicos,
};

function fallbackSubtopicos(topicoId: TopicoId): SubtopicoMeta[] {
  const slug = topicoSlugFromId(topicoId);
  return [
    {
      id: "todos",
      slug: "todos",
      nome: "Todos os cenários",
      descricao: "Exercício aleatório deste tópico.",
      status: "ativo",
    },
    {
      id: slug,
      slug,
      nome: "Geral",
      status: "ativo",
    },
  ];
}

function withSubtopicos(modulos: ModuloMeta[]): ModuloMeta[] {
  return modulos.map((modulo) => ({
    ...modulo,
    topicos: modulo.topicos.map((topico) => ({
      ...topico,
      subtopicos: subtopicosByTopico[topico.id] ?? fallbackSubtopicos(topico.id),
    })),
  }));
}

export const disciplinas: DisciplinaMeta[] = domains.map((d) => ({
  id: d.disciplinaId,
  nome: d.nome,
  descricao: d.descricao,
  modulos: withSubtopicos(d.modulos),
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

export function listSubtopicos(topicoId: TopicoId): SubtopicoMeta[] {
  const found = findTopicoById(topicoId);
  return found?.topico.subtopicos ?? subtopicosByTopico[topicoId] ?? fallbackSubtopicos(topicoId);
}

export function getSubtopico(
  disciplinaId: DisciplinaId,
  topicoSlug: string,
  subtopicoSlug: string,
): SubtopicoMeta | undefined {
  const topico = getTopico(disciplinaId, topicoSlug);
  return topico?.subtopicos?.find((s) => s.slug === subtopicoSlug);
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

export function subtopicoPath(
  disciplinaId: DisciplinaId,
  topicoId: TopicoId,
  subtopicoSlug: string,
): string {
  return `/${disciplinaId}/${topicoSlugFromId(topicoId)}/${subtopicoSlug}`;
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

export function defaultSubtopicoSlug(topicoId: TopicoId): string {
  const subs = listSubtopicos(topicoId);
  if (subs.length === 1) return subs[0]!.slug;
  const todos = subs.find((s) => s.slug === "todos");
  return todos?.slug ?? subs[0]!.slug;
}
