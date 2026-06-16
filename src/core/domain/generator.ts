import type { Dificuldade, TopicoId } from "./ids";
import type { Problem } from "./problem";
import type { SeededRandom } from "./seeded-random";

export interface GeneratorContext<TParams = unknown> {
  topicoId: TopicoId;
  dificuldade: Dificuldade;
  rng: SeededRandom;
  params?: TParams;
}

export interface ProblemGenerator<TParams = unknown> {
  readonly topicoId: TopicoId;
  readonly version: number;
  gerar(ctx: GeneratorContext<TParams>): Problem;
}
