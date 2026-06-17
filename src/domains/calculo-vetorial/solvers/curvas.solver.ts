import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { round2 } from "../lib/vec";
import { TOPICO_CURVAS, type CurvasData } from "../entities/types";

export const curvasSolver: ProblemSolver = {
  topicoId: TOPICO_CURVAS,

  resolver(problema: Problem): Solution {
    const d = problema.dados as CurvasData;
    switch (d.tipo) {
      case "curvas":
        return solveVelocidadeModulo(d, problema.id);
      case "curvas-velocidade-vetor":
        return solveVelocidadeVetor(d, problema.id);
      case "curvas-tangente":
        return solveTangente(d, problema.id);
      case "curvas-circulo":
        return solveCirculo(d, problema.id);
      case "curvas-comprimento":
        return solveComprimento(d, problema.id);
      case "curvas-helice":
        return solveHelice(d, problema.id);
    }
  },
};

function derivadaParabola(d: { a: number; t0: number }): [number, number] {
  return [d.a, 2 * d.t0];
}

function derivadaReta(d: { a: number; c?: number; t0: number }): [number, number] {
  return [d.a, d.c ?? 0];
}

function solveVelocidadeModulo(
  d: Extract<CurvasData, { tipo: "curvas" }>,
  problemaId: string,
): Solution {
  const [rx, ry] = derivadaParabola(d);
  const mod = round2(Math.sqrt(rx * rx + ry * ry));
  return {
    problemaId,
    respostaFinal: String(mod),
    steps: [
      {
        ordem: 1,
        titulo: "Derivar a curva",
        explicacao: "r'(t) = (x'(t), y'(t)).",
        calculo: `r'(t) = (${d.a}, 2t)`,
      },
      {
        ordem: 2,
        titulo: "Avaliar em t = t₀",
        explicacao: `Substituímos t = ${d.t0} nas componentes da derivada.`,
        calculo: `r'(${d.t0}) = (${rx}, ${ry})`,
      },
      {
        ordem: 3,
        titulo: "Calcular o módulo (velocidade escalar)",
        explicacao: "A velocidade escalar é o módulo do vetor velocidade.",
        calculo: `|r'(${d.t0})| = √(${rx}² + ${ry}²) = ${mod}`,
        resultado: String(mod),
      },
    ],
  };
}

function solveVelocidadeVetor(
  d: Extract<CurvasData, { tipo: "curvas-velocidade-vetor" }>,
  problemaId: string,
): Solution {
  const [rx, ry] =
    d.familia === "reta" ? derivadaReta(d) : derivadaParabola(d);
  const resultado = `(${rx}, ${ry})`;
  const derivExpr =
    d.familia === "reta"
      ? `r'(t) = (${d.a}, ${d.c})`
      : `r'(t) = (${d.a}, 2t)`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Derivar a curva",
        explicacao: "Derivamos cada componente em relação a t.",
        calculo: derivExpr,
      },
      {
        ordem: 2,
        titulo: "Avaliar em t₀",
        explicacao: `Substituímos t = ${d.t0}.`,
        calculo: `r'(${d.t0}) = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveTangente(
  d: Extract<CurvasData, { tipo: "curvas-tangente" }>,
  problemaId: string,
): Solution {
  const [rx, ry] = derivadaParabola(d);
  const resultado = `(${rx}, ${ry})`;
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Vetor tangente",
        explicacao: "O vetor tangente em t₀ é r'(t₀).",
        calculo: `r'(t) = (${d.a}, 2t)`,
      },
      {
        ordem: 2,
        titulo: "Avaliar",
        explicacao: `Em t = ${d.t0}, o vetor tangente é r'(${d.t0}).`,
        calculo: `r'(${d.t0}) = ${resultado}`,
        resultado,
      },
    ],
  };
}

function solveCirculo(
  d: Extract<CurvasData, { tipo: "curvas-circulo" }>,
  problemaId: string,
): Solution {
  return {
    problemaId,
    respostaFinal: "1",
    steps: [
      {
        ordem: 1,
        titulo: "Derivar",
        explicacao: "r'(t) = (−sin(t), cos(t)) para r(t) = (cos(t), sin(t)).",
        calculo: `r'(${d.t0}) = (−sin(${d.t0}), cos(${d.t0}))`,
      },
      {
        ordem: 2,
        titulo: "Módulo",
        explicacao: "sin²(t) + cos²(t) = 1, logo |r'(t)| = 1.",
        calculo: `|r'(${d.t0})| = 1`,
        resultado: "1",
      },
    ],
  };
}

function solveComprimento(
  d: Extract<CurvasData, { tipo: "curvas-comprimento" }>,
  problemaId: string,
): Solution {
  const speed = Math.sqrt(d.a * d.a + d.b * d.b);
  const comp = round2(speed * (d.t2 - d.t1));
  return {
    problemaId,
    respostaFinal: String(comp),
    steps: [
      {
        ordem: 1,
        titulo: "Velocidade escalar constante",
        explicacao: "Para r(t)=(at, bt), |r'(t)| = √(a²+b²).",
        calculo: `|r'(t)| = √(${d.a}² + ${d.b}²) = ${round2(speed)}`,
      },
      {
        ordem: 2,
        titulo: "Comprimento do arco",
        explicacao: "L = |r'| · (t₂ − t₁) quando a velocidade é constante.",
        calculo: `L = ${round2(speed)} · (${d.t2} − ${d.t1}) = ${comp}`,
        resultado: String(comp),
      },
    ],
  };
}

function solveHelice(
  d: Extract<CurvasData, { tipo: "curvas-helice" }>,
  problemaId: string,
): Solution {
  const mod = round2(Math.sqrt(2));
  return {
    problemaId,
    respostaFinal: String(mod),
    steps: [
      {
        ordem: 1,
        titulo: "Derivar a hélice",
        explicacao: "r'(t) = (−sin(t), cos(t), 1).",
        calculo: `r'(${d.t0}) com componente z' = 1`,
      },
      {
        ordem: 2,
        titulo: "Módulo",
        explicacao: "|r'(t)| = √(sin²+cos²+1) = √2.",
        calculo: `|r'(${d.t0})| = ${mod}`,
        resultado: String(mod),
      },
    ],
  };
}
