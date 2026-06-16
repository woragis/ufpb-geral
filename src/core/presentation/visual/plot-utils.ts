import type { Point2D, PlotBounds } from "./types";

export function sampleRange(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  steps = 120,
  skipNear?: number,
  skipRadius = 0.08,
): Point2D[] {
  const points: Point2D[] = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    if (skipNear !== undefined && Math.abs(x - skipNear) < skipRadius) {
      continue;
    }
    const y = fn(x);
    if (Number.isFinite(y) && Math.abs(y) < 1e4) {
      points.push({ x, y });
    }
  }
  return points;
}

export function boundsFromPoints(
  points: Point2D[],
  padding = 0.15,
): PlotBounds {
  if (points.length === 0) {
    return { xMin: -1, xMax: 1, yMin: -1, yMax: 1 };
  }
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const p of points) {
    xMin = Math.min(xMin, p.x);
    xMax = Math.max(xMax, p.x);
    yMin = Math.min(yMin, p.y);
    yMax = Math.max(yMax, p.y);
  }
  const xPad = (xMax - xMin || 1) * padding;
  const yPad = (yMax - yMin || 1) * padding;
  return {
    xMin: xMin - xPad,
    xMax: xMax + xPad,
    yMin: yMin - yPad,
    yMax: yMax + yPad,
  };
}

export function mergeBounds(a: PlotBounds, b: PlotBounds): PlotBounds {
  return {
    xMin: Math.min(a.xMin, b.xMin),
    xMax: Math.max(a.xMax, b.xMax),
    yMin: Math.min(a.yMin, b.yMin),
    yMax: Math.max(a.yMax, b.yMax),
  };
}

export function project3D(p: { x: number; y: number; z: number }): Point2D {
  return { x: p.x - p.y, y: (p.x + p.y) / 2 - p.z };
}
