import Link from "next/link";
import type { SubtopicoMeta } from "@/core/domain/catalog";

interface SubtopicoCardProps {
  href: string;
  subtopico: SubtopicoMeta;
}

export function SubtopicoCard({ href, subtopico }: SubtopicoCardProps) {
  const disabled = subtopico.status === "planejado";

  return (
    <Link
      href={disabled ? "#" : href}
      className={
        disabled
          ? "pointer-events-none rounded-xl border border-border/60 bg-surface-elevated/40 p-4 opacity-60"
          : "group rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-primary/40 hover:bg-surface-elevated/80"
      }
    >
      <h3 className="font-semibold text-fg group-hover:text-primary transition-colors">
        {subtopico.nome}
      </h3>
      {subtopico.descricao ? (
        <p className="mt-1 text-sm text-fg-muted line-clamp-2">
          {subtopico.descricao}
        </p>
      ) : null}
    </Link>
  );
}
