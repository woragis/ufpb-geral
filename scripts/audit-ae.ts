import { generateAndSolve } from "../src/core/application/generate-and-solve";
import { enrichProblem, enrichSolution } from "../src/infrastructure/latex/enrich";
import { resolveVisualSpecs } from "../src/core/presentation/visual/resolve-visual-specs";
import { listRegisteredTopicos } from "../src/infrastructure/registry/problem-registry";
import type { Dificuldade } from "../src/core/domain/ids";

const SEEDS = 80;

function main(): void {
  const topicos = listRegisteredTopicos().filter((t) =>
    t.topicoId.startsWith("analise-exploratoria."),
  );

  let total = 0;
  let missEnunciado = 0;
  let missVisual = 0;
  let missStepCalculo = 0;
  let missStepExplicacao = 0;
  const tipos = new Set<string>();
  const visualKinds = new Map<string, number>();

  for (const { topicoId, version } of topicos) {
    for (let i = 0; i < SEEDS; i++) {
      const seed = `ae-audit-${i}`;
      const dificuldade = ((i % 3) + 1) as Dificuldade;
      const result = generateAndSolve({
        topicoId,
        disciplinaId: "analise-exploratoria",
        seed,
        dificuldade,
        generatorVersion: version,
      });
      const p = enrichProblem(result.problem);
      const s = enrichSolution(p, result.solution);
      const tipo = (p.dados as { tipo?: string }).tipo ?? "?";
      total++;
      tipos.add(tipo);

      if (!p.enunciadoLatex?.trim()) missEnunciado++;

      const specs = resolveVisualSpecs(result.problem);
      if (specs.length === 0) {
        missVisual++;
      } else {
        for (const spec of specs) {
          visualKinds.set(spec.kind, (visualKinds.get(spec.kind) ?? 0) + 1);
        }
      }

      for (const step of s.steps) {
        if (step.calculo && !step.calculoLatex?.trim()) missStepCalculo++;
        if (step.explicacao && !step.explicacaoLatex?.trim()) missStepExplicacao++;
      }
    }
  }

  console.log(`AE audit: ${topicos.length} tópicos × ${SEEDS} seeds\n`);
  console.log(`Problemas: ${total}`);
  console.log(`Tipos distintos: ${tipos.size}`);
  console.log(`Sem enunciadoLatex: ${missEnunciado}/${total}`);
  console.log(`Sem visual: ${missVisual}/${total}`);
  console.log(`Passos sem calculoLatex: ${missStepCalculo}`);
  console.log(`Passos sem explicacaoLatex: ${missStepExplicacao}`);

  console.log("\nTipos de visual usados:");
  for (const [k, v] of [...visualKinds.entries()].sort()) {
    console.log(`  ${k}: ${v}`);
  }

  if (
    missEnunciado > 0 ||
    missVisual > 0 ||
    missStepCalculo > 0 ||
    missStepExplicacao > 0
  ) {
    process.exit(1);
  }
  console.log("\nAE audit passou.");
}

main();
