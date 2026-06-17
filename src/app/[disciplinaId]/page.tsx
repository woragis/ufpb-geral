import Link from "next/link";
import { notFound } from "next/navigation";
import { TopSeedsList } from "@/app/components/catalog/TopSeedsList";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { disciplineAccentText } from "@/lib/discipline-accent";
import { getDisciplina, topicoSlugFromId } from "@/infrastructure/catalog/disciplines";
import type { DisciplinaId } from "@/core/domain/ids";

export const dynamic = "force-dynamic";

export default async function DisciplinaPage({
  params,
}: {
  params: Promise<{ disciplinaId: string }>;
}) {
  const { disciplinaId } = await params;
  const disciplina = getDisciplina(disciplinaId as DisciplinaId);
  if (!disciplina) notFound();

  const accent = disciplineAccentText[disciplina.id as DisciplinaId];

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-semibold ${accent}`}>
              {disciplina.nome}
            </h1>
            <p className="text-fg-muted">{disciplina.descricao}</p>
          </div>
          <ButtonLink href="/" variant="secondary">
            Voltar
          </ButtonLink>
        </div>

        <section className="space-y-6">
          {disciplina.modulos.map((modulo) => (
            <Card
              key={modulo.id}
              disciplinaId={disciplina.id as DisciplinaId}
              accent
            >
              <h2 className="text-lg font-semibold text-fg">{modulo.nome}</h2>
              <p className="text-sm text-fg-muted mt-1">
                Tópicos organizados para estudo.
              </p>

              <ul className="mt-4 space-y-4">
                {modulo.topicos.map((topico) => {
                  const topicoSlug = topicoSlugFromId(topico.id);
                  const href = `/${disciplina.id}/${topicoSlug}`;
                  const disabled = topico.status !== "ativo";
                  return (
                    <li key={topico.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={href}
                          className={
                            disabled
                              ? "pointer-events-none text-fg-subtle"
                              : "text-fg hover:text-primary transition-colors"
                          }
                        >
                          {topico.nome}
                        </Link>
                        <span className="text-xs text-fg-muted">
                          {topico.status === "ativo" ? "Ativo" : "Planejado"}
                        </span>
                      </div>
                      <div className="text-sm text-fg-muted">
                        {topico.descricao}
                      </div>
                      {!disabled ? (
                        <TopSeedsList
                          topicoId={topico.id}
                          topicoNome={topico.nome}
                          disciplinaId={disciplina.id}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
