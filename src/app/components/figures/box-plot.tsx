import type { BoxPlotSpec } from "@/core/presentation/visual/types";

const W = 320;
const H = 120;

export function BoxPlotFigure({ spec }: { spec: BoxPlotSpec }) {
  const min = spec.min ?? spec.q1 - (spec.q3 - spec.q1) * 1.5;
  const max = spec.max ?? spec.q3 + (spec.q3 - spec.q1) * 1.5;
  const span = max - min || 1;
  const scale = (v: number) => 40 + ((v - min) / span) * (W - 80);

  const xMin = scale(min);
  const xQ1 = scale(spec.q1);
  const xQ2 = scale(spec.q2);
  const xQ3 = scale(spec.q3);
  const xMax = scale(max);
  const yMid = H / 2;

  return (
    <figure className="my-4">
      <svg
        role="img"
        aria-label={spec.ariaLabel}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-md rounded-lg border border-border bg-surface"
      >
        <line
          x1={xMin}
          y1={yMid}
          x2={xMax}
          y2={yMid}
          stroke="#64748b"
          strokeWidth={1}
        />
        <rect
          x={xQ1}
          y={yMid - 24}
          width={xQ3 - xQ1}
          height={48}
          fill="#2563eb"
          fillOpacity={0.2}
          stroke="#2563eb"
        />
        <line
          x1={xQ2}
          y1={yMid - 24}
          x2={xQ2}
          y2={yMid + 24}
          stroke="#dc2626"
          strokeWidth={2}
        />
        {[min, spec.q1, spec.q2, spec.q3, max].map((v, i) => (
          <text
            key={i}
            x={scale(v)}
            y={H - 8}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            className="fill-fg-muted"
          >
            {v}
          </text>
        ))}
      </svg>
    </figure>
  );
}
