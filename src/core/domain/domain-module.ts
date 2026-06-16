import type { DisciplinaId } from "./ids";
import type { ProblemGenerator } from "./generator";
import type { ProblemSolver } from "./solver";
import type { TopicoMeta } from "./catalog";

export interface DomainEntry {
  topicoId: string;
  generator: ProblemGenerator;
  solver: ProblemSolver;
}

export interface DomainModule {
  disciplinaId: DisciplinaId;
  topicos: TopicoMeta[];
  entries: DomainEntry[];
}
