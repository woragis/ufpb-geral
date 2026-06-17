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
      return [buildLimitesAlgebricoVisual(d as Extract<LimitesData, { tipo: "limite-algebrico" }>)];
    case "limite-racional": {
      const rd = d as Extract<LimitesData, { tipo: "limite-racional" }>;
      return [buildLimitesRacionalVisual(rd)];
    }
    case "limite-trig":
      return [buildLimitesTrigVisual(d as Extract<LimitesData, { tipo: "limite-trig" }>)];
    case "limite-exp-log":
      return [buildLimitesExpLogVisual(d as Extract<LimitesData, { tipo: "limite-exp-log" }>)];
    case "limite-lhopital":
      return [buildLimitesLhopitalVisual(d as Extract<LimitesData, { tipo: "limite-lhopital" }>)];
    case "limite-radical":
      return [buildLimitesRadicalVisual(d as Extract<LimitesData, { tipo: "limite-radical" }>)];
    case "limite-infinito":
      return [buildLimitesInfinitoVisual(d as Extract<LimitesData, { tipo: "limite-infinito" }>)];
    case "limite-infinito-neg":
      return [buildLimitesInfinitoNegVisual(d as Extract<LimitesData, { tipo: "limite-infinito-neg" }>)];
    case "limite-substituicao":
      return [buildLimitesSubstituicaoVisual(d as Extract<LimitesData, { tipo: "limite-substituicao" }>)];
    case "continuidade-afim":
      return [buildContinuidadeAfimVisual(d as Extract<ContinuidadeData, { tipo: "continuidade-afim" }>)];
    case "derivadas-polinomio":
      return [buildDerivadasPolinomioVisual(d as Extract<DerivadasData, { tipo: "derivadas-polinomio" }>)];
    case "derivadas-trig":
      return [buildDerivadasTrigVisual(d as Extract<DerivadasData, { tipo: "derivadas-trig" }>)];
    case "otimizacao-parabola":
      return [buildOtimizacaoParabolaVisual(d as Extract<OtimizacaoData, { tipo: "otimizacao-parabola" }>)];
    case "otimizacao-geometrica": {
      const od = d as Extract<OtimizacaoData, { tipo: "otimizacao-geometrica" }>;
      return [buildOtimizacaoGeometricaVisual(od)];
    }
    case "regra-cadeia-potencia":
      return [buildRegraCadeiaPotenciaVisual(d as Extract<RegraCadeiaData, { tipo: "regra-cadeia-potencia" }>)];
    case "integrais-definidas":
      return [buildIntegralDefinidaVisual(d as IntegraisDefinidasData)];
    case "area":
      return [buildAreaVisual(d as AreaData)];
    case "edos":
      return [buildEdosVisual(d as EdosData)];
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

function buildLimitHoleVisual(
  fn: (x: number) => number,
  title: string,
  x0: number,
  yLimit: number,
  span = 2,
): VisualSpec {
  const eps = 0.06;
  const left = sampleRange(fn, x0 - span, x0 - eps, 80);
  const right = sampleRange(fn, x0 + eps, x0 + span, 80);
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  return {
    kind: "function-plot",
    title,
    bounds,
    curves: [
      { points: left, color: "#2563eb" },
      { points: right, color: "#2563eb" },
    ],
    markers: [{ x: x0, y: yLimit, label: `L=${yLimit}`, style: "hole" }],
    ariaLabel: `Gráfico com limite ${yLimit} em x=${x0}`,
  };
}

