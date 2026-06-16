import type { Dificuldade, TopicoId } from "./ids";

export interface ExerciseSeed {
  topicoId: TopicoId;
  dificuldade: Dificuldade;
  seed: string;
  generatorVersion: number;
}
