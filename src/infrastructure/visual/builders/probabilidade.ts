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
    case "espaco-amostral-baralho":
    case "espaco-amostral-moeda-dado":
      return [buildEspacoAmostralBaralhoVisual()];
    case "eventos":
    case "eventos-probabilidade":
    case "eventos-exclusivos":
      return [buildEventosVisual(d as EventosData)];
    case "probabilidade-classica":
    case "probabilidade-classica-sem-reposicao":
      return [buildClassicaVisual(d as ProbabilidadeClassicaData)];
    case "probabilidade-classica-baralho":
      return [buildBaralhoVisual()];
    case "probabilidade-classica-dado-soma":
    case "probabilidade-classica-modular":
    case "probabilidade-classica-composta":
      return [buildDadoDuploVisual()];
    case "condicional":
    case "independencia":
    case "independencia-contraste":
      return [buildVennFromContagem(d as CondicionalData | IndependenciaData)];
    case "condicional-bayes":
    case "condicional-tabela":
    case "independencia-prob":
      return [buildProbTabelaVisual()];
    case "variaveis-discretas":
    case "variaveis-discretas-binomial":
    case "variaveis-discretas-geometrica":
    case "variaveis-discretas-variancia":
    case "variaveis-discretas-acumulada":
      return [buildVariaveisDiscretasVisual(d as VariaveisDiscretasData)];
    default:
      return [];
  }
}

function buildEventosVisual(d: EventosData): VisualSpec {
  const nAinterB = "nAinterB" in d ? d.nAinterB : 0;
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: nAinterB,
    ariaLabel: `Diagrama de Venn: |A|=${d.nA}, |B|=${d.nB}`,
  };
}

function buildClassicaVisual(d: ProbabilidadeClassicaData): VisualSpec {
  if (d.tipo !== "probabilidade-classica" && d.tipo !== "probabilidade-classica-sem-reposicao") {
    return buildDadoDuploVisual();
  }
  return {
    kind: "urn-diagram",
    colors: d.cores,
    targetColor: d.corAlvo,
    ariaLabel: `Urna com bolas e evento cor ${d.corAlvo}`,
  };
}

function buildEspacoAmostralVisual(d: EspacoAmostralData): VisualSpec {
  if (d.tipo !== "espaco-amostral") {
    return buildEspacoAmostralBaralhoVisual();
  }
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
  return buildDadoDuploVisual();
}

function buildVennFromContagem(
  d: CondicionalData | IndependenciaData,
): VisualSpec {
  if (!("nA" in d)) return buildProbTabelaVisual();
  return {
    kind: "venn-diagram",
    labelA: d.descricaoA,
    labelB: d.descricaoB,
    nA: d.nA,
    nB: d.nB,
    nIntersect: d.nAinterB,
    ariaLabel: "Diagrama de Venn",
  };
}

function buildProbTabelaVisual(): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Probabilidades",
    labels: ["P"],
    values: [1],
    ariaLabel: "Tabela de probabilidades",
  };
}

function buildDadoDuploVisual(): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Dois dados — |Ω| = 36",
    labels: ["|Ω|"],
    values: [36],
    ariaLabel: "36 pares ordenados possíveis",
  };
}

function buildEspacoAmostralBaralhoVisual(): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Baralho — 52 cartas",
    labels: ["|Ω|"],
    values: [52],
    ariaLabel: "52 cartas no baralho",
  };
}

function buildBaralhoVisual(): VisualSpec {
  return {
    kind: "bar-chart",
    title: "Baralho padrão",
    labels: ["copas", "espadas", "ouros", "paus", "figuras", "ás"],
    values: [13, 13, 13, 13, 12, 4],
    ariaLabel: "Composição do baralho",
  };
}

function roundProbLocal(x: number): number {
  return Math.round(x * 1000) / 1000;
}

function binomialProbSimple(n: number, k: number, p: number): number {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c * p ** k * (1 - p) ** (n - k);
}

function buildVariaveisDiscretasVisual(d: VariaveisDiscretasData): VisualSpec {
  if (d.tipo === "variaveis-discretas-binomial") {
    const values = Array.from({ length: d.n + 1 }, (_, k) =>
      roundProbLocal(binomialProbSimple(d.n, k, d.p)),
    );
    return {
      kind: "bar-chart",
      title: `Binomial(n=${d.n}, p=${d.p})`,
      labels: Array.from({ length: d.n + 1 }, (_, k) => String(k)),
      values,
      ariaLabel: `Distribuição binomial com n=${d.n}`,
    };
  }
  if (d.tipo === "variaveis-discretas-geometrica") {
    const labels = Array.from({ length: 6 }, (_, i) => String(i + 1));
    const values = labels.map((_, i) =>
      roundProbLocal((1 - d.p) ** i * d.p),
    );
    return {
      kind: "bar-chart",
      title: `Geométrica(p=${d.p})`,
      labels,
      values,
      ariaLabel: "Distribuição geométrica",
    };
  }
  if (!("valores" in d)) {
    return buildProbTabelaVisual();
  }
  return {
    kind: "bar-chart",
    title: "Função de probabilidade P(X = x)",
    labels: d.valores.map((v) => String(v)),
    values: d.probabilidades,
    ariaLabel: `Distribuição discreta com ${d.valores.length} valores`,
  };
}
