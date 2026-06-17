import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import {
  boundsFromPoints,
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
    case "vetores-soma":
    case "vetores-escalar":
    case "vetores-unitario":
    case "vetores-distancia":
    case "vetores-paralelo":
      return [buildVetoresVisual(d as VetoresData)];
    case "produto-escalar":
    case "produto-escalar-angulo":
    case "produto-escalar-projecao":
    case "produto-escalar-ortogonal":
      return [buildProdutoEscalarVisual(d as ProdutoEscalarData)];
    case "produto-vetorial":
    case "produto-vetorial-area":
    case "produto-vetorial-misto":
      return [buildProdutoVetorialVisual(d as ProdutoVetorialData)];
    case "retas-planos":
    case "retas-planos-parametrica":
    case "retas-planos-plano":
    case "retas-planos-distancia":
    case "retas-planos-distancia-reta":
    case "retas-planos-intersecao":
      return [buildRetasVisual(d as RetasPlanosData)];
    case "curvas":
    case "curvas-velocidade-vetor":
    case "curvas-tangente":
    case "curvas-circulo":
    case "curvas-comprimento":
    case "curvas-helice":
      return [buildCurvasVisual(d as CurvasData)];
    case "campos":
    case "campos-divergente":
    case "campos-rotacional":
    case "campos-gradiente-3d":
    case "campos-divergente-3d":
      return [buildCamposVisual(d as CamposData)];
    default:
      return [];
  }
}

