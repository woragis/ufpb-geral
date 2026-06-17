import type { VisualSpec } from "@/core/presentation/visual/types";
import { FunctionPlotFigure } from "./function-plot";
import { PiecewisePlotFigure } from "./piecewise-plot";
import { AreaPlotFigure } from "./area-plot";
import { Vectors2DFigure } from "./vectors-2d";
import { Vectors3DFigure } from "./vectors-3d";
import { ParametricCurveFigure } from "./parametric-curve";
import { BoxPlotFigure } from "./box-plot";
import { ScatterPlotFigure } from "./scatter-plot";
import { BarChartFigure } from "./bar-chart";
import { DataTableFigure } from "./data-table";
import { VennDiagramFigure } from "./venn-diagram";
import { UrnDiagramFigure } from "./urn-diagram";

export function ExerciseFigures({ specs }: { specs: VisualSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {specs.map((spec, i) => (
        <Figure key={i} spec={spec} />
      ))}
    </div>
  );
}

function Figure({ spec }: { spec: VisualSpec }) {
  switch (spec.kind) {
    case "function-plot":
      return <FunctionPlotFigure spec={spec} />;
    case "piecewise-plot":
      return <PiecewisePlotFigure spec={spec} />;
    case "area-plot":
      return <AreaPlotFigure spec={spec} />;
    case "vectors-2d":
      return <Vectors2DFigure spec={spec} />;
    case "vectors-3d":
      return <Vectors3DFigure spec={spec} />;
    case "parametric-curve":
      return <ParametricCurveFigure spec={spec} />;
    case "box-plot":
      return <BoxPlotFigure spec={spec} />;
    case "scatter-plot":
      return <ScatterPlotFigure spec={spec} />;
    case "bar-chart":
      return <BarChartFigure spec={spec} />;
    case "data-table":
      return <DataTableFigure spec={spec} />;
    case "venn-diagram":
      return <VennDiagramFigure spec={spec} />;
    case "urn-diagram":
      return <UrnDiagramFigure spec={spec} />;
    default:
      return null;
  }
}
