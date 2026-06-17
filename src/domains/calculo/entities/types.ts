export const TOPICO_LIMITES = "calculo.limites";
export const TOPICO_CONTINUIDADE = "calculo.continuidade";
export const TOPICO_DERIVADAS = "calculo.derivadas";
export const TOPICO_REGRA_CADEIA = "calculo.regra-cadeia";
export const TOPICO_OTIMIZACAO = "calculo.otimizacao";
export const TOPICO_INTEGRAIS_INDEFINIDAS = "calculo.integrais-indefinidas";
export const TOPICO_INTEGRAIS_DEFINIDAS = "calculo.integrais-definidas";
export const TOPICO_AREA = "calculo.area";
export const TOPICO_SEQUENCIAS = "calculo.sequencias";
export const TOPICO_SERIES = "calculo.series";
export const TOPICO_TAYLOR = "calculo.taylor";
export const TOPICO_EDOS = "calculo.edos";

// ── Limites ──

export interface LimitesAlgebricoData {
  tipo: "limite-algebrico";
  a: number;
  coeficiente: number;
  constante: number;
}

export interface LimitesTrigData {
  tipo: "limite-trig";
  variante: "sin-x" | "sin-ax" | "tan-x" | "um-menos-cos";
  /** multiplicador em sin(ax)/x ou sin(ax)/(bx) */
  a: number;
  b?: number;
}

export interface LimitesRacionalData {
  tipo: "limite-racional";
  a: number;
  /** raízes do numerador: (x - r1)(x - r2), grau 2 */
  r1: number;
  r2: number;
}

export interface LimitesRadicalData {
  tipo: "limite-radical";
  /** lim (sqrt(x+k) - sqrt(k)) / x  quando x→0 */
  k: number;
}

export interface LimitesInfinitoData {
  tipo: "limite-infinito";
  numA: number;
  numB: number;
  denA: number;
  denB: number;
}

export interface LimitesSubstituicaoData {
  tipo: "limite-substituicao";
  a: number;
  coeficientes: number[];
  expoentes: number[];
}

export type LimitesData =
  | LimitesAlgebricoData
  | LimitesTrigData
  | LimitesRacionalData
  | LimitesRadicalData
  | LimitesInfinitoData
  | LimitesSubstituicaoData;

// ── Continuidade ──

export interface ContinuidadeAfimData {
  tipo: "continuidade-afim";
  a: number;
  m1: number;
  b1: number;
  m2: number;
  b2: number;
  continua: boolean;
}

export interface ContinuidadeClassificarData {
  tipo: "continuidade-classificar";
  a: number;
  /** removivel | salto | infinita */
  classe: "removivel" | "salto" | "infinita";
  m: number;
  b: number;
  /** valor do buraco (removível) ou salto à esquerda */
  valorEsq: number;
  valorDir?: number;
}

export interface ContinuidadeCompletarData {
  tipo: "continuidade-completar";
  a: number;
  r1: number;
  r2: number;
}

export interface ContinuidadeLateralData {
  tipo: "continuidade-lateral";
  a: number;
  /** lim esq e dir de 1/(x-a) ou similar */
  variante: "inverso" | "modulo";
}

export type ContinuidadeData =
  | ContinuidadeAfimData
  | ContinuidadeClassificarData
  | ContinuidadeCompletarData
  | ContinuidadeLateralData;

// ── Derivadas ──

export interface DerivadasPolinomioData {
  tipo: "derivadas-polinomio";
  coeficientes: number[];
  expoentes: number[];
  x0: number;
}

export interface DerivadasTrigData {
  tipo: "derivadas-trig";
  funcao: "sin" | "cos" | "tan";
  /** argumento: k*x + b */
  k: number;
  b: number;
  x0: number;
}

export interface DerivadasExpLogData {
  tipo: "derivadas-exp-log";
  funcao: "exp" | "ln";
  k: number;
  x0: number;
}

export interface DerivadasProdutoData {
  tipo: "derivadas-produto";
  /** f(x) = (a*x^n) * (b*x^m + c) simplificado */
  a: number;
  n: number;
  b: number;
  m: number;
  c: number;
  x0: number;
}

export interface DerivadasQuocienteData {
  tipo: "derivadas-quociente";
  /** f(x) = x^n / (x + c) */
  n: number;
  c: number;
  x0: number;
}

export interface DerivadasTangenteData {
  tipo: "derivadas-tangente";
  a: number;
  n: number;
  x0: number;
}

export interface DerivadasDefinicaoData {
  tipo: "derivadas-definicao";
  a: number;
  n: number;
  x0: number;
}

export type DerivadasData =
  | DerivadasPolinomioData
  | DerivadasTrigData
  | DerivadasExpLogData
  | DerivadasProdutoData
  | DerivadasQuocienteData
  | DerivadasTangenteData
  | DerivadasDefinicaoData;

// ── Regra da cadeia ──

export interface RegraCadeiaPotenciaData {
  tipo: "regra-cadeia-potencia";
  a: number;
  b: number;
  n: number;
  x0: number;
}

export interface RegraCadeiaTrigData {
  tipo: "regra-cadeia-trig";
  funcao: "sin" | "cos";
  a: number;
  b: number;
  x0: number;
}

export interface RegraCadeiaExpLogData {
  tipo: "regra-cadeia-exp-log";
  funcao: "exp" | "ln";
  a: number;
  b: number;
  x0: number;
}

export type RegraCadeiaData =
  | RegraCadeiaPotenciaData
  | RegraCadeiaTrigData
  | RegraCadeiaExpLogData;

// ── Otimização ──

export interface OtimizacaoParabolaData {
  tipo: "otimizacao-parabola";
  a: number;
  b: number;
  c: number;
}

export interface OtimizacaoGeometricaData {
  tipo: "otimizacao-geometrica";
  /** perímetro fixo P, maximizar área retangular w*(P/2-w) */
  perimetro: number;
}

export interface OtimizacaoCrescimentoData {
  tipo: "otimizacao-crescimento";
  /** f(x) = x^3 + a*x, encontrar intervalos crescentes */
  a: number;
}

export interface OtimizacaoConcavidadeData {
  tipo: "otimizacao-concavidade";
  /** f(x) = x^3 + a*x */
  a: number;
}

export type OtimizacaoData =
  | OtimizacaoParabolaData
  | OtimizacaoGeometricaData
  | OtimizacaoCrescimentoData
  | OtimizacaoConcavidadeData;

// ── Cálculo 2+ (inalterados) ──

export interface IntegraisIndefinidasData {
  tipo: "integrais-indefinidas";
  n: number;
}

export interface IntegraisDefinidasData {
  tipo: "integrais-definidas";
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface AreaData {
  tipo: "area";
  m: number;
  b: number;
  a: number;
  c: number;
}

export interface SequenciasData {
  tipo: "sequencias";
  numeradorCoef: number;
  numeradorConst: number;
  denominadorCoef: number;
  denominadorConst: number;
}

export interface SeriesData {
  tipo: "series";
  a1: number;
  r: number;
  n: number;
}

export interface TaylorData {
  tipo: "taylor";
  funcao: "exponencial" | "seno";
  x0: number;
  grau: number;
}

export interface EdosData {
  tipo: "edos";
  k: number;
  y0: number;
  x: number;
}
