import type { DisciplinaId, TopicoId } from "./ids";

export type TopicoStatus = "ativo" | "planejado";

export interface SubtopicoMeta {
  id: string;
  nome: string;
  descricao?: string;
  slug: string;
  status?: TopicoStatus;
}

export interface TopicoMeta {
  id: TopicoId;
  nome: string;
  descricao: string;
  prerequisitos?: TopicoId[];
  status: TopicoStatus;
  subtopicos?: SubtopicoMeta[];
}

export interface ModuloMeta {
  id: string;
  nome: string;
  ordem: number;
  topicos: TopicoMeta[];
}

export interface DisciplinaMeta {
  id: DisciplinaId;
  nome: string;
  descricao: string;
  imagemUrl?: string;
  imagemAlt?: string;
  modulos: ModuloMeta[];
}
