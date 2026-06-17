"use client";

import { MathContent } from "@/app/components/math/MathContent";
import { ExerciseFigures } from "@/app/components/figures/ExerciseFigures";
import type { Problem, Step } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";

interface ExerciseViewProps {
  problem: Problem;
  stepsVisiveis: Step[];
  visualSpecs: VisualSpec[];
}

export function ExerciseView({
  problem,
  stepsVisiveis,
  visualSpecs,
}: ExerciseViewProps) {
  return (
    <>
      <div className="mt-4 text-fg">
        <h2 className="font-semibold mb-2">Enunciado</h2>
        <div className="text-fg-muted">
          <MathContent display latex={problem.enunciadoLatex}>
            {problem.enunciado}
          </MathContent>
        </div>
      </div>

      <ExerciseFigures specs={visualSpecs} />

      <div className="mt-6 space-y-4">
        {stepsVisiveis.map((step) => (
          <div
            key={step.ordem}
            className="rounded-lg border border-border bg-surface-elevated p-4"
          >
            <div className="font-semibold text-fg">
              Passo {step.ordem}: {step.titulo}
            </div>
            <div className="mt-2 text-fg-muted">
              {step.explicacaoLatex ? (
                <MathContent latex={step.explicacaoLatex}>
                  {step.explicacao}
                </MathContent>
              ) : (
                step.explicacao
              )}
            </div>
            {step.calculo || step.calculoLatex ? (
              <div className="mt-3">
                <div className="text-sm font-semibold text-fg">Cálculo</div>
                <div className="mt-1 math-content-display text-fg-muted">
                  <MathContent display latex={step.calculoLatex}>
                    {step.calculo ?? ""}
                  </MathContent>
                </div>
              </div>
            ) : null}
            {step.resultado || step.resultadoLatex ? (
              <div className="mt-3">
                <div className="text-sm font-semibold text-fg">Resultado</div>
                <div className="mt-1 rounded border border-border bg-surface px-3 py-2 text-fg">
                  <MathContent latex={step.resultadoLatex}>
                    {step.resultado ?? ""}
                  </MathContent>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