function buildVetoresVisual(d: VetoresData): VisualSpec {
  if (d.tipo === "vetores-distancia") {
    const [x1, y1, z1] = d.p;
    const [x2, y2, z2] = d.q;
    return {
      kind: "vectors-3d",
      vectors: [
        {
          from: { x: x1, y: y1, z: z1 },
          to: { x: x2, y: y2, z: z2 },
          label: "PQ",
          color: "#2563eb",
        },
      ],
      ariaLabel: "Distância entre pontos",
    };
  }
  if (d.tipo === "vetores-paralelo") {
    const [u1, u2, u3] = d.u;
    const [v1, v2, v3] = d.v;
    return {
      kind: "vectors-3d",
      vectors: [
        { from: { x: 0, y: 0, z: 0 }, to: { x: u1, y: u2, z: u3 }, label: "u", color: "#2563eb" },
        { from: { x: 0, y: 0, z: 0 }, to: { x: v1, y: v2, z: v3 }, label: "v", color: "#dc2626" },
      ],
      ariaLabel: "Vetores para teste de paralelismo",
    };
  }

  if (d.tipo === "vetores-soma") {
    const [u1, u2, u3 = 0] = d.u;
    const [v1, v2, v3 = 0] = d.v;
    const dim = d.dimensao;
    if (dim === 2) {
      const bounds = boundsFromPoints([
        { x: 0, y: 0 },
        { x: u1, y: u2 },
        { x: v1, y: v2 },
        { x: u1 + v1, y: u2 + v2 },
      ]);
      return {
        kind: "vectors-2d",
        title: "Soma de vetores",
        bounds,
        vectors: [
          { from: { x: 0, y: 0 }, to: { x: u1, y: u2 }, label: "u", color: "#2563eb" },
          { from: { x: u1, y: u2 }, to: { x: u1 + v1, y: u2 + v2 }, label: "v", color: "#dc2626" },
          { from: { x: 0, y: 0 }, to: { x: u1 + v1, y: u2 + v2 }, label: "u+v", color: "#16a34a" },
        ],
        ariaLabel: "Soma u + v no plano",
      };
    }
    return {
      kind: "vectors-3d",
      title: "Soma de vetores",
      vectors: [
        { from: { x: 0, y: 0, z: 0 }, to: { x: u1, y: u2, z: u3 }, label: "u", color: "#2563eb" },
        { from: { x: 0, y: 0, z: 0 }, to: { x: v1, y: v2, z: v3 }, label: "v", color: "#dc2626" },
        {
          from: { x: 0, y: 0, z: 0 },
          to: { x: u1 + v1, y: u2 + v2, z: u3 + v3 },
          label: "u+v",
          color: "#16a34a",
        },
      ],
      ariaLabel: "Soma u + v no espaço",
    };
  }

  const componentes =
    d.tipo === "vetores-escalar"
      ? d.componentes.map((c) => d.k * c)
      : d.componentes;
  const dimensao =
    d.tipo === "vetores-escalar"
      ? 3
      : d.tipo === "vetores" || d.tipo === "vetores-unitario"
        ? d.dimensao
        : 2;
  const [x, y, z = 0] = componentes;
  if (dimensao === 2) {
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
  const vectors = [
    { from: { x: 0, y: 0, z: 0 }, to: { x: u1, y: u2, z: u3 }, label: "u", color: "#2563eb" },
    { from: { x: 0, y: 0, z: 0 }, to: { x: v1, y: v2, z: v3 }, label: "v", color: "#dc2626" },
    { from: { x: 0, y: 0, z: 0 }, to: { x: cx, y: cy, z: cz }, label: "u×v", color: "#16a34a" },
  ];
  if (d.tipo === "produto-vetorial-misto") {
    const [w1, w2, w3] = d.w;
    vectors.push({
      from: { x: 0, y: 0, z: 0 },
      to: { x: w1, y: w2, z: w3 },
      label: "w",
      color: "#9333ea",
    });
  }
  return {
    kind: "vectors-3d",
    title: d.tipo === "produto-vetorial-misto" ? "Produto misto" : "u × v",
    vectors,
    ariaLabel: "Vetores u, v e produto vetorial",
  };
}

function buildRetasVisual(d: RetasPlanosData): VisualSpec {
  if (d.tipo === "retas-planos-parametrica") {
    const [x1, y1, z1] = d.p0;
    const [dx, dy, dz] = d.diretor;
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const z2 = z1 + dz;
    return {
      kind: "vectors-3d",
      title: "Reta paramétrica",
      vectors: [
        { from: { x: x1, y: y1, z: z1 }, to: { x: x2, y: y2, z: z2 }, label: "v", color: "#2563eb" },
      ],
      ariaLabel: "Reta com vetor diretor",
    };
  }
  if (d.tipo === "retas-planos-plano") {
    const [a, b, c] = d.normal;
    const [x1, y1, z1] = d.ponto;
    return {
      kind: "vectors-3d",
      title: "Plano — normal",
      vectors: [
        {
          from: { x: x1, y: y1, z: z1 },
          to: { x: x1 + a * 0.5, y: y1 + b * 0.5, z: z1 + c * 0.5 },
          label: "n",
          color: "#16a34a",
        },
      ],
      ariaLabel: "Vetor normal ao plano",
    };
  }
  if (d.tipo === "retas-planos-distancia") {
    const [x1, y1, z1] = d.ponto;
    return {
      kind: "vectors-3d",
      title: "Ponto e plano",
      vectors: [
        { from: { x: 0, y: 0, z: 0 }, to: { x: x1, y: y1, z: z1 }, label: "P", color: "#2563eb" },
      ],
      ariaLabel: "Ponto no espaço",
    };
  }
  if (d.tipo === "retas-planos-distancia-reta") {
    const [x1, y1, z1] = d.ponto;
    const [dx, dy, dz] = d.diretor;
    return {
      kind: "vectors-3d",
      title: "Ponto e reta",
      vectors: [
        { from: { x: x1, y: y1, z: z1 }, to: { x: x1 + dx, y: y1 + dy, z: z1 + dz }, label: "v", color: "#2563eb" },
      ],
      ariaLabel: "Distância de ponto à reta",
    };
  }
  if (d.tipo === "retas-planos-intersecao") {
    const [x0, y0, z0] = d.p0;
    const [dx, dy, dz] = d.diretor;
    return {
      kind: "vectors-3d",
      title: "Reta e plano",
      vectors: [
        { from: { x: x0, y: y0, z: z0 }, to: { x: x0 + dx, y: y0 + dy, z: z0 + dz }, label: "r", color: "#2563eb" },
      ],
      ariaLabel: "Interseção reta-plano",
    };
  }
  if (d.tipo === "retas-planos") {
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
  return {
    kind: "bar-chart",
    title: "Geometria analítica",
    labels: ["—"],
    values: [0],
    ariaLabel: "Visualização indisponível",
  };
}

function buildCurvasVisual(d: CurvasData): VisualSpec {
  if (d.tipo === "curvas-circulo") {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * 2 * Math.PI;
      points.push({ x: Math.cos(t), y: Math.sin(t) });
    }
    const bounds = boundsFromPoints(points);
    return {
      kind: "parametric-curve",
      title: "r(t) = (cos t, sin t)",
      bounds,
      points,
      marker: { x: Math.cos(d.t0), y: Math.sin(d.t0), label: `t=${d.t0}`, style: "point" },
      ariaLabel: "Circunferência unitária",
    };
  }
  if (d.tipo === "curvas-comprimento") {
    const t1 = d.t1;
    const t2 = d.t2;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = t1 + (i / 40) * (t2 - t1);
      points.push({ x: d.a * t, y: d.b * t });
    }
    const bounds = boundsFromPoints(points);
    return {
      kind: "parametric-curve",
      title: `r(t) = (${d.a}t, ${d.b}t)`,
      bounds,
      points,
      ariaLabel: "Segmento de reta paramétrica",
    };
  }
  if (d.tipo === "curvas-helice") {
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * 4 * Math.PI;
      points.push({ x: Math.cos(t), y: Math.sin(t) });
    }
    const bounds = boundsFromPoints(points);
    return {
      kind: "parametric-curve",
      title: "Projeção xy da hélice",
      bounds,
      points,
      marker: { x: Math.cos(d.t0), y: Math.sin(d.t0), label: `t=${d.t0}`, style: "point" },
      ariaLabel: "Projeção da hélice no plano xy",
    };
  }

  const t0 =
    d.tipo === "curvas" || d.tipo === "curvas-velocidade-vetor" || d.tipo === "curvas-tangente"
      ? d.t0
      : 1;
  const a = d.tipo === "curvas-velocidade-vetor" && d.familia === "reta" ? d.a : "a" in d ? d.a : 1;
  const b = "b" in d ? d.b : 0;

  if (d.tipo === "curvas-velocidade-vetor" && d.familia === "reta") {
    const tMax = d.t0 + 2;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * tMax;
      points.push({ x: d.a * t, y: (d.c ?? 0) * t + d.b });
    }
    const bounds = boundsFromPoints(points);
    const mx = d.a * d.t0;
    const my = (d.c ?? 0) * d.t0 + d.b;
    return {
      kind: "parametric-curve",
      title: `r(t) = (${d.a}t, ${d.c}t+${d.b})`,
      bounds,
      points,
      marker: { x: mx, y: my, label: `t=${d.t0}`, style: "point" },
      ariaLabel: `Curva paramétrica reta em t=${d.t0}`,
    };
  }

  const tMax = t0 + 2;
  const steps = 80;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    points.push({ x: a * t, y: t * t + b });
  }
  const bounds = boundsFromPoints(points);
  const y0 = a * t0;
  const y1 = t0 * t0 + b;
  return {
    kind: "parametric-curve",
    title: `r(t) = (${a}t, t²+${b})`,
    bounds,
    points,
    marker: { x: y0, y: y1, label: `t=${t0}`, style: "point" },
    ariaLabel: `Curva paramétrica com ponto em t=${t0}`,
  };
}

