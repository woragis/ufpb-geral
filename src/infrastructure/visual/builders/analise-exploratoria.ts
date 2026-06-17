import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import { boundsFromPoints } from "@/core/presentation/visual/plot-utils";
import type {
  CorrelacaoData,
  DistribuicoesData,
  MedidasDispersaoData,
  MedidasTendenciaData,
  TiposDadosData,
} from "@/domains/analise-exploratoria/entities/types";
import { media, quartis } from "@/domains/analise-exploratoria/lib/stats";

export function buildAnaliseExploratoriaVisuals(
  problem: Problem,
): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "tipos-dados":
      return [buildTiposDadosEscalaVisual(d as Extract<TiposDadosData, { tipo: "tipos-dados" }>)];
    case "tipos-dados-grafico":
      return [buildTiposDadosGraficoVisual(d as Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>)];
    case "media-aritmetica":
    case "medidas-tendencia-mediana":
    case "medidas-tendencia-moda":
    case "medidas-tendencia-ponderada":
      return [buildMedidasTendenciaVisual(d as MedidasTendenciaData)];
    case "medidas-dispersao":
    case "medidas-dispersao-cv":
      return [buildMedidasDispersaoVisual(d as MedidasDispersaoData)];
    case "distribuicoes":
    case "distribuicoes-ler-boxplot":
      return [buildDistribuicoesBoxVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes" | "distribuicoes-ler-boxplot" }>)];
    case "distribuicoes-quartis":
      return [buildDistribuicoesQuartisVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>)];
    case "distribuicoes-outliers":
      return [buildDistribuicoesOutliersVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>)];
    case "correlacao":
    case "correlacao-negativa":
    case "correlacao-fraca":
      return [buildCorrelacaoVisual(d as CorrelacaoData)];
    default:
      return [];
  }
}

function buildTiposDadosEscalaVisual(
  d: Extract<TiposDadosData, { tipo: "tipos-dados" }>,
): VisualSpec {
  const escalaLabels: Record<typeof d.escalaCorreta, string> = {
    nominal: "Nominal",
    ordinal: "Ordinal",
    intervalar: "Intervalar",
    razao: "Razão",
  };
  return {
    kind: "bar-chart",
    title: `${d.variavel} — escala ${escalaLabels[d.escalaCorreta]}`,
    labels: d.exemplos.slice(0, 6),
    values: d.exemplos.slice(0, 6).map(() => 1),
    ariaLabel: `Exemplos da variável ${d.variavel} na escala ${d.escalaCorreta}`,
  };
}

function buildTiposDadosGraficoVisual(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>,
): VisualSpec {
  return {
    kind: "bar-chart",
    title: `${d.variavel} — gráfico sugerido: ${d.graficoCorreto}`,
    labels: ["A", "B", "C"],
    values: [3, 5, 2],
    ariaLabel: `Ilustração para variável ${d.variavel}`,
  };
}

function buildMedidasTendenciaVisual(d: MedidasTendenciaData): VisualSpec {
  const valores =
    d.tipo === "medidas-tendencia-ponderada" ? d.valores : d.valores;
  const m = media(valores);
  return {
    kind: "bar-chart",
    title: "Valores do conjunto",
    labels: valores.map((_, i) => `x${i + 1}`),
    values: valores,
    referenceLine: m,
    ariaLabel: `Gráfico de barras com ${valores.length} valores`,
  };
}

function buildMedidasDispersaoVisual(d: MedidasDispersaoData): VisualSpec {
  const valores = d.valores;
  const m = media(valores);
  return {
    kind: "bar-chart",
    title: "Dispersão dos dados",
    labels: valores.map((_, i) => `${i + 1}`),
    values: valores,
    referenceLine: m,
    ariaLabel: `Barras dos dados com média em ${m.toFixed(2)}`,
  };
}

function buildDistribuicoesBoxVisual(d: {
  q1: number;
  q2: number;
  q3: number;
}): VisualSpec {
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

function buildDistribuicoesQuartisVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>,
): VisualSpec {
  const q = quartis(d.valores);
  return buildDistribuicoesBoxVisual(q);
}

function buildDistribuicoesOutliersVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>,
): VisualSpec {
  const q = quartis(d.valores);
  return {
    ...buildDistribuicoesBoxVisual(q),
    ariaLabel: "Boxplot com possíveis outliers",
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
