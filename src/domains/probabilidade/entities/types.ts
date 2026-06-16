export const TOPICO_ESPACO_AMOSTRAL = "probabilidade.espaco-amostral";
export const TOPICO_PROBABILIDADE_CLASSICA = "probabilidade.classica";

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
