import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import {
  boundsFromPoints,
  sampleRange,
} from "@/core/presentation/visual/plot-utils";
import type {
  BinomioNewtonData,
  ConjuntosData,
  FuncaoModularData,
  FuncoesElementaresData,
} from "@/domains/pre-calculo/entities/types";

export function buildPreCalculoVisuals(problem: Problem): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "conjuntos-operacao":
    case "conjuntos-produto-cartesiano":
    case "conjuntos-pertinencia":
      return [buildConjuntosVisual(d as ConjuntosData)];
    case "funcao-afim":
    case "funcao-quadratica":
    case "funcao-exponencial":
    case "funcao-logaritmica":
      return [buildFuncaoVisual(d as FuncoesElementaresData)];
    case "modular-equacao":
    case "modular-inequacao":
    case "modular-avaliar":
      return [buildModularVisual(d as FuncaoModularData)];
    case "binomio-coeficiente":
    case "binomio-termo-geral":
    case "binomio-soma-coeficientes":
    case "binomio-expansao":
      return [buildBinomioVisual(d as BinomioNewtonData)];
    default:
      return [];
  }
}

function buildConjuntosVisual(d: ConjuntosData): VisualSpec {
  if (d.tipo === "conjuntos-produto-cartesiano") {
    return {
      kind: "bar-chart",
      title: "Cardinalidades",
      labels: ["|A|", "|B|", "|A×B|"],
      values: [d.nA, d.nB, d.nA * d.nB],
      ariaLabel: `Produto cartesiano: ${d.nA} por ${d.nB}`,
    };
  }
  if (d.tipo === "conjuntos-pertinencia") {
    return {
      kind: "bar-chart",
      title: "Subconjunto de U",
      labels: ["|U|", "|A|"],
      values: [d.universo, d.nSatisfaz],
      ariaLabel: `Universo com ${d.universo} elementos`,
    };
  }
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: `Diagrama de Venn: |A|=${d.nA}, |B|=${d.nB}`,
  };
}

function buildFuncaoVisual(d: FuncoesElementaresData): VisualSpec {
  switch (d.tipo) {
    case "funcao-afim": {
      const fn = (x: number) => d.a * x + d.b;
      const points = sampleRange(fn, -5, 5);
      const bounds = boundsFromPoints(points);
      const markers =
        d.pergunta === "avaliar"
          ? [{ x: d.x0, y: fn(d.x0), label: `x=${d.x0}`, style: "point" as const }]
          : [{ x: -d.b / d.a, y: 0, label: "zero", style: "point" as const }];
      return {
        kind: "function-plot",
        title: `f(x) = ${d.a}x + ${d.b}`,
        bounds,
        curves: [{ points, color: "#7c3aed" }],
        markers,
        ariaLabel: "Gráfico de função afim",
      };
    }
    case "funcao-quadratica": {
      const fn = (x: number) => d.a * x * x + d.b * x + d.c;
      const points = sampleRange(fn, -4, 4);
      const bounds = boundsFromPoints(points);
      const xv = -d.b / (2 * d.a);
      const markers =
        d.pergunta === "vertice"
          ? [{ x: xv, y: fn(xv), label: "vértice", style: "point" as const }]
          : d.pergunta === "avaliar"
            ? [{ x: d.x0, y: fn(d.x0), label: `x=${d.x0}`, style: "point" as const }]
            : [];
      return {
        kind: "function-plot",
        title: `f(x) = ${d.a}x² + ${d.b}x + ${d.c}`,
        bounds,
        curves: [{ points, color: "#7c3aed" }],
        markers,
        ariaLabel: "Gráfico de função quadrática",
      };
    }
    case "funcao-exponencial": {
      const fn = (x: number) => d.base ** x;
      const points = sampleRange(fn, -1, 4);
      return {
        kind: "function-plot",
        title: `f(x) = ${d.base}^x`,
        bounds: boundsFromPoints(points),
        curves: [{ points, color: "#7c3aed" }],
        ariaLabel: "Gráfico exponencial",
      };
    }
    case "funcao-logaritmica": {
      const fn = (x: number) => Math.log(x) / Math.log(d.base);
      const points = sampleRange(fn, 0.5, d.argumento + 2);
      return {
        kind: "function-plot",
        title: `f(x) = log_${d.base}(x)`,
        bounds: boundsFromPoints(points),
        curves: [{ points, color: "#7c3aed" }],
        markers: [{ x: d.argumento, y: d.expoente, label: `x=${d.argumento}`, style: "point" as const }],
        ariaLabel: "Gráfico logarítmico",
      };
    }
  }
}

function buildModularVisual(d: FuncaoModularData): VisualSpec {
  const fn = (x: number) => Math.abs(d.a * x + d.b);
  const points = sampleRange(fn, -6, 6);
  const bounds = boundsFromPoints(points);
  const markers =
    d.tipo === "modular-avaliar"
      ? [{ x: d.x0, y: fn(d.x0), label: `x=${d.x0}`, style: "point" as const }]
      : [];
  return {
    kind: "function-plot",
    title: `f(x) = |${d.a}x + ${d.b}|`,
    bounds,
    curves: [{ points, color: "#7c3aed" }],
    markers,
    ariaLabel: "Gráfico de função modular",
  };
}

function buildBinomioVisual(d: BinomioNewtonData): VisualSpec {
  const n = d.tipo === "binomio-expansao" ? d.n : d.n;
  const labels: string[] = [];
  const values: number[] = [];
  for (let k = 0; k <= n; k++) {
    labels.push(`C(${n},${k})`);
    const a = d.tipo === "binomio-expansao" ? 1 : "a" in d ? d.a : 1;
    const b = d.tipo === "binomio-expansao" ? 1 : "b" in d ? d.b : 1;
    values.push(
      d.tipo === "binomio-expansao"
        ? combSimple(n, k)
        : combSimple(n, k) * (a as number) ** (n - k) * Math.abs(b as number) ** k,
    );
  }
  return {
    kind: "bar-chart",
    title: "Coeficientes binomiais",
    labels,
    values,
    ariaLabel: `Coeficientes de (a+b)^${n}`,
  };
}

function combSimple(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}
