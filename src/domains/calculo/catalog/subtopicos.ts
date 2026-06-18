import type { SubtopicoMeta } from "@/core/domain/catalog";
import type { TopicoId } from "@/core/domain/ids";
import {
  TOPICO_AREA,
  TOPICO_CONTINUIDADE,
  TOPICO_DERIVADAS,
  TOPICO_EDOS,
  TOPICO_INTEGRAIS_DEFINIDAS,
  TOPICO_INTEGRAIS_INDEFINIDAS,
  TOPICO_LIMITES,
  TOPICO_OTIMIZACAO,
  TOPICO_REGRA_CADEIA,
  TOPICO_SEQUENCIAS,
  TOPICO_SERIES,
  TOPICO_TAYLOR,
} from "../entities/types";

function sub(
  id: string,
  nome: string,
  descricao?: string,
): SubtopicoMeta {
  return { id, slug: id, nome, descricao, status: "ativo" };
}

const TODOS: SubtopicoMeta = {
  id: "todos",
  slug: "todos",
  nome: "Todos os cenários",
  descricao: "Exercício aleatório entre todos os tipos deste tópico.",
  status: "ativo",
};

export const calculoSubtopicos: Record<TopicoId, SubtopicoMeta[]> = {
  [TOPICO_LIMITES]: [
    TODOS,
    sub("limite-algebrico", "Limite algébrico", "Fatoração e simplificação."),
    sub("limite-trig", "Limites trigonométricos", "sin(x)/x e variantes."),
    sub("limite-racional", "Limite racional", "Quociente de polinômios."),
    sub("limite-radical", "Limite com radical", "Conjugado e simplificação."),
    sub("limite-infinito", "Limite em +∞", "Comportamento assintótico."),
    sub("limite-infinito-neg", "Limite em −∞", "Comportamento em −∞."),
    sub("limite-substituicao", "Limite por substituição", "Polinômios compostos."),
    sub("limite-exp-log", "Limites com exp/log", "(eˣ−1)/x e ln(1+x)/x."),
    sub("limite-lhopital", "Regra de L'Hôpital", "Indeterminações 0/0."),
  ],
  [TOPICO_CONTINUIDADE]: [
    TODOS,
    sub("continuidade-afim", "Função afim por partes"),
    sub("continuidade-classificar", "Classificar descontinuidade"),
    sub("continuidade-completar", "Completar para continuidade"),
    sub("continuidade-lateral", "Continuidade lateral"),
    sub("continuidade-tvi", "Teorema do valor intermediário"),
    sub("continuidade-trig-ponto", "Continuidade trigonométrica"),
    sub("continuidade-rolle", "Teorema de Rolle"),
  ],
  [TOPICO_DERIVADAS]: [
    TODOS,
    sub("derivadas-polinomio", "Derivada de polinômio"),
    sub("derivadas-trig", "Derivadas trigonométricas"),
    sub("derivadas-exp-log", "Derivadas exp/log"),
    sub("derivadas-produto", "Regra do produto"),
    sub("derivadas-quociente", "Regra do quociente"),
    sub("derivadas-tangente", "Reta tangente"),
    sub("derivadas-definicao", "Definição de derivada"),
    sub("derivadas-taxa-relacionada", "Taxas relacionadas"),
    sub("derivadas-implicita", "Derivação implícita"),
    sub("derivadas-aprox-linear", "Aproximação linear"),
    sub("derivadas-segunda-teste", "Teste da segunda derivada"),
    sub("derivadas-inversa-trig", "Derivada inversa trig"),
  ],
  [TOPICO_REGRA_CADEIA]: [
    TODOS,
    sub("regra-cadeia-potencia", "Potência composta"),
    sub("regra-cadeia-trig", "Trigonométrica composta"),
    sub("regra-cadeia-exp-log", "Exp/log composto"),
    sub("regra-cadeia-avancada", "Composições avançadas"),
  ],
  [TOPICO_OTIMIZACAO]: [
    TODOS,
    sub("otimizacao-parabola", "Máximo/mínimo de parábola"),
    sub("otimizacao-geometrica", "Otimização geométrica"),
    sub("otimizacao-crescimento", "Intervalos de crescimento"),
    sub("otimizacao-concavidade", "Concavidade"),
    sub("otimizacao-cilindro", "Cilindro de área mínima"),
    sub("otimizacao-caixa", "Caixa de volume máximo"),
    sub("otimizacao-segunda-derivada", "Teste da segunda derivada"),
    sub("otimizacao-esboco", "Esboço de gráfico"),
  ],
  [TOPICO_INTEGRAIS_INDEFINIDAS]: [
    sub("integrais-indefinidas", "Integrais indefinidas", "Primitivas básicas."),
  ],
  [TOPICO_INTEGRAIS_DEFINIDAS]: [
    sub("integrais-definidas", "Integrais definidas", "Teorema fundamental."),
  ],
  [TOPICO_AREA]: [
    sub("area", "Área entre curvas", "Aplicação de integrais."),
  ],
  [TOPICO_SEQUENCIAS]: [
    sub("sequencias", "Sequências", "Convergência e divergência."),
  ],
  [TOPICO_SERIES]: [
    sub("series", "Séries", "Séries numéricas."),
  ],
  [TOPICO_TAYLOR]: [
    sub("taylor", "Séries de Taylor", "Aproximação por polinômios."),
  ],
  [TOPICO_EDOS]: [
    sub("edos", "EDOs de 1ª ordem", "Equações diferenciais ordinárias."),
  ],
};
