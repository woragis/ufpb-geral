import { createSeededRandom } from "../src/core/application/create-seeded-random";
import { limitesGenerator } from "../src/domains/calculo/generators/limites.generator";
import { derivadasGenerator } from "../src/domains/calculo/generators/derivadas.generator";
import { regraCadeiaGenerator } from "../src/domains/calculo/generators/regra-cadeia.generator";
import { otimizacaoGenerator } from "../src/domains/calculo/generators/otimizacao.generator";
import { continuidadeGenerator } from "../src/domains/calculo/generators/continuidade.generator";
import type { TopicoId } from "../src/core/domain/ids";
import type { Dificuldade } from "../src/core/domain/ids";

function probe(
  gen: { gerar: (ctx: { topicoId: TopicoId; dificuldade: Dificuldade; rng: ReturnType<typeof createSeededRandom> }) => { dados: unknown } },
  topicoId: TopicoId,
  want: string[],
) {
  const found: Record<string, string> = {};
  for (let i = 0; i < 400; i++) {
    const seedStr = `showcase-${i}`;
    const seed = {
      topicoId,
      dificuldade: 3 as Dificuldade,
      seed: seedStr,
      generatorVersion: 3,
    };
    const rng = createSeededRandom(seed);
    const p = gen.gerar({ topicoId, dificuldade: 3, rng });
    const t = (p.dados as { tipo: string }).tipo;
    if (want.includes(t) && !found[t]) found[t] = seedStr;
    if (Object.keys(found).length === want.length) break;
  }
  return found;
}

const result = {
  limites: probe(limitesGenerator, "calculo.limites", [
    "limite-trig",
    "limite-exp-log",
    "limite-lhopital",
  ]),
  continuidade: probe(continuidadeGenerator, "calculo.continuidade", [
    "continuidade-tvi",
    "continuidade-rolle",
  ]),
  derivadas: probe(derivadasGenerator, "calculo.derivadas", [
    "derivadas-taxa-relacionada",
    "derivadas-implicita",
    "derivadas-trig",
  ]),
  regra: probe(regraCadeiaGenerator, "calculo.regra-cadeia", [
    "regra-cadeia-avancada",
    "regra-cadeia-trig",
  ]),
  otim: probe(otimizacaoGenerator, "calculo.otimizacao", [
    "otimizacao-cilindro",
    "otimizacao-caixa",
    "otimizacao-esboco",
  ]),
};

console.log(JSON.stringify(result, null, 2));
