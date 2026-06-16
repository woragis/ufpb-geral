"use client";

import { MathContent } from "@/app/components/math/MathContent";
import { ExerciseFigures } from "@/app/components/figures/ExerciseFigures";
import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";

interface ExerciseViewProps {
  problem: Problem;
  solution: Solution;
  stepsVisiveis: Step[];
  visualSpecs: VisualSpec[];
  hasNext: boolean;
  nextUrl: string;
  basePath: string;
  respostaFinal: string;
}

export function ExerciseView({
  problem,
  stepsVisiveis,
  visualSpecs,
}: Pick<ExerciseViewProps, "problem" | "stepsVisiveis" | "visualSpecs">) {
  return (
    <>
      <div className="mt-4 text-zinc-900 dark:text-zinc-50">
        <h2 className="font-semibold mb-2">Enunciado</h2>
        <div className="text-zinc-800 dark:text-zinc-200">
          <MathContent display>{problem.enunciado}</MathContent>
        </div>
      </div>

      <ExerciseFigures specs={visualSpecs} />

      <div className="mt-6 space-y-4">
        {stepsVisiveis.map((step) => (
          <div
            key={step.ordem}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="font-semibold text-zinc-900 dark:text-zinc-50">
              Passo {step.ordem}: {step.titulo}
            </div>
            <div className="mt-2 text-zinc-700 dark:text-zinc-300">
              {step.explicacao}
            </div>
            {step.calculo ? (
              <div className="mt-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Cálculo
                </div>
                <div className="mt-1 math-content-display text-zinc-800 dark:text-zinc-200">
                  <MathContent display>{step.calculo}</MathContent>
                </div>
              </div>
            ) : null}
            {step.resultado ? (
              <div className="mt-3">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Resultado
                </div>
                <div className="mt-1 rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
                  <MathContent>{step.resultado}</MathContent>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
