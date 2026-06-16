import type { TopicoId } from "./ids";
import type { Problem, Solution } from "./problem";

export interface ProblemSolver {
  readonly topicoId: TopicoId;
  resolver(problema: Problem): Solution;
}
