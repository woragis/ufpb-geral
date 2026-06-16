import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_TIPOS_DADOS, type TiposDadosData } from "../entities/types";

const CENARIOS: TiposDadosData[] = [
  {
    tipo: "tipos-dados",
    variavel: "cor dos olhos",
    exemplos: ["azul", "castanho", "verde"],
    escalaCorreta: "nominal",
  },
  {
    tipo: "tipos-dados",
    variavel: "nível de escolaridade",
    exemplos: ["fundamental", "médio", "superior"],
    escalaCorreta: "ordinal",
  },
  {
    tipo: "tipos-dados",
    variavel: "temperatura em °C",
    exemplos: ["0°C", "20°C", "37°C"],
    escalaCorreta: "intervalar",
  },
  {
    tipo: "tipos-dados",
    variavel: "altura em metros",
    exemplos: ["1,60 m", "1,75 m", "1,90 m"],
    escalaCorreta: "razao",
  },
];

export const tiposDadosGenerator = {
  topicoId: TOPICO_TIPOS_DADOS,
  version: 1,

  gerar(ctx: GeneratorContext): Problem {
    const cenario = ctx.rng.pick(CENARIOS);
    const dados: TiposDadosData = { ...cenario };

    const enunciado = `A variável "${dados.variavel}" (ex.: ${dados.exemplos.join(", ")}) pertence a qual escala de medição?`;

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_TIPOS_DADOS,
      enunciado,
      dados,
      dificuldade: ctx.dificuldade,
      seed: { topicoId: TOPICO_TIPOS_DADOS, dificuldade: ctx.dificuldade, seed: "", generatorVersion: 1 },
      geradoEm: "",
    };
  },
};
