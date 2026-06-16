import type { DomainModule } from "@/core/domain/domain-module";
import type { ModuloMeta } from "@/core/domain/catalog";

const modulos: ModuloMeta[] = [
  {
    id: "cv-1",
    nome: "Cálculo Vetorial",
    ordem: 1,
    topicos: [
      {
        id: "calculo-vetorial.vetores",
        nome: "Vetores no R² e R³",
        descricao: "Representação, módulo e operações básicas.",
        status: "planejado",
      },
      {
        id: "calculo-vetorial.produto-escalar",
        nome: "Produto escalar",
        descricao: "Ângulo entre vetores e projeção.",
        prerequisitos: ["calculo-vetorial.vetores"],
        status: "planejado",
      },
      {
        id: "calculo-vetorial.produto-vetorial",
        nome: "Produto vetorial",
        descricao: "Vetor perpendicular e área de paralelogramo.",
        prerequisitos: ["calculo-vetorial.vetores"],
        status: "planejado",
      },
      {
        id: "calculo-vetorial.retas-planos",
        nome: "Retas e planos",
        descricao: "Equações paramétricas e cartesianas.",
        prerequisitos: ["calculo-vetorial.produto-escalar"],
        status: "planejado",
      },
      {
        id: "calculo-vetorial.curvas",
        nome: "Curvas parametrizadas",
        descricao: "Trajetórias e velocidade.",
        status: "planejado",
      },
      {
        id: "calculo-vetorial.campos",
        nome: "Campos escalares e vetoriais",
        descricao: "Gradiente, rotacional e divergente (introdução).",
        status: "planejado",
      },
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
  entries: [],
};
