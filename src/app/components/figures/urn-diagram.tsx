import type { UrnDiagramSpec } from "@/core/presentation/visual/types";

const COLOR_MAP: Record<string, string> = {
  vermelha: "#dc2626",
  azul: "#2563eb",
  verde: "#16a34a",
  amarela: "#ca8a04",
};

export function UrnDiagramFigure({ spec }: { spec: UrnDiagramSpec }) {
  const balls: { color: string; x: number; y: number }[] = [];
  let idx = 0;
  for (const [cor, qtd] of Object.entries(spec.colors)) {
    for (let i = 0; i < qtd; i++) {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      balls.push({
        color: COLOR_MAP[cor] ?? "#64748b",
        x: 80 + col * 36,
        y: 70 + row * 36,
      });
      idx++;
    }
  }

  return (
    <figure className="my-4">
      <svg
        role="img"
        aria-label={spec.ariaLabel}
        viewBox="0 0 240 160"
        className="w-full max-w-xs rounded-lg border border-border bg-surface"
      >
        <rect
          x={40}
          y={40}
          width={160}
          height={100}
          rx={8}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={2}
        />
        {balls.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={14}
            fill={b.color}
            stroke={b.color === COLOR_MAP[spec.targetColor] ? "#000" : "none"}
            strokeWidth={2}
          />
        ))}
        <text x={120} y={155} textAnchor="middle" fontSize={10} fill="currentColor">
          alvo: {spec.targetColor}
        </text>
      </svg>
    </figure>
  );
}
