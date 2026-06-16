import Link from "next/link";
import { notFound } from "next/navigation";
import { getDisciplina } from "@/infrastructure/catalog/disciplines";

export default function DisciplinaPage({
  params,
}: {
  params: { disciplinaId: string };
}) {
  const disciplina = getDisciplina(params.disciplinaId as any);
  if (!disciplina) notFound();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {disciplina.nome}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300">{disciplina.descricao}</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
          >
            Voltar
          </Link>
        </div>

        <section className="space-y-6">
          {disciplina.modulos.map((modulo) => (
            <div
              key={modulo.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {modulo.nome}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                Tópicos organizados para estudo.
              </p>

              <ul className="mt-4 space-y-3">
                {modulo.topicos.map((topico) => {
                  const topicoSlug = topico.id.split(".").pop()!;
                  const href = `/${disciplina.id}/${topicoSlug}`;
                  const disabled = topico.status !== "ativo";
                  return (
                    <li key={topico.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          href={href}
                          className={
                            disabled
                              ? "pointer-events-none text-zinc-400"
                              : "text-zinc-900 dark:text-zinc-50 hover:underline"
                          }
                        >
                          {topico.nome}
                        </Link>
                        <span className="text-xs text-zinc-600 dark:text-zinc-300">
                          {topico.status === "ativo" ? "Ativo" : "Planejado"}
                        </span>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-300">
                        {topico.descricao}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

