export const TOPICO_LIMITES = "calculo.limites";

export interface LimitesData {
  tipo: "limite-algebrico";
  a: number;
  coeficiente: number;
  constante: number;
}
