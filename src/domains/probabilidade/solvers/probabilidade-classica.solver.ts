import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import {
  binomialProb,
  comb,
  countDadoSomaIgual,
  countDadoTransformacao,
  roundProb,
  simplificarFracao,
} from "../utils/math";
import {
  TOPICO_PROBABILIDADE_CLASSICA,
  type ProbabilidadeClassicaData,
} from "../entities/types";

export const probabilidadeClassicaSolver: ProblemSolver = {
  topicoId: TOPICO_PROBABILIDADE_CLASSICA,

  resolver(problema: Problem): Solution {
    const d = problema.dados as ProbabilidadeClassicaData;
    switch (d.tipo) {
      case "probabilidade-classica":
        return solveUrna(d, problema.id);
      case "probabilidade-classica-sem-reposicao":
        return solveSemReposicao(d, problema.id);
      case "probabilidade-classica-dado-soma":
        return solveDadoSoma(d, problema.id);
      case "probabilidade-classica-baralho":
        return solveBaralho(d, problema.id);
      case "probabilidade-classica-comites":
        return solveComites(d, problema.id);
      case "probabilidade-classica-modular":
        return solveModular(d, problema.id);
      case "probabilidade-classica-composta":
        return solveComposta(d, problema.id);
    }
  },
};

function solveUrna(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica" }>,
  problemaId: string,
): Solution {
  const favoraveis = d.cores[d.corAlvo] ?? 0;
  const total = Object.values(d.cores).reduce((a, b) => a + b, 0);
  const fracao = simplificarFracao(favoraveis, total);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Espaço amostral",
        explicacao: "n(Ω) é o total de bolas.",
        calculo: `n(Ω) = ${total}`,
      },
      {
        ordem: 2,
        titulo: "Casos favoráveis",
        explicacao: `n(A) = ${favoraveis} bolas ${d.corAlvo}.`,
        calculo: `n(A) = ${favoraveis}`,
      },
      {
        ordem: 3,
        titulo: "Probabilidade clássica",
        explicacao: "P(A) = n(A)/n(Ω).",
        calculo: `P(A) = ${favoraveis}/${total} = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveSemReposicao(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-sem-reposicao" }>,
  problemaId: string,
): Solution {
  const n = d.cores[d.corAlvo] ?? 0;
  const total = Object.values(d.cores).reduce((a, b) => a + b, 0);
  const num = n * (n - 1);
  const den = total * (total - 1);
  const fracao = simplificarFracao(num, den);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Sem reposição",
        explicacao: "P(2 da mesma cor) = [n·(n−1)] / [N·(N−1)].",
        calculo: `n = ${n}, N = ${total}`,
      },
      {
        ordem: 2,
        titulo: "Calcular",
        explicacao: "Multiplicamos as probabilidades sucessivas.",
        calculo: `P = (${n}·${n - 1})/(${total}·${total - 1}) = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveDadoSoma(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-dado-soma" }>,
  problemaId: string,
): Solution {
  const fav = countDadoSomaIgual(d.somaAlvo);
  const fracao = simplificarFracao(fav, 36);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Contar pares favoráveis",
        explicacao: `Há ${fav} pares (i,j) com i+j = ${d.somaAlvo}.`,
        calculo: `n(A) = ${fav}`,
      },
      {
        ordem: 2,
        titulo: "Probabilidade",
        explicacao: "P = favoráveis/36.",
        calculo: `P = ${fav}/36 = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveBaralho(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-baralho" }>,
  problemaId: string,
): Solution {
  const fav =
    d.evento === "as" ? 4 : d.evento === "figura" ? 12 : 13;
  const fracao = simplificarFracao(fav, 52);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Casos favoráveis",
        explicacao: `Há ${fav} cartas favoráveis em 52.`,
        calculo: `n(A) = ${fav}, n(Ω) = 52`,
      },
      {
        ordem: 2,
        titulo: "Probabilidade",
        explicacao: "P(A) = n(A)/52.",
        calculo: `P(A) = ${fav}/52 = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveComites(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-comites" }>,
  problemaId: string,
): Solution {
  const fracao = simplificarFracao(d.k, d.n);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Comissões possíveis",
        explicacao: `Total de comissões: C(${d.n},${d.k}) = ${comb(d.n, d.k)}.`,
        calculo: `C(${d.n},${d.k}) = ${comb(d.n, d.k)}`,
      },
      {
        ordem: 2,
        titulo: "Probabilidade da pessoa específica",
        explicacao: "Em sorteio uniforme de comissões, P(estar na comissão) = k/n.",
        calculo: `P = ${d.k}/${d.n} = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveModular(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-modular" }>,
  problemaId: string,
): Solution {
  const fav = countDadoTransformacao(
    d.transformacao,
    (v) => v % d.modulo === d.resto,
  );
  const fracao = simplificarFracao(fav, 36);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Contar favoráveis",
        explicacao: `Contamos pares cuja transformação ≡ ${d.resto} (mod ${d.modulo}).`,
        calculo: `n(A) = ${fav}`,
      },
      {
        ordem: 2,
        titulo: "Probabilidade",
        explicacao: "P = n(A)/36.",
        calculo: `P = ${fav}/36 = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}

function solveComposta(
  d: Extract<ProbabilidadeClassicaData, { tipo: "probabilidade-classica-composta" }>,
  problemaId: string,
): Solution {
  const fracao = simplificarFracao(d.favoraveis, d.total);
  return {
    problemaId,
    respostaFinal: fracao,
    steps: [
      {
        ordem: 1,
        titulo: "Evento composto",
        explicacao: `Favoráveis: ${d.favoraveis} de ${d.total} resultados.`,
        calculo: `n(A) = ${d.favoraveis}, n(Ω) = ${d.total}`,
      },
      {
        ordem: 2,
        titulo: "Probabilidade",
        explicacao: "P(A) = n(A)/n(Ω).",
        calculo: `P(A) = ${d.favoraveis}/${d.total} = ${fracao}`,
        resultado: fracao,
      },
    ],
  };
}
