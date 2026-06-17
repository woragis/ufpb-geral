import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import {
  boundsFromPoints,
  mergeBounds,
  sampleRange,
} from "@/core/presentation/visual/plot-utils";
import type {
  AreaData,
  ContinuidadeData,
  DerivadasData,
  EdosData,
  IntegraisDefinidasData,
  IntegraisIndefinidasData,
  LimitesData,
  OtimizacaoData,
  RegraCadeiaData,
  SequenciasData,
  SeriesData,
  TaylorData,
} from "@/domains/calculo/entities/types";

export function buildCalculoVisuals(problem: Problem): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "limite-algebrico":
      return [buildLimitesVisual(d as LimitesData)];
    case "continuidade":
      return [buildContinuidadeVisual(d as ContinuidadeData)];
    case "derivadas":
      return [buildDerivadasVisual(d as DerivadasData)];
    case "otimizacao":
      return [buildOtimizacaoVisual(d as OtimizacaoData)];
    case "integrais-definidas":
      return [buildIntegralDefinidaVisual(d as IntegraisDefinidasData)];
    case "area":
      return [buildAreaVisual(d as AreaData)];
    case "edos":
      return [buildEdosVisual(d as EdosData)];
    case "regra-cadeia":
      return [buildRegraCadeiaVisual(d as RegraCadeiaData)];
    case "integrais-indefinidas":
      return [buildIntegralIndefinidaVisual(d as IntegraisIndefinidasData)];
    case "sequencias":
      return [buildSequenciasVisual(d as SequenciasData)];
    case "series":
      return [buildSeriesVisual(d as SeriesData)];
    case "taylor":
      return [buildTaylorVisual(d as TaylorData)];
    default:
      return [];
  }
}

function buildLimitesVisual(d: LimitesData): VisualSpec {
  const fn = (x: number) =>
    (d.coeficiente * x * x - d.constante) / (x - d.a);
  const left = sampleRange(fn, d.a - 3, d.a - 0.15, 60);
  const right = sampleRange(fn, d.a + 0.15, d.a + 3, 60);
  const bounds = mergeBounds(
    boundsFromPoints(left),
    boundsFromPoints(right),
  );
  const yHole = 2 * d.coeficiente * d.a;
  return {
    kind: "function-plot",
    title: `f(x) = (${d.coeficiente}x² − ${d.constante})/(x − ${d.a})`,
    bounds,
    curves: [
      { points: left, color: "#2563eb" },
      { points: right, color: "#2563eb" },
    ],
    markers: [
      { x: d.a, y: yHole, label: `x=${d.a}`, style: "hole" },
    ],
    ariaLabel: `Gráfico da função racional com descontinuidade removível em x=${d.a}`,
  };
}

function buildContinuidadeVisual(d: ContinuidadeData): VisualSpec {
  const left = sampleRange(
    (x) => d.m1 * x + d.b1,
    d.a - 3,
    d.a - 0.01,
    40,
  );
  const right = sampleRange(
    (x) => d.m2 * x + d.b2,
    d.a,
    d.a + 3,
    40,
  );
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  return {
    kind: "piecewise-plot",
    title: "Função por partes",
    bounds,
    segments: [
      { points: left, label: `x < ${d.a}` },
      { points: right, label: `x ≥ ${d.a}` },
    ],
    breakpointX: d.a,
    markers: [
      {
        x: d.a,
        y: d.m2 * d.a + d.b2,
        label: `x=${d.a}`,
        style: "point",
      },
    ],
    ariaLabel: `Função por partes com junção em x=${d.a}`,
  };
}

function buildDerivadasVisual(d: DerivadasData): VisualSpec {
  const fn = (x: number) =>
    d.coeficientes.reduce(
      (acc, c, i) => acc + c * Math.pow(x, d.expoentes[i]!),
      0,
    );
  const points = sampleRange(fn, d.x0 - 3, d.x0 + 3);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: "f(x)",
    bounds,
    curves: [{ points, color: "#2563eb" }],
    markers: [{ x: d.x0, y: fn(d.x0), label: `x₀=${d.x0}`, style: "point" }],
    ariaLabel: `Gráfico de f(x) com ponto em x=${d.x0}`,
  };
}

function buildOtimizacaoVisual(d: OtimizacaoData): VisualSpec {
  const fn = (x: number) => d.a * x * x + d.b * x + d.c;
  const xv = -d.b / (2 * d.a);
  const points = sampleRange(fn, xv - 4, xv + 4);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `f(x) = ${d.a}x² + ${d.b}x + ${d.c}`,
    bounds,
    curves: [{ points, color: "#2563eb" }],
    markers: [
      { x: xv, y: fn(xv), label: "vértice", style: "vertex" },
    ],
    ariaLabel: `Parábola com vértice em x=${xv.toFixed(2)}`,
  };
}

