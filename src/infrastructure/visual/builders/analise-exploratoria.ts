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
import {
  media,
  quartis,
  scatterPointsForR,
} from "@/domains/analise-exploratoria/lib/stats";

function hashStr(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function freqTable(
  title: string,
  categorias: string[],
  frequencias: number[],
  ariaLabel: string,
): VisualSpec {
  const total = frequencias.reduce((a, b) => a + b, 0);
  return {
    kind: "data-table",
    title,
    headers: ["Categoria", "Frequência", "Freq. relativa (%)"],
    rows: categorias.map((c, i) => {
      const f = frequencias[i]!;
      const pct = total > 0 ? Math.round((f / total) * 1000) / 10 : 0;
      return [c, String(f), String(pct)];
    }),
    ariaLabel,
  };
}

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
      return buildTiposDadosFrequenciaVisuals(
        d as Extract<TiposDadosData, { tipo: "tipos-dados-frequencia" }>,
      );
    case "tipos-dados-media-escala":
      return [buildTiposDadosMediaEscalaVisual(d as Extract<TiposDadosData, { tipo: "tipos-dados-media-escala" }>)];
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
      return buildDistribuicoesHistogramaVisuals(
        d as Extract<DistribuicoesData, { tipo: "distribuicoes-histograma" }>,
      );
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
    kind: "data-table",
    title: `${d.variavel} — escala ${escalaLabels[d.escalaCorreta]}`,
    headers: ["Exemplo"],
    rows: d.exemplos.slice(0, 6).map((e) => [e]),
    ariaLabel: `Exemplos da variável ${d.variavel} na escala ${d.escalaCorreta}`,
  };
}

function buildTiposDadosMediaEscalaVisual(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-media-escala" }>,
): VisualSpec {
  const exemplos =
    d.escalaCorreta === "razao"
      ? ["120", "250", "480"]
      : ["18 °C", "22 °C", "26 °C"];
  const escala = d.escalaCorreta === "razao" ? "Razão" : "Intervalar";
  return {
    kind: "data-table",
    title: `${d.variavel} — escala ${escala}`,
    headers: ["Observação", "Valor"],
    rows: exemplos.map((v, i) => [`Amostra ${i + 1}`, v]),
    ariaLabel: `Valores de ${d.variavel} em escala ${escala}`,
  };
}

function sampleCategorica(variavel: string): { labels: string[]; values: number[] } {
  const h = hashStr(variavel);
  const labels = ["A", "B", "C", "D"];
  const values = labels.map((_, i) => 3 + ((h >> (i * 3)) % 8));
  return { labels, values };
}

function sampleDiscreta(variavel: string): { labels: string[]; values: number[] } {
  const h = hashStr(variavel);
  const labels = ["0", "1", "2", "3", "4"];
  return {
    labels,
    values: labels.map((_, i) => 1 + ((h >> i) % 6) + (i % 2)),
  };
}

function sampleTemporal(variavel: string): { points: { x: number; y: number }[] } {
  const h = hashStr(variavel);
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const points = months.map((_, i) => ({
    x: i + 1,
    y: 10 + ((h >> (i * 2)) % 15),
  }));
  return { points };
}

function sampleContinua(variavel: string): number[] {
  const h = hashStr(variavel);
  return Array.from({ length: 12 }, (_, i) => 20 + (h % 20) + i * 2 + (i % 3));
}

function buildTiposDadosGraficoVisual(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>,
): VisualSpec {
  switch (d.graficoCorreto) {
    case "histograma": {
      const { labels, values } = sampleDiscreta(d.variavel);
      return {
        kind: "bar-chart",
        title: `${d.variavel} — histograma`,
        labels,
        values,
        ariaLabel: `Histograma para ${d.variavel}`,
      };
    }
    case "linha": {
      const { points } = sampleTemporal(d.variavel);
      return {
        kind: "function-plot",
        title: `${d.variavel} — série temporal`,
        bounds: boundsFromPoints(points),
        curves: [{ points }],
        ariaLabel: `Gráfico de linhas para ${d.variavel}`,
      };
    }
    case "boxplot": {
      const vals = sampleContinua(d.variavel);
      const q = quartis(vals);
      return {
        kind: "box-plot",
        ...q,
        min: Math.min(...vals),
        max: Math.max(...vals),
        ariaLabel: `Boxplot para ${d.variavel}`,
      };
    }
    default: {
      const { labels, values } = sampleCategorica(d.variavel);
      return {
        kind: "bar-chart",
        title: `${d.variavel} — gráfico de barras`,
        labels,
        values,
        ariaLabel: `Gráfico de barras para ${d.variavel}`,
      };
    }
  }
}

function buildTiposDadosFrequenciaVisuals(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-frequencia" }>,
): VisualSpec[] {
  return [
    freqTable(
      "Tabela de frequências",
      d.categorias,
      d.frequencias,
      `Frequências: ${d.categorias.join(", ")}`,
    ),
    {
      kind: "bar-chart",
      title: "Gráfico de frequências",
      labels: d.categorias,
      values: d.frequencias,
      ariaLabel: `Barras das frequências por categoria`,
    },
  ];
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
  const iqr = d.q3 - d.q1;
  const min = d.q1 - iqr;
  const max = d.q3 + iqr;
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
  const min = Math.min(...d.valores);
  const max = Math.max(...d.valores);
  return {
    kind: "box-plot",
    ...q,
    min,
    max,
    ariaLabel: `Boxplot dos dados com quartis`,
  };
}

function buildDistribuicoesOutliersVisual(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-outliers" }>,
): VisualSpec {
  const q = quartis(d.valores);
  const min = Math.min(...d.valores);
  const max = Math.max(...d.valores);
  return {
    kind: "box-plot",
    ...q,
    min,
    max,
    ariaLabel: "Boxplot com possíveis outliers",
  };
}

function buildDistribuicoesHistogramaVisuals(
  d: Extract<DistribuicoesData, { tipo: "distribuicoes-histograma" }>,
): VisualSpec[] {
  return [
    freqTable(
      "Distribuição por classes",
      d.bins,
      d.frequencias,
      `Histograma com ${d.bins.length} classes`,
    ),
    {
      kind: "bar-chart",
      title: "Histograma",
      labels: d.bins,
      values: d.frequencias,
      ariaLabel: `Histograma com ${d.bins.length} classes`,
    },
  ];
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
    title: "Diagrama de dispersão",
    bounds,
    points,
    ariaLabel: `Diagrama de dispersão com ${points.length} pontos`,
  };
}

function buildCorrelacaoInterpretacaoVisual(
  d: Extract<CorrelacaoData, { tipo: "correlacao-interpretacao" }>,
): VisualSpec {
  const points = scatterPointsForR(d.r);
  return {
    kind: "scatter-plot",
    title: `Correlação r = ${d.r}`,
    bounds: boundsFromPoints(points),
    points,
    ariaLabel: `Dispersão com correlação aproximada r = ${d.r}`,
  };
}
