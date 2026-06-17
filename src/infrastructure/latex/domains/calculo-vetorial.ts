import type { Problem } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import {
  num,
  signed,
  text,
  vecInline,
} from "@/core/presentation/math/latex-helpers";
import type {
  CamposData,
  CurvasData,
  ProdutoEscalarData,
  ProdutoVetorialData,
  RetasPlanosData,
  VetoresData,
} from "@/domains/calculo-vetorial/entities/types";
import { cross, dot, modulo, round2 } from "@/domains/calculo-vetorial/lib/vec";
import { cvStepCalculo } from "./calculo-vetorial-steps";

function isCV(p: Problem): boolean {
  return p.disciplinaId === "calculo-vetorial";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
}

function campoFnLatex(funcao: "x2y2" | "xy" | "x2y"): string {
  if (funcao === "xy") return "xy";
  if (funcao === "x2y") return "x^2y";
  return "x^2 + y^2";
}

export const enrichCalculoVetorialLatex: DomainLatexEnricher = {
  matches: isCV,

  enunciado(problem) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "vetores": {
        const x = dados<Extract<VetoresData, { tipo: "vetores" }>>(problem);
        return `Calcule $\\|\\mathbf{v}\\|$ com $\\mathbf{v} = ${vecInline(...x.componentes)}$.`;
      }
      case "vetores-soma": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-soma" }>>(problem);
        return `Calcule $\\mathbf{u} + \\mathbf{v}$ com $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "vetores-escalar": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-escalar" }>>(problem);
        return `Calcule $${num(x.k)}\\,\\mathbf{v}$ com $\\mathbf{v} = ${vecInline(...x.componentes)}$.`;
      }
      case "vetores-unitario": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-unitario" }>>(problem);
        return `Encontre o vetor unitário na direção de $\\mathbf{v} = ${vecInline(...x.componentes)}$.`;
      }
      case "vetores-distancia": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-distancia" }>>(problem);
        return `Calcule a distância entre $P${vecInline(...x.p)}$ e $Q${vecInline(...x.q)}$.`;
      }
      case "vetores-paralelo": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-paralelo" }>>(problem);
        return `Os vetores $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$ são paralelos?`;
      }
      case "produto-escalar": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>>(problem);
        return `Calcule $\\mathbf{u} \\cdot \\mathbf{v}$ com $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "produto-escalar-angulo": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-angulo" }>>(problem);
        return `Calcule o ângulo $\\theta$ entre $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$ (em graus, 2 casas decimais).`;
      }
      case "produto-escalar-projecao": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-projecao" }>>(problem);
        return `Calcule a projeção de $\\mathbf{u} = ${vecInline(...x.u)}$ sobre $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "produto-escalar-ortogonal": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-ortogonal" }>>(problem);
        return `Os vetores $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$ são ortogonais?`;
      }
      case "produto-vetorial": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>>(problem);
        return `Calcule $\\mathbf{u} \\times \\mathbf{v}$ com $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "produto-vetorial-area": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial-area" }>>(problem);
        return `Calcule a área do paralelogramo formado por $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "produto-vetorial-misto": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial-misto" }>>(problem);
        return `Calcule o produto misto $\\mathbf{u} \\cdot (\\mathbf{v} \\times \\mathbf{w})$ com $\\mathbf{u} = ${vecInline(...x.u)}$, $\\mathbf{v} = ${vecInline(...x.v)}$, $\\mathbf{w} = ${vecInline(...x.w)}$.`;
      }
      case "retas-planos": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos" }>>(problem);
        return `Encontre o vetor diretor da reta que passa por $P${vecInline(...x.p1)}$ e $Q${vecInline(...x.p2)}$.`;
      }
      case "retas-planos-parametrica": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-parametrica" }>>(problem);
        return `Dada a reta $\\mathbf{r}(t) = ${vecInline(...x.p0)} + t\\,${vecInline(...x.diretor)}$, calcule $\\mathbf{r}(1)$.`;
      }
      case "retas-planos-plano": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-plano" }>>(problem);
        return `Encontre a equação do plano com normal $\\mathbf{n} = ${vecInline(...x.normal)}$ passando por $P${vecInline(...x.ponto)}$.`;
      }
      case "retas-planos-distancia": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-distancia" }>>(problem);
        const [a, b, c, d0] = x.coeficientes;
        return `Calcule a distância do ponto $P${vecInline(...x.ponto)}$ ao plano ${num(a)}x ${signed(b)}y ${signed(c)}z = ${num(d0)}$.`;
      }
      case "retas-planos-distancia-reta": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-distancia-reta" }>>(problem);
        return `Calcule a distância do ponto $P${vecInline(...x.ponto)}$ à reta que passa por $P_0${vecInline(...x.p0)}$ com diretor $\\mathbf{v} = ${vecInline(...x.diretor)}$.`;
      }
      case "retas-planos-intersecao": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-intersecao" }>>(problem);
        const [a, b, c, d0] = x.coeficientes;
        return `Encontre o ponto de interseção da reta $\\mathbf{r}(t) = ${vecInline(...x.p0)} + t\\,${vecInline(...x.diretor)}$ com o plano ${num(a)}x ${signed(b)}y ${signed(c)}z = ${num(d0)}$.`;
      }
      case "curvas": {
        const x = dados<Extract<CurvasData, { tipo: "curvas" }>>(problem);
        return `Para $\\mathbf{r}(t) = (${num(x.a)}t,\\; t^2 ${signed(x.b)})$, calcule $\\|\\mathbf{r}'(${num(x.t0)})\\|$.`;
      }
      case "curvas-velocidade-vetor": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-velocidade-vetor" }>>(problem);
        if (x.familia === "reta") {
          return `Para $\\mathbf{r}(t) = (${num(x.a)}t,\\; ${num(x.c ?? 0)}t ${signed(x.b)})$, calcule $\\mathbf{r}'(${num(x.t0)})$.`;
        }
        return `Para $\\mathbf{r}(t) = (${num(x.a)}t,\\; t^2 ${signed(x.b)})$, calcule $\\mathbf{r}'(${num(x.t0)})$.`;
      }
      case "curvas-tangente": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-tangente" }>>(problem);
        return `Para $\\mathbf{r}(t) = (${num(x.a)}t,\\; t^2 ${signed(x.b)})$, encontre o vetor tangente em $t = ${num(x.t0)}$.`;
      }
      case "curvas-circulo":
        return `Para $\\mathbf{r}(t) = (\\cos t,\\; \\sin t)$, calcule $\\|\\mathbf{r}'(t_0)\\|$.`;
      case "curvas-comprimento": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-comprimento" }>>(problem);
        return `Calcule o comprimento do arco de $\\mathbf{r}(t) = (${num(x.a)}t,\\; ${num(x.b)}t)$ para $t \\in [${num(x.t1)}, ${num(x.t2)}]$.`;
      }
      case "curvas-helice":
        return `Para a hélice $\\mathbf{r}(t) = (\\cos t,\\; \\sin t,\\; t)$, calcule $\\|\\mathbf{r}'(t_0)\\|$.`;
      case "campos": {
        const x = dados<Extract<CamposData, { tipo: "campos" }>>(problem);
        return `Calcule $\\nabla f$ de $f(x,y) = ${campoFnLatex(x.funcao)}$ no ponto $(${num(x.x0)}, ${num(x.y0)})$.`;
      }
      case "campos-divergente": {
        const x = dados<Extract<CamposData, { tipo: "campos-divergente" }>>(problem);
        return `Calcule $\\mathrm{div}\\,\\mathbf{F}$ de $\\mathbf{F}(x,y) = (${num(x.a)}x ${signed(x.b)},\\; ${num(x.c)}y ${signed(x.d)})$.`;
      }
      case "campos-rotacional": {
        const x = dados<Extract<CamposData, { tipo: "campos-rotacional" }>>(problem);
        return `Calcule o rotacional escalar de $\\mathbf{F}(x,y) = (${num(x.a)}y,\\; ${num(x.b)}x)$.`;
      }
      case "campos-gradiente-3d": {
        const x = dados<Extract<CamposData, { tipo: "campos-gradiente-3d" }>>(problem);
        return `Calcule $\\nabla f$ de $f(x,y,z) = x^2 + y^2 + z^2$ no ponto $(${num(x.x0)}, ${num(x.y0)}, ${num(x.z0)})$.`;
      }
      case "campos-divergente-3d": {
        const x = dados<Extract<CamposData, { tipo: "campos-divergente-3d" }>>(problem);
        return `Calcule $\\mathrm{div}\\,\\mathbf{F}$ de $\\mathbf{F}(x,y,z) = (${num(x.a)}x,\\; ${num(x.b)}y,\\; ${num(x.c)}z)$.`;
      }
      default:
        return undefined;
    }
  },

  respostaFinal(problem, solution) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "vetores": {
        const x = dados<Extract<VetoresData, { tipo: "vetores" }>>(problem);
        return num(round2(modulo(x.componentes)));
      }
      case "vetores-soma": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-soma" }>>(problem);
        return vecInline(...x.u.map((ui, i) => ui + x.v[i]!));
      }
      case "vetores-escalar": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-escalar" }>>(problem);
        return vecInline(...x.componentes.map((c) => x.k * c));
      }
      case "vetores-unitario": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-unitario" }>>(problem);
        const m = modulo(x.componentes);
        return vecInline(...x.componentes.map((c) => round2(c / m)));
      }
      case "vetores-distancia": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-distancia" }>>(problem);
        const dx = x.q[0] - x.p[0];
        const dy = x.q[1] - x.p[1];
        const dz = x.q[2] - x.p[2];
        return num(round2(Math.sqrt(dx * dx + dy * dy + dz * dz)));
      }
      case "vetores-paralelo": {
        const x = dados<Extract<VetoresData, { tipo: "vetores-paralelo" }>>(problem);
        const cr = cross(x.u, x.v);
        return text(cr.every((c) => c === 0) ? "Sim" : "Não");
      }
      case "produto-escalar": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>>(problem);
        return num(dot(x.u, x.v));
      }
      case "produto-escalar-angulo": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-angulo" }>>(problem);
        const cos =
          dot(x.u, x.v) / (modulo(x.u) * modulo(x.v));
        const deg = round2((Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI);
        return num(deg);
      }
      case "produto-escalar-projecao": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-projecao" }>>(problem);
        const scalar = dot(x.u, x.v) / dot(x.v, x.v);
        return vecInline(...x.v.map((vi) => round2(scalar * vi)));
      }
      case "produto-escalar-ortogonal": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar-ortogonal" }>>(problem);
        return text(dot(x.u, x.v) === 0 ? "Sim" : "Não");
      }
      case "produto-vetorial": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>>(problem);
        return vecInline(...cross(x.u, x.v));
      }
      case "produto-vetorial-area": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial-area" }>>(problem);
        return num(round2(modulo(cross(x.u, x.v))));
      }
      case "produto-vetorial-misto": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial-misto" }>>(problem);
        return num(dot(x.u, cross(x.v, x.w)));
      }
      case "retas-planos": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos" }>>(problem);
        return vecInline(...x.p2.map((v, i) => v - x.p1[i]!));
      }
      case "retas-planos-parametrica": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos-parametrica" }>>(problem);
        const ponto = x.p0.map((v, i) => v + x.diretor[i]!) as [number, number, number];
        return vecInline(...ponto);
      }
      case "retas-planos-plano":
        return solution.respostaFinal;
      case "retas-planos-distancia":
      case "retas-planos-distancia-reta":
      case "retas-planos-intersecao":
        return solution.respostaFinal;
      case "curvas": {
        const x = dados<Extract<CurvasData, { tipo: "curvas" }>>(problem);
        const rx = x.a;
        const ry = 2 * x.t0;
        return num(round2(Math.sqrt(rx * rx + ry * ry)));
      }
      case "curvas-velocidade-vetor": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-velocidade-vetor" }>>(problem);
        if (x.familia === "reta") {
          return vecInline(x.a, x.c ?? 0);
        }
        return vecInline(x.a, 2 * x.t0);
      }
      case "curvas-tangente": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-tangente" }>>(problem);
        return vecInline(x.a, 2 * x.t0);
      }
      case "curvas-circulo":
        return num(1);
      case "curvas-comprimento": {
        const x = dados<Extract<CurvasData, { tipo: "curvas-comprimento" }>>(problem);
        const speed = Math.sqrt(x.a * x.a + x.b * x.b);
        return num(round2(speed * (x.t2 - x.t1)));
      }
      case "curvas-helice":
        return num(round2(Math.sqrt(2)));
      case "campos": {
        const x = dados<Extract<CamposData, { tipo: "campos" }>>(problem);
        if (x.funcao === "xy") return vecInline(x.y0, x.x0);
        if (x.funcao === "x2y") return vecInline(2 * x.x0 * x.y0, x.x0 * x.x0);
        return vecInline(2 * x.x0, 2 * x.y0);
      }
      case "campos-divergente": {
        const x = dados<Extract<CamposData, { tipo: "campos-divergente" }>>(problem);
        return num(x.a + x.c);
      }
      case "campos-rotacional": {
        const x = dados<Extract<CamposData, { tipo: "campos-rotacional" }>>(problem);
        return num(x.b - x.a);
      }
      case "campos-gradiente-3d": {
        const x = dados<Extract<CamposData, { tipo: "campos-gradiente-3d" }>>(problem);
        return vecInline(2 * x.x0, 2 * x.y0, 2 * x.z0);
      }
      case "campos-divergente-3d": {
        const x = dados<Extract<CamposData, { tipo: "campos-divergente-3d" }>>(problem);
        return num(x.a + x.b + x.c);
      }
      default:
        return solution.respostaFinal;
    }
  },

  stepCalculo(problem, step) {
    return cvStepCalculo(problem, step);
  },

  stepResultado(problem, step) {
    if (!step.resultado) return undefined;
    return enrichCalculoVetorialLatex.respostaFinal(problem, {
      problemaId: problem.id,
      respostaFinal: step.resultado,
      steps: [],
    });
  },
};