function buildIntegralDefinidaVisual(d: IntegraisDefinidasData): VisualSpec {
  const fn = (x: number) => d.c * x + d.d;
  const curve = sampleRange(fn, d.a, d.b);
  const bounds = boundsFromPoints(curve);
  return {
    kind: "area-plot",
    title: `∫[${d.a}, ${d.b}] (${d.c}x + ${d.d}) dx`,
    bounds,
    curve,
    fillFromY: 0,
    ariaLabel: `Área sob a reta entre x=${d.a} e x=${d.b}`,
  };
}

function buildAreaVisual(d: AreaData): VisualSpec {
  const fn = (x: number) => d.m * x + d.b;
  const curve = sampleRange(fn, d.a, d.c);
  const bounds = boundsFromPoints(curve);
  return {
    kind: "area-plot",
    title: `Área sob f(x) = ${d.m}x + ${d.b}`,
    bounds,
    curve,
    fillFromY: 0,
    ariaLabel: `Área entre x=${d.a} e x=${d.c}`,
  };
}

function buildEdosVisual(d: EdosData): VisualSpec {
  const fn = (x: number) => d.y0 * Math.exp(d.k * x);
  const points = sampleRange(fn, 0, Math.max(d.x + 1, 3));
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `y(x) = ${d.y0}e^(${d.k}x)`,
    bounds,
    curves: [{ points, color: "#16a34a" }],
    markers: [
      { x: d.x, y: fn(d.x), label: `x=${d.x}`, style: "point" },
    ],
    ariaLabel: `Solução exponencial da EDO em x=${d.x}`,
  };
}

function buildRegraCadeiaVisual(d: RegraCadeiaData): VisualSpec {
  const fn = (x: number) => Math.pow(d.a * x + d.b, d.n);
  const points = sampleRange(fn, d.x0 - 3, d.x0 + 3);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `h(x) = (${d.a}x + ${d.b})^${d.n}`,
    bounds,
    curves: [{ points, color: "#7c3aed" }],
    markers: [{ x: d.x0, y: fn(d.x0), label: `x₀=${d.x0}`, style: "point" }],
    ariaLabel: `Gráfico de h(x) com ponto em x=${d.x0}`,
  };
}

function buildIntegralIndefinidaVisual(d: IntegraisIndefinidasData): VisualSpec {
  const fn = (x: number) => Math.pow(x, d.n);
  const points = sampleRange(fn, 0.5, 4);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `f(x) = x^${d.n}`,
    bounds,
    curves: [{ points, color: "#2563eb" }],
    ariaLabel: `Gráfico de x elevado a ${d.n}`,
  };
}

function buildSequenciasVisual(d: SequenciasData): VisualSpec {
  const terms = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    const num = (d.numeradorCoef * n + d.numeradorConst) / (d.denominadorCoef * n + d.denominadorConst);
    return { label: `a${n}`, value: Math.round(num * 100) / 100 };
  });
  return {
    kind: "bar-chart",
    title: "Primeiros termos da sequência",
    labels: terms.map((t) => t.label),
    values: terms.map((t) => t.value),
    ariaLabel: "Barras com os primeiros termos da sequência",
  };
}

function buildSeriesVisual(d: SeriesData): VisualSpec {
  const count = Math.abs(d.r) < 1 ? 6 : Math.min(d.n, 6);
  const terms = Array.from({ length: count }, (_, i) => d.a1 * Math.pow(d.r, i));
  return {
    kind: "bar-chart",
    title: Math.abs(d.r) < 1 ? "Termos da série geométrica" : `Termos até n=${d.n}`,
    labels: terms.map((_, i) => `a${i + 1}`),
    values: terms.map((v) => Math.round(v * 100) / 100),
    ariaLabel: "Barras com termos da série geométrica",
  };
}

function buildTaylorVisual(d: TaylorData): VisualSpec {
  const f =
    d.funcao === "exponencial"
      ? (x: number) => Math.exp(x)
      : (x: number) => Math.sin(x);
  const taylor =
    d.funcao === "exponencial"
      ? d.grau === 1
        ? (x: number) => 1 + x
        : (x: number) => 1 + x + (x * x) / 2
      : d.grau === 1
        ? (x: number) => x
        : (x: number) => x - (x * x * x) / 6;
  const left = d.x0 - 2;
  const right = d.x0 + 2;
  const fPoints = sampleRange(f, left, right);
  const pPoints = sampleRange(taylor, left, right);
  const bounds = mergeBounds(boundsFromPoints(fPoints), boundsFromPoints(pPoints));
  return {
    kind: "function-plot",
    title: d.funcao === "exponencial" ? "eˣ e aproximação de Taylor" : "sen(x) e aproximação de Taylor",
    bounds,
    curves: [
      { points: fPoints, color: "#2563eb" },
      { points: pPoints, color: "#dc2626", dashed: true },
    ],
    markers: [{ x: d.x0, y: f(d.x0), label: `x₀=${d.x0}`, style: "point" }],
    ariaLabel: `Comparação entre função e polinômio de Taylor grau ${d.grau}`,
  };
}
