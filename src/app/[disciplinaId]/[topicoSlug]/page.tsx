import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/app/components/CopyButton";
import { generateAndSolve } from "@/core/application/generate-and-solve";
import { encodeExerciseSeed } from "@/core/application/seed-codec";
import { getDisciplina, getTopico } from "@/infrastructure/catalog/disciplines";

import type { ExerciseSeed } from "@/core/domain/seed";

export const dynamic = "force-dynamic";

function toSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  return params;
}

export default function TopicPage({
  params,
  searchParams,
}: {
  params: { disciplinaId: string; topicoSlug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const disciplina = getDisciplina(params.disciplinaId as any);
  if (!disciplina) notFound();

  const topico = getTopico(disciplina.id as any, params.topicoSlug);
  if (!topico || topico.status !== "ativo") {
    // Para MVP, somente tópicos ativos têm geradores/solvers.
    notFound();
  }

  const stepParam = Array.isArray(searchParams.step)
    ? searchParams.step[0]
    : searchParams.step;
  const revealStepsRaw = stepParam ? Number(stepParam) : 0;
  const revealSteps =
    Number.isFinite(revealStepsRaw) && revealStepsRaw >= 0
      ? Math.floor(revealStepsRaw)
      : 0;
  const seedParams = toSearchParams(searchParams);

  const seedFromUrl = (() => {
    const s = seedParams.get("s");
    if (!s) return null;
    const dRaw = Number(seedParams.get("d") ?? "2");
    const vRaw = Number(seedParams.get("v") ?? "1");

    if (![1, 2, 3].includes(dRaw)) return null;
    if (!Number.isFinite(vRaw) || vRaw < 1) return null;

    return {
      topicoId: topico.id,
      dificuldade: dRaw as 1 | 2 | 3,
      seed: s,
      generatorVersion: vRaw,
    } satisfies ExerciseSeed;
  })();

  let result: ReturnType<typeof generateAndSolve>;
  try {
    result = generateAndSolve({
      topicoId: topico.id,
      disciplinaId: disciplina.id as any,
      dificuldade: seedFromUrl?.dificuldade,
      seed: seedFromUrl?.seed,
      generatorVersion: seedFromUrl?.generatorVersion,
      revealSteps,
    });
  } catch {
    notFound();
  }

  const { solution, stepsVisiveis, problem, exerciseSeed } = result;

  const currentStep = stepsVisiveis.length;

  const basePath = `/${disciplina.id}/${params.topicoSlug}`;
  const shareParams = new URLSearchParams();
  shareParams.set("s", exerciseSeed.seed);
  shareParams.set("d", String(exerciseSeed.dificuldade));
  if (exerciseSeed.generatorVersion !== 1) {
    shareParams.set("v", String(exerciseSeed.generatorVersion));
  }
  shareParams.set("step", String(currentStep));

  const shareUrl = `${basePath}?${shareParams.toString()}`;
  const shareCode = encodeExerciseSeed(exerciseSeed);

  const nextStep = currentStep + 1;
  const hasNext = nextStep <= solution.steps.length;

  const nextParams = new URLSearchParams(shareParams);
  nextParams.set("step", String(nextStep));
  const nextUrl = `${basePath}?${nextParams.toString()}`;

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {disciplina.nome} — {topico.nome}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300">{topico.descricao}</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
          >
            Início
          </Link>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                Dificuldade: {exerciseSeed.dificuldade} · Passos visíveis:{" "}
                {currentStep}/{solution.steps.length}
              </div>
              <div className="flex items-center gap-2">
                <CopyButton value={shareCode} label="Copiar código" />
                <CopyButton value={shareUrl} label="Copiar link" />
              </div>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Exercício ID (determinístico): {problem.id}
            </div>
          </div>

          <div className="mt-4 text-zinc-900 dark:text-zinc-50">
            <h2 className="font-semibold mb-2">Enunciado</h2>
            <div className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
              {problem.enunciado}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {stepsVisiveis.map((step) => (
              <div
                key={step.ordem}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Passo {step.ordem}: {step.titulo}
                </div>
                <div className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {step.explicacao}
                </div>
                {step.calculo ? (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Cálculo
                    </div>
                    <pre className="mt-1 whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
                      {step.calculo}
                    </pre>
                  </div>
                ) : null}
                {step.resultado ? (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Resultado
                    </div>
                    <div className="mt-1 rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
                      {step.resultado}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {hasNext ? (
              <Link
                href={nextUrl}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black"
              >
                Revelar próximo passo
              </Link>
            ) : (
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                Resposta final: {solution.respostaFinal}
              </div>
            )}

            <Link
              href={basePath}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
            >
              Novo exercício
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

