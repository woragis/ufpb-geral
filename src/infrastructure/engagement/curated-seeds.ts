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
  // Cálculo 1 — v3 showcases
  { disciplinaId: "calculo", topicoId: "calculo.limites", seed: "showcase-0", dificuldade: 3, generatorVersion: 3, label: "Limite trig (sin/x)" },
  { disciplinaId: "calculo", topicoId: "calculo.limites", seed: "showcase-12", dificuldade: 3, generatorVersion: 3, label: "Limite eˣ e ln" },
  { disciplinaId: "calculo", topicoId: "calculo.limites", seed: "showcase-2", dificuldade: 3, generatorVersion: 3, label: "L'Hôpital" },
  { disciplinaId: "calculo", topicoId: "calculo.continuidade", seed: "showcase-8", dificuldade: 3, generatorVersion: 3, label: "Teorema do valor intermediário" },
  { disciplinaId: "calculo", topicoId: "calculo.continuidade", seed: "showcase-10", dificuldade: 3, generatorVersion: 3, label: "Teorema de Rolle" },
  { disciplinaId: "calculo", topicoId: "calculo.derivadas", seed: "showcase-16", dificuldade: 3, generatorVersion: 3, label: "Taxa relacionada" },
  { disciplinaId: "calculo", topicoId: "calculo.derivadas", seed: "showcase-4", dificuldade: 3, generatorVersion: 3, label: "Derivação implícita" },
  { disciplinaId: "calculo", topicoId: "calculo.derivadas", seed: "showcase-3", dificuldade: 3, generatorVersion: 3, label: "Derivada trig" },
  { disciplinaId: "calculo", topicoId: "calculo.regra-cadeia", seed: "showcase-3", dificuldade: 3, generatorVersion: 3, label: "sin²(x) e composições" },
  { disciplinaId: "calculo", topicoId: "calculo.regra-cadeia", seed: "showcase-5", dificuldade: 3, generatorVersion: 3, label: "Cadeia com trig" },
  { disciplinaId: "calculo", topicoId: "calculo.otimizacao", seed: "showcase-13", dificuldade: 3, generatorVersion: 3, label: "Cilindro — volume máximo" },
  { disciplinaId: "calculo", topicoId: "calculo.otimizacao", seed: "showcase-23", dificuldade: 3, generatorVersion: 3, label: "Caixa sem tampa" },
  { disciplinaId: "calculo", topicoId: "calculo.otimizacao", seed: "showcase-5", dificuldade: 3, generatorVersion: 3, label: "Esboço de gráfico" },
  { disciplinaId: "calculo", topicoId: "calculo.integrais-indefinidas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Integral indefinida" },
  { disciplinaId: "calculo", topicoId: "calculo.integrais-definidas", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Integral definida" },
  { disciplinaId: "calculo", topicoId: "calculo.area", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Área sob reta" },
  { disciplinaId: "calculo", topicoId: "calculo.sequencias", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Limite de sequência" },
  { disciplinaId: "calculo", topicoId: "calculo.series", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Série geométrica" },
  { disciplinaId: "calculo", topicoId: "calculo.taylor", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "Polinômio de Taylor" },
  { disciplinaId: "calculo", topicoId: "calculo.edos", seed: "curated-1", dificuldade: 2, generatorVersion: 1, label: "EDO linear" },
  // Probabilidade v2
  { disciplinaId: "probabilidade", topicoId: "probabilidade.espaco-amostral", seed: "showcase-v2-0", dificuldade: 3, generatorVersion: 2, label: "Baralho e modular" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.classica", seed: "showcase-v2-5", dificuldade: 3, generatorVersion: 2, label: "Dado, baralho e composição" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.condicional", seed: "showcase-v2-2", dificuldade: 3, generatorVersion: 2, label: "Bayes" },
  { disciplinaId: "probabilidade", topicoId: "probabilidade.variaveis-discretas", seed: "showcase-v2-8", dificuldade: 3, generatorVersion: 2, label: "Binomial e geométrica" },
  // Cálculo Vetorial v2
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.vetores", seed: "showcase-v2-1", dificuldade: 3, generatorVersion: 2, label: "Soma e vetor unitário" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.produto-escalar", seed: "showcase-v2-3", dificuldade: 3, generatorVersion: 2, label: "Ângulo e projeção" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.retas-planos", seed: "showcase-v2-4", dificuldade: 3, generatorVersion: 2, label: "Plano e distância" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.campos", seed: "showcase-v2-6", dificuldade: 3, generatorVersion: 2, label: "Gradiente, div e rot" },
  // Cálculo Vetorial v3
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.vetores", seed: "showcase-v3-0", dificuldade: 3, generatorVersion: 3, label: "Distância e paralelismo" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.curvas", seed: "showcase-v3-4", dificuldade: 3, generatorVersion: 3, label: "Círculo, comprimento e hélice" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.campos", seed: "showcase-v3-8", dificuldade: 3, generatorVersion: 3, label: "Gradiente e divergente 3D" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.produto-vetorial", seed: "showcase-v3-2", dificuldade: 3, generatorVersion: 3, label: "Área e produto misto" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.retas-planos", seed: "showcase-v3-6", dificuldade: 3, generatorVersion: 3, label: "Distância à reta e interseção" },
  { disciplinaId: "calculo-vetorial", topicoId: "calculo-vetorial.produto-escalar", seed: "showcase-v3-1", dificuldade: 3, generatorVersion: 3, label: "Projeção e ortogonalidade" },
  // Análise Exploratória v3
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.tipos-dados", seed: "showcase-v3-0", dificuldade: 2, generatorVersion: 3, label: "Escala de medição" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.tipos-dados", seed: "showcase-v3-1", dificuldade: 3, generatorVersion: 3, label: "Frequência e gráfico" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-tendencia", seed: "showcase-v3-2", dificuldade: 2, generatorVersion: 3, label: "Média e mediana" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-tendencia", seed: "showcase-v3-3", dificuldade: 3, generatorVersion: 3, label: "Média geométrica e escolha" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-dispersao", seed: "showcase-v3-4", dificuldade: 2, generatorVersion: 3, label: "Desvio e amplitude" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.medidas-dispersao", seed: "showcase-v3-5", dificuldade: 3, generatorVersion: 3, label: "MAD e variância populacional" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.distribuicoes", seed: "showcase-v3-6", dificuldade: 2, generatorVersion: 3, label: "IQR e boxplot" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.distribuicoes", seed: "showcase-v3-7", dificuldade: 3, generatorVersion: 3, label: "Histograma e assimetria" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.correlacao", seed: "showcase-v3-8", dificuldade: 2, generatorVersion: 3, label: "Pearson e Spearman" },
  { disciplinaId: "analise-exploratoria", topicoId: "analise-exploratoria.correlacao", seed: "showcase-v3-9", dificuldade: 3, generatorVersion: 3, label: "Interpretação e covariância" },
];

export function getCuratedSeedsForTopico(topicoId: TopicoId): CuratedSeed[] {
  return CURATED_SEEDS.filter((s) => s.topicoId === topicoId);
}

export function getCuratedSeedsForDisciplina(
  disciplinaId: DisciplinaId,
): CuratedSeed[] {
  return CURATED_SEEDS.filter((s) => s.disciplinaId === disciplinaId);
}
