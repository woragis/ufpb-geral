import { generateAndSolve } from "../src/core/application/generate-and-solve";
import { findTopicoById } from "../src/infrastructure/catalog/disciplines";
import { listRegisteredTopicos } from "../src/infrastructure/registry/problem-registry";
import { resolveVisualSpecs } from "../src/core/presentation/visual/resolve-visual-specs";
import type { Dificuldade } from "../src/core/domain/ids";

const SEEDS_PER_TOPIC = Number(process.env.SMOKE_SEEDS_PER_TOPIC ?? "100");
const DIVERSITY_MIN = Number(process.env.SMOKE_DIVERSITY_MIN ?? "3");

/** Tópicos com menos de 3 cenários estruturais por design. */
const DIVERSITY_FLOOR: Record<string, number> = {};

interface Failure {
  topicoId: string;
  seed: string;
  error: string;
}

function main(): void {
  const topicos = listRegisteredTopicos();
  const failures: Failure[] = [];
  const tiposPorTopico = new Map<string, Set<string>>();
  let total = 0;

  console.log(`Smoke test: ${topicos.length} tópicos × ${SEEDS_PER_TOPIC} seeds\n`);

  for (const { topicoId, version } of topicos) {
    const found = findTopicoById(topicoId);
    if (!found) {
      failures.push({
        topicoId,
        seed: "-",
        error: "Tópico não encontrado no catálogo",
      });
      continue;
    }

    const disciplinaId = found.disciplina.id;
    let topicOk = 0;
    const tipos = new Set<string>();

    for (let i = 0; i < SEEDS_PER_TOPIC; i++) {
      const seed = `smoke-${i}`;
      const dificuldade = ((i % 3) + 1) as Dificuldade;
      total++;

      try {
        const result = generateAndSolve({
          topicoId,
          disciplinaId,
          seed,
          dificuldade,
          generatorVersion: version,
        });

        if (!result.solution.respostaFinal?.trim()) {
          throw new Error("respostaFinal vazia");
        }
        if (result.solution.steps.length < 1) {
          throw new Error("nenhum passo na solução");
        }

        const specs = resolveVisualSpecs(result.problem);
        if (
          specs.length === 0 &&
          (result.problem.disciplinaId === "calculo-vetorial" ||
            result.problem.disciplinaId === "analise-exploratoria")
        ) {
          const tipo = (result.problem.dados as { tipo?: string }).tipo;
          throw new Error(`visual vazio para tipo ${tipo ?? "?"}`);
        }

        const tipo = (result.problem.dados as { tipo?: string }).tipo;
        if (tipo) tipos.add(tipo);

        topicOk++;
      } catch (err) {
        failures.push({
          topicoId,
          seed,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    tiposPorTopico.set(topicoId, tipos);

    const requiredDiversity =
      version >= 2 ? (DIVERSITY_FLOOR[topicoId] ?? DIVERSITY_MIN) : 1;
    if (tipos.size < requiredDiversity) {
      failures.push({
        topicoId,
        seed: "diversity",
        error: `apenas ${tipos.size} tipo(s) distinto(s) em ${SEEDS_PER_TOPIC} seeds (mínimo ${requiredDiversity})`,
      });
    }

    const status = topicOk === SEEDS_PER_TOPIC ? "OK" : "FAIL";
    const div =
      version >= 2 ? `, ${tipos.size} tipos` : "";
    console.log(`  [${status}] ${topicoId} — ${topicOk}/${SEEDS_PER_TOPIC}${div}`);
  }

  console.log(`\nTotal: ${total - failures.length}/${total} OK`);

  if (failures.length > 0) {
    console.error(`\n${failures.length} falha(s):`);
    for (const f of failures.slice(0, 20)) {
      console.error(`  - ${f.topicoId} seed=${f.seed}: ${f.error}`);
    }
    if (failures.length > 20) {
      console.error(`  ... e mais ${failures.length - 20}`);
    }
    process.exit(1);
  }

  console.log("\nSmoke test passou.");
}

main();
