import type { Vectors2DSpec } from "@/core/presentation/visual/types";
import { PlotCanvas, createScaler } from "./plot-canvas";

export function Vectors2DFigure({ spec }: { spec: Vectors2DSpec }) {
  const { px } = createScaler(spec.bounds);

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      <defs>
        <marker
          id="vec-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="context-stroke" />
        </marker>
      </defs>
      {spec.vectors.map((v, i) => {
        const from = px(v.from);
        const to = px(v.to);
        const color = v.color ?? "#2563eb";
        return (
          <g key={i}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth={2}
              markerEnd="url(#vec-arrow)"
            />
            <text
              x={to.x + 6}
              y={to.y - 6}
              fontSize={11}
              fill={color}
            >
              {v.label}
            </text>
          </g>
        );
      })}
    </PlotCanvas>
  );
}
