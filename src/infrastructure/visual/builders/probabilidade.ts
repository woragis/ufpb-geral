import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import type {
  EventosData,
  ProbabilidadeClassicaData,
} from "@/domains/probabilidade/entities/types";

export function buildProbabilidadeVisuals(problem: Problem): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "eventos":
      return [buildEventosVisual(d as EventosData)];
    case "probabilidade-classica":
      return [buildClassicaVisual(d as ProbabilidadeClassicaData)];
    default:
      return [];
  }
}

function buildEventosVisual(d: EventosData): VisualSpec {
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: `Diagrama de Venn: |A|=${d.nA}, |B|=${d.nB}, |A∩B|=${d.nAinterB}`,
  };
}

function buildClassicaVisual(d: ProbabilidadeClassicaData): VisualSpec {
  return {
    kind: "urn-diagram",
    colors: d.cores,
    targetColor: d.corAlvo,
    ariaLabel: `Urna com bolas e evento cor ${d.corAlvo}`,
  };
}
