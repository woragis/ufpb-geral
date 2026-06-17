import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { fmtNum } from "../lib/format";
import { TOPICO_REGRA_CADEIA, type RegraCadeiaData } from "../entities/types";

export const regraCadeiaSolver: ProblemSolver = {
  topicoId: TOPICO_REGRA_CADEIA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as RegraCadeiaData;
    switch (d.tipo) {
      case "regra-cadeia-potencia":
        return solvePotencia(d, problema.id);
      case "regra-cadeia-trig":
        return solveTrig(d, problema.id);
      case "regra-cadeia-exp-log":
        return solveExpLog(d, problema.id);
      default:
        throw new Error("Tipo de regra da cadeia desconhecido");
    }
  },
};

function solvePotencia(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-potencia" }>,
  problemaId: string,
): Solution {
  const gx = d.a * d.x0 + d.b;
  const resultado = d.n * Math.pow(gx, d.n - 1) * d.a;

  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Composição",
        explicacao: "h(x) = f(g(x)) com f(u) = uⁿ e g(x) = ax + b.",
        calculo: `f(u) = u^${d.n}, g(x) = ${d.a}x + ${d.b}`,
      },
      {
        ordem: 2,
        titulo: "Regra da cadeia",
        explicacao: "h'(x) = f'(g(x))·g'(x).",
        calculo: `h'(x) = ${d.n}(${d.a}x + ${d.b})^${d.n - 1} · ${d.a}`,
      },
      {
        ordem: 3,
        titulo: "Substituir",
        explicacao: `g(${d.x0}) = ${gx}`,
        calculo: `h'(${d.x0}) = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveTrig(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-trig" }>,
  problemaId: string,
): Solution {
  const arg = d.a * d.x0 + d.b;
  const resultado =
    d.funcao === "sin"
      ? d.a * Math.cos(arg)
      : -d.a * Math.sin(arg);
  const resposta = fmtNum(Math.round(resultado * 1000) / 1000);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Composição",
        explicacao: `g(x) = ${d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}, h = ${d.funcao} ∘ g.`,
        calculo: `g'(x) = ${d.a}`,
      },
      {
        ordem: 2,
        titulo: "Regra da cadeia",
        explicacao:
          d.funcao === "sin"
            ? "h' = cos(g(x))·g'(x)"
            : "h' = −sin(g(x))·g'(x)",
        calculo:
          d.funcao === "sin"
            ? `h'(x) = cos(${d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}) · ${d.a}`
            : `h'(x) = −sin(${d.a}x ${d.b >= 0 ? "+" : "−"} ${Math.abs(d.b)}) · ${d.a}`,
      },
      {
        ordem: 3,
        titulo: "Avaliar",
        explicacao: `x = ${d.x0}`,
        calculo: `h'(${d.x0}) = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveExpLog(
  d: Extract<RegraCadeiaData, { tipo: "regra-cadeia-exp-log" }>,
  problemaId: string,
): Solution {
  const inner = d.a * d.x0 + d.b;
  const resultado =
    d.funcao === "exp"
      ? d.a * Math.exp(inner)
      : d.a / inner;
  const resposta = fmtNum(Math.round(resultado * 1000) / 1000);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Composição",
        explicacao: `g(x) = ${d.a}x + ${d.b}.`,
        calculo: `g'(x) = ${d.a}`,
      },
      {
        ordem: 2,
        titulo: "Regra da cadeia",
        explicacao:
          d.funcao === "exp"
            ? "h' = e^(g(x))·g'(x)"
            : "h' = g'(x)/g(x)",
        calculo:
          d.funcao === "exp"
            ? `h'(x) = e^(${d.a}x+${d.b}) · ${d.a}`
            : `h'(x) = ${d.a}/(${d.a}x+${d.b})`,
      },
      {
        ordem: 3,
        titulo: "Avaliar",
        explicacao: `x = ${d.x0}`,
        calculo: `h'(${d.x0}) = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}
