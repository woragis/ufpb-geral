import type { Problem } from "@/core/domain/problem";
import type { VisualSpec } from "@/core/presentation/visual/types";
import type {
  CondicionalData,
  EspacoAmostralData,
  EventosData,
  IndependenciaData,
  ProbabilidadeClassicaData,
  VariaveisDiscretasData,
} from "@/domains/probabilidade/entities/types";

export function buildProbabilidadeVisuals(problem: Problem): VisualSpec[] {
  const d = problem.dados as { tipo?: string };
  if (!d?.tipo) return [];

  switch (d.tipo) {
    case "espaco-amostral":
      return [buildEspacoAmostralVisual(d as EspacoAmostralData)];
    case "eventos":
      return [buildEventosVisual(d as EventosData)];
    case "probabilidade-classica":
      return [buildClassicaVisual(d as ProbabilidadeClassicaData)];
    case "condicional":
      return [buildCondicionalVisual(d as CondicionalData)];
    case "independencia":
      return [buildIndependenciaVisual(d as IndependenciaData)];
    case "variaveis-discretas":
      return [buildVariaveisDiscretasVisual(d as VariaveisDiscretasData)];
    default:
      return [];
  }
}

function buildEventosVisual(d: EventosData): VisualSpec {
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: `Diagrama de Venn: |A|=${d.nA}, |B|=${d.nB}, |A∩B|=${d.nAinterB}`,
  };
}

function buildClassicaVisual(d: ProbabilidadeClassicaData): VisualSpec {
  return {
    kind: "urn-diagram",
    colors: d.cores,
    targetColor: d.corAlvo,
    ariaLabel: `Urna com bolas e evento cor ${d.corAlvo}`,
  };
}

function buildEspacoAmostralVisual(d: EspacoAmostralData): VisualSpec {
  if (d.experimento === "moeda") {
    return {
      kind: "bar-chart",
      title: "Espaço amostral — moeda",
      labels: ["Cara", "Coroa"],
      values: [1, 1],
      ariaLabel: "Dois resultados equiprováveis",
    };
  }
  if (d.experimento === "dado") {
    return {
      kind: "bar-chart",
      title: "Espaço amostral — dado",
      labels: ["1", "2", "3", "4", "5", "6"],
      values: [1, 1, 1, 1, 1, 1],
      ariaLabel: "Seis faces equiprováveis",
    };
  }
  return {
    kind: "bar-chart",
    title: "Dois dados — cardinalidade |Ω| = 36",
    labels: ["|Ω|"],
    values: [36],
    ariaLabel: "36 pares ordenados possíveis",
  };
}

function buildCondicionalVisual(d: CondicionalData): VisualSpec {
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: `Diagrama de Venn para P(A|B) com |A∩B|=${d.nAinterB}, |B|=${d.nB}`,
  };
}

function buildIndependenciaVisual(d: IndependenciaData): VisualSpec {
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: `Diagrama de Venn para teste de independência`,
  };
}

function buildVariaveisDiscretasVisual(d: VariaveisDiscretasData): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Função de probabilidade P(X = x)",
    labels: d.valores.map((v) => String(v)),
    values: d.probabilidades,
    ariaLabel: `Distribuição discreta com ${d.valores.length} valores`,
  };
}
