import { generateAndSolve } from "../src/core/application/generate-and-solve";
import { enrichProblem, enrichSolution } from "../src/infrastructure/latex/enrich";
import { listRegisteredTopicos } from "../src/infrastructure/registry/problem-registry";
import type { Dificuldade } from "../src/core/domain/ids";

const SEEDS = 80;

function main(): void {
  const calcTopicos = listRegisteredTopicos().filter((t) =>
    t.topicoId.startsWith("calculo."),
  );

  let total = 0;
  let missEnunciado = 0;
  let missStepCalculo = 0;
  let missStepExplicacao = 0;
  const missByTipo = new Map<string, number>();

  for (const { topicoId, version } of calcTopicos) {
    for (let i = 0; i < SEEDS; i++) {
      const seed = `latex-audit-${i}`;
      const dificuldade = ((i % 3) + 1) as Dificuldade;
      const result = generateAndSolve({
        topicoId,
        disciplinaId: "calculo",
        seed,
        dificuldade,
        generatorVersion: version,
      });
      const p = enrichProblem(result.problem);
      const s = enrichSolution(p, result.solution);
      const tipo = (p.dados as { tipo?: string }).tipo ?? "?";
      total++;

      if (!p.enunciadoLatex?.trim()) {
        missEnunciado++;
        missByTipo.set(`en:${tipo}`, (missByTipo.get(`en:${tipo}`) ?? 0) + 1);
      }

      for (const step of s.steps) {
        if (step.calculo && !step.calculoLatex?.trim()) {
          missStepCalculo++;
        }
        if (step.explicacao && !step.explicacaoLatex?.trim()) {
          missStepExplicacao++;
        }
      }
    }
  }

  console.log(`LaTeX audit (cálculo): ${calcTopicos.length} tópicos × ${SEEDS} seeds\n`);
  console.log(`Problemas: ${total}`);
  console.log(`Sem enunciadoLatex: ${missEnunciado}/${total}`);
  console.log(`Passos sem calculoLatex: ${missStepCalculo}`);
  console.log(`Passos sem explicacaoLatex: ${missStepExplicacao}`);

  if (missByTipo.size > 0) {
    console.log("\nFaltas por tipo (enunciado):");
    for (const [k, v] of [...missByTipo.entries()].sort()) {
      console.log(`  ${k}: ${v}`);
    }
  }

  if (missEnunciado > 0 || missStepCalculo > 0 || missStepExplicacao > 0) {
    process.exit(1);
  }
  console.log("\nLaTeX audit passou.");
}

main();
