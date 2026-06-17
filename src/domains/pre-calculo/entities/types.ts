export const TOPICO_CONJUNTOS = "pre-calculo.conjuntos";
export const TOPICO_FUNCOES_ELEMENTARES = "pre-calculo.funcoes-elementares";
export const TOPICO_FUNCAO_MODULAR = "pre-calculo.funcao-modular";
export const TOPICO_BINOMIO_NEWTON = "pre-calculo.binomio-newton";

// ── Conjuntos ──

export interface ConjuntosOperacaoData {
  tipo: "conjuntos-operacao";
  operacao: "uniao" | "intersecao" | "complemento" | "diferenca";
  nU: number;
  nA: number;
  nB: number;
  nAinterB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface ConjuntosProdutoCartesianoData {
  tipo: "conjuntos-produto-cartesiano";
  nA: number;
  nB: number;
  descricaoA: string;
  descricaoB: string;
}

export interface ConjuntosPertinenciaData {
  tipo: "conjuntos-pertinencia";
  universo: number;
  nSatisfaz: number;
  propriedade: string;
  pergunta: "cardinalidade";
}

export type ConjuntosData =
  | ConjuntosOperacaoData
  | ConjuntosProdutoCartesianoData
  | ConjuntosPertinenciaData;

// ── Funções elementares ──

export interface FuncaoAfimData {
  tipo: "funcao-afim";
  a: number;
  b: number;
  pergunta: "avaliar" | "raiz";
  x0: number;
}

export interface FuncaoQuadraticaData {
  tipo: "funcao-quadratica";
  a: number;
  b: number;
  c: number;
  pergunta: "vertice" | "discriminante" | "avaliar";
  x0: number;
}

export interface FuncaoExponencialData {
  tipo: "funcao-exponencial";
  base: number;
  pergunta: "avaliar" | "equacao";
  expoente: number;
}

export interface FuncaoLogaritmicaData {
  tipo: "funcao-logaritmica";
  base: number;
  pergunta: "avaliar" | "equacao";
  argumento: number;
  expoente: number;
}

export type FuncoesElementaresData =
  | FuncaoAfimData
  | FuncaoQuadraticaData
  | FuncaoExponencialData
  | FuncaoLogaritmicaData;

// ── Função modular ──

export interface FuncaoModularEquacaoData {
  tipo: "modular-equacao";
  a: number;
  b: number;
  c: number;
}

export interface FuncaoModularInequacaoData {
  tipo: "modular-inequacao";
  a: number;
  b: number;
  c: number;
  operador: "menor" | "maior";
}

export interface FuncaoModularAvaliarData {
  tipo: "modular-avaliar";
  a: number;
  b: number;
  x0: number;
}

export type FuncaoModularData =
  | FuncaoModularEquacaoData
  | FuncaoModularInequacaoData
  | FuncaoModularAvaliarData;

// ── Binômio de Newton ──

export interface BinomioCoeficienteData {
  tipo: "binomio-coeficiente";
  n: number;
  k: number;
  a: number;
  b: number;
}

export interface BinomioTermoGeralData {
  tipo: "binomio-termo-geral";
  n: number;
  ordem: number;
  a: number;
  b: number;
}

export interface BinomioSomaCoeficientesData {
  tipo: "binomio-soma-coeficientes";
  n: number;
  a: number;
  b: number;
}

export interface BinomioExpansaoData {
  tipo: "binomio-expansao";
  n: number;
}

export type BinomioNewtonData =
  | BinomioCoeficienteData
  | BinomioTermoGeralData
  | BinomioSomaCoeficientesData
  | BinomioExpansaoData;
