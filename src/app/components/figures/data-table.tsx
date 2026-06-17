import type { DataTableSpec } from "@/core/presentation/visual/types";

export function DataTableFigure({ spec }: { spec: DataTableSpec }) {
  return (
    <figure className="my-4">
      {spec.title ? (
        <figcaption className="text-sm font-medium text-fg-muted mb-2">
          {spec.title}
        </figcaption>
      ) : null}
      <div
        role="img"
        aria-label={spec.ariaLabel}
        className="overflow-x-auto rounded-lg border border-border bg-surface"
      >
        <table className="w-full min-w-[240px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              {spec.headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left font-semibold text-fg"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-b-0 even:bg-surface-elevated/50"
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-fg-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