function buildLimitesTrigVisual(
  d: Extract<LimitesData, { tipo: "limite-trig" }>,
): VisualSpec {
  switch (d.variante) {
    case "sin-x":
      return buildLimitHoleVisual(
        (x) => (x === 0 ? 1 : Math.sin(x) / x),
        "f(x) = sin(x)/x",
        0,
        1,
      );
    case "sin-ax": {
      const b = d.b ?? 1;
      const ratio = d.a / b;
      return buildLimitHoleVisual(
        (x) => (x === 0 ? ratio : Math.sin(d.a * x) / (b * x)),
        `f(x) = sin(${d.a}x)/(${b}x)`,
        0,
        ratio,
      );
    }
    case "tan-x":
      return buildLimitHoleVisual(
        (x) => (x === 0 ? 1 : Math.tan(x) / x),
        "f(x) = tan(x)/x",
        0,
        1,
        1.2,
      );
    case "um-menos-cos":
      return buildLimitHoleVisual(
        (x) => (x === 0 ? 0.5 : (1 - Math.cos(x)) / (x * x)),
        "f(x) = (1 − cos(x))/x²",
        0,
        0.5,
      );
  }
}

function buildLimitesExpLogVisual(
  d: Extract<LimitesData, { tipo: "limite-exp-log" }>,
): VisualSpec {
  if (d.variante === "exp-x") {
    return buildLimitHoleVisual(
      (x) => (x === 0 ? 1 : (Math.exp(x) - 1) / x),
      "f(x) = (eˣ − 1)/x",
      0,
      1,
    );
  }
  return buildLimitHoleVisual(
    (x) => (x === 0 ? 1 : Math.log(1 + x) / x),
    "f(x) = ln(1 + x)/x",
    0,
    1,
  );
}

function buildLimitesLhopitalVisual(
  d: Extract<LimitesData, { tipo: "limite-lhopital" }>,
): VisualSpec {
  if (d.variante === "exp-menos-x") {
    return buildLimitHoleVisual(
      (x) => (x === 0 ? 0.5 : (Math.exp(x) - 1 - x) / (x * x)),
      "f(x) = (eˣ − 1 − x)/x²",
      0,
      0.5,
      1.5,
    );
  }
  return buildLimitHoleVisual(
    (x) => (x === 0 ? -1 / 6 : (Math.sin(x) - x) / (x * x * x)),
    "f(x) = (sin(x) − x)/x³",
    0,
    -1 / 6,
    1.2,
  );
}

function buildLimitesRadicalVisual(
  d: Extract<LimitesData, { tipo: "limite-radical" }>,
): VisualSpec {
  const limitY = 1 / (2 * Math.sqrt(d.k));
  return buildLimitHoleVisual(
    (x) =>
      x === 0
        ? limitY
        : (Math.sqrt(x + d.k) - Math.sqrt(d.k)) / x,
    `f(x) = (√(x+${d.k}) − √${d.k})/x`,
    0,
    Math.round(limitY * 1000) / 1000,
  );
}

function buildLimitesInfinitoVisual(
  d: Extract<LimitesData, { tipo: "limite-infinito" }>,
): VisualSpec {
  const fn = (x: number) =>
    (d.numA * x * x + d.numB) / (d.denA * x * x + d.denB);
  const asymptote = d.numA / d.denA;
  const points = sampleRange(fn, 1, 12, 100);
  const bounds = mergeBounds(boundsFromPoints(points), {
    xMin: 0,
    xMax: 12,
    yMin: asymptote - 2,
    yMax: asymptote + 2,
  });
  const asymptoteLine = [
    { x: 1, y: asymptote },
    { x: 12, y: asymptote },
  ];
  return {
    kind: "function-plot",
    title: `f(x) → ${asymptote} quando x → ∞`,
    bounds,
    curves: [
      { points, color: "#2563eb" },
      { points: asymptoteLine, color: "#dc2626", dashed: true },
    ],
    ariaLabel: `Função racional com assíntota horizontal y=${asymptote}`,
  };
}

function buildLimitesInfinitoNegVisual(
  d: Extract<LimitesData, { tipo: "limite-infinito-neg" }>,
): VisualSpec {
  const fn = (x: number) =>
    (d.numA * x * x + d.numB) / (d.denA * x * x + d.denB);
  const asymptote = d.numA / d.denA;
  const points = sampleRange(fn, -12, -1, 100);
  const bounds = mergeBounds(boundsFromPoints(points), {
    xMin: -12,
    xMax: 0,
    yMin: asymptote - 2,
    yMax: asymptote + 2,
  });
  const asymptoteLine = [
    { x: -12, y: asymptote },
    { x: -1, y: asymptote },
  ];
  return {
    kind: "function-plot",
    title: `f(x) → ${asymptote} quando x → −∞`,
    bounds,
    curves: [
      { points, color: "#2563eb" },
      { points: asymptoteLine, color: "#dc2626", dashed: true },
    ],
    ariaLabel: `Função racional com assíntota horizontal y=${asymptote}`,
  };
}

