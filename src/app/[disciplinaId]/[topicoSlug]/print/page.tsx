import Link from "next/link";
import { notFound } from "next/navigation";
import { ExerciseView } from "@/app/components/exercise/ExerciseView";
import { generateAndSolve } from "@/core/application/generate-and-solve";
import { decodeImportPayload } from "@/core/application/import-payload-codec";
import { solveFromDados } from "@/core/application/solve-from-dados";
import { resolveVisualSpecs } from "@/core/presentation/visual/resolve-visual-specs";
import { MathContent } from "@/app/components/math/MathContent";
import { getDisciplina, getTopico } from "@/infrastructure/catalog/disciplines";
import type { ExerciseSeed } from "@/core/domain/seed";

export const dynamic = "force-dynamic";

export default function PrintPage({
  params,
  searchParams,
}: {
  params: { disciplinaId: string; topicoSlug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const disciplina = getDisciplina(params.disciplinaId as any);
  if (!disciplina) notFound();

  const topico = getTopico(disciplina.id as any, params.topicoSlug);
  if (!topico || topico.status !== "ativo") notFound();

  const s = Array.isArray(searchParams.s) ? searchParams.s[0] : searchParams.s;
  const p = Array.isArray(searchParams.p) ? searchParams.p[0] : searchParams.p;
  const dRaw = Number(
    Array.isArray(searchParams.d) ? searchParams.d[0] : searchParams.d ?? "2",
  );
  const vRaw = Number(
    Array.isArray(searchParams.v) ? searchParams.v[0] : searchParams.v ?? "1",
  );

  let result: ReturnType<typeof generateAndSolve>;

  const importPayload = p ? decodeImportPayload(p) : null;

  try {
    if (importPayload) {
      result = solveFromDados({
        topicoId: importPayload.topicoId,
        disciplinaId: disciplina.id as any,
        dificuldade: importPayload.dificuldade,
        dados: importPayload.dados,
        generatorVersion: importPayload.generatorVersion,
        revealSteps: 999,
      });
    } else {
      const seedFromUrl: ExerciseSeed | null = s
        ? {
            topicoId: topico.id,
            dificuldade: ([1, 2, 3].includes(dRaw) ? dRaw : 2) as 1 | 2 | 3,
            seed: s,
            generatorVersion: Number.isFinite(vRaw) ? vRaw : 1,
          }
        : null;

      result = generateAndSolve({
        topicoId: topico.id,
        disciplinaId: disciplina.id as any,
        dificuldade: seedFromUrl?.dificuldade,
        seed: seedFromUrl?.seed,
        generatorVersion: seedFromUrl?.generatorVersion,
        revealSteps: 999,
      });
    }
  } catch {
    notFound();
  }

  const { problem, solution, stepsVisiveis } = result;
  const visualSpecs = resolveVisualSpecs(problem);

  return (
    <div className="print-page bg-white text-black p-8 max-w-3xl mx-auto">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">
          {disciplina.nome} — {topico.nome}
        </h1>
        <p className="text-sm text-zinc-600">Exportação PDF / impressão</p>
      </header>

      <ExerciseView
        problem={problem}
        stepsVisiveis={stepsVisiveis}
        visualSpecs={visualSpecs}
      />

      <div className="mt-6 border-t pt-4">
        <strong>Resposta final: </strong>
        <MathContent latex={solution.respostaFinalLatex}>
          {solution.respostaFinal}
        </MathContent>
      </div>

      <p className="mt-8 text-xs text-zinc-500 no-print">
        <Link href={`/${disciplina.id}/${params.topicoSlug}`}>Voltar ao exercício</Link>
        {" · "}
        Use Ctrl+P para imprimir ou salvar como PDF.
      </p>

      <style>{`
        @media print {
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
}
