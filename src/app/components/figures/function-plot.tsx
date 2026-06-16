import type { FunctionPlotSpec } from "@/core/presentation/visual/types";
import {
  MarkerDot,
  PlotCanvas,
  createScaler,
  polylinePoints,
} from "./plot-canvas";

export function FunctionPlotFigure({ spec }: { spec: FunctionPlotSpec }) {
  const { px } = createScaler(spec.bounds);

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      {spec.curves.map((curve, i) => (
        <polyline
          key={i}
          fill="none"
          stroke={curve.color ?? "#2563eb"}
          strokeWidth={2}
          strokeDasharray={curve.dashed ? "6 4" : undefined}
          points={polylinePoints(curve.points, spec.bounds)}
        />
      ))}
      {spec.markers?.map((m, i) => {
        const { x, y } = px({ x: m.x, y: m.y });
        return (
          <MarkerDot
            key={i}
            x={x}
            y={y}
            label={m.label}
            style={m.style}
          />
        );
      })}
    </PlotCanvas>
  );
}
