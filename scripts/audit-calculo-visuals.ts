import { generateAndSolve } from "../src/core/application/generate-and-solve";
import { resolveVisualSpecs } from "../src/core/presentation/visual/resolve-visual-specs";
import { listRegisteredTopicos } from "../src/infrastructure/registry/problem-registry";
import type { Dificuldade } from "../src/core/domain/ids";

const SEEDS = 80;

function main(): void {
  const calcTopicos = listRegisteredTopicos().filter((t) =>
    t.topicoId.startsWith("calculo."),
  );

  let total = 0;
  let missVisual = 0;
  const missByTipo = new Map<string, number>();
  const coveredTipos = new Set<string>();

  for (const { topicoId, version } of calcTopicos) {
    for (let i = 0; i < SEEDS; i++) {
      const seed = `visual-audit-${i}`;
      const dificuldade = ((i % 3) + 1) as Dificuldade;
      const result = generateAndSolve({
        topicoId,
        disciplinaId: "calculo",
        seed,
        dificuldade,
        generatorVersion: version,
      });
      const tipo = (result.problem.dados as { tipo?: string }).tipo ?? "?";
      total++;
      coveredTipos.add(tipo);

      const specs = resolveVisualSpecs(result.problem);
      if (specs.length === 0) {
        missVisual++;
        missByTipo.set(tipo, (missByTipo.get(tipo) ?? 0) + 1);
      }
    }
  }

  console.log(
    `Visual audit (cálculo): ${calcTopicos.length} tópicos × ${SEEDS} seeds\n`,
  );
  console.log(`Problemas: ${total}`);
  console.log(`Sem visual: ${missVisual}/${total}`);
  console.log(`Tipos distintos vistos: ${coveredTipos.size}`);

  if (missByTipo.size > 0) {
    console.log("\nFaltas por tipo:");
    for (const [k, v] of [...missByTipo.entries()].sort()) {
      console.log(`  ${k}: ${v}`);
    }
  }

  if (missVisual > 0) {
    process.exit(1);
  }
  console.log("\nVisual audit passou.");
}

main();
