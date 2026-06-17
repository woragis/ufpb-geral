import type { Vectors3DSpec } from "@/core/presentation/visual/types";
import { project3D } from "@/core/presentation/visual/plot-utils";

const W = 400;
const H = 260;
const CX = W / 2;
const CY = H / 2;
const SCALE = 18;

export function Vectors3DFigure({ spec }: { spec: Vectors3DSpec }) {
  return (
    <figure className="my-4">
      {spec.title ? (
        <figcaption className="text-sm font-medium text-fg-muted mb-2">
          {spec.title}
        </figcaption>
      ) : null}
      <svg
        role="img"
        aria-label={spec.ariaLabel}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-md rounded-lg border border-border bg-surface"
      >
        <defs>
          <marker
            id="vec3d-arrow"
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
          const from2 = project3D(v.from);
          const to2 = project3D(v.to);
          const x1 = CX + from2.x * SCALE;
          const y1 = CY - from2.y * SCALE;
          const x2 = CX + to2.x * SCALE;
          const y2 = CY - to2.y * SCALE;
          const color = v.color ?? "#2563eb";
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={2}
                markerEnd="url(#vec3d-arrow)"
              />
              <text x={x2 + 4} y={y2 - 4} fontSize={11} fill={color}>
                {v.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
