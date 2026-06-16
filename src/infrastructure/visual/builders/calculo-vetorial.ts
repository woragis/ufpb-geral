import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import {
  boundsFromPoints,
  sampleRange,
} from "@/core/presentation/visual/plot-utils";
import type {
  CamposData,
  CurvasData,
  ProdutoEscalarData,
  ProdutoVetorialData,
  RetasPlanosData,
  VetoresData,
} from "@/domains/calculo-vetorial/entities/types";

export function buildCalculoVetorialVisuals(problem: Problem): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "vetores":
      return [buildVetoresVisual(d as VetoresData)];
    case "produto-escalar":
      return [buildProdutoEscalarVisual(d as ProdutoEscalarData)];
    case "produto-vetorial":
      return [buildProdutoVetorialVisual(d as ProdutoVetorialData)];
    case "retas-planos":
      return [buildRetasVisual(d as RetasPlanosData)];
    case "curvas":
      return [buildCurvasVisual(d as CurvasData)];
    case "campos":
      return [buildCamposVisual(d as CamposData)];
    default:
      return [];
  }
}

function buildVetoresVisual(d: VetoresData): VisualSpec {
  const [x, y, z = 0] = d.componentes;
  if (d.dimensao === 2) {
    const bounds = boundsFromPoints([
      { x: 0, y: 0 },
      { x, y },
    ]);
    return {
      kind: "vectors-2d",
      bounds,
      vectors: [{ from: { x: 0, y: 0 }, to: { x, y }, label: "v" }],
      ariaLabel: `Vetor (${x}, ${y}) no plano`,
    };
  }
  return {
    kind: "vectors-3d",
    vectors: [
      {
        from: { x: 0, y: 0, z: 0 },
        to: { x, y, z },
        label: "v",
        color: "#2563eb",
      },
    ],
    ariaLabel: `Vetor (${x}, ${y}, ${z}) no espaço`,
  };
}

function buildProdutoEscalarVisual(d: ProdutoEscalarData): VisualSpec {
  const [ux, uy] = d.u;
  const [vx, vy] = d.v;
  const bounds = boundsFromPoints([
    { x: 0, y: 0 },
    { x: ux, y: uy },
    { x: vx, y: vy },
  ]);
  return {
    kind: "vectors-2d",
    title: "Produto escalar",
    bounds,
    vectors: [
      { from: { x: 0, y: 0 }, to: { x: ux, y: uy }, label: "u", color: "#2563eb" },
      { from: { x: 0, y: 0 }, to: { x: vx, y: vy }, label: "v", color: "#dc2626" },
    ],
    ariaLabel: `Vetores u e v no plano`,
  };
}

function buildProdutoVetorialVisual(d: ProdutoVetorialData): VisualSpec {
  const [u1, u2, u3] = d.u;
  const [v1, v2, v3] = d.v;
  const cx = u2 * v3 - u3 * v2;
  const cy = u3 * v1 - u1 * v3;
  const cz = u1 * v2 - u2 * v1;
  return {
    kind: "vectors-3d",
    title: "u × v",
    vectors: [
      { from: { x: 0, y: 0, z: 0 }, to: { x: u1, y: u2, z: u3 }, label: "u", color: "#2563eb" },
      { from: { x: 0, y: 0, z: 0 }, to: { x: v1, y: v2, z: v3 }, label: "v", color: "#dc2626" },
      { from: { x: 0, y: 0, z: 0 }, to: { x: cx, y: cy, z: cz }, label: "u×v", color: "#16a34a" },
    ],
    ariaLabel: "Vetores u, v e produto vetorial",
  };
}

function buildRetasVisual(d: RetasPlanosData): VisualSpec {
  const [x1, y1, z1] = d.p1;
  const [x2, y2, z2] = d.p2;
  const tVals = [-0.2, 0, 0.5, 1, 1.2];
  const points = tVals.map((t) => ({
    x: x1 + t * (x2 - x1),
    y: y1 + t * (y2 - y1),
    z: z1 + t * (z2 - z1),
  }));
  return {
    kind: "vectors-3d",
    title: "Reta por P e Q",
    vectors: [
      {
        from: points[1]!,
        to: points[3]!,
        label: "PQ",
        color: "#2563eb",
      },
    ],
    ariaLabel: `Segmento de reta de P a Q`,
  };
}

function buildCurvasVisual(d: CurvasData): VisualSpec {
  const tMax = d.t0 + 2;
  const steps = 80;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    points.push({ x: d.a * t, y: t * t + d.b });
  }
  const bounds = boundsFromPoints(points);
  const y0 = d.a * d.t0;
  const y1 = d.t0 * d.t0 + d.b;
  return {
    kind: "parametric-curve",
    title: `r(t) = (${d.a}t, t²+${d.b})`,
    bounds,
    points,
    marker: { x: y0, y: y1, label: `t=${d.t0}`, style: "point" },
    ariaLabel: `Curva paramétrica com ponto em t=${d.t0}`,
  };
}

function buildCamposVisual(d: CamposData): VisualSpec {
  const gx = 2 * d.x0;
  const gy = 2 * d.y0;
  const bounds = boundsFromPoints([
    { x: 0, y: 0 },
    { x: d.x0, y: d.y0 },
    { x: d.x0 + gx, y: d.y0 + gy },
  ]);
  return {
    kind: "vectors-2d",
    title: `∇f em (${d.x0}, ${d.y0})`,
    bounds,
    vectors: [
      {
        from: { x: d.x0, y: d.y0 },
        to: { x: d.x0 + gx * 0.3, y: d.y0 + gy * 0.3 },
        label: "∇f",
        color: "#16a34a",
      },
    ],
    ariaLabel: `Gradiente de f em (${d.x0}, ${d.y0})`,
  };
}
