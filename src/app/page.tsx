import Link from "next/link";
import { disciplinas, topicoSlugFromId } from "@/infrastructure/catalog/disciplines";
import { CopyCodeForm } from "./components/CopyCodeForm";
import { ImportExerciseForm } from "./components/ai/ImportExerciseForm";
import { PersonalPanels } from "./components/personal/PersonalPanels";
import { Card, CardAi } from "./components/ui/Card";
import { disciplineAccentText } from "@/lib/discipline-accent";
import type { DisciplinaId } from "@/core/domain/ids";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex flex-col w-full max-w-4xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-semibold text-fg">
            UFPB Study — Exercícios com seeds
          </h1>
          <p className="text-fg-muted">
            Gere exercícios aleatórios (determinísticos) e compartilhe pelo
            código.
          </p>
        </header>

        <Card className="mb-10">
          <h2 className="font-semibold text-fg mb-2">Colar código do exercício</h2>
          <CopyCodeForm />
        </Card>

        <PersonalPanels />

        <CardAi className="mb-10">
          <h2 className="font-semibold text-fg mb-2">Importar exercício com IA</h2>
          <p className="text-sm text-fg-muted mb-3">
            Cole um enunciado em texto livre; a IA mapeia para um tópico do site.
          </p>
          <ImportExerciseForm />
        </CardAi>

        <section className="grid gap-4">
          {disciplinas.map((disciplina) => {
            const activeTopics = disciplina.modulos
              .flatMap((m) => m.topicos)
              .filter((t) => t.status === "ativo");
            if (activeTopics.length === 0) return null;

            const accent = disciplineAccentText[disciplina.id as DisciplinaId];

            return (
              <Card
                key={disciplina.id}
                disciplinaId={disciplina.id as DisciplinaId}
                accent
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/${disciplina.id}`}
                      className={`text-xl font-semibold hover:text-primary transition-colors ${accent}`}
                    >
                      {disciplina.nome}
                    </Link>
                    <p className="text-fg-muted">
                      {activeTopics.length} tópico(s) ativo(s) no momento.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {activeTopics.map((topico) => {
                    const topicoSlug = topicoSlugFromId(topico.id);
                    const href = `/${disciplina.id}/${topicoSlug}`;
                    return (
                      <li key={topico.id}>
                        <Link
                          href={href}
                          className="text-fg hover:text-primary transition-colors"
                        >
                          {topico.nome}
                        </Link>
                        <div className="text-sm text-fg-muted">
                          {topico.descricao}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
