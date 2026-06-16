import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { limitesGenerator } from "./generators/limites.generator";
import { limitesSolver } from "./solvers/limites.solver";
import { continuidadeGenerator } from "./generators/continuidade.generator";
import { continuidadeSolver } from "./solvers/continuidade.solver";
import { derivadasGenerator } from "./generators/derivadas.generator";
import { derivadasSolver } from "./solvers/derivadas.solver";
import { regraCadeiaGenerator } from "./generators/regra-cadeia.generator";
import { regraCadeiaSolver } from "./solvers/regra-cadeia.solver";
import { otimizacaoGenerator } from "./generators/otimizacao.generator";
import { otimizacaoSolver } from "./solvers/otimizacao.solver";
import { integraisIndefinidasGenerator } from "./generators/integrais-indefinidas.generator";
import { integraisIndefinidasSolver } from "./solvers/integrais-indefinidas.solver";
import { integraisDefinidasGenerator } from "./generators/integrais-definidas.generator";
import { integraisDefinidasSolver } from "./solvers/integrais-definidas.solver";
import { areaGenerator } from "./generators/area.generator";
import { areaSolver } from "./solvers/area.solver";
import { sequenciasGenerator } from "./generators/sequencias.generator";
import { sequenciasSolver } from "./solvers/sequencias.solver";
import { seriesGenerator } from "./generators/series.generator";
import { seriesSolver } from "./solvers/series.solver";
import { taylorGenerator } from "./generators/taylor.generator";
import { taylorSolver } from "./solvers/taylor.solver";
import { edosGenerator } from "./generators/edos.generator";
import { edosSolver } from "./solvers/edos.solver";
import {
  TOPICO_LIMITES,
  TOPICO_CONTINUIDADE,
  TOPICO_DERIVADAS,
  TOPICO_REGRA_CADEIA,
  TOPICO_OTIMIZACAO,
  TOPICO_INTEGRAIS_INDEFINIDAS,
  TOPICO_INTEGRAIS_DEFINIDAS,
  TOPICO_AREA,
  TOPICO_SEQUENCIAS,
  TOPICO_SERIES,
  TOPICO_TAYLOR,
  TOPICO_EDOS,
} from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "calc-1",
    nome: "Cálculo 1",
    ordem: 1,
    topicos: [
      { id: TOPICO_LIMITES, nome: "Limites", descricao: "Limites de funções, indeterminações e continuidade.", status: "ativo" },
      { id: TOPICO_CONTINUIDADE, nome: "Continuidade", descricao: "Definição e tipos de descontinuidade.", prerequisitos: [TOPICO_LIMITES], status: "ativo" },
      { id: TOPICO_DERIVADAS, nome: "Derivadas", descricao: "Regras de derivação e interpretação geométrica.", prerequisitos: [TOPICO_LIMITES], status: "ativo" },
      { id: TOPICO_REGRA_CADEIA, nome: "Regra da cadeia", descricao: "Derivação de funções compostas.", prerequisitos: [TOPICO_DERIVADAS], status: "ativo" },
      { id: TOPICO_OTIMIZACAO, nome: "Otimização", descricao: "Máximos e mínimos com derivadas.", prerequisitos: [TOPICO_DERIVADAS], status: "ativo" },
    ],
  },
  {
    id: "calc-2",
    nome: "Cálculo 2",
    ordem: 2,
    topicos: [
      { id: TOPICO_INTEGRAIS_INDEFINIDAS, nome: "Integrais indefinidas", descricao: "Primitivas e técnicas básicas.", status: "ativo" },
      { id: TOPICO_INTEGRAIS_DEFINIDAS, nome: "Integrais definidas", descricao: "Teorema fundamental do cálculo.", status: "ativo" },
      { id: TOPICO_AREA, nome: "Área entre curvas", descricao: "Aplicações de integrais definidas.", status: "ativo" },
    ],
  },
  {
    id: "calc-3",
    nome: "Cálculo 3",
    ordem: 3,
    topicos: [
      { id: TOPICO_SEQUENCIAS, nome: "Sequências", descricao: "Convergência e divergência.", status: "ativo" },
      { id: TOPICO_SERIES, nome: "Séries", descricao: "Séries numéricas e testes de convergência.", status: "ativo" },
      { id: TOPICO_TAYLOR, nome: "Séries de Taylor", descricao: "Aproximação de funções por polinômios.", status: "ativo" },
    ],
  },
  {
    id: "calc-4",
    nome: "Cálculo 4 (opcional)",
    ordem: 4,
    topicos: [
      { id: TOPICO_EDOS, nome: "Equações diferenciais ordinárias", descricao: "EDOs de 1ª ordem e aplicações.", status: "ativo" },
    ],
  },
];

export const calculoDomain: DomainModule & {
  nome: string;
  descricao: string;
  modulos: ModuloMeta[];
} = {
  disciplinaId: "calculo",
  nome: "Cálculo",
  descricao: "Limites, derivadas, integrais e séries — do Cálculo 1 ao 4.",
  modulos,
  topicos: modulos.flatMap((m) => m.topicos),
  entries: [
    { topicoId: TOPICO_LIMITES, generator: limitesGenerator, solver: limitesSolver },
    { topicoId: TOPICO_CONTINUIDADE, generator: continuidadeGenerator, solver: continuidadeSolver },
    { topicoId: TOPICO_DERIVADAS, generator: derivadasGenerator, solver: derivadasSolver },
    { topicoId: TOPICO_REGRA_CADEIA, generator: regraCadeiaGenerator, solver: regraCadeiaSolver },
    { topicoId: TOPICO_OTIMIZACAO, generator: otimizacaoGenerator, solver: otimizacaoSolver },
    { topicoId: TOPICO_INTEGRAIS_INDEFINIDAS, generator: integraisIndefinidasGenerator, solver: integraisIndefinidasSolver },
    { topicoId: TOPICO_INTEGRAIS_DEFINIDAS, generator: integraisDefinidasGenerator, solver: integraisDefinidasSolver },
    { topicoId: TOPICO_AREA, generator: areaGenerator, solver: areaSolver },
    { topicoId: TOPICO_SEQUENCIAS, generator: sequenciasGenerator, solver: sequenciasSolver },
    { topicoId: TOPICO_SERIES, generator: seriesGenerator, solver: seriesSolver },
    { topicoId: TOPICO_TAYLOR, generator: taylorGenerator, solver: taylorSolver },
    { topicoId: TOPICO_EDOS, generator: edosGenerator, solver: edosSolver },
  ],
};
