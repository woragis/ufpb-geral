import type { VisualSpec } from "@/core/presentation/visual/types";
import {
  boundsFromPoints,
  mergeBounds,
  sampleRange,
} from "@/core/presentation/visual/plot-utils";
import type {
  ContinuidadeData,
  DerivadasData,
  OtimizacaoData,
  RegraCadeiaData,
} from "@/domains/calculo/entities/types";

const BLUE = "#2563eb";
const RED = "#dc2626";
const PURPLE = "#7c3aed";
const GREEN = "#16a34a";

function fnPlot(
  title: string,
  curves: { points: { x: number; y: number }[]; color?: string; dashed?: boolean }[],
  bounds: ReturnType<typeof boundsFromPoints>,
  markers?: { x: number; y: number; label?: string; style?: "point" | "hole" | "vertex" }[],
  ariaLabel?: string,
): VisualSpec {
  return {
    kind: "function-plot",
    title,
    bounds,
    curves,
    markers,
    ariaLabel: ariaLabel ?? title,
  };
}

function holePlot(
  fn: (x: number) => number,
  title: string,
  x0: number,
  yHole: number,
  span = 2,
): VisualSpec {
  const eps = 0.08;
  const left = sampleRange(fn, x0 - span, x0 - eps, 70);
  const right = sampleRange(fn, x0 + eps, x0 + span, 70);
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  return fnPlot(
    title,
    [
      { points: left, color: BLUE },
      { points: right, color: BLUE },
    ],
    bounds,
    [{ x: x0, y: yHole, label: `x=${x0}`, style: "hole" }],
  );
}

function asymptotePlot(
  fn: (x: number) => number,
  title: string,
  x0: number,
  span = 2,
): VisualSpec {
  const eps = 0.12;
  const left = sampleRange(fn, x0 - span, x0 - eps, 60);
  const right = sampleRange(fn, x0 + eps, x0 + span, 60);
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  return fnPlot(
    title,
    [
      { points: left, color: BLUE },
      { points: right, color: BLUE },
    ],
    bounds,
    [{ x: x0, y: 0, label: `x=${x0}`, style: "hole" }],
    `Assintota vertical em x=${x0}`,
  );
}

export function buildContinuidadeClassificarVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-classificar" }>,
): VisualSpec {
  if (d.classe === "removivel") {
    const yHole = 2 * d.a;
    const fn = (x: number) => (x * x - d.a * d.a) / (x - d.a);
    return holePlot(fn, `f(x) = (x^2 - ${d.a * d.a})/(x - ${d.a})`, d.a, yHole);
  }
  if (d.classe === "salto") {
    const left = sampleRange((x) => d.m * x + d.b, d.a - 3, d.a - 0.01, 40);
    const rightPts = [{ x: d.a, y: d.valorDir ?? 0 }];
    const bounds = mergeBounds(boundsFromPoints(left), {
      xMin: d.a - 3,
      xMax: d.a + 2,
      yMin: Math.min(d.valorEsq, d.valorDir ?? 0) - 2,
      yMax: Math.max(d.valorEsq, d.valorDir ?? 0) + 2,
    });
    return {
      kind: "piecewise-plot",
      title: "Descontinuidade de salto",
      bounds,
      segments: [
        { points: left, label: `x < ${d.a}` },
        { points: rightPts, label: `x >= ${d.a}` },
      ],
      breakpointX: d.a,
      markers: [
        { x: d.a, y: d.valorEsq, label: "lim-", style: "hole" },
        { x: d.a, y: d.valorDir ?? 0, label: "lim+", style: "point" },
      ],
      ariaLabel: `Salto em x=${d.a}`,
    };
  }
  return asymptotePlot((x) => 1 / (x - d.a), `f(x) = 1/(x - ${d.a})`, d.a);
}

export function buildContinuidadeCompletarVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-completar" }>,
): VisualSpec {
  const sum = d.r1 + d.r2;
  const prod = d.r1 * d.r2;
  const yHole = d.r1 + d.r2;
  const fn = (x: number) => (x * x - sum * x + prod) / (x - d.a);
  return holePlot(fn, `Completar f em x=${d.a}`, d.a, yHole);
}

