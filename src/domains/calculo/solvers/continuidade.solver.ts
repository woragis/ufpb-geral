import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { TOPICO_CONTINUIDADE, type ContinuidadeData } from "../entities/types";

export const continuidadeSolver: ProblemSolver = {
  topicoId: TOPICO_CONTINUIDADE,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ContinuidadeData;
    switch (d.tipo) {
      case "continuidade-afim":
        return solveAfim(d, problema.id);
      case "continuidade-classificar":
        return solveClassificar(d, problema.id);
      case "continuidade-completar":
        return solveCompletar(d, problema.id);
      case "continuidade-lateral":
        return solveLateral(d, problema.id);
      default:
        throw new Error("Tipo de continuidade desconhecido");
    }
  },
};

function solveAfim(
  d: Extract<ContinuidadeData, { tipo: "continuidade-afim" }>,
  problemaId: string,
): Solution {
  const limEsq = d.m1 * d.a + d.b1;
  const limDir = d.m2 * d.a + d.b2;

  return {
    problemaId,
    respostaFinal: d.continua ? "Sim" : "Não",
    steps: [
      {
        ordem: 1,
        titulo: "Limite à esquerda",
        explicacao: "Avaliamos a expressão para x < a em x = a.",
        calculo: `lim(x→${d.a}⁻) = ${d.m1}·${d.a} ${d.b1 >= 0 ? "+" : "−"} ${Math.abs(d.b1)} = ${limEsq}`,
        resultado: String(limEsq),
      },
      {
        ordem: 2,
        titulo: "Limite à direita",
        explicacao: "Avaliamos a expressão para x ≥ a em x = a.",
        calculo: `lim(x→${d.a}⁺) = f(${d.a}) = ${limDir}`,
        resultado: String(limDir),
      },
      {
        ordem: 3,
        titulo: "Conclusão",
        explicacao: "Contínua se os limites laterais são iguais.",
        calculo: `${limEsq} ${d.continua ? "=" : "≠"} ${limDir}`,
        resultado: d.continua ? "Sim" : "Não",
      },
    ],
  };
}

function solveClassificar(
  d: Extract<ContinuidadeData, { tipo: "continuidade-classificar" }>,
  problemaId: string,
): Solution {
  const labels = {
    removivel: "Removível",
    salto: "Salto",
    infinita: "Infinita",
  };

  if (d.classe === "removivel") {
    const limite = 2 * d.a;
    return {
      problemaId,
      respostaFinal: labels.removivel,
      steps: [
        {
          ordem: 1,
          titulo: "Calcular o limite",
          explicacao: "Fatoramos e simplificamos — o limite existe e é finito.",
          calculo: `lim(x→${d.a}) (x²−${d.a * d.a})/(x−${d.a}) = lim(x→${d.a}) (x+${d.a}) = ${limite}`,
          resultado: String(limite),
        },
        {
          ordem: 2,
          titulo: "Classificar",
          explicacao: "Limite existe mas a função não está definida (ou mal definida) no ponto.",
          calculo: "Descontinuidade removível",
          resultado: labels.removivel,
        },
      ],
    };
  }

  if (d.classe === "salto") {
    const limEsq = d.valorEsq;
    const limDir = d.valorDir ?? 0;
    return {
      problemaId,
      respostaFinal: labels.salto,
      steps: [
        {
          ordem: 1,
          titulo: "Limites laterais",
          explicacao: "Calculamos os limites à esquerda e à direita.",
          calculo: `lim⁻ = ${limEsq}, lim⁺ = ${limDir}`,
        },
        {
          ordem: 2,
          titulo: "Classificar",
          explicacao: "Limites laterais existem mas são diferentes.",
          calculo: `${limEsq} ≠ ${limDir} → salto`,
          resultado: labels.salto,
        },
      ],
    };
  }

  return {
    problemaId,
    respostaFinal: labels.infinita,
    steps: [
      {
        ordem: 1,
        titulo: "Limites laterais",
        explicacao: "Quando x → a, o denominador tende a zero.",
        calculo: `lim(x→${d.a}⁻) = −∞, lim(x→${d.a}⁺) = +∞`,
      },
      {
        ordem: 2,
        titulo: "Classificar",
        explicacao: "Pelo menos um limite lateral é infinito.",
        calculo: "Descontinuidade infinita",
        resultado: labels.infinita,
      },
    ],
  };
}

function solveCompletar(
  d: Extract<ContinuidadeData, { tipo: "continuidade-completar" }>,
  problemaId: string,
): Solution {
  const valor = d.r1 + d.r2;

  return {
    problemaId,
    respostaFinal: String(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Fatorar e simplificar",
        explicacao: "Para x ≠ a, simplificamos a fração.",
        calculo: `(x−${d.r1})(x−${d.r2})/(x−${d.a}) = x − ${d.r2}`,
      },
      {
        ordem: 2,
        titulo: "Calcular o limite",
        explicacao: "O limite quando x → a é o valor que torna f contínua.",
        calculo: `f(${d.a}) = ${d.a} − ${d.r2} = ${valor}`,
        resultado: String(valor),
      },
    ],
  };
}

function solveLateral(
  d: Extract<ContinuidadeData, { tipo: "continuidade-lateral" }>,
  problemaId: string,
): Solution {
  if (d.variante === "inverso") {
    return {
      problemaId,
      respostaFinal: "Não",
      steps: [
        {
          ordem: 1,
          titulo: "Limite à esquerda",
          explicacao: "x − a < 0, então 1/(x−a) → −∞.",
          calculo: `lim(x→${d.a}⁻) 1/(x−${d.a}) = −∞`,
        },
        {
          ordem: 2,
          titulo: "Limite à direita",
          explicacao: "x − a > 0, então 1/(x−a) → +∞.",
          calculo: `lim(x→${d.a}⁺) 1/(x−${d.a}) = +∞`,
        },
        {
          ordem: 3,
          titulo: "Conclusão",
          explicacao: "Limites laterais não são finitos e iguais.",
          calculo: "Não existem e não são iguais",
          resultado: "Não",
        },
      ],
    };
  }

  return {
    problemaId,
    respostaFinal: "Não",
    steps: [
      {
        ordem: 1,
        titulo: "Limite à esquerda",
        explicacao: "Para x < 0, |x| = −x.",
        calculo: "lim(x→0⁻) |x|/x = lim(x→0⁻) (−x)/x = −1",
        resultado: "−1",
      },
      {
        ordem: 2,
        titulo: "Limite à direita",
        explicacao: "Para x > 0, |x| = x.",
        calculo: "lim(x→0⁺) |x|/x = 1",
        resultado: "1",
      },
      {
        ordem: 3,
        titulo: "Conclusão",
        explicacao: "Limites laterais existem mas diferem.",
        calculo: "−1 ≠ 1",
        resultado: "Não",
      },
    ],
  };
}
