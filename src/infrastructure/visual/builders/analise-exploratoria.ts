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
    case "tipos-dados-frequencia":
      return [buildTiposDadosFrequenciaVisual(d as Extract<TiposDadosData, { tipo: "tipos-dados-frequencia" }>)];
    case "tipos-dados-media-escala": {
      const x = d as Extract<TiposDadosData, { tipo: "tipos-dados-media-escala" }>;
      return [buildTiposDadosEscalaVisual({
        tipo: "tipos-dados",
        variavel: x.variavel,
        exemplos: ["amostra 1", "amostra 2", "amostra 3"],
        escalaCorreta: x.escalaCorreta,
      })];
    }
    case "media-aritmetica":
    case "medidas-tendencia-mediana":
    case "medidas-tendencia-moda":
    case "medidas-tendencia-ponderada":
    case "medidas-tendencia-escolha":
    case "medidas-tendencia-geometrica":
      return [buildMedidasTendenciaVisual(d as MedidasTendenciaData)];
    case "medidas-dispersao":
    case "medidas-dispersao-cv":
    case "medidas-dispersao-populacional":
    case "medidas-dispersao-mad":
      return [buildMedidasDispersaoVisual(d as MedidasDispersaoData)];
    case "distribuicoes":
    case "distribuicoes-ler-boxplot":
      return [buildDistribuicoesBoxVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes" | "distribuicoes-ler-boxplot" }>)];
    case "distribuicoes-quartis":
      return [buildDistribuicoesQuartisVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-quartis" }>)];
    case "distribuicoes-outliers":
      return [buildDistribuicoesOutliersVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>)];
    case "distribuicoes-histograma":
      return [buildDistribuicoesHistogramaVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-histograma" }>)];
    case "distribuicoes-assimetria":
      return [buildDistribuicoesAssimetriaVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-assimetria" }>)];
    case "distribuicoes-cinco-numeros":
      return [buildDistribuicoesCincoNumerosVisual(d as Extract<DistribuicoesData, { tipo: "distribuicoes-cinco-numeros" }>)];
    case "correlacao":
    case "correlacao-negativa":
    case "correlacao-fraca":
    case "correlacao-spearman":
    case "correlacao-covariancia":
      return [buildCorrelacaoVisual(d as Extract<CorrelacaoData, { tipo: "correlacao" | "correlacao-negativa" | "correlacao-fraca" | "correlacao-spearman" | "correlacao-covariancia" }>)];
    case "correlacao-interpretacao":
      return [buildCorrelacaoInterpretacaoVisual(d as Extract<CorrelacaoData, { tipo: "correlacao-interpretacao" }>)];
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
  const labels = ["A", "B", "C", "D"];
  const values = [4, 7, 3, 5];

  switch (d.graficoCorreto) {
    case "histograma":
      return {
        kind: "bar-chart",
        title: `${d.variavel} — histograma`,
        labels: ["1–2", "2–3", "3–4", "4–5"],
        values: [2, 5, 8, 3],
        ariaLabel: `Histograma ilustrativo para ${d.variavel}`,
      };
    case "linha": {
      const points = labels.map((_, i) => ({ x: i + 1, y: values[i]! }));
      return {
        kind: "function-plot",
        title: `${d.variavel} — série temporal`,
        bounds: boundsFromPoints(points),
        curves: [{ points }],
        ariaLabel: `Gráfico de linhas para ${d.variavel}`,
      };
    }
    case "boxplot": {
      const sorted = [...values].sort((a, b) => a - b);
      const q = quartis(sorted);
      return {
        kind: "box-plot",
        ...q,
        min: Math.min(...sorted),
        max: Math.max(...sorted),
        ariaLabel: `Boxplot ilustrativo para ${d.variavel}`,
      };
    }
    default:
      return {
        kind: "bar-chart",
        title: `${d.variavel} — gráfico de barras`,
        labels,
        values,
        ariaLabel: `Gráfico de barras para ${d.variavel}`,
      };
  }
}

function buildTiposDadosFrequenciaVisual(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-frequencia" }>,
): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Tabela de frequências",
    labels: d.categorias,
    values: d.frequencias,
    ariaLabel: `Frequências por categoria: ${d.categorias.join(", ")}`,
  };
}

function buildMedidasTendenciaVisual(d: MedidasTendenciaData): VisualSpec {
  const valores = d.valores;
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

function buildDistribuicoesHistogramaVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-histograma" }>,
): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Histograma",
    labels: d.bins,
    values: d.frequencias,
    ariaLabel: `Histograma com ${d.bins.length} classes`,
  };
}

function buildDistribuicoesAssimetriaVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-assimetria" }>,
): VisualSpec {
  const m = media(d.valores);
  return {
    kind: "bar-chart",
    title: `Forma da distribuição (${d.assimetria})`,
    labels: d.valores.map((_, i) => `${i + 1}`),
    values: d.valores,
    referenceLine: m,
    ariaLabel: `Distribuição ${d.assimetria}`,
  };
}

function buildDistribuicoesCincoNumerosVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-cinco-numeros" }>,
): VisualSpec {
  const q = quartis(d.valores);
  const min = Math.min(...d.valores);
  const max = Math.max(...d.valores);
  return {
    kind: "box-plot",
    ...q,
    min,
    max,
    ariaLabel: "Resumo dos cinco números (mín, Q1, mediana, Q3, máx)",
  };
}

function buildCorrelacaoVisual(d: {
  xs: number[];
  ys: number[];
}): VisualSpec {
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

function buildCorrelacaoInterpretacaoVisual(
  d: Extract<CorrelacaoData, { tipo: "correlacao-interpretacao" }>,
): VisualSpec {
  const n = 8;
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const slope = d.r >= 0 ? 1 : -1;
  const ys = xs.map((x) => slope * x * Math.abs(d.r) + (1 - Math.abs(d.r)) * 3);
  const points = xs.map((x, i) => ({ x, y: ys[i]! }));
  return {
    kind: "scatter-plot",
    title: `Correlação r = ${d.r}`,
    bounds: boundsFromPoints(points),
    points,
    ariaLabel: `Dispersão ilustrativa com r = ${d.r}`,
  };
}
