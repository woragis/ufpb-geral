import type { DisciplinaId, TopicoId } from "./ids";

export type TopicoStatus = "ativo" | "planejado";

export interface TopicoMeta {
  id: TopicoId;
  nome: string;
  descricao: string;
  prerequisitos?: TopicoId[];
  status: TopicoStatus;
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
  modulos: ModuloMeta[];
}