export function buildContinuidadeLateralVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-lateral" }>,
): VisualSpec {
  if (d.variante === "inverso") {
    return asymptotePlot(
      (x) => 1 / (x - d.a),
      `Limites laterais de 1/(x - ${d.a})`,
      d.a,
    );
  }
  const left = sampleRange((x) => -1, -3, -0.01, 30);
  const right = sampleRange((x) => 1, 0.01, 3, 30);
  const bounds = mergeBounds(boundsFromPoints(left), boundsFromPoints(right));
  return {
    kind: "piecewise-plot",
    title: "f(x) = |x|/x",
    bounds,
    segments: [
      { points: left, label: "x < 0" },
      { points: right, label: "x > 0" },
    ],
    breakpointX: 0,
    markers: [
      { x: 0, y: -1, label: "lim-", style: "hole" },
      { x: 0, y: 1, label: "lim+", style: "hole" },
    ],
    ariaLabel: "Limites laterais de |x|/x em zero",
  };
}

export function buildContinuidadeTviVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-tvi" }>,
): VisualSpec {
  const segment = [
    { x: d.a, y: d.fa },
    { x: d.b, y: d.fb },
  ];
  const kLine = [
    { x: d.a, y: d.k },
    { x: d.b, y: d.k },
  ];
  const bounds = mergeBounds(boundsFromPoints(segment), boundsFromPoints(kLine));
  return fnPlot(
    "Teorema do Valor Intermediario",
    [
      { points: segment, color: BLUE },
      { points: kLine, color: RED, dashed: true },
    ],
    bounds,
    [
      { x: d.a, y: d.fa, label: `f(${d.a})`, style: "point" },
      { x: d.b, y: d.fb, label: `f(${d.b})`, style: "point" },
    ],
    `f continua em [${d.a}, ${d.b}] com nivel k=${d.k}`,
  );
}

export function buildContinuidadeTrigPontoVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-trig-ponto" }>,
): VisualSpec {
  if (d.funcao === "sin") {
    return holePlot(
      (x) => (x === 0 ? 1 : Math.sin(x) / x),
      "f(x) = sin(x)/x",
      0,
      1,
    );
  }
  const points = sampleRange(Math.cos, -3, 3);
  return fnPlot(
    "g(x) = cos(x)",
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: 0, y: 1, label: "x=0", style: "point" }],
  );
}

export function buildContinuidadeRolleVisual(
  d: Extract<ContinuidadeData, { tipo: "continuidade-rolle" }>,
): VisualSpec {
  const fn = (x: number) => d.coef * x * x;
  const points = sampleRange(fn, d.a, d.b);
  const bounds = boundsFromPoints(points);
  return fnPlot(
    `f(x) = ${d.coef}x^2 em [${d.a}, ${d.b}]`,
    [{ points, color: BLUE }],
    bounds,
    [
      { x: d.a, y: fn(d.a), label: `x=${d.a}`, style: "point" },
      { x: d.b, y: fn(d.b), label: `x=${d.b}`, style: "point" },
      { x: 0, y: 0, label: "c=0", style: "vertex" },
    ],
    "Rolle: f(a)=f(b) e f'(c)=0",
  );
}

