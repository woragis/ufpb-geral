import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { espacoAmostralGenerator } from "./generators/espaco-amostral.generator";
import { espacoAmostralSolver } from "./solvers/espaco-amostral.solver";
import { probabilidadeClassicaGenerator } from "./generators/probabilidade-classica.generator";
import { probabilidadeClassicaSolver } from "./solvers/probabilidade-classica.solver";
import { eventosGenerator } from "./generators/eventos.generator";
import { eventosSolver } from "./solvers/eventos.solver";
import { condicionalGenerator } from "./generators/condicional.generator";
import { condicionalSolver } from "./solvers/condicional.solver";
import { independenciaGenerator } from "./generators/independencia.generator";
import { independenciaSolver } from "./solvers/independencia.solver";
import { variaveisDiscretasGenerator } from "./generators/variaveis-discretas.generator";
import { variaveisDiscretasSolver } from "./solvers/variaveis-discretas.solver";
import {
  TOPICO_ESPACO_AMOSTRAL,
  TOPICO_PROBABILIDADE_CLASSICA,
  TOPICO_EVENTOS,
  TOPICO_CONDICIONAL,
  TOPICO_INDEPENDENCIA,
  TOPICO_VARIAVEIS_DISCRETAS,
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
        id: TOPICO_EVENTOS,
        nome: "Eventos e operações",
        descricao: "União, interseção, complemento e eventos mutuamente exclusivos.",
        prerequisitos: [TOPICO_ESPACO_AMOSTRAL],
        status: "ativo",
      },
      {
        id: TOPICO_PROBABILIDADE_CLASSICA,
        nome: "Probabilidade clássica",
        descricao: "P(A) = n(A)/n(Ω) em experimentos equiprováveis.",
        prerequisitos: [TOPICO_ESPACO_AMOSTRAL],
        status: "ativo",
      },
      {
        id: TOPICO_CONDICIONAL,
        nome: "Probabilidade condicional",
        descricao: "P(A|B) e regra do produto.",
        prerequisitos: [TOPICO_PROBABILIDADE_CLASSICA],
        status: "ativo",
      },
      {
        id: TOPICO_INDEPENDENCIA,
        nome: "Independência",
        descricao: "Eventos independentes e aplicações.",
        prerequisitos: [TOPICO_CONDICIONAL],
        status: "ativo",
      },
      {
        id: TOPICO_VARIAVEIS_DISCRETAS,
        nome: "Variáveis aleatórias discretas",
        descricao: "Função de probabilidade e esperança.",
        prerequisitos: [TOPICO_PROBABILIDADE_CLASSICA],
        status: "ativo",
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
    { topicoId: TOPICO_ESPACO_AMOSTRAL, generator: espacoAmostralGenerator, solver: espacoAmostralSolver },
    { topicoId: TOPICO_EVENTOS, generator: eventosGenerator, solver: eventosSolver },
    { topicoId: TOPICO_PROBABILIDADE_CLASSICA, generator: probabilidadeClassicaGenerator, solver: probabilidadeClassicaSolver },
    { topicoId: TOPICO_CONDICIONAL, generator: condicionalGenerator, solver: condicionalSolver },
    { topicoId: TOPICO_INDEPENDENCIA, generator: independenciaGenerator, solver: independenciaSolver },
    { topicoId: TOPICO_VARIAVEIS_DISCRETAS, generator: variaveisDiscretasGenerator, solver: variaveisDiscretasSolver },
  ],
};
