import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { formatFraction } from "../utils/math";
import {
  TOPICO_FUNCOES_ELEMENTARES,
  type FuncoesElementaresData,
} from "../entities/types";

export const funcoesElementaresSolver: ProblemSolver = {
  topicoId: TOPICO_FUNCOES_ELEMENTARES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as FuncoesElementaresData;
    switch (d.tipo) {
      case "funcao-afim":
        return solveAfim(d, problema.id);
      case "funcao-quadratica":
        return solveQuadratica(d, problema.id);
      case "funcao-exponencial":
        return solveExponencial(d, problema.id);
      case "funcao-logaritmica":
        return solveLogaritmica(d, problema.id);
    }
  },
};

function solveAfim(
  d: Extract<FuncoesElementaresData, { tipo: "funcao-afim" }>,
  problemaId: string,
): Solution {
  if (d.pergunta === "raiz") {
    const resultado = formatFraction(-d.b, d.a);
    return {
      problemaId,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Zero da função afim",
          explicacao: "Resolvemos ax + b = 0, logo x = −b/a.",
          calculo: `x = −(${d.b})/${d.a} = ${resultado}`,
          resultado,
        },
      ],
    };
  }
  const resultado = d.a * d.x0 + d.b;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Avaliação",
        explicacao: "Substituímos x na expressão f(x) = ax + b.",
        calculo: `f(${d.x0}) = ${d.a}·${d.x0} + (${d.b}) = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveQuadratica(
  d: Extract<FuncoesElementaresData, { tipo: "funcao-quadratica" }>,
  problemaId: string,
): Solution {
  if (d.pergunta === "vertice") {
    const resultado = formatFraction(-d.b, 2 * d.a);
    return {
      problemaId,
      respostaFinal: resultado,
      steps: [
        {
          ordem: 1,
          titulo: "Vértice da parábola",
          explicacao: "A abscissa do vértice é x_v = −b/(2a).",
          calculo: `x_v = −(${d.b})/(2·${d.a}) = ${resultado}`,
          resultado,
        },
      ],
    };
  }
  if (d.pergunta === "discriminante") {
    const resultado = d.b * d.b - 4 * d.a * d.c;
    return {
      problemaId,
      respostaFinal: String(resultado),
      steps: [
        {
          ordem: 1,
          titulo: "Discriminante",
          explicacao: "Δ = b² − 4ac determina o número de raízes reais.",
          calculo: `Δ = (${d.b})² − 4·${d.a}·(${d.c}) = ${resultado}`,
          resultado: String(resultado),
        },
      ],
    };
  }
  const resultado = d.a * d.x0 * d.x0 + d.b * d.x0 + d.c;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Avaliação",
        explicacao: "Substituímos x na função quadrática.",
        calculo: `f(${d.x0}) = ${d.a}·(${d.x0})² + (${d.b})·(${d.x0}) + (${d.c}) = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveExponencial(
  d: Extract<FuncoesElementaresData, { tipo: "funcao-exponencial" }>,
  problemaId: string,
): Solution {
  if (d.pergunta === "equacao") {
    return {
      problemaId,
      respostaFinal: String(d.expoente),
      steps: [
        {
          ordem: 1,
          titulo: "Equação exponencial",
          explicacao: "Igualamos os expoentes quando as bases são iguais.",
          calculo: `${d.base}^x = ${d.base}^${d.expoente} ⇒ x = ${d.expoente}`,
          resultado: String(d.expoente),
        },
      ],
    };
  }
  const resultado = d.base ** d.expoente;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Potência",
        explicacao: "Calculamos a potência com expoente natural.",
        calculo: `${d.base}^${d.expoente} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveLogaritmica(
  d: Extract<FuncoesElementaresData, { tipo: "funcao-logaritmica" }>,
  problemaId: string,
): Solution {
  const expoente = d.expoente;
  if (d.pergunta === "equacao") {
    return {
      problemaId,
      respostaFinal: String(d.argumento),
      steps: [
        {
          ordem: 1,
          titulo: "Equação logarítmica",
          explicacao: "Se log_a(x) = k, então x = a^k.",
          calculo: `x = ${d.base}^${expoente} = ${d.argumento}`,
          resultado: String(d.argumento),
        },
      ],
    };
  }
  return {
    problemaId,
    respostaFinal: String(expoente),
    steps: [
      {
        ordem: 1,
        titulo: "Logaritmo",
        explicacao: "Expressamos o argumento como potência da base.",
        calculo: `log_${d.base}(${d.argumento}) = log_${d.base}(${d.base}^${expoente}) = ${expoente}`,
        resultado: String(expoente),
      },
    ],
  };
}
