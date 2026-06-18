import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StudyNav } from "@/app/components/catalog/StudyNav";
import { TopSeedsList } from "@/app/components/catalog/TopSeedsList";
import { SubtopicoCard } from "@/app/components/catalog/SubtopicoCard";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { disciplineAccentText } from "@/lib/discipline-accent";
import {
  getDisciplina,
  getTopico,
  subtopicoPath,
} from "@/infrastructure/catalog/disciplines";
import type { DisciplinaId } from "@/core/domain/ids";

export const dynamic = "force-dynamic";

function param(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : v;
}

function toQueryString(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default async function TopicoHubPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ disciplinaId: string; topicoSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const disciplina = getDisciplina(params.disciplinaId as DisciplinaId);
  if (!disciplina) notFound();

  const topico = getTopico(disciplina.id, params.topicoSlug);
  if (!topico || topico.status !== "ativo") notFound();

  const hasLegacyExercise =
    param(searchParams, "s") ||
    param(searchParams, "p") ||
    param(searchParams, "step") ||
    param(searchParams, "mode");

  if (hasLegacyExercise) {
    redirect(
      `/${disciplina.id}/${params.topicoSlug}/todos${toQueryString(searchParams)}`,
    );
  }

  const subtopicos = topico.subtopicos ?? [];
  const accent = disciplineAccentText[disciplina.id as DisciplinaId];

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <nav className="text-sm text-fg-muted mb-2">
              <Link href={`/${disciplina.id}`} className="hover:text-primary">
                {disciplina.nome}
              </Link>
              <span className="mx-2">›</span>
              <span className="text-fg">{topico.nome}</span>
            </nav>
            <h1 className={`text-2xl font-semibold ${accent}`}>{topico.nome}</h1>
            <p className="text-fg-muted mt-1">{topico.descricao}</p>
          </div>
          <ButtonLink href={`/${disciplina.id}`} variant="secondary">
            Voltar
          </ButtonLink>
        </div>

        <StudyNav
          disciplinaId={disciplina.id}
          topicoSlug={params.topicoSlug}
        />

        <Card className="mb-8 mt-6">
          <h2 className="text-lg font-semibold text-fg">Escolha um subtópico</h2>
          <p className="text-sm text-fg-muted mt-1">
            Cada card foca em um tipo de exercício deste tópico.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {subtopicos.map((sub) => (
              <SubtopicoCard
                key={sub.slug}
                subtopico={sub}
                href={subtopicoPath(disciplina.id, topico.id, sub.slug)}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-fg">Exercícios em destaque</h2>
          <div className="mt-3">
            <TopSeedsList
              topicoId={topico.id}
              topicoNome={topico.nome}
              disciplinaId={disciplina.id}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
