import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { conjuntosGenerator } from "./generators/conjuntos.generator";
import { conjuntosSolver } from "./solvers/conjuntos.solver";
import { funcoesElementaresGenerator } from "./generators/funcoes-elementares.generator";
import { funcoesElementaresSolver } from "./solvers/funcoes-elementares.solver";
import { funcaoModularGenerator } from "./generators/funcao-modular.generator";
import { funcaoModularSolver } from "./solvers/funcao-modular.solver";
import { binomioNewtonGenerator } from "./generators/binomio-newton.generator";
import { binomioNewtonSolver } from "./solvers/binomio-newton.solver";
import {
  TOPICO_BINOMIO_NEWTON,
  TOPICO_CONJUNTOS,
  TOPICO_FUNCAO_MODULAR,
  TOPICO_FUNCOES_ELEMENTARES,
} from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "precalc-1",
    nome: "Fundamentos",
    ordem: 1,
    topicos: [
      {
        id: TOPICO_CONJUNTOS,
        nome: "Conjuntos",
        descricao: "Operações, cardinalidade, complemento e produto cartesiano.",
        status: "ativo",
      },
      {
        id: TOPICO_FUNCOES_ELEMENTARES,
        nome: "Funções elementares",
        descricao: "Afim, quadrática, exponencial e logarítmica.",
        prerequisitos: [TOPICO_CONJUNTOS],
        status: "ativo",
      },
      {
        id: TOPICO_FUNCAO_MODULAR,
        nome: "Função modular",
        descricao: "Equações, inequações e gráficos com valor absoluto.",
        prerequisitos: [TOPICO_FUNCOES_ELEMENTARES],
        status: "ativo",
      },
      {
        id: TOPICO_BINOMIO_NEWTON,
        nome: "Binômio de Newton",
        descricao: "Coeficientes binomiais, termo geral e expansões.",
        prerequisitos: [TOPICO_CONJUNTOS],
        status: "ativo",
      },
    ],
  },
];

export const preCalculoDomain: DomainModule & {
  nome: string;
  descricao: string;
  modulos: ModuloMeta[];
} = {
  disciplinaId: "pre-calculo",
  nome: "Pré-Cálculo",
  descricao:
    "Conjuntos, funções elementares, módulo e binômio de Newton — base para probabilidade e cálculo.",
  modulos,
  topicos: modulos.flatMap((m) => m.topicos),
  entries: [
    { topicoId: TOPICO_CONJUNTOS, generator: conjuntosGenerator, solver: conjuntosSolver },
    {
      topicoId: TOPICO_FUNCOES_ELEMENTARES,
      generator: funcoesElementaresGenerator,
      solver: funcoesElementaresSolver,
    },
    { topicoId: TOPICO_FUNCAO_MODULAR, generator: funcaoModularGenerator, solver: funcaoModularSolver },
    { topicoId: TOPICO_BINOMIO_NEWTON, generator: binomioNewtonGenerator, solver: binomioNewtonSolver },
  ],
};
