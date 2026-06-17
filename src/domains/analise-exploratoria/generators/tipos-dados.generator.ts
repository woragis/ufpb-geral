import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_TIPOS_DADOS, type TiposDadosData } from "../entities/types";

const ESCALAS: Array<Extract<TiposDadosData, { tipo: "tipos-dados" }>> = [
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

const GRAFICOS: Array<Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>> = [
  {
    tipo: "tipos-dados-grafico",
    variavel: "cor favorita",
    contexto: "categorica",
    graficoCorreto: "barras",
  },
  {
    tipo: "tipos-dados-grafico",
    variavel: "notas de prova",
    contexto: "quantitativa-discreta",
    graficoCorreto: "histograma",
  },
  {
    tipo: "tipos-dados-grafico",
    variavel: "temperatura diária",
    contexto: "temporal",
    graficoCorreto: "linha",
  },
  {
    tipo: "tipos-dados-grafico",
    variavel: "salários",
    contexto: "quantitativa-continua",
    graficoCorreto: "boxplot",
  },
];

const CENARIOS: Array<(ctx: GeneratorContext) => TiposDadosData> = [
  (ctx) => ({ ...ctx.rng.pick(ESCALAS) }),
  (ctx) => ({ ...ctx.rng.pick(GRAFICOS) }),
];

function enunciado(d: TiposDadosData): string {
  if (d.tipo === "tipos-dados") {
    return `A variável "${d.variavel}" (ex.: ${d.exemplos.join(", ")}) pertence a qual escala de medição?`;
  }
  const contextoLabels = {
    categorica: "categórica nominal",
    "quantitativa-discreta": "quantitativa discreta",
    "quantitativa-continua": "quantitativa contínua",
    temporal: "série temporal",
  };
  return `Para a variável "${d.variavel}" (${contextoLabels[d.contexto]}), qual gráfico é mais adequado?`;
}

export const tiposDadosGenerator = {
  topicoId: TOPICO_TIPOS_DADOS,
  version: 2,

  gerar(ctx: GeneratorContext): Problem {
    const dados = ctx.rng.pick(CENARIOS)(ctx);

    return {
      id: "",
      disciplinaId: "analise-exploratoria",
      topicoId: TOPICO_TIPOS_DADOS,
      enunciado: enunciado(dados),
      dados,
      dificuldade: ctx.dificuldade,
      seed: {
        topicoId: TOPICO_TIPOS_DADOS,
        dificuldade: ctx.dificuldade,
        seed: "",
        generatorVersion: 2,
      },
      geradoEm: "",
    };
  },
};
