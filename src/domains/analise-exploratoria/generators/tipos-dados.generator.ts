import type { GeneratorContext } from "@/core/domain/generator";
import type { Problem } from "@/core/domain/problem";
import { TOPICO_TIPOS_DADOS, type TiposDadosData } from "../entities/types";
import { pickCenarioByTipo, type CenarioEntry } from "@/core/application/pick-cenario";

const ESCALAS: Array<Extract<TiposDadosData, { tipo: "tipos-dados" }>> = [
  { tipo: "tipos-dados", variavel: "cor dos olhos", exemplos: ["azul", "castanho", "verde"], escalaCorreta: "nominal" },
  { tipo: "tipos-dados", variavel: "tipo sanguíneo", exemplos: ["A", "B", "O", "AB"], escalaCorreta: "nominal" },
  { tipo: "tipos-dados", variavel: "nível de escolaridade", exemplos: ["fundamental", "médio", "superior"], escalaCorreta: "ordinal" },
  { tipo: "tipos-dados", variavel: "satisfação (1 a 5)", exemplos: ["1", "2", "3", "4", "5"], escalaCorreta: "ordinal" },
  { tipo: "tipos-dados", variavel: "temperatura em °C", exemplos: ["0°C", "20°C", "37°C"], escalaCorreta: "intervalar" },
  { tipo: "tipos-dados", variavel: "ano calendário", exemplos: ["2020", "2023", "2025"], escalaCorreta: "intervalar" },
  { tipo: "tipos-dados", variavel: "altura em metros", exemplos: ["1,60 m", "1,75 m", "1,90 m"], escalaCorreta: "razao" },
  { tipo: "tipos-dados", variavel: "peso em kg", exemplos: ["60 kg", "75 kg", "90 kg"], escalaCorreta: "razao" },
];

const GRAFICOS: Array<Extract<TiposDadosData, { tipo: "tipos-dados-grafico" }>> = [
  { tipo: "tipos-dados-grafico", variavel: "cor favorita", contexto: "categorica", graficoCorreto: "barras" },
  { tipo: "tipos-dados-grafico", variavel: "cidade de nascimento", contexto: "categorica", graficoCorreto: "barras" },
  { tipo: "tipos-dados-grafico", variavel: "notas de prova", contexto: "quantitativa-discreta", graficoCorreto: "histograma" },
  { tipo: "tipos-dados-grafico", variavel: "número de filhos", contexto: "quantitativa-discreta", graficoCorreto: "histograma" },
  { tipo: "tipos-dados-grafico", variavel: "temperatura diária", contexto: "temporal", graficoCorreto: "linha" },
  { tipo: "tipos-dados-grafico", variavel: "vendas mensais", contexto: "temporal", graficoCorreto: "linha" },
  { tipo: "tipos-dados-grafico", variavel: "salários", contexto: "quantitativa-continua", graficoCorreto: "boxplot" },
  { tipo: "tipos-dados-grafico", variavel: "tempo de reação", contexto: "quantitativa-continua", graficoCorreto: "boxplot" },
];

const MEDIA_ESCALA: Array<Extract<TiposDadosData, { tipo: "tipos-dados-media-escala" }>> = [
  { tipo: "tipos-dados-media-escala", variavel: "renda familiar (R$)", escalaCorreta: "razao" },
  { tipo: "tipos-dados-media-escala", variavel: "distância percorrida (km)", escalaCorreta: "razao" },
  { tipo: "tipos-dados-media-escala", variavel: "temperatura ambiente (°C)", escalaCorreta: "intervalar" },
];

function gerarEscalas(ctx: GeneratorContext): TiposDadosData {
  return { ...ctx.rng.pick(ESCALAS) };
}

function gerarGraficos(ctx: GeneratorContext): TiposDadosData {
  return { ...ctx.rng.pick(GRAFICOS) };
}

function gerarMediaEscala(ctx: GeneratorContext): TiposDadosData {
  return { ...ctx.rng.pick(MEDIA_ESCALA) };
}

const CENARIOS: CenarioEntry<TiposDadosData>[] = [
  { tipo: "tipos-dados", gerar: gerarEscalas },
  { tipo: "tipos-dados-grafico", gerar: gerarGraficos },
  { tipo: "tipos-dados-frequencia", gerar: gerarFrequencia },
  { tipo: "tipos-dados-media-escala", gerar: gerarMediaEscala },
];

function gerarFrequencia(ctx: GeneratorContext): TiposDadosData {
  const categorias = ctx.rng.pick([
    ["A", "B", "C"],
    ["Norte", "Sul", "Leste"],
    ["Verde", "Azul", "Vermelho"],
  ] as const);
  const frequencias = categorias.map(() => ctx.rng.nextInt(2, 12));
  const pergunta = ctx.rng.pick(["total", "moda-categoria"] as const);
  return { tipo: "tipos-dados-frequencia", categorias: [...categorias], frequencias, pergunta };
}

function enunciado(d: TiposDadosData): string {
  switch (d.tipo) {
    case "tipos-dados":
      return `A variável "${d.variavel}" (ex.: ${d.exemplos.join(", ")}) pertence a qual escala de medição?`;
    case "tipos-dados-grafico": {
      const contextoLabels = {
        categorica: "categórica nominal",
        "quantitativa-discreta": "quantitativa discreta",
        "quantitativa-continua": "quantitativa contínua",
        temporal: "série temporal",
      };
      return `Para a variável "${d.variavel}" (${contextoLabels[d.contexto]}), qual gráfico é mais adequado?`;
    }
    case "tipos-dados-frequencia": {
      const linhas = d.categorias.map((c, i) => `${c}: ${d.frequencias[i]}`).join(", ");
      if (d.pergunta === "total") {
        return `Na tabela de frequências {${linhas}}, qual é o total de observações?`;
      }
      return `Na tabela {${linhas}}, qual categoria tem maior frequência?`;
    }
    case "tipos-dados-media-escala":
      return `Para a variável "${d.variavel}", em qual escala de medição faz sentido calcular a média aritmética?`;
  }
}

export const tiposDadosGenerator = {
  topicoId: TOPICO_TIPOS_DADOS,
  version: 3,

  gerar(ctx: GeneratorContext<{ tipo?: string }>): Problem {
    const pool =
      ctx.dificuldade === 1
        ? CENARIOS.filter((c) =>
            ["tipos-dados", "tipos-dados-grafico"].includes(c.tipo),
          )
        : CENARIOS;
    const dados = pickCenarioByTipo(ctx, CENARIOS, pool);

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
        generatorVersion: 3,
      },
      geradoEm: "",
    };
  },
};
