import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";
import { vetoresGenerator } from "./generators/vetores.generator";
import { vetoresSolver } from "./solvers/vetores.solver";
import { produtoEscalarGenerator } from "./generators/produto-escalar.generator";
import { produtoEscalarSolver } from "./solvers/produto-escalar.solver";
import { produtoVetorialGenerator } from "./generators/produto-vetorial.generator";
import { produtoVetorialSolver } from "./solvers/produto-vetorial.solver";
import { retasPlanosGenerator } from "./generators/retas-planos.generator";
import { retasPlanosSolver } from "./solvers/retas-planos.solver";
import { curvasGenerator } from "./generators/curvas.generator";
import { curvasSolver } from "./solvers/curvas.solver";
import { camposGenerator } from "./generators/campos.generator";
import { camposSolver } from "./solvers/campos.solver";
import {
  TOPICO_VETORES,
  TOPICO_PRODUTO_ESCULAR,
  TOPICO_PRODUTO_VETORIAL,
  TOPICO_RETAS_PLANOS,
  TOPICO_CURVAS,
  TOPICO_CAMPOS,
} from "./entities/types";

const modulos: ModuloMeta[] = [
  {
    id: "cv-1",
    nome: "Cálculo Vetorial",
    ordem: 1,
    topicos: [
      { id: TOPICO_VETORES, nome: "Vetores no R² e R³", descricao: "Representação, módulo e operações básicas.", status: "ativo" },
      { id: TOPICO_PRODUTO_ESCULAR, nome: "Produto escalar", descricao: "Ângulo entre vetores e projeção.", prerequisitos: [TOPICO_VETORES], status: "ativo" },
      { id: TOPICO_PRODUTO_VETORIAL, nome: "Produto vetorial", descricao: "Vetor perpendicular e área de paralelogramo.", prerequisitos: [TOPICO_VETORES], status: "ativo" },
      { id: TOPICO_RETAS_PLANOS, nome: "Retas e planos", descricao: "Equações paramétricas e cartesianas.", prerequisitos: [TOPICO_PRODUTO_ESCULAR], status: "ativo" },
      { id: TOPICO_CURVAS, nome: "Curvas parametrizadas", descricao: "Trajetórias e velocidade.", status: "ativo" },
      { id: TOPICO_CAMPOS, nome: "Campos escalares e vetoriais", descricao: "Gradiente, rotacional e divergente (introdução).", status: "ativo" },
    ],
  },
];

export const calculoVetorialDomain: DomainModule & {
  nome: string;
  descricao: string;
  modulos: ModuloMeta[];
} = {
  disciplinaId: "calculo-vetorial",
  nome: "Cálculo Vetorial",
  descricao: "Álgebra vetorial, geometria analítica e campos.",
  modulos,
  topicos: modulos.flatMap((m) => m.topicos),
  entries: [
    { topicoId: TOPICO_VETORES, generator: vetoresGenerator, solver: vetoresSolver },
    { topicoId: TOPICO_PRODUTO_ESCULAR, generator: produtoEscalarGenerator, solver: produtoEscalarSolver },
    { topicoId: TOPICO_PRODUTO_VETORIAL, generator: produtoVetorialGenerator, solver: produtoVetorialSolver },
    { topicoId: TOPICO_RETAS_PLANOS, generator: retasPlanosGenerator, solver: retasPlanosSolver },
    { topicoId: TOPICO_CURVAS, generator: curvasGenerator, solver: curvasSolver },
    { topicoId: TOPICO_CAMPOS, generator: camposGenerator, solver: camposSolver },
  ],
};
