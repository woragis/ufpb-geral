import type { ParametricCurveSpec } from "@/core/presentation/visual/types";
import {
  MarkerDot,
  PlotCanvas,
  createScaler,
  polylinePoints,
} from "./plot-canvas";

export function ParametricCurveFigure({ spec }: { spec: ParametricCurveSpec }) {
  const { px } = createScaler(spec.bounds);

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      <polyline
        fill="none"
        stroke="#7c3aed"
        strokeWidth={2}
        points={polylinePoints(spec.points, spec.bounds)}
      />
      {spec.marker ? (
        <MarkerDot
          {...px({ x: spec.marker.x, y: spec.marker.y })}
          label={spec.marker.label}
          style={spec.marker.style}
        />
      ) : null}
    </PlotCanvas>
  );
}
