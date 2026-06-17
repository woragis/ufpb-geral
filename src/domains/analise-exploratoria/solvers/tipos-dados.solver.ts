import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_TIPOS_DADOS, type TiposDadosData } from "../entities/types";

const EXPLICACOES_ESCALA: Record<
  Extract<TiposDadosData, { tipo: "tipos-dados" }>["escalaCorreta"],
  string
> = {
  nominal: "Categorias sem ordem natural — apenas classificam.",
  ordinal: "Categorias com ordem, mas diferenças não são uniformes.",
  intervalar: "Diferenças são significativas, mas não há zero absoluto.",
  razao: "Possui zero absoluto — razões entre valores fazem sentido.",
};

const EXPLICACOES_GRAFICO: Record<
  Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>["graficoCorreto"],
  string
> = {
  barras: "Dados categóricos são comparados por frequência em barras.",
  histograma: "Distribuição de dados quantitativos discretos ou agrupados.",
  linha: "Séries temporais mostram evolução ao longo do tempo.",
  boxplot: "Resumo de distribuição contínua com quartis e outliers.",
};

const GRAFICO_LABEL: Record<
  Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>["graficoCorreto"],
  string
> = {
  barras: "Gráfico de barras",
  histograma: "Histograma",
  linha: "Gráfico de linhas",
  boxplot: "Boxplot",
};

export const tiposDadosSolver: ProblemSolver = {
  topicoId: TOPICO_TIPOS_DADOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as TiposDadosData;
    switch (d.tipo) {
      case "tipos-dados":
        return solveEscala(d, problema.id);
      case "tipos-dados-grafico":
        return solveGrafico(d, problema.id);
      case "tipos-dados-frequencia":
        return solveFrequencia(d, problema.id);
      case "tipos-dados-media-escala":
        return solveMediaEscala(d, problema.id);
    }
  },
};

function solveEscala(
  d: Extract<TiposDadosData, { tipo: "tipos-dados" }>,
  problemaId: string,
): Solution {
  const resposta = d.escalaCorreta.charAt(0).toUpperCase() + d.escalaCorreta.slice(1);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Analisar a variável",
        explicacao: `Observamos ordem, diferença mensurável e zero absoluto para "${d.variavel}".`,
        calculo: `Exemplos: ${d.exemplos.join(", ")}`,
      },
      {
        ordem: 2,
        titulo: "Classificar a escala",
        explicacao: EXPLICACOES_ESCALA[d.escalaCorreta],
        calculo: `Escala: ${d.escalaCorreta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveGrafico(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>,
  problemaId: string,
): Solution {
  const resposta = GRAFICO_LABEL[d.graficoCorreto];
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Identificar o tipo de variável",
        explicacao: `A variável "${d.variavel}" é ${d.contexto.replace("-", " ")}.`,
        calculo: `Contexto: ${d.contexto}`,
      },
      {
        ordem: 2,
        titulo: "Escolher o gráfico",
        explicacao: EXPLICACOES_GRAFICO[d.graficoCorreto],
        calculo: `Gráfico: ${d.graficoCorreto}`,
        resultado: resposta,
      },
    ],
  };
}

function solveFrequencia(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-frequencia" }>,
  problemaId: string,
): Solution {
  if (d.pergunta === "total") {
    const total = d.frequencias.reduce((a, b) => a + b, 0);
    return {
      problemaId,
      respostaFinal: String(total),
      steps: [
        {
          ordem: 1,
          titulo: "Somar frequências",
          explicacao: "O total é a soma de todas as frequências.",
          calculo: `${d.frequencias.join(" + ")} = ${total}`,
          resultado: String(total),
        },
      ],
    };
  }
  let bestIdx = 0;
  let maxF = 0;
  for (let i = 0; i < d.frequencias.length; i++) {
    if (d.frequencias[i]! > maxF) {
      maxF = d.frequencias[i]!;
      bestIdx = i;
    }
  }
  const resposta = d.categorias[bestIdx]!;
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Comparar frequências",
        explicacao: "A categoria modal tem a maior frequência.",
        calculo: d.categorias.map((c, i) => `${c}: ${d.frequencias[i]}`).join(", "),
      },
      {
        ordem: 2,
        titulo: "Identificar a moda",
        explicacao: "Escolhemos a categoria com maior contagem.",
        calculo: `Categoria: ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveMediaEscala(
  d: Extract<TiposDadosData, { tipo: "tipos-dados-media-escala" }>,
  problemaId: string,
): Solution {
  const resposta = d.escalaCorreta.charAt(0).toUpperCase() + d.escalaCorreta.slice(1);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Critério da média",
        explicacao: "A média exige diferenças mensuráveis e, idealmente, zero absoluto.",
        calculo: `Variável: ${d.variavel}`,
      },
      {
        ordem: 2,
        titulo: "Classificar",
        explicacao:
          d.escalaCorreta === "razao"
            ? "Razão permite média e comparações proporcionais."
            : "Intervalar permite média de diferenças, mas razões não.",
        calculo: `Escala: ${d.escalaCorreta}`,
        resultado: resposta,
      },
    ],
  };
}
