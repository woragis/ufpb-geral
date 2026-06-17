import type { GeneratorContext } from "@/core/domain/generator";

/** Módulos de transformação que compõem o evento em problemas clássicos. */
export type ModuloTransformacao = "soma" | "abs-soma" | "produto" | "quadrado-soma";

export interface EventoComposto {
  descricao: string;
  favoraveis: number;
  total: number;
}

const TRANSFORMACOES: Record<
  ModuloTransformacao,
  { label: string; apply: (a: number, b: number) => number }
> = {
  soma: { label: "soma", apply: (a, b) => a + b },
  "abs-soma": { label: "valor absoluto da soma", apply: (a, b) => Math.abs(a + b) },
  produto: { label: "produto", apply: (a, b) => a * b },
  "quadrado-soma": { label: "quadrado da soma", apply: (a, b) => (a + b) ** 2 },
};

const PREDICADOS = [
  {
    id: "par",
    build: (ctx: GeneratorContext) => {
      const label = "número par";
      const fav = countDadoParidade(true);
      return { descricao: `a ${label}`, favoraveis: fav, total: 36 };
    },
  },
  {
    id: "impar",
    build: () => {
      const fav = countDadoParidade(false);
      return { descricao: "um número ímpar", favoraveis: fav, total: 36 };
    },
  },
  {
    id: "maior-que",
    build: (ctx: GeneratorContext) => {
      const limite = ctx.rng.pick([7, 8, 9, 10]);
      let fav = 0;
      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
          if (i + j > limite) fav++;
        }
      }
      return {
        descricao: `soma maior que ${limite}`,
        favoraveis: fav,
        total: 36,
      };
    },
  },
  {
    id: "resto",
    build: (ctx: GeneratorContext) => {
      const modulo = ctx.rng.pick([3, 4, 5]);
      const resto = ctx.rng.nextInt(0, modulo - 1);
      let fav = 0;
      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
          if ((i + j) % modulo === resto) fav++;
        }
      }
      return {
        descricao: `soma deixar resto ${resto} ao dividir por ${modulo}`,
        favoraveis: fav,
        total: 36,
      };
    },
  },
] as const;

function countDadoParidade(par: boolean): number {
  let count = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      if ((i + j) % 2 === (par ? 0 : 1)) count++;
    }
  }
  return count;
}

/** Sorteia transformação + predicado e monta um evento sobre dois dados. */
export function comporEventoDadoDuplo(ctx: GeneratorContext): EventoComposto {
  const transformacao = ctx.rng.pick(
    Object.keys(TRANSFORMACOES) as ModuloTransformacao[],
  );
  const pred = ctx.rng.pick(PREDICADOS);
  const base = pred.build(ctx);

  if (transformacao === "soma") {
    return base;
  }

  const t = TRANSFORMACOES[transformacao];
  let favoraveis = 0;
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      const valor = t.apply(i, j);
      const alvoPar = base.descricao.includes("par") && !base.descricao.includes("ímpar");
      const alvoImpar = base.descricao.includes("ímpar");
      const matchParidade = alvoPar
        ? valor % 2 === 0
        : alvoImpar
          ? valor % 2 === 1
          : true;

      if (base.descricao.includes("resto")) {
        const match = base.descricao.match(/resto (\d+) ao dividir por (\d+)/);
        if (match) {
          const r = Number(match[1]);
          const m = Number(match[2]);
          if (valor % m === r) favoraveis++;
        }
      } else if (base.descricao.includes("maior que")) {
        const limite = Number(base.descricao.match(/maior que (\d+)/)?.[1]);
        if (valor > limite && matchParidade) favoraveis++;
      } else if (matchParidade) {
        favoraveis++;
      }
    }
  }

  return {
    descricao: `a ${t.label} ser ${base.descricao.replace(/^a /, "")}`,
    favoraveis,
    total: 36,
  };
}

export function pickModulosTransformacao(
  ctx: GeneratorContext,
  max = 2,
): ModuloTransformacao[] {
  const pool = Object.keys(TRANSFORMACOES) as ModuloTransformacao[];
  const n = ctx.dificuldade === 1 ? 1 : ctx.rng.nextInt(1, max);
  return ctx.rng.shuffle(pool).slice(0, n);
}
