import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import { boundsFromPoints } from "@/core/presentation/visual/plot-utils";
import type {
  CorrelacaoData,
  DistribuicoesData,
  MedidasDispersaoData,
  MedidasTendenciaData,
} from "@/domains/analise-exploratoria/entities/types";

export function buildAnaliseExploratoriaVisuals(
  problem: Problem,
): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "media-aritmetica":
      return [buildMedidasTendenciaVisual(d as MedidasTendenciaData)];
    case "medidas-dispersao":
      return [buildMedidasDispersaoVisual(d as MedidasDispersaoData)];
    case "distribuicoes":
      return [buildDistribuicoesVisual(d as DistribuicoesData)];
    case "correlacao":
      return [buildCorrelacaoVisual(d as CorrelacaoData)];
    default:
      return [];
  }
}

function buildMedidasTendenciaVisual(d: MedidasTendenciaData): VisualSpec {
  const media =
    d.valores.reduce((a, b) => a + b, 0) / d.valores.length;
  return {
    kind: "bar-chart",
    title: "Valores do conjunto",
    labels: d.valores.map((_, i) => `x${i + 1}`),
    values: d.valores,
    referenceLine: media,
    ariaLabel: `Gráfico de barras com ${d.valores.length} valores`,
  };
}

function buildMedidasDispersaoVisual(d: MedidasDispersaoData): VisualSpec {
  const media =
    d.valores.reduce((a, b) => a + b, 0) / d.valores.length;
  return {
    kind: "bar-chart",
    title: "Dispersão dos dados",
    labels: d.valores.map((_, i) => `${i + 1}`),
    values: d.valores,
    referenceLine: media,
    ariaLabel: `Barras dos dados com média em ${media.toFixed(2)}`,
  };
}

function buildDistribuicoesVisual(d: DistribuicoesData): VisualSpec {
  const min = d.q1 - (d.q3 - d.q1);
  const max = d.q3 + (d.q3 - d.q1);
  return {
    kind: "box-plot",
    q1: d.q1,
    q2: d.q2,
    q3: d.q3,
    min,
    max,
    ariaLabel: `Boxplot com Q1=${d.q1}, mediana=${d.q2}, Q3=${d.q3}`,
  };
}

function buildCorrelacaoVisual(d: CorrelacaoData): VisualSpec {
  const points = d.xs.map((x, i) => ({ x, y: d.ys[i]! }));
  const bounds = boundsFromPoints(points);
  return {
    kind: "scatter-plot",
    title: "Correlação",
    bounds,
    points,
    ariaLabel: `Diagrama de dispersão com ${points.length} pontos`,
  };
}
