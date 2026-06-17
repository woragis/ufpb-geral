import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CAMPOS, type CamposData } from "../entities/types";

export const camposSolver: ProblemSolver = {
  topicoId: TOPICO_CAMPOS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CamposData;
    switch (d.tipo) {
      case "campos":
        return solveGradiente(d, problema.id);
      case "campos-divergente":
        return solveDivergente(d, problema.id);
      case "campos-rotacional":
        return solveRotacional(d, problema.id);
      case "campos-gradiente-3d":
        return solveGradiente3d(d, problema.id);
      case "campos-divergente-3d":
        return solveDivergente3d(d, problema.id);
    }
  },
};

function solveGradiente(
  d: Extract<CamposData, { tipo: "campos" }>,
  problemaId: string,
): Solution {
  let fx: number;
  let fy: number;
  let calculoParcial: string;

  if (d.funcao === "xy") {
    fx = d.y0;
    fy = d.x0;
    calculoParcial = "∂f/∂x = y, ∂f/∂y = x";
  } else if (d.funcao === "x2y") {
    fx = 2 * d.x0 * d.y0;
    fy = d.x0 * d.x0;
    calculoParcial = "∂f/∂x = 2xy, ∂f/∂y = x²";
  } else {
    fx = 2 * d.x0;
    fy = 2 * d.y0;
    calculoParcial = "∂f/∂x = 2x, ∂f/∂y = 2y";
  }

  const resultado = `(${fx}, ${fy})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Derivadas parciais",
        explicacao: "∇f = (∂f/∂x, ∂f/∂y).",
        calculo: calculoParcial,
      },
      {
        ordem: 2,
        titulo: "Avaliar no ponto",
        explicacao: `Substituímos x = ${d.x0} e y = ${d.y0}.`,
        calculo: `∇f(${d.x0}, ${d.y0}) = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveDivergente(
  d: Extract<CamposData, { tipo: "campos-divergente" }>,
  problemaId: string,
): Solution {
  const div = d.a + d.c;
  return {
    problemaId,
    respostaFinal: String(div),
    steps: [
      {
        ordem: 1,
        titulo: "Divergente em 2D",
        explicacao: "div F = ∂P/∂x + ∂Q/∂y para F = (P, Q).",
        calculo: `P = ${d.a}x + ${d.b}, Q = ${d.c}y + ${d.d}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "∂P/∂x = a e ∂Q/∂y = c.",
        calculo: `div F = ${d.a} + ${d.c} = ${div}`,
        resultado: String(div),
      },
    ],
  };
}

function solveRotacional(
  d: Extract<CamposData, { tipo: "campos-rotacional" }>,
  problemaId: string,
): Solution {
  const rot = d.b - d.a;
  return {
    problemaId,
    respostaFinal: String(rot),
    steps: [
      {
        ordem: 1,
        titulo: "Rotacional escalar em 2D",
        explicacao: "rot F = ∂Q/∂x − ∂P/∂y para F = (P, Q).",
        calculo: `P = ${d.a}y, Q = ${d.b}x`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "∂Q/∂x = b e ∂P/∂y = a.",
        calculo: `rot F = ${d.b} − ${d.a} = ${rot}`,
        resultado: String(rot),
      },
    ],
  };
}

function solveGradiente3d(
  d: Extract<CamposData, { tipo: "campos-gradiente-3d" }>,
  problemaId: string,
): Solution {
  const resultado = `(${2 * d.x0}, ${2 * d.y0}, ${2 * d.z0})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Derivadas parciais",
        explicacao: "∇f = (2x, 2y, 2z) para f = x² + y² + z².",
        calculo: `∂f/∂x = 2x, ∂f/∂y = 2y, ∂f/∂z = 2z`,
      },
      {
        ordem: 2,
        titulo: "Avaliar",
        explicacao: `No ponto (${d.x0}, ${d.y0}, ${d.z0}).`,
        calculo: `∇f = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveDivergente3d(
  d: Extract<CamposData, { tipo: "campos-divergente-3d" }>,
  problemaId: string,
): Solution {
  const div = d.a + d.b + d.c;
  return {
    problemaId,
    respostaFinal: String(div),
    steps: [
      {
        ordem: 1,
        titulo: "Divergente em 3D",
        explicacao: "div F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z.",
        calculo: `F = (${d.a}x, ${d.b}y, ${d.c}z)`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Somamos as derivadas parciais das componentes.",
        calculo: `div F = ${d.a} + ${d.b} + ${d.c} = ${div}`,
        resultado: String(div),
      },
    ],
  };
}
