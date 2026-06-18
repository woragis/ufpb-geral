import type { SubtopicoMeta } from "@/core/domain/catalog";
import type { TopicoId } from "@/core/domain/ids";
import {
  TOPICO_BINOMIO_NEWTON,
  TOPICO_CONJUNTOS,
  TOPICO_FUNCAO_MODULAR,
  TOPICO_FUNCOES_ELEMENTARES,
} from "../entities/types";

function sub(id: string, nome: string, descricao?: string): SubtopicoMeta {
  return { id, slug: id, nome, descricao, status: "ativo" };
}

const TODOS: SubtopicoMeta = {
  id: "todos",
  slug: "todos",
  nome: "Todos os cenários",
  status: "ativo",
};

export const preCalculoSubtopicos: Record<TopicoId, SubtopicoMeta[]> = {
  [TOPICO_CONJUNTOS]: [
    TODOS,
    sub("conjuntos-operacao", "Operações entre conjuntos"),
    sub("conjuntos-produto-cartesiano", "Produto cartesiano"),
    sub("conjuntos-pertinencia", "Pertinência e diagramas"),
  ],
  [TOPICO_FUNCOES_ELEMENTARES]: [
    TODOS,
    sub("funcao-afim", "Função afim"),
    sub("funcao-quadratica", "Função quadrática"),
    sub("funcao-exponencial", "Função exponencial"),
    sub("funcao-logaritmica", "Função logarítmica"),
  ],
  [TOPICO_FUNCAO_MODULAR]: [
    TODOS,
    sub("modular-equacao", "Equação modular"),
    sub("modular-inequacao", "Inequação modular"),
    sub("modular-avaliar", "Avaliar módulo"),
  ],
  [TOPICO_BINOMIO_NEWTON]: [
    TODOS,
    sub("binomio-coeficiente", "Coeficiente binomial"),
    sub("binomio-termo-geral", "Termo geral"),
    sub("binomio-soma-coeficientes", "Soma dos coeficientes"),
    sub("binomio-expansao", "Expansão de binômio"),
  ],
};
