import type { Dificuldade, DisciplinaId, TopicoId } from "./ids";
import type { ExerciseSeed } from "./seed";

export interface Step {
  ordem: number;
  titulo: string;
  explicacao: string;
  calculo?: string;
  resultado?: string;
  calculoLatex?: string;
  resultadoLatex?: string;
  explicacaoLatex?: string;
}

export interface Solution {
  problemaId: string;
  respostaFinal: string;
  respostaFinalLatex?: string;
  steps: Step[];
}

export interface Problem {
  id: string;
  disciplinaId: DisciplinaId;
  topicoId: TopicoId;
  enunciado: string;
  enunciadoLatex?: string;
  dados: unknown;
  dificuldade: Dificuldade;
  seed: ExerciseSeed;
  geradoEm: string;
}
