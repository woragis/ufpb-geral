import type { DisciplinaId, TopicoId } from "@/core/domain/ids";
import type { ExerciseSeed } from "@/core/domain/seed";

export interface CuratedSeed extends ExerciseSeed {
  disciplinaId: DisciplinaId;
  label: string;
  boost?: number;
}

/** Seeds estáveis escolhidas para aparecer no catálogo antes de haver dados reais. */
export const CURATED_SEEDS: CuratedSeed[] = [
  // Probabilidade
  { disciplinaId: "probabilidade", topicoId: "probabilidade.espaco-amostral", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Espaço amostral clássico" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.eventos", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "União de eventos" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.classica", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Urna e bolas" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.condicional", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Probabilidade condicional" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.independencia", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Teste de independência" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.variaveis-discretas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Esperança discreta" },
  // Cálculo
  { disciplinaId: "calculo", topicoId: "calculo.limites", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Limite algébrico" },
  { disciplinaId: "calculo", topicoId: "calculo.continuidade", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Continuidade por partes" },
  { disciplinaId: "calculo", topicoId: "calculo.derivadas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Derivada em um ponto" },
  { disciplinaId: "calculo", topicoId: "calculo.regra-cadeia", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Regra da cadeia" },
  { disciplinaId: "calculo", topicoId: "calculo.otimizacao", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Otimização quadrática" },
  { disciplinaId: "calculo", topicoId: "calculo.integrais-indefinidas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Integral indefinida" },
  { disciplinaId: "calculo", topicoId: "calculo.integrais-definidas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Integral definida" },
  { disciplinaId: "calculo", topicoId: "calculo.area", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Área sob reta" },
  { disciplinaId: "calculo", topicoId: "calculo.sequencias", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Limite de sequência" },
  { disciplinaId: "calculo", topicoId: "calculo.series", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Série geométrica" },
  { disciplinaId: "calculo", topicoId: "calculo.taylor", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Polinômio de Taylor" },
  { disciplinaId: "calculo", topicoId: "calculo.edos", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "EDO linear" },
  // Cálculo Vetorial
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.vetores", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Módulo de vetor" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.produto-escalar", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Produto escalar" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.produto-vetorial", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Produto vetorial" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.retas-planos", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Vetor diretor" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.curvas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Curva paramétrica" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.campos", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Gradiente" },
  // Análise Exploratória
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.tipos-dados", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Escala de medição" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-tendencia", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Média aritmética" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-dispersao", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Desvio padrão" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.distribuicoes", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "IQR" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.correlacao", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Correlação de Pearson" },
];

export function getCuratedSeedsForTopico(topicoId: TopicoId): CuratedSeed[] {
  return CURATED_SEEDS.filter((s) => s.topicoId === topicoId);
}

export function getCuratedSeedsForDisciplina(
  disciplinaId: DisciplinaId,
): CuratedSeed[] {
  return CURATED_SEEDS.filter((s) => s.disciplinaId === disciplinaId);
}
