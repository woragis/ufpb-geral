import type { Dificuldade, TopicoId } from "@/core/domain/ids";
import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { ExerciseSeed } from "@/core/domain/seed";
import { enrichProblem, enrichSolution } from "@/infrastructure/latex/enrich";
import { getRegistryEntry } from "@/infrastructure/registry/problem-registry";
import { stableProblemId } from "./hash";
import type { GenerateAndSolveOutput } from "./generate-and-solve";

export interface SolveFromDadosInput {
  topicoId: TopicoId;
  disciplinaId: Problem["disciplinaId"];
  dificuldade: Dificuldade;
  dados: unknown;
  generatorVersion?: number;
  seed?: string;
  revealSteps?: number;
}

export function solveFromDados(input: SolveFromDadosInput): GenerateAndSolveOutput {
  const version =
    input.generatorVersion ?? getRegistryEntry(input.topicoId)?.generator.version ?? 1;
  const entry = getRegistryEntry(input.topicoId, version);
  if (!entry) {
    throw new Error(`Tópico não implementado: ${input.topicoId}`);
  }

  const seed =
    input.seed ??
    `import-${stableProblemId(`${input.topicoId}|${JSON.stringify(input.dados)}`)}`;

  const exerciseSeed: ExerciseSeed = {
    topicoId: input.topicoId,
    dificuldade: input.dificuldade,
    seed,
    generatorVersion: version,
  };

  const seedKey = `${exerciseSeed.topicoId}|${exerciseSeed.dificuldade}|${exerciseSeed.seed}|v${exerciseSeed.generatorVersion}`;

  const base: Problem = {
    id: stableProblemId(seedKey),
    disciplinaId: input.disciplinaId,
    topicoId: input.topicoId,
    enunciado: "Exercício importado",
    dados: input.dados,
    dificuldade: input.dificuldade,
    seed: exerciseSeed,
    geradoEm: new Date().toISOString(),
  };

  let problem = enrichProblem(base);
  if (problem.enunciadoLatex && problem.enunciado === "Exercício importado") {
    problem = {
      ...problem,
      enunciado: problem.enunciadoLatex.replace(/\\text\{([^}]+)\}/g, "$1"),
    };
  }

  const solution = enrichSolution(problem, entry.solver.resolver(problem));
  const revealSteps = input.revealSteps ?? 0;
  const stepsVisiveis: Step[] = solution.steps.slice(0, revealSteps);

  return { problem, solution, stepsVisiveis, exerciseSeed };
}
