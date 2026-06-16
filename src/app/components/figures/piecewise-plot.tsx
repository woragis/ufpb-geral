import type { PiecewisePlotSpec } from "@/core/presentation/visual/types";
import {
  MarkerDot,
  PlotCanvas,
  createScaler,
  polylinePoints,
} from "./plot-canvas";

const SEGMENT_COLORS = ["#2563eb", "#dc2626"];

export function PiecewisePlotFigure({ spec }: { spec: PiecewisePlotSpec }) {
  const { px } = createScaler(spec.bounds);

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      {spec.segments.map((seg, i) => (
        <polyline
          key={i}
          fill="none"
          stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
          strokeWidth={2}
          points={polylinePoints(seg.points, spec.bounds)}
        />
      ))}
      <line
        x1={px({ x: spec.breakpointX, y: spec.bounds.yMin }).x}
        y1={36}
        x2={px({ x: spec.breakpointX, y: spec.bounds.yMin }).x}
        y2={224}
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeDasharray="4 4"
      />
      {spec.markers?.map((m, i) => {
        const { x, y } = px({ x: m.x, y: m.y });
        return (
          <MarkerDot key={i} x={x} y={y} label={m.label} style={m.style} />
        );
      })}
    </PlotCanvas>
  );
}
