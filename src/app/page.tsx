import Link from "next/link";
import { disciplinas, topicoSlugFromId } from "@/infrastructure/catalog/disciplines";
import { CopyCodeForm } from "./components/CopyCodeForm";
import { ImportExerciseForm } from "./components/ai/ImportExerciseForm";
import { PersonalPanels } from "./components/personal/PersonalPanels";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-4xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            UFPB Study — Exercícios com seeds
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300">
            Gere exercícios aleatórios (determinísticos) e compartilhe pelo
            código.
          </p>
        </header>

        <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Colar código do exercício
          </h2>
          <CopyCodeForm />
        </section>

        <PersonalPanels />

        <section className="mb-10 rounded-xl border border-violet-200 bg-white p-4 dark:border-violet-900 dark:bg-black">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Importar exercício com IA
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">
            Cole um enunciado em texto livre; a IA mapeia para um tópico do site.
          </p>
          <ImportExerciseForm />
        </section>

        <section className="grid gap-4">
          {disciplinas.map((disciplina) => {
            const activeTopics = disciplina.modulos.flatMap((m) => m.topicos).filter((t) => t.status === "ativo");
            if (activeTopics.length === 0) return null;

            return (
              <div
                key={disciplina.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/${disciplina.id}`}
                      className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
                    >
                      {disciplina.nome}
                    </Link>
                    <p className="text-zinc-600 dark:text-zinc-300">
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
                          className="text-zinc-900 dark:text-zinc-50 hover:underline"
                        >
                          {topico.nome}
                        </Link>
                        <div className="text-sm text-zinc-600 dark:text-zinc-300">
                          {topico.descricao}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
