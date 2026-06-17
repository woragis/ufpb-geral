import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { DisciplinaId } from "@/core/domain/ids";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { disciplineAccentText } from "@/lib/discipline-accent";
import { ExerciseView } from "@/app/components/exercise/ExerciseView";
import { ExerciseUrlSync } from "@/app/components/exercise/ExerciseUrlSync";
import { ShareExerciseButton } from "@/app/components/exercise/ShareExerciseButton";
import { EngagementActions } from "@/app/components/engagement/EngagementActions";
import { PersonalExerciseTracker } from "@/app/components/personal/PersonalExerciseTracker";
import { ExplainPanel } from "@/app/components/ai/ExplainPanel";
import { ExamTimer } from "@/app/components/exam/ExamTimer";
import { generateAndSolve } from "@/core/application/generate-and-solve";
import { buildExerciseHref } from "@/core/application/exercise-url";
import { decodeImportPayload } from "@/core/application/import-payload-codec";
import { solveFromDados } from "@/core/application/solve-from-dados";
import { encodeExerciseSeed } from "@/core/application/seed-codec";
import { resolveVisualSpecs } from "@/core/presentation/visual/resolve-visual-specs";
import { MathContent } from "@/app/components/math/MathContent";
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

function param(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function TopicPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ disciplinaId: string; topicoSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  const disciplina = getDisciplina(params.disciplinaId as any);
  if (!disciplina) notFound();

  const topico = getTopico(disciplina.id as any, params.topicoSlug);
  if (!topico || topico.status !== "ativo") {
    notFound();
  }

  const examMode = param(searchParams, "mode") === "prova";
  const examMinutes = Number(param(searchParams, "minutes") ?? "30");

  const stepParam = param(searchParams, "step");
  const revealStepsRaw = stepParam ? Number(stepParam) : 0;
  const revealSteps =
    Number.isFinite(revealStepsRaw) && revealStepsRaw >= 0
      ? Math.floor(revealStepsRaw)
      : 0;

  const importPayload = (() => {
    const p = param(searchParams, "p");
    return p ? decodeImportPayload(p) : null;
  })();

  const seedParams = toSearchParams(searchParams);

  const seedFromUrl = (() => {
    if (importPayload) return null;
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
    if (importPayload) {
      result = solveFromDados({
        topicoId: importPayload.topicoId,
        disciplinaId: disciplina.id as any,
        dificuldade: importPayload.dificuldade,
        dados: importPayload.dados,
        generatorVersion: importPayload.generatorVersion,
        revealSteps: examMode ? 0 : revealSteps,
      });
    } else {
      result = generateAndSolve({
        topicoId: topico.id,
        disciplinaId: disciplina.id as any,
        dificuldade: seedFromUrl?.dificuldade,
        seed: seedFromUrl?.seed,
        generatorVersion: seedFromUrl?.generatorVersion,
        revealSteps: examMode ? 0 : revealSteps,
      });
    }
  } catch {
    notFound();
  }

  const { solution, stepsVisiveis, problem, exerciseSeed } = result;
  const visualSpecs = resolveVisualSpecs(problem);

  const currentStep = stepsVisiveis.length;
  const respostaFinalRevelada = currentStep >= solution.steps.length;
  const nextStep = currentStep + 1;
  const hasNext = !examMode && nextStep <= solution.steps.length;

  const importPayloadParam = param(searchParams, "p");
  const basePath = `/${disciplina.id}/${params.topicoSlug}`;

  const urlOptions = {
    seed: exerciseSeed,
    step: currentStep,
    examMode,
    examMinutes,
    importPayload: importPayloadParam,
  };

  const exerciseHref = buildExerciseHref(
    disciplina.id,
    params.topicoSlug,
    urlOptions,
  );

  const nextHref = buildExerciseHref(disciplina.id, params.topicoSlug, {
    ...urlOptions,
    step: nextStep,
  });

  const submitHref = buildExerciseHref(disciplina.id, params.topicoSlug, {
    ...urlOptions,
    step: solution.steps.length,
  });

  const printQuery = buildExerciseHref(disciplina.id, params.topicoSlug, {
    seed: exerciseSeed,
    importPayload: importPayloadParam,
  }).split("?")[1];
  const printUrl = `${basePath}/print${printQuery ? `?${printQuery}` : ""}`;

  const examStartHref = buildExerciseHref(disciplina.id, params.topicoSlug, {
    seed: exerciseSeed,
    examMode: true,
    examMinutes: 30,
  });

  const novoExercicioHref = importPayloadParam
    ? basePath
    : `${basePath}?d=${exerciseSeed.dificuldade}`;

  const shareCode = importPayload ? null : encodeExerciseSeed(exerciseSeed);
  const shareText = `Exercício de ${disciplina.nome} — ${topico.nome}`;

  return (
    <div className="flex flex-col flex-1">
      <Suspense fallback={null}>
        <ExerciseUrlSync
          disciplinaId={disciplina.id}
          topicoSlug={params.topicoSlug}
          exerciseSeed={exerciseSeed}
          currentStep={currentStep}
          examMode={examMode}
          examMinutes={examMinutes}
          importPayloadParam={importPayloadParam}
        />
      </Suspense>
      <main className="w-full max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-semibold text-fg ${disciplineAccentText[disciplina.id as DisciplinaId]}`}>
              {disciplina.nome} — {topico.nome}
              {importPayload ? (
                <span className="ml-2 text-sm font-normal text-ai-muted-fg">
                  (importado)
                </span>
              ) : null}
            </h1>
            <p className="text-fg-muted">{topico.descricao}</p>
          </div>
          <ButtonLink href="/" variant="secondary">
            Início
          </ButtonLink>
        </div>

        {examMode ? <ExamTimer minutes={examMinutes} /> : null}

        <Card className="mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm text-fg-muted">
                Dificuldade: {exerciseSeed.dificuldade} · Passos visíveis:{" "}
                {examMode ? "ocultos" : `${currentStep}/${solution.steps.length}`}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <EngagementActions
                  disciplinaId={disciplina.id as DisciplinaId}
                  exerciseSeed={exerciseSeed}
                />
                <PersonalExerciseTracker
                  disciplinaId={disciplina.id as DisciplinaId}
                  exerciseSeed={exerciseSeed}
                  topicoNome={topico.nome}
                  enunciadoPreview={problem.enunciado}
                  currentStep={currentStep}
                />
                <ShareExerciseButton
                  relativeHref={exerciseHref}
                  title={shareText}
                  text={shareText}
                  shareCode={shareCode}
                />
                <ButtonLink href={printUrl} variant="secondary" target="_blank">
                  PDF
                </ButtonLink>
                {!examMode ? (
                  <ButtonLink href={examStartHref} variant="warningSoft">
                    Modo prova
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            <div className="text-sm text-fg-subtle">
              Exercício ID: {problem.id}
            </div>
          </div>

          <ExerciseView
            problem={problem}
            stepsVisiveis={stepsVisiveis}
            visualSpecs={visualSpecs}
          />

          <ExplainPanel
            topicoId={topico.id}
            disciplinaId={disciplina.id}
            enunciado={problem.enunciado}
            enunciadoLatex={problem.enunciadoLatex}
            stepsVisiveis={stepsVisiveis}
            respostaFinalRevelada={respostaFinalRevelada}
            respostaFinal={solution.respostaFinal}
          />

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {examMode && !respostaFinalRevelada ? (
              <ButtonLink href={submitHref} variant="warning">
                Entregar prova
              </ButtonLink>
            ) : hasNext ? (
              <ButtonLink href={nextHref} variant="primary">
                Revelar próximo passo
              </ButtonLink>
            ) : (
              <div className="text-sm text-fg-muted">
                Resposta final:{" "}
                <MathContent latex={solution.respostaFinalLatex}>
                  {solution.respostaFinal}
                </MathContent>
              </div>
            )}

            <ButtonLink href={novoExercicioHref} variant="secondary">
              Novo exercício
            </ButtonLink>
          </div>
        </Card>
      </main>
    </div>
  );
}
