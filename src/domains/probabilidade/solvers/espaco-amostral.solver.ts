import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { countDadoSomaModulo } from "../utils/math";
import { TOPICO_ESPACO_AMOSTRAL, type EspacoAmostralData } from "../entities/types";

export const espacoAmostralSolver: ProblemSolver = {
  topicoId: TOPICO_ESPACO_AMOSTRAL,

  resolver(problema: Problem): Solution {
    const d = problema.dados as EspacoAmostralData;
    switch (d.tipo) {
      case "espaco-amostral":
        return solveBasico(d, problema.id);
      case "espaco-amostral-baralho":
        return solveBaralho(d, problema.id);
      case "espaco-amostral-moeda-dado":
        return solveMoedaDado(d, problema.id);
      case "espaco-amostral-modular":
        return solveModular(d, problema.id);
    }
  },
};

function solveBasico(
  d: Extract<EspacoAmostralData, { tipo: "espaco-amostral" }>,
  problemaId: string,
): Solution {
  const card =
    d.experimento === "moeda" ? 2 : d.experimento === "dado" ? 6 : 36;
  return {
    problemaId,
    respostaFinal: String(card),
    steps: [
      {
        ordem: 1,
        titulo: "Identificar os resultados",
        explicacao: "Listamos ou contamos todos os resultados possíveis do experimento.",
        calculo:
          d.experimento === "moeda"
            ? "Ω = {Cara, Coroa}"
            : d.experimento === "dado"
              ? "Ω = {1, 2, 3, 4, 5, 6}"
              : "Ω = {(i,j) : i,j ∈ {1,...,6}}",
      },
      {
        ordem: 2,
        titulo: "Cardinalidade",
        explicacao: "|Ω| é o número de resultados possíveis.",
        calculo: `|Ω| = ${card}`,
        resultado: String(card),
      },
    ],
  };
}

function solveBaralho(
  d: Extract<EspacoAmostralData, { tipo: "espaco-amostral-baralho" }>,
  problemaId: string,
): Solution {
  const resultado = d.pergunta === "cardinalidade" ? "52" : "13";
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Espaço amostral do baralho",
        explicacao: "Um baralho padrão tem 52 cartas distintas.",
        calculo: d.pergunta === "cardinalidade" ? "|Ω| = 52" : `Cada naipe tem 13 cartas`,
      },
      {
        ordem: 2,
        titulo: "Resultado",
        explicacao:
          d.pergunta === "cardinalidade"
            ? "Ao sortear uma carta, há 52 resultados possíveis."
            : `Há 13 cartas de ${d.naipeAlvo}.`,
        calculo: resultado,
        resultado,
      },
    ],
  };
}

function solveMoedaDado(
  d: Extract<EspacoAmostralData, { tipo: "espaco-amostral-moeda-dado" }>,
  problemaId: string,
): Solution {
  return {
    problemaId,
    respostaFinal: "12",
    steps: [
      {
        ordem: 1,
        titulo: "Produto de espaços",
        explicacao: "Moeda (2 resultados) × dado (6 resultados).",
        calculo: "|Ω| = 2 × 6",
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Multiplicamos as cardinalidades.",
        calculo: "|Ω| = 12",
        resultado: "12",
      },
    ],
  };
}

function solveModular(
  d: Extract<EspacoAmostralData, { tipo: "espaco-amostral-modular" }>,
  problemaId: string,
): Solution {
  const fav = countDadoSomaModulo(d.modulo, d.resto);
  const resultado = d.pergunta === "cardinalidade" ? "36" : String(fav);
  return {
    problemaId,
    respostaFinal: resultado,
    steps: [
      {
        ordem: 1,
        titulo: "Espaço amostral",
        explicacao: "Dois dados produzem 6 × 6 = 36 pares ordenados.",
        calculo: "|Ω| = 36",
      },
      {
        ordem: 2,
        titulo: d.pergunta === "cardinalidade" ? "Cardinalidade" : "Contar favoráveis",
        explicacao:
          d.pergunta === "cardinalidade"
            ? "O espaço amostral tem 36 elementos."
            : `Contamos pares cuja soma ≡ ${d.resto} (mod ${d.modulo}).`,
        calculo:
          d.pergunta === "cardinalidade"
            ? "|Ω| = 36"
            : `Favoráveis = ${fav}`,
        resultado,
      },
    ],
  };
}
