export const TOPICO_MEDIDAS_TENDENCIA = "analise-exploratoria.medidas-tendencia";
export const TOPICO_TIPOS_DADOS = "analise-exploratoria.tipos-dados";
export const TOPICO_MEDIDAS_DISPERSAO = "analise-exploratoria.medidas-dispersao";
export const TOPICO_DISTRIBUICOES = "analise-exploratoria.distribuicoes";
export const TOPICO_CORRELACAO = "analise-exploratoria.correlacao";

// ── Medidas de tendência ──

export interface MedidasTendenciaMediaData {
  tipo: "media-aritmetica";
  valores: number[];
}

export interface MedidasTendenciaMedianaData {
  tipo: "medidas-tendencia-mediana";
  valores: number[];
}

export interface MedidasTendenciaModaData {
  tipo: "medidas-tendencia-moda";
  valores: number[];
}

export interface MedidasTendenciaPonderadaData {
  tipo: "medidas-tendencia-ponderada";
  valores: number[];
  pesos: number[];
}

export interface MedidasTendenciaEscolhaData {
  tipo: "medidas-tendencia-escolha";
  valores: number[];
  /** Medida mais representativa para o conjunto (com outlier). */
  resposta: "media" | "mediana";
}

export interface MedidasTendenciaGeometricaData {
  tipo: "medidas-tendencia-geometrica";
  valores: number[];
}

export type MedidasTendenciaData =
  | MedidasTendenciaMediaData
  | MedidasTendenciaMedianaData
  | MedidasTendenciaModaData
  | MedidasTendenciaPonderadaData
  | MedidasTendenciaEscolhaData
  | MedidasTendenciaGeometricaData;

// ── Tipos de dados ──

export interface TiposDadosEscalaData {
  tipo: "tipos-dados";
  variavel: string;
  exemplos: string[];
  escalaCorreta: "nominal" | "ordinal" | "intervalar" | "razao";
}

export interface TiposDadosGraficoData {
  tipo: "tipos-dados-grafico";
  variavel: string;
  contexto: "categorica" | "quantitativa-discreta" | "quantitativa-continua" | "temporal";
  graficoCorreto: "barras" | "histograma" | "linha" | "boxplot";
}

export interface TiposDadosFrequenciaData {
  tipo: "tipos-dados-frequencia";
  categorias: string[];
  frequencias: number[];
  pergunta: "total" | "moda-categoria";
}

export interface TiposDadosMediaEscalaData {
  tipo: "tipos-dados-media-escala";
  variavel: string;
  /** Escala em que a média aritmética é adequada. */
  escalaCorreta: "intervalar" | "razao";
}

export type TiposDadosData =
  | TiposDadosEscalaData
  | TiposDadosGraficoData
  | TiposDadosFrequenciaData
  | TiposDadosMediaEscalaData;

// ── Dispersão ──

export interface MedidasDispersaoBasicoData {
  tipo: "medidas-dispersao";
  valores: number[];
  pergunta: "variancia" | "desvio" | "amplitude";
}

export interface MedidasDispersaoCvData {
  tipo: "medidas-dispersao-cv";
  valores: number[];
}

export interface MedidasDispersaoPopulacionalData {
  tipo: "medidas-dispersao-populacional";
  valores: number[];
  pergunta: "variancia" | "desvio";
}

export interface MedidasDispersaoMadData {
  tipo: "medidas-dispersao-mad";
  valores: number[];
}

export type MedidasDispersaoData =
  | MedidasDispersaoBasicoData
  | MedidasDispersaoCvData
  | MedidasDispersaoPopulacionalData
  | MedidasDispersaoMadData;

// ── Distribuições ──

export interface DistribuicoesIqrData {
  tipo: "distribuicoes";
  q1: number;
  q2: number;
  q3: number;
}

export interface DistribuicoesQuartisData {
  tipo: "distribuicoes-quartis";
  valores: number[];
  pergunta: "q1" | "q2" | "q3";
}

export interface DistribuicoesOutliersData {
  tipo: "distribuicoes-outliers";
  valores: number[];
}

export interface DistribuicoesLerBoxplotData {
  tipo: "distribuicoes-ler-boxplot";
  q1: number;
  q2: number;
  q3: number;
  pergunta: "iqr" | "mediana";
}

export interface DistribuicoesHistogramaData {
  tipo: "distribuicoes-histograma";
  bins: string[];
  frequencias: number[];
  pergunta: "classe-moda" | "frequencia-total";
}

export interface DistribuicoesAssimetriaData {
  tipo: "distribuicoes-assimetria";
  valores: number[];
  assimetria: "positiva" | "negativa" | "simetrica";
}

export interface DistribuicoesCincoNumerosData {
  tipo: "distribuicoes-cinco-numeros";
  valores: number[];
  pergunta: "min" | "max" | "amplitude";
}

export type DistribuicoesData =
  | DistribuicoesIqrData
  | DistribuicoesQuartisData
  | DistribuicoesOutliersData
  | DistribuicoesLerBoxplotData
  | DistribuicoesHistogramaData
  | DistribuicoesAssimetriaData
  | DistribuicoesCincoNumerosData;

// ── Correlação ──

export interface CorrelacaoPearsonData {
  tipo: "correlacao";
  xs: number[];
  ys: number[];
}

export interface CorrelacaoNegativaData {
  tipo: "correlacao-negativa";
  xs: number[];
  ys: number[];
}

export interface CorrelacaoFracaData {
  tipo: "correlacao-fraca";
  xs: number[];
  ys: number[];
}

export interface CorrelacaoSpearmanData {
  tipo: "correlacao-spearman";
  xs: number[];
  ys: number[];
}

export interface CorrelacaoInterpretacaoData {
  tipo: "correlacao-interpretacao";
  r: number;
}

export interface CorrelacaoCovarianciaData {
  tipo: "correlacao-covariancia";
  xs: number[];
  ys: number[];
}

export type CorrelacaoData =
  | CorrelacaoPearsonData
  | CorrelacaoNegativaData
  | CorrelacaoFracaData
  | CorrelacaoSpearmanData
  | CorrelacaoInterpretacaoData
  | CorrelacaoCovarianciaData;
