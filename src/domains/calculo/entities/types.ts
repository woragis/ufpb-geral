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

export interface LimitesData {
  tipo: "limite-algebrico";
  a: number;
  coeficiente: number;
  constante: number;
}

export interface ContinuidadeData {
  tipo: "continuidade";
  a: number;
  m1: number;
  b1: number;
  m2: number;
  b2: number;
  continua: boolean;
}

export interface DerivadasData {
  tipo: "derivadas";
  coeficientes: number[];
  expoentes: number[];
  x0: number;
}

export interface RegraCadeiaData {
  tipo: "regra-cadeia";
  a: number;
  b: number;
  n: number;
  x0: number;
}

export interface OtimizacaoData {
  tipo: "otimizacao";
  a: number;
  b: number;
  c: number;
}

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
