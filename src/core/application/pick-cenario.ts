import type { GeneratorContext } from "@/core/domain/generator";

export interface CenarioEntry<T> {
  tipo: string;
  gerar: (ctx: GeneratorContext<{ tipo?: string }>) => T;
}

export function pickCenarioByTipo<T>(
  ctx: GeneratorContext<{ tipo?: string }>,
  cenarios: CenarioEntry<T>[],
  pool?: CenarioEntry<T>[],
): T {
  const base = pool ?? cenarios;
  const tipo = ctx.params?.tipo;
  const filtered =
    tipo && tipo !== "todos"
      ? base.filter((c) => c.tipo === tipo)
      : base;

  if (filtered.length === 0) {
    throw new Error(`Nenhum cenário para o subtópico: ${tipo ?? "?"}`);
  }

  return ctx.rng.pick(filtered).gerar(ctx);
}
