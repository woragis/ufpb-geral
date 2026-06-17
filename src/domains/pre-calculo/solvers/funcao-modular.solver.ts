import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { absModular, formatFraction } from "../utils/math";
import { TOPICO_FUNCAO_MODULAR, type FuncaoModularData } from "../entities/types";

export const funcaoModularSolver: ProblemSolver = {
  topicoId: TOPICO_FUNCAO_MODULAR,

  resolver(problema: Problem): Solution {
    const d = problema.dados as FuncaoModularData;
    switch (d.tipo) {
      case "modular-equacao":
        return solveEquacao(d, problema.id);
      case "modular-inequacao":
        return solveInequacao(d, problema.id);
      case "modular-avaliar":
        return solveAvaliar(d, problema.id);
    }
  },
};

function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : formatFraction(Math.round(n * 1000), 1000);
}

function solveEquacao(
  d: Extract<FuncaoModularData, { tipo: "modular-equacao" }>,
  problemaId: string,
): Solution {
  const n1 = (d.c - d.b) / d.a;
  const n2 = (-d.c - d.b) / d.a;
  const sorted = [n1, n2].sort((a, b) => a - b);
  const resposta =
    n1 === n2 ? fmtNum(n1) : `${fmtNum(sorted[0]!)}, ${fmtNum(sorted[1]!)}`;

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Casos do módulo",
        explicacao: "|ax+b| = c implica ax+b = c ou ax+b = −c.",
        calculo: `${d.a}x + (${d.b}) = ${d.c} ⇒ x = ${fmtNum(n1)};  ${d.a}x + (${d.b}) = −${d.c} ⇒ x = ${fmtNum(n2)}`,
      },
      {
        ordem: 2,
        titulo: "Soluções",
        explicacao: "Reunimos as raízes em ordem crescente.",
        resultado: resposta,
      },
    ],
  };
}

function solveInequacao(
  d: Extract<FuncaoModularData, { tipo: "modular-inequacao" }>,
  problemaId: string,
): Solution {
  const left = (-d.c - d.b) / d.a;
  const right = (d.c - d.b) / d.a;
  const lo = Math.min(left, right);
  const hi = Math.max(left, right);

  if (d.operador === "menor") {
    const resposta = `(${fmtNum(lo)}, ${fmtNum(hi)})`;
    return {
      problemaId,
      respostaFinal: resposta,
      steps: [
        {
          ordem: 1,
          titulo: "Inequação com módulo",
          explicacao: "|ax+b| < c equivale a −c < ax+b < c.",
          calculo: `−${d.c} < ${d.a}x + (${d.b}) < ${d.c}`,
        },
        {
          ordem: 2,
          titulo: "Intervalo solução",
          explicacao: "Isolamos x e escrevemos o intervalo aberto.",
          calculo: `${fmtNum(lo)} < x < ${fmtNum(hi)}`,
          resultado: resposta,
        },
      ],
    };
  }

  const resposta = `(-∞, ${fmtNum(lo)}) ∪ (${fmtNum(hi)}, +∞)`;
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Inequação com módulo",
        explicacao: "|ax+b| > c equivale a ax+b > c ou ax+b < −c.",
        calculo: `x < ${fmtNum(lo)} ou x > ${fmtNum(hi)}`,
        resultado: resposta,
      },
    ],
  };
}

function solveAvaliar(
  d: Extract<FuncaoModularData, { tipo: "modular-avaliar" }>,
  problemaId: string,
): Solution {
  const resultado = absModular(d.a, d.b, d.x0);
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Avaliação do módulo",
        explicacao: "Substituímos x e aplicamos o valor absoluto.",
        calculo: `f(${d.x0}) = |${d.a}·${d.x0} + (${d.b})| = |${d.a * d.x0 + d.b}| = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}
