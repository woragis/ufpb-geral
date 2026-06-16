import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { limitesGenerator } from "./generators/limites.generator";
import { limitesSolver } from "./solvers/limites.solver";
import { TOPICO_LIMITES } from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "calc-1",
    nome: "Cálculo 1",
    ordem: 1,
    topicos: [
      {
        id: TOPICO_LIMITES,
        nome: "Limites",
        descricao: "Limites de funções, indeterminações e continuidade.",
        status: "ativo",
      },
      {
        id: "calculo.continuidade",
        nome: "Continuidade",
        descricao: "Definição e tipos de descontinuidade.",
        prerequisitos: [TOPICO_LIMITES],
        status: "planejado",
      },
      {
        id: "calculo.derivadas",
        nome: "Derivadas",
        descricao: "Regras de derivação e interpretação geométrica.",
        prerequisitos: [TOPICO_LIMITES],
        status: "planejado",
      },
      {
        id: "calculo.regra-cadeia",
        nome: "Regra da cadeia",
        descricao: "Derivação de funções compostas.",
        prerequisitos: ["calculo.derivadas"],
        status: "planejado",
      },
      {
        id: "calculo.otimizacao",
        nome: "Otimização",
        descricao: "Máximos e mínimos com derivadas.",
        prerequisitos: ["calculo.derivadas"],
        status: "planejado",
      },
    ],
  },
  {
    id: "calc-2",
    nome: "Cálculo 2",
    ordem: 2,
    topicos: [
      {
        id: "calculo.integrais-indefinidas",
        nome: "Integrais indefinidas",
        descricao: "Primitivas e técnicas básicas.",
        status: "planejado",
      },
      {
        id: "calculo.integrais-definidas",
        nome: "Integrais definidas",
        descricao: "Teorema fundamental do cálculo.",
        status: "planejado",
      },
      {
        id: "calculo.area",
        nome: "Área entre curvas",
        descricao: "Aplicações de integrais definidas.",
        status: "planejado",
      },
    ],
  },
  {
    id: "calc-3",
    nome: "Cálculo 3",
    ordem: 3,
    topicos: [
      {
        id: "calculo.sequencias",
        nome: "Sequências",
        descricao: "Convergência e divergência.",
        status: "planejado",
      },
      {
        id: "calculo.series",
        nome: "Séries",
        descricao: "Séries numéricas e testes de convergência.",
        status: "planejado",
      },
      {
        id: "calculo.taylor",
        nome: "Séries de Taylor",
        descricao: "Aproximação de funções por polinômios.",
        status: "planejado",
      },
    ],
  },
  {
    id: "calc-4",
    nome: "Cálculo 4 (opcional)",
    ordem: 4,
    topicos: [
      {
        id: "calculo.edos",
        nome: "Equações diferenciais ordinárias",
        descricao: "EDOs de 1ª ordem e aplicações.",
        status: "planejado",
      },
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
    {
      topicoId: TOPICO_LIMITES,
      generator: limitesGenerator,
      solver: limitesSolver,
    },
  ],
};
