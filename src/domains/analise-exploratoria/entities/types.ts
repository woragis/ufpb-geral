export const TOPICO_MEDIDAS_TENDENCIA = "analise-exploratoria.medidas-tendencia";
export const TOPICO_TIPOS_DADOS = "analise-exploratoria.tipos-dados";
export const TOPICO_MEDIDAS_DISPERSAO = "analise-exploratoria.medidas-dispersao";
export const TOPICO_DISTRIBUICOES = "analise-exploratoria.distribuicoes";
export const TOPICO_CORRELACAO = "analise-exploratoria.correlacao";

export interface MedidasTendenciaData {
  tipo: "media-aritmetica";
  valores: number[];
}

export interface TiposDadosData {
  tipo: "tipos-dados";
  variavel: string;
  exemplos: string[];
  escalaCorreta: "nominal" | "ordinal" | "intervalar" | "razao";
}

export interface MedidasDispersaoData {
  tipo: "medidas-dispersao";
  valores: number[];
  pergunta: "variancia" | "desvio" | "amplitude";
}

export interface DistribuicoesData {
  tipo: "distribuicoes";
  q1: number;
  q2: number;
  q3: number;
}

export interface CorrelacaoData {
  tipo: "correlacao";
  xs: number[];
  ys: number[];
}
