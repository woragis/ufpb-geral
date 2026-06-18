"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DisciplinaMeta } from "@/core/domain/catalog";
import type { DisciplinaId } from "@/core/domain/ids";
import { topicoSlugFromId } from "@/infrastructure/catalog/disciplines";

const MONOGRAM: Record<DisciplinaId, string> = {
  probabilidade: "Pr",
  "pre-calculo": "Pré",
  calculo: "Cá",
  "calculo-vetorial": "Vet",
  "analise-exploratoria": "AE",
};

const GRADIENT: Record<DisciplinaId, string> = {
  probabilidade: "from-violet-600/80 to-violet-900/90",
  "pre-calculo": "from-emerald-600/80 to-emerald-900/90",
  calculo: "from-blue-600/80 to-blue-900/90",
  "calculo-vetorial": "from-cyan-600/80 to-cyan-900/90",
  "analise-exploratoria": "from-amber-600/80 to-amber-900/90",
};

interface DisciplineCardProps {
  disciplina: DisciplinaMeta;
}

export function DisciplineCard({ disciplina }: DisciplineCardProps) {
  const router = useRouter();
  const id = disciplina.id as DisciplinaId;
  const activeTopics = disciplina.modulos
    .flatMap((m) => m.topicos)
    .filter((t) => t.status === "ativo");

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <Link
        href={`/${disciplina.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div
          className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${GRADIENT[id]}`}
        >
          {disciplina.imagemUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={disciplina.imagemUrl}
              alt={disciplina.imagemAlt ?? disciplina.nome}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-white/90">
                {MONOGRAM[id]}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10">
            <h2 className="text-lg font-semibold text-white">
              {disciplina.nome}
            </h2>
          </div>
        </div>
      </Link>

      <div className="px-4 py-3">
        <p className="text-sm text-fg-muted line-clamp-2 sm:line-clamp-1 group-hover:line-clamp-none motion-reduce:line-clamp-2">
          {disciplina.descricao}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
          <span>{activeTopics.length} tópico(s)</span>
          {activeTopics.length > 0 ? (
            <select
              className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-fg"
              defaultValue=""
              onChange={(e) => {
                const slug = e.target.value;
                if (slug) router.push(`/${disciplina.id}/${slug}`);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">Ir ao tópico…</option>
              {activeTopics.map((t) => (
                <option key={t.id} value={topicoSlugFromId(t.id)}>
                  {t.nome}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>
    </article>
  );
}
