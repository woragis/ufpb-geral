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
    if (d.tipo === "tipos-dados") {
      const escala = d.escalaCorreta;
      const resposta = escala.charAt(0).toUpperCase() + escala.slice(1);
      return {
        problemaId: problema.id,
        respostaFinal: resposta,
        steps: [
          {
            ordem: 1,
            titulo: "Analisar a variável",
            explicacao: `Observamos se há ordem, diferença mensurável e zero absoluto para "${d.variavel}".`,
            calculo: `Exemplos: ${d.exemplos.join(", ")}`,
          },
          {
            ordem: 2,
            titulo: "Classificar a escala",
            explicacao: EXPLICACOES_ESCALA[escala],
            calculo: `Escala: ${escala}`,
            resultado: resposta,
          },
        ],
      };
    }

    const resposta = GRAFICO_LABEL[d.graficoCorreto];
    return {
      problemaId: problema.id,
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
  },
};
