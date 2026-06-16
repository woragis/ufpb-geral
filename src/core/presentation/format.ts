import type { Step } from "@/core/domain/problem";

export function formatStepLabel(step: Step): string {
  return `Passo ${step.ordem}: ${step.titulo}`;
}

export function dificuldadeLabel(dificuldade: 1 | 2 | 3): string {
  switch (dificuldade) {
    case 1:
      return "Fácil";
    case 2:
      return "Médio";
    case 3:
      return "Difícil";
  }
}
