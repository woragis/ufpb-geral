import type { ReactNode } from "react";
import type { PlotBounds, Point2D } from "@/core/presentation/visual/types";

export const PLOT_WIDTH = 400;
export const PLOT_HEIGHT = 260;
export const PLOT_PADDING = 36;

export function createScaler(bounds: PlotBounds) {
  const w = PLOT_WIDTH - 2 * PLOT_PADDING;
  const h = PLOT_HEIGHT - 2 * PLOT_PADDING;
  const xSpan = bounds.xMax - bounds.xMin || 1;
  const ySpan = bounds.yMax - bounds.yMin || 1;

  return {
    px: (p: Point2D) => ({
      x: PLOT_PADDING + ((p.x - bounds.xMin) / xSpan) * w,
      y: PLOT_HEIGHT - PLOT_PADDING - ((p.y - bounds.yMin) / ySpan) * h,
    }),
  };
}

export function polylinePoints(points: Point2D[], bounds: PlotBounds): string {
  const { px } = createScaler(bounds);
  return points.map((p) => {
    const { x, y } = px(p);
    return `${x},${y}`;
  }).join(" ");
}

interface PlotCanvasProps {
  bounds: PlotBounds;
  title?: string;
  ariaLabel: string;
  children: ReactNode;
}

export function PlotCanvas({
  bounds,
  title,
  ariaLabel,
  children,
}: PlotCanvasProps) {
  const { px } = createScaler(bounds);
  const origin = px({ x: 0, y: 0 });
  const xAxisY = Math.min(
    Math.max(origin.y, PLOT_PADDING),
    PLOT_HEIGHT - PLOT_PADDING,
  );
  const yAxisX = Math.min(
    Math.max(origin.x, PLOT_PADDING),
    PLOT_WIDTH - PLOT_PADDING,
  );

  return (
    <figure className="my-4">
      {title ? (
        <figcaption className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {title}
        </figcaption>
      ) : null}
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
      >
        <line
          x1={PLOT_PADDING}
          y1={xAxisY}
          x2={PLOT_WIDTH - PLOT_PADDING}
          y2={xAxisY}
          stroke="currentColor"
          strokeOpacity={0.25}
        />
        <line
          x1={yAxisX}
          y1={PLOT_PADDING}
          x2={yAxisX}
          y2={PLOT_HEIGHT - PLOT_PADDING}
          stroke="currentColor"
          strokeOpacity={0.25}
        />
        {children}
      </svg>
    </figure>
  );
}

export function MarkerDot({
  x,
  y,
  label,
  style = "point",
}: {
  x: number;
  y: number;
  label?: string;
  style?: "point" | "hole" | "vertex";
}) {
  const r = style === "vertex" ? 5 : 4;
  const fill = style === "hole" ? "white" : "#2563eb";
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        stroke="#2563eb"
        strokeWidth={2}
      />
      {label ? (
        <text
          x={x + 8}
          y={y - 8}
          fontSize={11}
          fill="currentColor"
          className="fill-zinc-700 dark:fill-zinc-300"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function ArrowHead({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  return (
  <>
    <defs>
      <marker
        id={`arrow-${color.replace("#", "")}`}
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L6,3 L0,6 Z" fill={color} />
      </marker>
    </defs>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={2}
      markerEnd={`url(#arrow-${color.replace("#", "")})`}
    />
  </>
  );
}
