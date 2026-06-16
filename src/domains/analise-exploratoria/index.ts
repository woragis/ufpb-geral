import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { medidasTendenciaGenerator } from "./generators/medidas-tendencia.generator";
import { medidasTendenciaSolver } from "./solvers/medidas-tendencia.solver";
import { TOPICO_MEDIDAS_TENDENCIA } from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "ae-1",
    nome: "Análise Exploratória",
    ordem: 1,
    topicos: [
      {
        id: "analise-exploratoria.tipos-dados",
        nome: "Tipos e escalas de dados",
        descricao: "Nominal, ordinal, intervalar e razão.",
        status: "planejado",
      },
      {
        id: TOPICO_MEDIDAS_TENDENCIA,
        nome: "Medidas de tendência central",
        descricao: "Média, mediana e moda.",
        status: "ativo",
      },
      {
        id: "analise-exploratoria.medidas-dispersao",
        nome: "Medidas de dispersão",
        descricao: "Variância, desvio padrão e amplitude.",
        status: "planejado",
      },
      {
        id: "analise-exploratoria.distribuicoes",
        nome: "Distribuições e gráficos",
        descricao: "Histogramas, boxplots e forma da distribuição.",
        status: "planejado",
      },
      {
        id: "analise-exploratoria.correlacao",
        nome: "Correlação",
        descricao: "Associação entre variáveis quantitativas.",
        status: "planejado",
      },
    ],
  },
];

export const analiseExploratoriaDomain: DomainModule & {
  nome: string;
  descricao: string;
  modulos: ModuloMeta[];
} = {
  disciplinaId: "analise-exploratoria",
  nome: "Análise Exploratória",
  descricao: "Resumo, visualização e interpretação de dados.",
  modulos,
  topicos: modulos.flatMap((m) => m.topicos),
  entries: [
    {
      topicoId: TOPICO_MEDIDAS_TENDENCIA,
      generator: medidasTendenciaGenerator,
      solver: medidasTendenciaSolver,
    },
  ],
};
