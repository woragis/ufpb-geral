export const TOPICO_VETORES = "calculo-vetorial.vetores";
export const TOPICO_PRODUTO_ESCULAR = "calculo-vetorial.produto-escalar";
export const TOPICO_PRODUTO_VETORIAL = "calculo-vetorial.produto-vetorial";
export const TOPICO_RETAS_PLANOS = "calculo-vetorial.retas-planos";
export const TOPICO_CURVAS = "calculo-vetorial.curvas";
export const TOPICO_CAMPOS = "calculo-vetorial.campos";

// ── Vetores ──

export interface VetoresModuloData {
  tipo: "vetores";
  dimensao: 2 | 3;
  componentes: number[];
}

export interface VetoresSomaData {
  tipo: "vetores-soma";
  dimensao: 2 | 3;
  u: number[];
  v: number[];
}

export interface VetoresEscalarData {
  tipo: "vetores-escalar";
  k: number;
  componentes: number[];
}

export interface VetoresUnitarioData {
  tipo: "vetores-unitario";
  dimensao: 2 | 3;
  componentes: number[];
}

export interface VetoresDistanciaData {
  tipo: "vetores-distancia";
  p: [number, number, number];
  q: [number, number, number];
}

export interface VetoresParaleloData {
  tipo: "vetores-paralelo";
  u: [number, number, number];
  v: [number, number, number];
}

export type VetoresData =
  | VetoresModuloData
  | VetoresSomaData
  | VetoresEscalarData
  | VetoresUnitarioData
  | VetoresDistanciaData
  | VetoresParaleloData;

// ── Produto escalar ──

export interface ProdutoEscalarDotData {
  tipo: "produto-escalar";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoEscalarAnguloData {
  tipo: "produto-escalar-angulo";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoEscalarProjecaoData {
  tipo: "produto-escalar-projecao";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoEscalarOrtogonalData {
  tipo: "produto-escalar-ortogonal";
  u: [number, number, number];
  v: [number, number, number];
}

export type ProdutoEscalarData =
  | ProdutoEscalarDotData
  | ProdutoEscalarAnguloData
  | ProdutoEscalarProjecaoData
  | ProdutoEscalarOrtogonalData;

// ── Produto vetorial ──

export interface ProdutoVetorialCrossData {
  tipo: "produto-vetorial";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoVetorialAreaData {
  tipo: "produto-vetorial-area";
  u: [number, number, number];
  v: [number, number, number];
}

export interface ProdutoVetorialMistoData {
  tipo: "produto-vetorial-misto";
  u: [number, number, number];
  v: [number, number, number];
  w: [number, number, number];
}

export type ProdutoVetorialData =
  | ProdutoVetorialCrossData
  | ProdutoVetorialAreaData
  | ProdutoVetorialMistoData;

// ── Retas e planos ──

export interface RetasPlanosDiretorData {
  tipo: "retas-planos";
  p1: [number, number, number];
  p2: [number, number, number];
}

export interface RetasPlanosParametricaData {
  tipo: "retas-planos-parametrica";
  p0: [number, number, number];
  diretor: [number, number, number];
}

export interface RetasPlanosPlanoData {
  tipo: "retas-planos-plano";
  ponto: [number, number, number];
  normal: [number, number, number];
}

export interface RetasPlanosDistanciaData {
  tipo: "retas-planos-distancia";
  ponto: [number, number, number];
  /** ax + by + cz = d */
  coeficientes: [number, number, number, number];
}

export interface RetasPlanosDistanciaRetaData {
  tipo: "retas-planos-distancia-reta";
  ponto: [number, number, number];
  p0: [number, number, number];
  diretor: [number, number, number];
}

export interface RetasPlanosIntersecaoData {
  tipo: "retas-planos-intersecao";
  p0: [number, number, number];
  diretor: [number, number, number];
  coeficientes: [number, number, number, number];
}

export type RetasPlanosData =
  | RetasPlanosDiretorData
  | RetasPlanosParametricaData
  | RetasPlanosPlanoData
  | RetasPlanosDistanciaData
  | RetasPlanosDistanciaRetaData
  | RetasPlanosIntersecaoData;

// ── Curvas ──

export interface CurvasVelocidadeModuloData {
  tipo: "curvas";
  familia: "parabola";
  a: number;
  b: number;
  t0: number;
}

export interface CurvasVelocidadeVetorData {
  tipo: "curvas-velocidade-vetor";
  familia: "parabola" | "reta";
  a: number;
  b: number;
  c?: number;
  t0: number;
}

export interface CurvasTangenteData {
  tipo: "curvas-tangente";
  familia: "parabola";
  a: number;
  b: number;
  t0: number;
}

export interface CurvasCirculoData {
  tipo: "curvas-circulo";
  t0: number;
}

export interface CurvasComprimentoData {
  tipo: "curvas-comprimento";
  a: number;
  b: number;
  t1: number;
  t2: number;
}

export interface CurvasHeliceData {
  tipo: "curvas-helice";
  t0: number;
}

export type CurvasData =
  | CurvasVelocidadeModuloData
  | CurvasVelocidadeVetorData
  | CurvasTangenteData
  | CurvasCirculoData
  | CurvasComprimentoData
  | CurvasHeliceData;

// ── Campos ──

export interface CamposGradienteData {
  tipo: "campos";
  funcao: "x2y2" | "xy" | "x2y";
  x0: number;
  y0: number;
}

export interface CamposDivergenteData {
  tipo: "campos-divergente";
  /** F(x,y) = (ax + b, cy + d) */
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface CamposRotacionalData {
  tipo: "campos-rotacional";
  a: number;
  b: number;
}

export interface CamposGradiente3dData {
  tipo: "campos-gradiente-3d";
  x0: number;
  y0: number;
  z0: number;
}

export interface CamposDivergente3dData {
  tipo: "campos-divergente-3d";
  a: number;
  b: number;
  c: number;
}

export type CamposData =
  | CamposGradienteData
  | CamposDivergenteData
  | CamposRotacionalData
  | CamposGradiente3dData
  | CamposDivergente3dData;
