import type { SubtopicoMeta } from "@/core/domain/catalog";
import type { TopicoId } from "@/core/domain/ids";
import {
  TOPICO_CONDICIONAL,
  TOPICO_ESPACO_AMOSTRAL,
  TOPICO_EVENTOS,
  TOPICO_INDEPENDENCIA,
  TOPICO_PROBABILIDADE_CLASSICA,
  TOPICO_VARIAVEIS_DISCRETAS,
} from "../entities/types";

function sub(id: string, nome: string): SubtopicoMeta {
  return { id, slug: id, nome, status: "ativo" };
}

const TODOS: SubtopicoMeta = {
  id: "todos",
  slug: "todos",
  nome: "Todos os cenários",
  status: "ativo",
};

export const probabilidadeSubtopicos: Record<TopicoId, SubtopicoMeta[]> = {
  [TOPICO_ESPACO_AMOSTRAL]: [
    TODOS,
    sub("espaco-amostral", "Espaço amostral básico"),
    sub("espaco-amostral-baralho", "Baralho"),
    sub("espaco-amostral-moeda-dado", "Moeda e dado"),
    sub("espaco-amostral-modular", "Contagem modular"),
  ],
  [TOPICO_EVENTOS]: [
    TODOS,
    sub("eventos", "Operações com eventos"),
    sub("eventos-probabilidade", "Probabilidade de eventos"),
    sub("eventos-exclusivos", "Eventos mutuamente exclusivos"),
  ],
  [TOPICO_PROBABILIDADE_CLASSICA]: [
    TODOS,
    sub("probabilidade-classica", "Probabilidade clássica"),
    sub("probabilidade-classica-sem-reposicao", "Sem reposição"),
    sub("probabilidade-classica-dado-soma", "Soma de dados"),
    sub("probabilidade-classica-baralho", "Baralho"),
    sub("probabilidade-classica-comites", "Comitês"),
    sub("probabilidade-classica-modular", "Contagem"),
    sub("probabilidade-classica-composta", "Probabilidade composta"),
  ],
  [TOPICO_CONDICIONAL]: [
    TODOS,
    sub("condicional", "Probabilidade condicional"),
    sub("condicional-bayes", "Teorema de Bayes"),
    sub("condicional-tabela", "Tabela de contingência"),
  ],
  [TOPICO_INDEPENDENCIA]: [
    TODOS,
    sub("independencia", "Independência de eventos"),
    sub("independencia-contraste", "Contraste dependência"),
    sub("independencia-prob", "Verificação por probabilidade"),
  ],
  [TOPICO_VARIAVEIS_DISCRETAS]: [
    TODOS,
    sub("variaveis-discretas", "Variável discreta"),
    sub("variaveis-discretas-variancia", "Variância discreta"),
    sub("variaveis-discretas-acumulada", "Distribuição acumulada"),
    sub("variaveis-discretas-binomial", "Binomial"),
    sub("variaveis-discretas-geometrica", "Geométrica"),
  ],
};