export function buildDerivadasExpLogVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-exp-log" }>,
): VisualSpec {
  const fn =
    d.funcao === "exp"
      ? (x: number) => Math.exp(d.k * x)
      : (x: number) => Math.log(Math.max(d.k * x, 0.01));
  const xMin = d.funcao === "exp" ? d.x0 - 2 : 0.1;
  const points = sampleRange(fn, xMin, d.x0 + 2);
  return fnPlot(
    d.funcao === "exp" ? `f(x) = e^(${d.k}x)` : `f(x) = ln(${d.k}x)`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildDerivadasProdutoVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-produto" }>,
): VisualSpec {
  const fn = (x: number) => d.a * Math.pow(x, d.n) * (d.b * x + d.c);
  const points = sampleRange(fn, Math.max(0.5, d.x0 - 2), d.x0 + 2);
  return fnPlot(
    "f(x) = u(x)*v(x)",
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildDerivadasQuocienteVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-quociente" }>,
): VisualSpec {
  const fn = (x: number) => Math.pow(x, d.n) / (x + d.c);
  const points = sampleRange(fn, Math.max(0.5, d.x0 - 1), d.x0 + 3, 80, -d.c, 0.15);
  return fnPlot(
    `f(x) = x^${d.n}/(x+${d.c})`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildDerivadasTangenteVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-tangente" }>,
): VisualSpec {
  const fn = (x: number) => d.a * Math.pow(x, d.n);
  const y0 = fn(d.x0);
  const m = d.a * d.n * Math.pow(d.x0, d.n - 1);
  const tan = (x: number) => y0 + m * (x - d.x0);
  const left = d.x0 - 3;
  const right = d.x0 + 3;
  const fPts = sampleRange(fn, left, right);
  const tPts = sampleRange(tan, left, right);
  const bounds = mergeBounds(boundsFromPoints(fPts), boundsFromPoints(tPts));
  return fnPlot(
    "Reta tangente",
    [
      { points: fPts, color: BLUE },
      { points: tPts, color: RED, dashed: true },
    ],
    bounds,
    [{ x: d.x0, y: y0, label: "P", style: "point" }],
  );
}

export function buildDerivadasDefinicaoVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-definicao" }>,
): VisualSpec {
  const fn = (x: number) => d.a * Math.pow(x, d.n);
  const points = sampleRange(fn, d.x0 - 2, d.x0 + 2);
  return fnPlot(
    `f(x) = ${d.a}x^${d.n}`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildDerivadasTaxaVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-taxa-relacionada" }>,
): VisualSpec {
  if (d.variante === "escada") {
    const L = d.p1;
    const x = d.p2;
    const y = Math.sqrt(L * L - x * x);
    return {
      kind: "bar-chart",
      title: "Escada: x^2 + y^2 = L^2",
      labels: ["L", "x", "y"],
      values: [L, x, Math.round(y * 10) / 10],
      ariaLabel: `Triangulo retangulo L=${L}, x=${x}, y~${y.toFixed(1)}`,
    };
  }
  if (d.variante === "balao") {
    const r = d.p1;
    return {
      kind: "bar-chart",
      title: "Esfera: V = (4/3)pi*r^3",
      labels: ["r", "dr/dt", "dV/dt"],
      values: [r, d.p2, Math.round(4 * r * r * d.p2 * 10) / 10],
      ariaLabel: "Relacao entre taxas do volume e do raio",
    };
  }
  return {
    kind: "bar-chart",
    title: "Cone: relacao V(h)",
    labels: ["H", "h", "dV/dt"],
    values: [d.p1, d.p2, d.p3],
    ariaLabel: "Taxas no cone",
  };
}

export function buildDerivadasImplicitaVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-implicita" }>,
): VisualSpec {
  const r = d.r;
  const top = sampleRange((x) => Math.sqrt(Math.max(0, r * r - x * x)), -r + 0.1, r - 0.1);
  const bot = sampleRange((x) => -Math.sqrt(Math.max(0, r * r - x * x)), -r + 0.1, r - 0.1);
  const bounds = mergeBounds(boundsFromPoints(top), boundsFromPoints(bot));
  return fnPlot(
    `x^2 + y^2 = ${r}^2`,
    [
      { points: top, color: BLUE },
      { points: bot, color: BLUE },
    ],
    bounds,
    [{ x: d.x0, y: d.y0, label: "P", style: "point" }],
  );
}

export function buildDerivadasAproxLinearVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-aprox-linear" }>,
): VisualSpec {
  const fn = (x: number) => d.a * Math.pow(x, d.n);
  const y0 = fn(d.x0);
  const m = d.a * d.n * Math.pow(d.x0, d.n - 1);
  const tan = (x: number) => y0 + m * (x - d.x0);
  const left = d.x0 - 1;
  const right = d.x0 + d.dx + 0.5;
  const fPts = sampleRange(fn, left, right);
  const tPts = sampleRange(tan, left, right);
  const bounds = mergeBounds(boundsFromPoints(fPts), boundsFromPoints(tPts));
  return fnPlot(
    "Linearizacao L(x)",
    [
      { points: fPts, color: BLUE },
      { points: tPts, color: RED, dashed: true },
    ],
    bounds,
    [
      { x: d.x0, y: y0, label: "x0", style: "point" },
      { x: d.x0 + d.dx, y: fn(d.x0 + d.dx), label: "alvo", style: "hole" },
    ],
  );
}

export function buildDerivadasSegundaTesteVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-segunda-teste" }>,
): VisualSpec {
  const fn = (x: number) => x * x * x + d.a * x;
  const points = sampleRange(fn, d.x0 - 2, d.x0 + 2);
  return fnPlot(
    `f(x) = x^3 ${d.a >= 0 ? "+" : "-"} ${Math.abs(d.a)}x`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "critico", style: "vertex" }],
  );
}