function buildCamposVisual(d: CamposData): VisualSpec {
  if (d.tipo === "campos-gradiente-3d") {
    return {
      kind: "vectors-3d",
      title: "∇f em 3D",
      vectors: [
        {
          from: { x: d.x0, y: d.y0, z: d.z0 },
          to: { x: d.x0 + 2 * d.x0 * 0.3, y: d.y0 + 2 * d.y0 * 0.3, z: d.z0 + 2 * d.z0 * 0.3 },
          label: "∇f",
          color: "#16a34a",
        },
      ],
      ariaLabel: `Gradiente 3D em (${d.x0}, ${d.y0}, ${d.z0})`,
    };
  }
  if (d.tipo === "campos-divergente-3d") {
    return {
      kind: "vectors-3d",
      title: "Campo F em 3D",
      vectors: [
        { from: { x: 0, y: 0, z: 0 }, to: { x: d.a, y: 0, z: 0 }, label: "Fx", color: "#2563eb" },
        { from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: d.b, z: 0 }, label: "Fy", color: "#dc2626" },
        { from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: 0, z: d.c }, label: "Fz", color: "#16a34a" },
      ],
      ariaLabel: "Componentes do campo vetorial 3D",
    };
  }
  if (d.tipo === "campos-divergente" || d.tipo === "campos-rotacional") {
    const [a, b] =
      d.tipo === "campos-divergente"
        ? [d.a, d.c]
        : [d.a, d.b];
    return {
      kind: "vectors-2d",
      title: d.tipo === "campos-divergente" ? "Campo F(x,y)" : "Campo rotacional",
      bounds: boundsFromPoints([
        { x: 0, y: 0 },
        { x: a, y: 0 },
        { x: 0, y: b },
      ]),
      vectors: [
        { from: { x: 0, y: 0 }, to: { x: a, y: 0 }, label: "Fx", color: "#2563eb" },
        { from: { x: 0, y: 0 }, to: { x: 0, y: b }, label: "Fy", color: "#dc2626" },
      ],
      ariaLabel: "Campo vetorial no plano",
    };
  }

  let gx: number;
  let gy: number;
  if (d.funcao === "xy") {
    gx = d.y0;
    gy = d.x0;
  } else if (d.funcao === "x2y") {
    gx = 2 * d.x0 * d.y0;
    gy = d.x0 * d.x0;
  } else {
    gx = 2 * d.x0;
    gy = 2 * d.y0;
  }
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
