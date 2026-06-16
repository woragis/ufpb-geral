import type { AreaPlotSpec } from "@/core/presentation/visual/types";
import { PlotCanvas, createScaler, polylinePoints } from "./plot-canvas";

export function AreaPlotFigure({ spec }: { spec: AreaPlotSpec }) {
  const { px } = createScaler(spec.bounds);
  const baseY = spec.fillFromY ?? spec.bounds.yMin;
  const basePx = px({ x: spec.bounds.xMin, y: baseY }).y;
  const curvePts = spec.curve.map((p) => px(p));
  const areaPath = [
    `M ${px({ x: spec.curve[0]!.x, y: baseY }).x} ${basePx}`,
    ...curvePts.map((p) => `L ${p.x} ${p.y}`),
    `L ${px({ x: spec.curve[spec.curve.length - 1]!.x, y: baseY }).x} ${basePx}`,
    "Z",
  ].join(" ");

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      <path d={areaPath} fill="#2563eb" fillOpacity={0.2} />
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth={2}
        points={polylinePoints(spec.curve, spec.bounds)}
      />
    </PlotCanvas>
  );
}
