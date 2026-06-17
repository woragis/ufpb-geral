import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "./types";
import { buildCalculoVisuals } from "@/infrastructure/visual/builders/calculo";
import { buildPreCalculoVisuals } from "@/infrastructure/visual/builders/pre-calculo";
import { buildCalculoVetorialVisuals } from "@/infrastructure/visual/builders/calculo-vetorial";
import { buildAnaliseExploratoriaVisuals } from "@/infrastructure/visual/builders/analise-exploratoria";
import { buildProbabilidadeVisuals } from "@/infrastructure/visual/builders/probabilidade";

export function resolveVisualSpecs(problem: Problem): VisualSpec[] {
  const builders = [
    buildCalculoVisuals,
    buildPreCalculoVisuals,
    buildCalculoVetorialVisuals,
    buildAnaliseExploratoriaVisuals,
    buildProbabilidadeVisuals,
  ];

  for (const build of builders) {
    const specs = build(problem);
    if (specs.length > 0) return specs;
  }

  return [];
}
