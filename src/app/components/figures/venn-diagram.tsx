import type { VennDiagramSpec } from "@/core/presentation/visual/types";

export function VennDiagramFigure({ spec }: { spec: VennDiagramSpec }) {
  return (
    <figure className="my-4">
      <svg
        role="img"
        aria-label={spec.ariaLabel}
        viewBox="0 0 320 180"
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
      >
        <circle
          cx={120}
          cy={90}
          r={70}
          fill="#2563eb"
          fillOpacity={0.2}
          stroke="#2563eb"
          strokeWidth={2}
        />
        <circle
          cx={200}
          cy={90}
          r={70}
          fill="#dc2626"
          fillOpacity={0.2}
          stroke="#dc2626"
          strokeWidth={2}
        />
        <text x={75} y={50} fontSize={11} fill="#2563eb">
          A
        </text>
        <text x={235} y={50} fontSize={11} fill="#dc2626">
          B
        </text>
        <text x={95} y={95} fontSize={10} fill="currentColor">
          |A|={spec.nA}
        </text>
        <text x={175} y={95} fontSize={10} fill="currentColor">
          |A∩B|={spec.nIntersect}
        </text>
        <text x={215} y={95} fontSize={10} fill="currentColor">
          |B|={spec.nB}
        </text>
      </svg>
    </figure>
  );
}
