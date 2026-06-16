import type { ScatterPlotSpec } from "@/core/presentation/visual/types";
import { PlotCanvas, createScaler } from "./plot-canvas";

export function ScatterPlotFigure({ spec }: { spec: ScatterPlotSpec }) {
  const { px } = createScaler(spec.bounds);

  return (
    <PlotCanvas
      bounds={spec.bounds}
      title={spec.title}
      ariaLabel={spec.ariaLabel}
    >
      {spec.points.map((p, i) => {
        const { x, y } = px(p);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={5}
            fill="#2563eb"
            fillOpacity={0.75}
          />
        );
      })}
    </PlotCanvas>
  );
}
