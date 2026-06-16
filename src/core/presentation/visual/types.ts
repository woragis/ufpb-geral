export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface PlotBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlotMarker {
  x: number;
  y: number;
  label?: string;
  style?: "point" | "hole" | "vertex";
}

export interface FunctionPlotSpec {
  kind: "function-plot";
  title?: string;
  bounds: PlotBounds;
  curves: { points: Point2D[]; color?: string; dashed?: boolean }[];
  markers?: PlotMarker[];
  ariaLabel: string;
}

export interface PiecewisePlotSpec {
  kind: "piecewise-plot";
  title?: string;
  bounds: PlotBounds;
  segments: { points: Point2D[]; label?: string }[];
  breakpointX: number;
  markers?: PlotMarker[];
  ariaLabel: string;
}

export interface AreaPlotSpec {
  kind: "area-plot";
  title?: string;
  bounds: PlotBounds;
  curve: Point2D[];
  fillFromY?: number;
  ariaLabel: string;
}

export interface Vectors2DSpec {
  kind: "vectors-2d";
  title?: string;
  bounds: PlotBounds;
  vectors: { from: Point2D; to: Point2D; label: string; color?: string }[];
  ariaLabel: string;
}

export interface Vectors3DSpec {
  kind: "vectors-3d";
  title?: string;
  vectors: { from: Point3D; to: Point3D; label: string; color?: string }[];
  ariaLabel: string;
}

export interface ParametricCurveSpec {
  kind: "parametric-curve";
  title?: string;
  bounds: PlotBounds;
  points: Point2D[];
  marker?: PlotMarker;
  ariaLabel: string;
}

export interface BoxPlotSpec {
  kind: "box-plot";
  q1: number;
  q2: number;
  q3: number;
  min?: number;
  max?: number;
  ariaLabel: string;
}

export interface ScatterPlotSpec {
  kind: "scatter-plot";
  title?: string;
  bounds: PlotBounds;
  points: Point2D[];
  ariaLabel: string;
}

export interface BarChartSpec {
  kind: "bar-chart";
  title?: string;
  labels: string[];
  values: number[];
  referenceLine?: number;
  ariaLabel: string;
}

export interface VennDiagramSpec {
  kind: "venn-diagram";
  labelA: string;
  labelB: string;
  nA: number;
  nB: number;
  nIntersect: number;
  ariaLabel: string;
}

export interface UrnDiagramSpec {
  kind: "urn-diagram";
  colors: Record<string, number>;
  targetColor: string;
  ariaLabel: string;
}

export type VisualSpec =
  | FunctionPlotSpec
  | PiecewisePlotSpec
  | AreaPlotSpec
  | Vectors2DSpec
  | Vectors3DSpec
  | ParametricCurveSpec
  | BoxPlotSpec
  | ScatterPlotSpec
  | BarChartSpec
  | VennDiagramSpec
  | UrnDiagramSpec;
