export const TOPICO_ESPACO_AMOSTRAL = "probabilidade.espaco-amostral";
export const TOPICO_PROBABILIDADE_CLASSICA = "probabilidade.classica";
export const TOPICO_EVENTOS = "probabilidade.eventos";
export const TOPICO_CONDICIONAL = "probabilidade.condicional";
export const TOPICO_INDEPENDENCIA = "probabilidade.independencia";
export const TOPICO_VARIAVEIS_DISCRETAS = "probabilidade.variaveis-discretas";

export interface EspacoAmostralData {
  tipo: "espaco-amostral";
  experimento: "moeda" | "dado" | "dado-duplo";
  pergunta: "cardinalidade" | "listar";
}

export interface ProbabilidadeClassicaData {
  tipo: "probabilidade-classica";
  corAlvo: string;
  cores: Record<string, number>;
}

export interface EventosData {
  tipo: "eventos";
  operacao: "uniao" | "intersecao" | "complemento";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface CondicionalData {
  tipo: "condicional";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface IndependenciaData {
  tipo: "independencia";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface VariaveisDiscretasData {
  tipo: "variaveis-discretas";
  pergunta: "esperanca" | "probabilidade";
  valores: number[];
  probabilidades: number[];
  valorAlvo?: number;
}
