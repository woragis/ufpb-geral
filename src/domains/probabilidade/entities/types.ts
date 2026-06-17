export const TOPICO_ESPACO_AMOSTRAL = "probabilidade.espaco-amostral";
export const TOPICO_PROBABILIDADE_CLASSICA = "probabilidade.classica";
export const TOPICO_EVENTOS = "probabilidade.eventos";
export const TOPICO_CONDICIONAL = "probabilidade.condicional";
export const TOPICO_INDEPENDENCIA = "probabilidade.independencia";
export const TOPICO_VARIAVEIS_DISCRETAS = "probabilidade.variaveis-discretas";

// ── Espaço amostral ──

export interface EspacoAmostralBasicoData {
  tipo: "espaco-amostral";
  experimento: "moeda" | "dado" | "dado-duplo";
  pergunta: "cardinalidade" | "listar";
}

export interface EspacoAmostralBaralhoData {
  tipo: "espaco-amostral-baralho";
  pergunta: "cardinalidade" | "naipe";
  naipeAlvo?: "copas" | "espadas" | "ouros" | "paus";
}

export interface EspacoAmostralMoedaDadoData {
  tipo: "espaco-amostral-moeda-dado";
  pergunta: "cardinalidade" | "listar";
}

export interface EspacoAmostralModularData {
  tipo: "espaco-amostral-modular";
  /** dois dados; evento descrito por resto da soma */
  modulo: number;
  resto: number;
  pergunta: "favoraveis" | "cardinalidade";
}

export type EspacoAmostralData =
  | EspacoAmostralBasicoData
  | EspacoAmostralBaralhoData
  | EspacoAmostralMoedaDadoData
  | EspacoAmostralModularData;

// ── Eventos ──

export interface EventosCardinalidadeData {
  tipo: "eventos";
  operacao: "uniao" | "intersecao" | "complemento";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface EventosProbabilidadeData {
  tipo: "eventos-probabilidade";
  operacao: "uniao" | "intersecao" | "complemento";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface EventosExclusivosData {
  tipo: "eventos-exclusivos";
  nOmega: number;
  nA: number;
  nB: number;
  descricaoA: string;
  descricaoB: string;
}

export type EventosData =
  | EventosCardinalidadeData
  | EventosProbabilidadeData
  | EventosExclusivosData;

// ── Probabilidade clássica ──

export interface ProbabilidadeClassicaUrnaData {
  tipo: "probabilidade-classica";
  corAlvo: string;
  cores: Record<string, number>;
}

export interface ProbabilidadeClassicaSemReposicaoData {
  tipo: "probabilidade-classica-sem-reposicao";
  corAlvo: string;
  cores: Record<string, number>;
  retiradas: 2;
}

export interface ProbabilidadeClassicaDadoSomaData {
  tipo: "probabilidade-classica-dado-soma";
  /** soma alvo ao lançar dois dados */
  somaAlvo: number;
}

export interface ProbabilidadeClassicaBaralhoData {
  tipo: "probabilidade-classica-baralho";
  evento: "naipe" | "figura" | "as";
  naipeAlvo?: "copas" | "espadas" | "ouros" | "paus";
}

export interface ProbabilidadeClassicaComitesData {
  tipo: "probabilidade-classica-comites";
  n: number;
  k: number;
  /** comitê deve conter pessoa específica */
  obrigatorio: boolean;
}

export interface ProbabilidadeClassicaModularData {
  tipo: "probabilidade-classica-modular";
  modulo: number;
  resto: number;
  /** transformação aplicada à soma de dois dados */
  transformacao: "soma" | "abs-soma" | "produto";
}

export interface ProbabilidadeClassicaCompostaData {
  tipo: "probabilidade-classica-composta";
  descricao: string;
  favoraveis: number;
  total: number;
}

export type ProbabilidadeClassicaData =
  | ProbabilidadeClassicaUrnaData
  | ProbabilidadeClassicaSemReposicaoData
  | ProbabilidadeClassicaDadoSomaData
  | ProbabilidadeClassicaBaralhoData
  | ProbabilidadeClassicaComitesData
  | ProbabilidadeClassicaModularData
  | ProbabilidadeClassicaCompostaData;

// ── Condicional ──

export interface CondicionalContagemData {
  tipo: "condicional";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface CondicionalBayesData {
  tipo: "condicional-bayes";
  pA: number;
  pB: number;
  pBA: number;
  descricaoA: string;
  descricaoB: string;
}

export interface CondicionalTabelaData {
  tipo: "condicional-tabela";
  /** P(A∩B), P(B) dados como frações simplificadas */
  pAinterB: number;
  pB: number;
  descricaoA: string;
  descricaoB: string;
}

export type CondicionalData =
  | CondicionalContagemData
  | CondicionalBayesData
  | CondicionalTabelaData;

// ── Independência ──

export interface IndependenciaTesteData {
  tipo: "independencia";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface IndependenciaContrasteData {
  tipo: "independencia-contraste";
  nOmega: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface IndependenciaProbData {
  tipo: "independencia-prob";
  pA: number;
  pB: number;
  pAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export type IndependenciaData =
  | IndependenciaTesteData
  | IndependenciaContrasteData
  | IndependenciaProbData;

// ── Variáveis discretas ──

export interface VariaveisDiscretasEsperancaData {
  tipo: "variaveis-discretas";
  pergunta: "esperanca";
  valores: number[];
  probabilidades: number[];
}

export interface VariaveisDiscretasProbData {
  tipo: "variaveis-discretas";
  pergunta: "probabilidade";
  valores: number[];
  probabilidades: number[];
  valorAlvo: number;
}

export interface VariaveisDiscretasVarianciaData {
  tipo: "variaveis-discretas-variancia";
  valores: number[];
  probabilidades: number[];
}

export interface VariaveisDiscretasAcumuladaData {
  tipo: "variaveis-discretas-acumulada";
  valores: number[];
  probabilidades: number[];
  limite: number;
}

export interface VariaveisDiscretasBinomialData {
  tipo: "variaveis-discretas-binomial";
  n: number;
  p: number;
  k: number;
}

export interface VariaveisDiscretasGeometricaData {
  tipo: "variaveis-discretas-geometrica";
  p: number;
  k: number;
}

export type VariaveisDiscretasData =
  | VariaveisDiscretasEsperancaData
  | VariaveisDiscretasProbData
  | VariaveisDiscretasVarianciaData
  | VariaveisDiscretasAcumuladaData
  | VariaveisDiscretasBinomialData
  | VariaveisDiscretasGeometricaData;
