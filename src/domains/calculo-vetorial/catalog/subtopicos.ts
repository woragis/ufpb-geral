import type { SubtopicoMeta } from "@/core/domain/catalog";
import type { TopicoId } from "@/core/domain/ids";
import {
  TOPICO_CAMPOS,
  TOPICO_CURVAS,
  TOPICO_PRODUTO_ESCULAR,
  TOPICO_PRODUTO_VETORIAL,
  TOPICO_RETAS_PLANOS,
  TOPICO_VETORES,
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

export const calculoVetorialSubtopicos: Record<TopicoId, SubtopicoMeta[]> = {
  [TOPICO_VETORES]: [
    TODOS,
    sub("vetores", "Vetores básicos"),
    sub("vetores-soma", "Soma de vetores"),
    sub("vetores-escalar", "Multiplicação escalar"),
    sub("vetores-unitario", "Vetor unitário"),
    sub("vetores-distancia", "Distância entre pontos"),
    sub("vetores-paralelo", "Paralelismo"),
  ],
  [TOPICO_PRODUTO_ESCULAR]: [
    TODOS,
    sub("produto-escalar", "Produto escalar"),
    sub("produto-escalar-angulo", "Ângulo entre vetores"),
    sub("produto-escalar-projecao", "Projeção ortogonal"),
    sub("produto-escalar-ortogonal", "Ortogonalidade"),
  ],
  [TOPICO_PRODUTO_VETORIAL]: [
    TODOS,
    sub("produto-vetorial", "Produto vetorial"),
    sub("produto-vetorial-area", "Área do paralelogramo"),
    sub("produto-vetorial-misto", "Produto misto"),
  ],
  [TOPICO_RETAS_PLANOS]: [
    TODOS,
    sub("retas-planos", "Retas no espaço"),
    sub("retas-planos-parametrica", "Equação paramétrica"),
    sub("retas-planos-plano", "Equação do plano"),
    sub("retas-planos-distancia", "Distância ponto-plano"),
    sub("retas-planos-distancia-reta", "Distância entre retas"),
    sub("retas-planos-intersecao", "Interseção reta-plano"),
  ],
  [TOPICO_CURVAS]: [
    TODOS,
    sub("curvas", "Curvas parametrizadas"),
    sub("curvas-velocidade-vetor", "Vetor velocidade"),
    sub("curvas-tangente", "Vetor tangente"),
    sub("curvas-circulo", "Circunferência"),
    sub("curvas-comprimento", "Comprimento de arco"),
    sub("curvas-helice", "Hélice"),
  ],
  [TOPICO_CAMPOS]: [
    TODOS,
    sub("campos", "Campo escalar — gradiente"),
    sub("campos-divergente", "Divergente"),
    sub("campos-rotacional", "Rotacional"),
    sub("campos-gradiente-3d", "Gradiente em R³"),
    sub("campos-divergente-3d", "Divergente em R³"),
  ],
};
