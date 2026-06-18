import type { SubtopicoMeta } from "@/core/domain/catalog";
import type { TopicoId } from "@/core/domain/ids";
import {
  TOPICO_CORRELACAO,
  TOPICO_DISTRIBUICOES,
  TOPICO_MEDIDAS_DISPERSAO,
  TOPICO_MEDIDAS_TENDENCIA,
  TOPICO_TIPOS_DADOS,
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

export const analiseExploratoriaSubtopicos: Record<TopicoId, SubtopicoMeta[]> = {
  [TOPICO_TIPOS_DADOS]: [
    TODOS,
    sub("tipos-dados", "Escalas de dados"),
    sub("tipos-dados-grafico", "Gráficos adequados"),
    sub("tipos-dados-frequencia", "Tabelas de frequência"),
    sub("tipos-dados-media-escala", "Média por escala"),
  ],
  [TOPICO_MEDIDAS_TENDENCIA]: [
    TODOS,
    sub("media-aritmetica", "Média aritmética"),
    sub("medidas-tendencia-mediana", "Mediana"),
    sub("medidas-tendencia-moda", "Moda"),
    sub("medidas-tendencia-ponderada", "Média ponderada"),
    sub("medidas-tendencia-escolha", "Escolha da medida"),
    sub("medidas-tendencia-geometrica", "Média geométrica"),
  ],
  [TOPICO_MEDIDAS_DISPERSAO]: [
    TODOS,
    sub("medidas-dispersao", "Variância e desvio"),
    sub("medidas-dispersao-cv", "Coeficiente de variação"),
    sub("medidas-dispersao-populacional", "Medidas populacionais"),
    sub("medidas-dispersao-mad", "Desvio absoluto médio"),
  ],
  [TOPICO_DISTRIBUICOES]: [
    TODOS,
    sub("distribuicoes", "Distribuições básicas"),
    sub("distribuicoes-quartis", "Quartis"),
    sub("distribuicoes-outliers", "Outliers"),
    sub("distribuicoes-ler-boxplot", "Leitura de boxplot"),
    sub("distribuicoes-histograma", "Histograma"),
    sub("distribuicoes-assimetria", "Assimetria"),
    sub("distribuicoes-cinco-numeros", "Resumo dos cinco números"),
  ],
  [TOPICO_CORRELACAO]: [
    TODOS,
    sub("correlacao", "Correlação positiva"),
    sub("correlacao-negativa", "Correlação negativa"),
    sub("correlacao-fraca", "Correlação fraca"),
    sub("correlacao-spearman", "Spearman"),
    sub("correlacao-interpretacao", "Interpretação"),
    sub("correlacao-covariancia", "Covariância"),
  ],
};
