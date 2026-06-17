import type { Dificuldade, TopicoId } from "@/core/domain/ids";
import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { ExerciseSeed } from "@/core/domain/seed";
import { createSeededRandom } from "./create-seeded-random";
import { randomShareableSeed } from "./random-shareable-seed";
import { stableProblemId } from "./hash";
import { getRegistryEntry } from "@/infrastructure/registry/problem-registry";
import { enrichProblem, enrichSolution } from "@/infrastructure/latex/enrich";

export interface GenerateAndSolveInput {
  topicoId: TopicoId;
  disciplinaId: Problem["disciplinaId"];
  dificuldade?: Dificuldade;
  seed?: string;
  generatorVersion?: number;
  revealSteps?: number;
}

export interface GenerateAndSolveOutput {
  problem: Problem;
  solution: Solution;
  stepsVisiveis: Step[];
  exerciseSeed: ExerciseSeed;
}

export function generateAndSolve(
  input: GenerateAndSolveInput,
): GenerateAndSolveOutput {
  const version = input.generatorVersion ?? getLatestVersion(input.topicoId);
  const entry = getRegistryEntry(input.topicoId, version);

  if (!entry) {
    throw new Error(`Tópico não implementado: ${input.topicoId}`);
  }

  const exerciseSeed: ExerciseSeed = {
    topicoId: input.topicoId,
    dificuldade: input.dificuldade ?? 2,
    seed: input.seed ?? randomShareableSeed(),
    generatorVersion: entry.generator.version,
  };

  const rng = createSeededRandom(exerciseSeed);
  const seedKey = `${exerciseSeed.topicoId}|${exerciseSeed.dificuldade}|${exerciseSeed.seed}|v${exerciseSeed.generatorVersion}`;

  const problem = entry.generator.gerar({
    topicoId: input.topicoId,
    dificuldade: exerciseSeed.dificuldade,
    rng,
  });

  const problemWithMeta: Problem = enrichProblem({
    ...problem,
    id: stableProblemId(seedKey),
    disciplinaId: input.disciplinaId,
    topicoId: input.topicoId,
    dificuldade: exerciseSeed.dificuldade,
    seed: exerciseSeed,
    geradoEm: new Date().toISOString(),
  });

  const solution = enrichSolution(
    problemWithMeta,
    entry.solver.resolver(problemWithMeta),
  );
  const revealSteps = input.revealSteps ?? 0;
  const stepsVisiveis = solution.steps.slice(0, revealSteps);

  return {
    problem: problemWithMeta,
    solution,
    stepsVisiveis,
    exerciseSeed,
  };
}

function getLatestVersion(topicoId: TopicoId): number {
  const entry = getRegistryEntry(topicoId);
  return entry?.generator.version ?? 1;
}
