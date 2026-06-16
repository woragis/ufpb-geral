export const TOPICO_VETORES = "calculo-vetorial.vetores";
export const TOPICO_PRODUTO_ESCULAR = "calculo-vetorial.produto-escalar";
export const TOPICO_PRODUTO_VETORIAL = "calculo-vetorial.produto-vetorial";
export const TOPICO_RETAS_PLANOS = "calculo-vetorial.retas-planos";
export const TOPICO_CURVAS = "calculo-vetorial.curvas";
export const TOPICO_CAMPOS = "calculo-vetorial.campos";

export interface VetoresData {
  tipo: "vetores";
  dimensao: 2 | 3;
  componentes: number[];
}

export interface ProdutoEscalarData {
  tipo: "produto-escalar";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoVetorialData {
  tipo: "produto-vetorial";
  u: [number, number, number];
  v: [number, number, number];
}

export interface RetasPlanosData {
  tipo: "retas-planos";
  p1: [number, number, number];
  p2: [number, number, number];
}

export interface CurvasData {
  tipo: "curvas";
  a: number;
  b: number;
  t0: number;
}

export interface CamposData {
  tipo: "campos";
  x0: number;
  y0: number;
}