function buildLimitesSubstituicaoVisual(
  d: Extract<LimitesData, { tipo: "limite-substituicao" }>,
): VisualSpec {
  const fn = (x: number) =>
    d.coeficientes.reduce(
      (acc, c, i) => acc + c * Math.pow(x, d.expoentes[i]!),
      0,
    );
  const points = sampleRange(fn, d.a - 3, d.a + 3);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: "Polinômio contínuo",
    bounds,
    curves: [{ points, color: "#2563eb" }],
    markers: [{ x: d.a, y: fn(d.a), label: `x=${d.a}`, style: "point" }],
    ariaLabel: `Gráfico do polinômio com ponto em x=${d.a}`,
  };
}

function buildLimitesAlgebricoVisual(
  d: Extract<LimitesData, { tipo: "limite-algebrico" }>,
): VisualSpec {
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

function buildLimitesRacionalVisual(
  d: Extract<LimitesData, { tipo: "limite-racional" }>,
): VisualSpec {
  const sum = d.r1 + d.r2;
  const prod = d.r1 * d.r2;
  const fn = (x: number) => (x * x - sum * x + prod) / (x - d.a);
  const left = sampleRange(fn, d.a - 3, d.a - 0.15, 60);
  const right = sampleRange(fn, d.a + 0.15, d.a + 3, 60);
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  const yHole = d.r1 + d.r2;
  return {
    kind: "function-plot",
    title: `f(x) = (x² − ${sum}x + ${prod})/(x − ${d.a})`,
    bounds,
    curves: [
      { points: left, color: "#2563eb" },
      { points: right, color: "#2563eb" },
    ],
    markers: [{ x: d.a, y: yHole, label: `x=${d.a}`, style: "hole" }],
    ariaLabel: `Gráfico racional com buraco em x=${d.a}`,
  };
}

function buildContinuidadeAfimVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-afim" }>,
): VisualSpec {
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

function buildDerivadasPolinomioVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-polinomio" }>,
): VisualSpec {
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

function buildDerivadasTrigVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-trig" }>,
): VisualSpec {
  const fn = (x: number) => {
    const arg = d.k * x + d.b;
    if (d.funcao === "sin") return Math.sin(arg);
    if (d.funcao === "cos") return Math.cos(arg);
    return Math.tan(arg);
  };
  const points = sampleRange(fn, d.x0 - 3, d.x0 + 3);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `f(x) = ${d.funcao}(x)`,
    bounds,
    curves: [{ points, color: "#2563eb" }],
    markers: [{ x: d.x0, y: fn(d.x0), label: `x₀`, style: "point" }],
    ariaLabel: `Gráfico trigonométrico`,
  };
}

function buildOtimizacaoParabolaVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-parabola" }>,
): VisualSpec {
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

function buildOtimizacaoGeometricaVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-geometrica" }>,
): VisualSpec {
  const fn = (x: number) => x * (d.perimetro / 2 - x);
  const xv = d.perimetro / 4;
  const points = sampleRange(fn, 0, d.perimetro / 2);
  const bounds = boundsFromPoints(points);
  return {
    kind: "function-plot",
    title: `A(x) = x(${d.perimetro}/2 − x)`,
    bounds,
    curves: [{ points, color: "#2563eb" }],
    markers: [{ x: xv, y: fn(xv), label: "máx", style: "vertex" }],
    ariaLabel: `Área do retângulo em função da largura`,
  };
}

function buildRegraCadeiaPotenciaVisual(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-potencia" }>,
): VisualSpec {
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
