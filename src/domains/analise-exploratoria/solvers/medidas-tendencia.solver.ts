import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  TOPICO_MEDIDAS_TENDENCIA,
  type MedidasTendenciaData,
} from "../entities/types";
import { media, mediana, moda, mediaPonderada, round2 } from "../lib/stats";

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export const medidasTendenciaSolver: ProblemSolver = {
  topicoId: TOPICO_MEDIDAS_TENDENCIA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as MedidasTendenciaData;
    switch (d.tipo) {
      case "media-aritmetica":
        return solveMedia(d, problema.id);
      case "medidas-tendencia-mediana":
        return solveMediana(d, problema.id);
      case "medidas-tendencia-moda":
        return solveModa(d, problema.id);
      case "medidas-tendencia-ponderada":
        return solvePonderada(d, problema.id);
    }
  },
};

function solveMedia(
  d: Extract<MedidasTendenciaData, { tipo: "media-aritmetica" }>,
  problemaId: string,
): Solution {
  const soma = d.valores.reduce((a, b) => a + b, 0);
  const n = d.valores.length;
  const m = media(d.valores);
  const resposta = fmt(m);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Somar os valores",
        explicacao: "A média aritmética exige primeiro a soma de todas as observações.",
        calculo: `${d.valores.join(" + ")} = ${soma}`,
        resultado: String(soma),
      },
      {
        ordem: 2,
        titulo: "Contar as observações",
        explicacao: "n é o número de elementos no conjunto de dados.",
        calculo: `n = ${n}`,
        resultado: String(n),
      },
      {
        ordem: 3,
        titulo: "Aplicar a fórmula da média",
        explicacao: "x̄ = (soma dos valores) / n",
        calculo: `x̄ = ${soma} / ${n} = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveMediana(
  d: Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-mediana" }>,
  problemaId: string,
): Solution {
  const sorted = [...d.valores].sort((a, b) => a - b);
  const med = mediana(d.valores);
  const resposta = fmt(med);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Ordenar os dados",
        explicacao: "A mediana exige os valores em ordem crescente.",
        calculo: `{${sorted.join(", ")}}`,
      },
      {
        ordem: 2,
        titulo: "Identificar a posição central",
        explicacao:
          sorted.length % 2 === 1
            ? "Com n ímpar, a mediana é o valor central."
            : "Com n par, a mediana é a média dos dois valores centrais.",
        calculo: `Mediana = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}

function solveModa(
  d: Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-moda" }>,
  problemaId: string,
): Solution {
  const m = moda(d.valores);
  return {
    problemaId,
    respostaFinal: String(m),
    steps: [
      {
        ordem: 1,
        titulo: "Contar frequências",
        explicacao: "A moda é o valor que mais se repete no conjunto.",
        calculo: `Conjunto: {${d.valores.join(", ")}}`,
      },
      {
        ordem: 2,
        titulo: "Identificar a moda",
        explicacao: "Escolhemos o valor com maior frequência.",
        calculo: `Moda = ${m}`,
        resultado: String(m),
      },
    ],
  };
}

function solvePonderada(
  d: Extract<MedidasTendenciaData, { tipo: "medidas-tendencia-ponderada" }>,
  problemaId: string,
): Solution {
  const somaPesos = d.pesos.reduce((a, b) => a + b, 0);
  const soma = d.valores.reduce((acc, v, i) => acc + v * d.pesos[i]!, 0);
  const mp = round2(mediaPonderada(d.valores, d.pesos));
  const resposta = fmt(mp);
  return {
    problemaId,
    respostaFinal: resposta,
    steps: [
      {
        ordem: 1,
        titulo: "Somar os pesos",
        explicacao: "A média ponderada divide pela soma dos pesos.",
        calculo: `Σw = ${d.pesos.join(" + ")} = ${somaPesos}`,
      },
      {
        ordem: 2,
        titulo: "Calcular Σ(x·w)",
        explicacao: "Multiplicamos cada valor pelo seu peso e somamos.",
        calculo: `Σ(x·w) = ${soma}`,
      },
      {
        ordem: 3,
        titulo: "Aplicar a fórmula",
        explicacao: "x̄_p = Σ(x·w) / Σw",
        calculo: `x̄_p = ${soma} / ${somaPesos} = ${resposta}`,
        resultado: resposta,
      },
    ],
  };
}
