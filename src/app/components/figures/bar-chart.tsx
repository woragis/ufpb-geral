import type { BarChartSpec } from "@/core/presentation/visual/types";

export function BarChartFigure({ spec }: { spec: BarChartSpec }) {
  const W = 400;
  const H = 220;
  const pad = 32;
  const maxVal = Math.max(...spec.values, spec.referenceLine ?? 0, 1);
  const barW = (W - 2 * pad) / spec.values.length - 8;

  return (
    <figure className="my-4">
      {spec.title ? (
        <figcaption className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {spec.title}
        </figcaption>
      ) : null}
      <svg
        role="img"
        aria-label={spec.ariaLabel}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
      >
        {spec.referenceLine !== undefined ? (
          <line
            x1={pad}
            y1={H - pad - (spec.referenceLine / maxVal) * (H - 2 * pad)}
            x2={W - pad}
            y2={H - pad - (spec.referenceLine / maxVal) * (H - 2 * pad)}
            stroke="#dc2626"
            strokeDasharray="6 4"
            strokeWidth={1.5}
          />
        ) : null}
        {spec.values.map((v, i) => {
          const h = (v / maxVal) * (H - 2 * pad);
          const x = pad + i * (barW + 8);
          const y = H - pad - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill="#2563eb"
                fillOpacity={0.75}
                rx={2}
              />
              <text
                x={x + barW / 2}
                y={H - 10}
                textAnchor="middle"
                fontSize={10}
                fill="currentColor"
                className="fill-zinc-600 dark:fill-zinc-400"
              >
                {spec.labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
