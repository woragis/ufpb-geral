import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { medidasTendenciaGenerator } from "./generators/medidas-tendencia.generator";
import { medidasTendenciaSolver } from "./solvers/medidas-tendencia.solver";
import { tiposDadosGenerator } from "./generators/tipos-dados.generator";
import { tiposDadosSolver } from "./solvers/tipos-dados.solver";
import { medidasDispersaoGenerator } from "./generators/medidas-dispersao.generator";
import { medidasDispersaoSolver } from "./solvers/medidas-dispersao.solver";
import { distribuicoesGenerator } from "./generators/distribuicoes.generator";
import { distribuicoesSolver } from "./solvers/distribuicoes.solver";
import { correlacaoGenerator } from "./generators/correlacao.generator";
import { correlacaoSolver } from "./solvers/correlacao.solver";
import {
  TOPICO_MEDIDAS_TENDENCIA,
  TOPICO_TIPOS_DADOS,
  TOPICO_MEDIDAS_DISPERSAO,
  TOPICO_DISTRIBUICOES,
  TOPICO_CORRELACAO,
} from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "ae-1",
    nome: "Análise Exploratória",
    ordem: 1,
    topicos: [
      { id: TOPICO_TIPOS_DADOS, nome: "Tipos e escalas de dados", descricao: "Nominal, ordinal, intervalar e razão.", status: "ativo" },
      { id: TOPICO_MEDIDAS_TENDENCIA, nome: "Medidas de tendência central", descricao: "Média, mediana e moda.", status: "ativo" },
      { id: TOPICO_MEDIDAS_DISPERSAO, nome: "Medidas de dispersão", descricao: "Variância, desvio padrão e amplitude.", status: "ativo" },
      { id: TOPICO_DISTRIBUICOES, nome: "Distribuições e gráficos", descricao: "Histogramas, boxplots e forma da distribuição.", status: "ativo" },
      { id: TOPICO_CORRELACAO, nome: "Correlação", descricao: "Associação entre variáveis quantitativas.", status: "ativo" },
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
    { topicoId: TOPICO_TIPOS_DADOS, generator: tiposDadosGenerator, solver: tiposDadosSolver },
    { topicoId: TOPICO_MEDIDAS_TENDENCIA, generator: medidasTendenciaGenerator, solver: medidasTendenciaSolver },
    { topicoId: TOPICO_MEDIDAS_DISPERSAO, generator: medidasDispersaoGenerator, solver: medidasDispersaoSolver },
    { topicoId: TOPICO_DISTRIBUICOES, generator: distribuicoesGenerator, solver: distribuicoesSolver },
    { topicoId: TOPICO_CORRELACAO, generator: correlacaoGenerator, solver: correlacaoSolver },
  ],
};
