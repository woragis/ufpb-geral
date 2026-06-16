import type { Problem, Solution } from "@/core/domain/problem";
import type { ProblemSolver } from "@/core/domain/solver";
import { simplificarFracao } from "../generators/probabilidade-classica.generator";
import {
  TOPICO_PROBABILIDADE_CLASSICA,
  type ProbabilidadeClassicaData,
} from "../entities/types";

export const probabilidadeClassicaSolver: ProblemSolver = {
  topicoId: TOPICO_PROBABILIDADE_CLASSICA,

  resolver(problema: Problem): Solution {
    const dados = problema.dados as ProbabilidadeClassicaData;
    const favoraveis = dados.cores[dados.corAlvo] ?? 0;
    const total = Object.values(dados.cores).reduce((a, b) => a + b, 0);
    const fracao = simplificarFracao(favoraveis, total);
    const decimal = (favoraveis / total).toFixed(4).replace(/\.?0+$/, "");

    return {
      problemaId: problema.id,
      respostaFinal: fracao,
      steps: [
        {
          ordem: 1,
          titulo: "Definir o espaço amostral",
          explicacao:
            "Cada bola é um resultado possível. O espaço amostral tem tantos elementos quanto o total de bolas.",
          calculo: `n(Ω) = ${Object.entries(dados.cores)
            .map(([cor, qtd]) => `${qtd}`)
            .join(" + ")} = ${total}`,
          resultado: String(total),
        },
        {
          ordem: 2,
          titulo: "Identificar o evento favorável",
          explicacao: `O evento A é "sair bola ${dados.corAlvo}". Contamos apenas as bolas dessa cor.`,
          calculo: `n(A) = ${favoraveis}`,
          resultado: String(favoraveis),
        },
        {
          ordem: 3,
          titulo: "Aplicar a definição clássica",
          explicacao:
            "Quando todos os resultados são igualmente prováveis, P(A) = casos favoráveis / casos possíveis.",
          calculo: `P(A) = n(A) / n(Ω) = ${favoraveis}/${total}`,
          resultado: fracao,
        },
        {
          ordem: 4,
          titulo: "Forma decimal (opcional)",
          explicacao: "Podemos expressar a probabilidade também como número decimal.",
          calculo: `P(A) ≈ ${decimal}`,
          resultado: decimal,
        },
      ],
    };
  },
};