export function buildDerivadasInversaTrigVisual(
  d: Extract<DerivadasData, { tipo: "derivadas-inversa-trig" }>,
): VisualSpec {
  const fn =
    d.funcao === "arctan"
      ? (x: number) => Math.atan(x)
      : (x: number) => Math.asin(x);
  const xMin = d.funcao === "arctan" ? d.x0 - 2 : 0.01;
  const xMax = d.funcao === "arctan" ? d.x0 + 2 : 0.99;
  const points = sampleRange(fn, xMin, xMax);
  return fnPlot(
    d.funcao === "arctan" ? "f(x) = arctan(x)" : "f(x) = arcsin(x)",
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildRegraCadeiaTrigVisual(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-trig" }>,
): VisualSpec {
  const fn = (x: number) => {
    const arg = d.a * x + d.b;
    return d.funcao === "sin" ? Math.sin(arg) : Math.cos(arg);
  };
  const points = sampleRange(fn, d.x0 - 2, d.x0 + 2);
  return fnPlot(
    `h(x) = ${d.funcao}(${d.a}x + ${d.b})`,
    [{ points, color: PURPLE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildRegraCadeiaExpLogVisual(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-exp-log" }>,
): VisualSpec {
  const inner = (x: number) => d.a * x + d.b;
  const fn =
    d.funcao === "exp"
      ? (x: number) => Math.exp(inner(x))
      : (x: number) => Math.log(Math.max(inner(x), 0.01));
  const xMin = d.funcao === "exp" ? d.x0 - 1 : Math.max(0.1, (1 - d.b) / d.a);
  const points = sampleRange(fn, xMin, d.x0 + 2);
  return fnPlot(
    d.funcao === "exp" ? `h(x) = e^(${d.a}x+${d.b})` : `h(x) = ln(${d.a}x+${d.b})`,
    [{ points, color: PURPLE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "point" }],
  );
}

export function buildRegraCadeiaAvancadaVisual(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-avancada" }>,
): VisualSpec {
  const x0 = d.x0;
  switch (d.variante) {
    case "sin-quadrado": {
      const fn = (x: number) => Math.sin(x) ** 2;
      const pts = sampleRange(fn, x0 - 2, x0 + 2);
      return fnPlot("h(x) = sin^2(x)", [{ points: pts, color: PURPLE }], boundsFromPoints(pts), [
        { x: x0, y: fn(x0), label: "x0", style: "point" },
      ]);
    }
    case "exp-quadrado": {
      const fn = (x: number) => Math.exp(x * x);
      const pts = sampleRange(fn, x0 - 1.5, x0 + 1.5);
      return fnPlot("h(x) = e^(x^2)", [{ points: pts, color: PURPLE }], boundsFromPoints(pts), [
        { x: x0, y: fn(x0), label: "x0", style: "point" },
      ]);
    }
    case "ln-quadrado": {
      const fn = (x: number) => Math.log(x * x + 1);
      const pts = sampleRange(fn, x0 - 2, x0 + 2);
      return fnPlot("h(x) = ln(x^2+1)", [{ points: pts, color: PURPLE }], boundsFromPoints(pts), [
        { x: x0, y: fn(x0), label: "x0", style: "point" },
      ]);
    }
    case "sqrt-composta": {
      const fn = (x: number) => Math.sqrt(1 + x * x);
      const pts = sampleRange(fn, x0 - 2, x0 + 2);
      return fnPlot("h(x) = sqrt(1+x^2)", [{ points: pts, color: PURPLE }], boundsFromPoints(pts), [
        { x: x0, y: fn(x0), label: "x0", style: "point" },
      ]);
    }
    default: {
      const fn = (x: number) => Math.sin(x) ** 2;
      const pts = sampleRange(fn, x0 - 2, x0 + 2);
      return fnPlot("h(x) = sin^2(x)", [{ points: pts, color: PURPLE }], boundsFromPoints(pts), [
        { x: x0, y: fn(x0), label: "x0", style: "point" },
      ]);
    }
  }
}

export function buildOtimizacaoCrescimentoVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-crescimento" }>,
): VisualSpec {
  const fn = (x: number) => x * x * x + d.a * x;
  const points = sampleRange(fn, -3, 3);
  return fnPlot(
    `f(x) = x^3 ${d.a >= 0 ? "+" : "-"} ${Math.abs(d.a)}x`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    undefined,
    "Intervalos de crescimento de f",
  );
}

export function buildOtimizacaoConcavidadeVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-concavidade" }>,
): VisualSpec {
  const fn = (x: number) => x * x * x + d.a * x;
  const points = sampleRange(fn, -2, 3);
  return fnPlot(
    "f''(x) = 6x",
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: 0, y: fn(0), label: "x=0", style: "point" }],
  );
}

export function buildOtimizacaoCilindroVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-cilindro" }>,
): VisualSpec {
  const S = d.area;
  const fn = (r: number) => (r * (S - 2 * r * r)) / 2;
  const rMax = Math.sqrt(S / 2);
  const points = sampleRange(fn, 0.3, rMax - 0.1, 60);
  const rOpt = Math.sqrt(S / (3 * Math.PI));
  return fnPlot(
    "V(r) com area fixa",
    [{ points, color: GREEN }],
    boundsFromPoints(points),
    [{ x: rOpt, y: fn(rOpt), label: "r*", style: "vertex" }],
    "Volume do cilindro em funcao do raio",
  );
}

export function buildOtimizacaoCaixaVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-caixa" }>,
): VisualSpec {
  const L = d.lado;
  const fn = (x: number) => x * (L - 2 * x) ** 2;
  const points = sampleRange(fn, 0.2, L / 2 - 0.1, 60);
  const xOpt = L / 6;
  return fnPlot(
    `V(x) = x(${L}-2x)^2`,
    [{ points, color: GREEN }],
    boundsFromPoints(points),
    [{ x: xOpt, y: fn(xOpt), label: "x*", style: "vertex" }],
  );
}

export function buildOtimizacaoSegundaDerivadaVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-segunda-derivada" }>,
): VisualSpec {
  const fn = (x: number) => d.a * x * x * x + d.b * x * x;
  const points = sampleRange(fn, d.x0 - 2, d.x0 + 2);
  return fnPlot(
    `f(x) = ${d.a}x^3 ${d.b >= 0 ? "+" : "-"} ${Math.abs(d.b)}x^2`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [{ x: d.x0, y: fn(d.x0), label: "x0", style: "vertex" }],
  );
}

export function buildOtimizacaoEsboçoVisual(
  d: Extract<OtimizacaoData, { tipo: "otimizacao-esboco" }>,
): VisualSpec {
  const fn = (x: number) => x * x * x + d.a * x;
  const delta = Math.sqrt(-d.a / 3);
  const points = sampleRange(fn, -delta - 1.5, delta + 1.5);
  return fnPlot(
    `f(x) = x^3 ${d.a >= 0 ? "+" : "-"} ${Math.abs(d.a)}x`,
    [{ points, color: BLUE }],
    boundsFromPoints(points),
    [
      { x: -delta, y: fn(-delta), label: "critico", style: "point" },
      { x: delta, y: fn(delta), label: "critico", style: "point" },
    ],
  );
}
