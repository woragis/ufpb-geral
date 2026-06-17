import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { fmtNum, fmtPoly } from "../lib/format";
import { TOPICO_LIMITES, type LimitesData } from "../entities/types";

export const limitesSolver: ProblemSolver = {
  topicoId: TOPICO_LIMITES,

  resolver(problema: Problem): Solution {
    const d = problema.dados as LimitesData;
    switch (d.tipo) {
      case "limite-algebrico":
        return solveAlgebrico(d, problema.id);
      case "limite-trig":
        return solveTrig(d, problema.id);
      case "limite-racional":
        return solveRacional(d, problema.id);
      case "limite-radical":
        return solveRadical(d, problema.id);
      case "limite-infinito":
        return solveInfinito(d, problema.id);
      case "limite-substituicao":
        return solveSubstituicao(d, problema.id);
      default:
        throw new Error("Tipo de limite desconhecido");
    }
  },
};

function solveAlgebrico(
  d: Extract<LimitesData, { tipo: "limite-algebrico" }>,
  problemaId: string,
): Solution {
  const resultado = 2 * d.coeficiente * d.a;
  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Verificar indeterminação",
        explicacao: "Substituindo x = a, numerador e denominador se anulam — temos 0/0.",
        calculo: `x = ${d.a} → 0/0`,
      },
      {
        ordem: 2,
        titulo: "Fatorar o numerador",
        explicacao: "Usamos diferença de quadrados: ax² − ca² = a(x − a)(x + a).",
        calculo: `${d.coeficiente}x² − ${d.constante} = ${d.coeficiente}(x − ${d.a})(x + ${d.a})`,
      },
      {
        ordem: 3,
        titulo: "Simplificar",
        explicacao: "Cancelamos (x − a), válido pois x → a implica x ≠ a.",
        calculo: `→ ${d.coeficiente}(x + ${d.a})`,
      },
      {
        ordem: 4,
        titulo: "Calcular o limite",
        explicacao: "Substituímos x = a na expressão simplificada.",
        calculo: `${d.coeficiente}(${d.a} + ${d.a}) = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveTrig(
  d: Extract<LimitesData, { tipo: "limite-trig" }>,
  problemaId: string,
): Solution {
  let resultado: number;
  let enunciadoCalc: string;
  let explicacao: string;

  switch (d.variante) {
    case "sin-x":
      resultado = 1;
      enunciadoCalc = "lim(x→0) sin(x)/x = 1";
      explicacao = "Limite fundamental: lim(x→0) sin(x)/x = 1.";
      break;
    case "sin-ax": {
      const b = d.b ?? 1;
      resultado = d.a / b;
      enunciadoCalc = `sin(${d.a}x)/(${b}x) = (${d.a}/${b}) · sin(${d.a}x)/(${d.a}x) → ${d.a}/${b}`;
      explicacao = `Reescrevemos como (${d.a}/${b})·sin(${d.a}x)/(${d.a}x) e aplicamos o limite fundamental.`;
      break;
    }
    case "tan-x":
      resultado = 1;
      enunciadoCalc = "tg(x)/x = sin(x)/(x·cos(x)) → 1/1 = 1";
      explicacao = "Escrevemos tg(x) = sin(x)/cos(x) e usamos sin(x)/x → 1 e cos(x) → 1.";
      break;
    case "um-menos-cos":
      resultado = 0.5;
      enunciadoCalc = "(1−cos x)/x² → 1/2 (limite clássico)";
      explicacao = "Usamos 1 − cos(x) ≈ x²/2 quando x → 0, ou identidade com sin²(x/2).";
      break;
  }

  const resposta = Number.isInteger(resultado) ? String(resultado) : fmtNum(resultado);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Identificar limite fundamental",
        explicacao,
        calculo: enunciadoCalc,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao: "Aplicando os limites conhecidos.",
        calculo: `= ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveRacional(
  d: Extract<LimitesData, { tipo: "limite-racional" }>,
  problemaId: string,
): Solution {
  const resultado = d.r1 + d.r2;
  const sum = d.r1 + d.r2;
  const prod = d.r1 * d.r2;

  return {
    problemaId,
    respostaFinal: String(resultado),
    steps: [
      {
        ordem: 1,
        titulo: "Verificar indeterminação",
        explicacao: "Substituindo x = a, obtemos 0/0.",
        calculo: `x = ${d.a} → 0/0`,
      },
      {
        ordem: 2,
        titulo: "Fatorar o numerador",
        explicacao: "Fatoramos o trinômio usando as raízes r₁ e r₂.",
        calculo: `x² − ${sum}x + ${prod} = (x − ${d.r1})(x − ${d.r2})`,
      },
      {
        ordem: 3,
        titulo: "Simplificar e calcular",
        explicacao: `Como r₁ = ${d.a}, cancelamos (x − ${d.a}).`,
        calculo: `→ (x − ${d.r2}) → ${d.a} − ${d.r2} = ${resultado}`,
        resultado: String(resultado),
      },
    ],
  };
}

function solveRadical(
  d: Extract<LimitesData, { tipo: "limite-radical" }>,
  problemaId: string,
): Solution {
  const sqrtK = Math.sqrt(d.k);
  const resultado = Math.round((1 / (2 * sqrtK)) * 1000) / 1000;
  const resposta = fmtNum(resultado);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Forma indeterminada",
        explicacao: "Substituindo x = 0, obtemos 0/0.",
        calculo: "0/0",
      },
      {
        ordem: 2,
        titulo: "Racionalizar o numerador",
        explicacao: "Multiplicamos por o conjugado √(x+k) + √k.",
        calculo: `(√(x+${d.k}) − √${d.k})(√(x+${d.k}) + √${d.k}) = x`,
      },
      {
        ordem: 3,
        titulo: "Simplificar",
        explicacao: "A fração fica 1/(√(x+k) + √k).",
        calculo: `1/(√(x+${d.k}) + √${d.k})`,
      },
      {
        ordem: 4,
        titulo: "Calcular o limite",
        explicacao: "Substituímos x = 0.",
        calculo: `1/(√${d.k} + √${d.k}) = 1/(2√${d.k}) = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveInfinito(
  d: Extract<LimitesData, { tipo: "limite-infinito" }>,
  problemaId: string,
): Solution {
  const resultado = Math.round((d.numA / d.denA) * 1000) / 1000;
  const resposta = fmtNum(resultado);

  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Forma indeterminada ∞/∞",
        explicacao: "Grau do numerador e denominador é 2.",
        calculo: "∞/∞",
      },
      {
        ordem: 2,
        titulo: "Dividir por x²",
        explicacao: "Dividimos numerador e denominador por x² (x → ∞).",
        calculo: `(${d.numA} + ${d.numB}/x²) / (${d.denA} + ${d.denB}/x²)`,
      },
      {
        ordem: 3,
        titulo: "Calcular",
        explicacao: "Termos com 1/x² tendem a zero.",
        calculo: `${d.numA}/${d.denA} = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveSubstituicao(
  d: Extract<LimitesData, { tipo: "limite-substituicao" }>,
  problemaId: string,
): Solution {
  const valor = d.coeficientes.reduce(
    (acc, c, i) => acc + c * Math.pow(d.a, d.expoentes[i]!),
    0,
  );

  return {
    problemaId,
    respostaFinal: String(valor),
    steps: [
      {
        ordem: 1,
        titulo: "Verificar continuidade",
        explicacao: "Polinômios são contínuos em todo ℝ — podemos substituir diretamente.",
        calculo: `f(x) = ${fmtPoly(d.coeficientes, d.expoentes)}`,
      },
      {
        ordem: 2,
        titulo: "Substituir x = a",
        explicacao: `Calculamos f(${d.a}).`,
        calculo: `f(${d.a}) = ${valor}`,
        resultado: String(valor),
      },
    ],
  };
}
