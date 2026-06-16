import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { espacoAmostralGenerator } from "./generators/espaco-amostral.generator";
import { espacoAmostralSolver } from "./solvers/espaco-amostral.solver";
import { probabilidadeClassicaGenerator } from "./generators/probabilidade-classica.generator";
import { probabilidadeClassicaSolver } from "./solvers/probabilidade-classica.solver";
import {
  TOPICO_ESPACO_AMOSTRAL,
  TOPICO_PROBABILIDADE_CLASSICA,
} from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "prob-1",
    nome: "Probabilidade 1",
    ordem: 1,
    topicos: [
      {
        id: TOPICO_ESPACO_AMOSTRAL,
        nome: "Espaço amostral",
        descricao: "Experimentos aleatórios, resultados e cardinalidade de Ω.",
        status: "ativo",
      },
      {
        id: "probabilidade.eventos",
        nome: "Eventos e operações",
        descricao: "União, interseção, complemento e eventos mutuamente exclusivos.",
        prerequisitos: [TOPICO_ESPACO_AMOSTRAL],
        status: "planejado",
      },
      {
        id: TOPICO_PROBABILIDADE_CLASSICA,
        nome: "Probabilidade clássica",
        descricao: "P(A) = n(A)/n(Ω) em experimentos equiprováveis.",
        prerequisitos: [TOPICO_ESPACO_AMOSTRAL],
        status: "ativo",
      },
      {
        id: "probabilidade.condicional",
        nome: "Probabilidade condicional",
        descricao: "P(A|B) e regra do produto.",
        prerequisitos: [TOPICO_PROBABILIDADE_CLASSICA],
        status: "planejado",
      },
      {
        id: "probabilidade.independencia",
        nome: "Independência",
        descricao: "Eventos independentes e aplicações.",
        prerequisitos: ["probabilidade.condicional"],
        status: "planejado",
      },
      {
        id: "probabilidade.variaveis-discretas",
        nome: "Variáveis aleatórias discretas",
        descricao: "Função de probabilidade e esperança.",
        prerequisitos: [TOPICO_PROBABILIDADE_CLASSICA],
        status: "planejado",
      },
    ],
  },
];

export const probabilidadeDomain: DomainModule & {
  nome: string;
  descricao: string;
  modulos: ModuloMeta[];
} = {
  disciplinaId: "probabilidade",
  nome: "Probabilidade",
  descricao: "Experimentos aleatórios, eventos e modelos clássicos de probabilidade.",
  modulos,
  topicos: modulos.flatMap((m) => m.topicos),
  entries: [
    {
      topicoId: TOPICO_ESPACO_AMOSTRAL,
      generator: espacoAmostralGenerator,
      solver: espacoAmostralSolver,
    },
    {
      topicoId: TOPICO_PROBABILIDADE_CLASSICA,
      generator: probabilidadeClassicaGenerator,
      solver: probabilidadeClassicaSolver,
    },
  ],
};
