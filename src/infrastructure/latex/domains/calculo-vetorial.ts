import type { Problem, Solution, Step } from "@/core/domain/problem";
import type { DomainLatexEnricher } from "../enrich";
import {
  num,
  partial,
  signed,
  sqrtLatex,
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

function isCV(p: Problem): boolean {
  return p.disciplinaId === "calculo-vetorial";
}

function dados<T>(p: Problem): T {
  return p.dados as T;
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
      case "produto-escalar": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>>(problem);
        return `Calcule $\\mathbf{u} \\cdot \\mathbf{v}$ com $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "produto-vetorial": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>>(problem);
        return `Calcule $\\mathbf{u} \\times \\mathbf{v}$ com $\\mathbf{u} = ${vecInline(...x.u)}$ e $\\mathbf{v} = ${vecInline(...x.v)}$.`;
      }
      case "retas-planos": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos" }>>(problem);
        return `Encontre o vetor diretor da reta que passa por $P${vecInline(...x.p1)}$ e $Q${vecInline(...x.p2)}$.`;
      }
      case "curvas": {
        const x = dados<Extract<CurvasData, { tipo: "curvas" }>>(problem);
        return `Para $\\mathbf{r}(t) = (${num(x.a)}t,\\; t^2 ${signed(x.b)})$, calcule $\\|\\mathbf{r}'(${num(x.t0)})\\|$.`;
      }
      case "campos": {
        const x = dados<Extract<CamposData, { tipo: "campos" }>>(problem);
        const fn =
          x.funcao === "xy"
            ? "xy"
            : x.funcao === "x2y"
              ? "x^2y"
              : "x^2 + y^2";
        return `Calcule $\\nabla f$ de $f(x,y) = ${fn}$ no ponto $(${num(x.x0)}, ${num(x.y0)})$.`;
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
        const mod = Math.sqrt(
          x.componentes.reduce((a, c) => a + c * c, 0),
        );
        return num(Math.round(mod * 100) / 100);
      }
      case "produto-escalar": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>>(problem);
        return num(x.u.reduce((acc, ui, i) => acc + ui * x.v[i]!, 0));
      }
      case "produto-vetorial": {
        const x = dados<Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>>(problem);
        const [u1, u2, u3] = x.u;
        const [v1, v2, v3] = x.v;
        const i = u2 * v3 - u3 * v2;
        const j = -(u1 * v3 - u3 * v1);
        const k = u1 * v2 - u2 * v1;
        return vecInline(i, j, k);
      }
      case "retas-planos": {
        const x = dados<Extract<RetasPlanosData, { tipo: "retas-planos" }>>(problem);
        const dir = x.p2.map((v, i) => v - x.p1[i]!) as [number, number, number];
        return vecInline(...dir);
      }
      case "curvas": {
        const x = dados<Extract<CurvasData, { tipo: "curvas" }>>(problem);
        const rx = x.a;
        const ry = 2 * x.t0;
        return num(Math.round(Math.sqrt(rx * rx + ry * ry) * 100) / 100);
      }
      case "campos": {
        const x = dados<Extract<CamposData, { tipo: "campos" }>>(problem);
        if (x.funcao === "xy") return vecInline(x.y0, x.x0);
        if (x.funcao === "x2y") return vecInline(2 * x.x0 * x.y0, x.x0 * x.x0);
        return vecInline(2 * x.x0, 2 * x.y0);
      }
      default:
        return solution.respostaFinal;
    }
  },

  stepCalculo(problem, step) {
    const d = problem.dados as { tipo?: string };
    switch (d.tipo) {
      case "vetores": {
        const x = dados<Extract<VetoresData, { tipo: "vetores" }>>(problem);
        const terms = x.componentes.map((c) => `${num(c)}^2`).join(" + ");
        const sq = x.componentes.reduce((a, c) => a + c * c, 0);
        if (step.ordem === 1) return `\\|\\mathbf{v}\\| = ${sqrtLatex(terms)}`;
        if (step.ordem === 2) {
          return `\\|\\mathbf{v}\\| = ${sqrtLatex(num(sq))} = ${num(Math.sqrt(sq))}`;
        }
        break;
      }
      case "produto-escalar": {
        const x = dados<Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>>(problem);
        const terms = x.u.map((ui, i) => `${num(ui)} \\cdot ${num(x.v[i]!)}`);
        const res = x.u.reduce((acc, ui, i) => acc + ui * x.v[i]!, 0);
        if (step.ordem === 1) return `\\mathbf{u} \\cdot \\mathbf{v} = ${terms.join(" + ")}`;
        if (step.ordem === 2) return `\\mathbf{u} \\cdot \\mathbf{v} = ${num(res)}`;
        break;
      }
      case "campos": {
        const x = dados<Extract<CamposData, { tipo: "campos" }>>(problem);
        if (step.ordem === 1) {
          const fn =
            x.funcao === "xy"
              ? "xy"
              : x.funcao === "x2y"
                ? "x^2y"
                : "x^2 + y^2";
          return `${partial(fn, "x")},\\quad ${partial(fn, "y")}`;
        }
        if (step.ordem === 2) {
          if (x.funcao === "xy") return `\\nabla f(${num(x.x0)}, ${num(x.y0)}) = ${vecInline(x.y0, x.x0)}`;
          if (x.funcao === "x2y") {
            return `\\nabla f(${num(x.x0)}, ${num(x.y0)}) = ${vecInline(2 * x.x0 * x.y0, x.x0 * x.x0)}`;
          }
          return `\\nabla f(${num(x.x0)}, ${num(x.y0)}) = ${vecInline(2 * x.x0, 2 * x.y0)}`;
        }
        break;
      }
      case "curvas": {
        const x = dados<Extract<CurvasData, { tipo: "curvas" }>>(problem);
        const rx = x.a;
        const ry = 2 * x.t0;
        const mod = Math.sqrt(rx * rx + ry * ry);
        if (step.ordem === 1) return `\\mathbf{r}'(t) = (${num(x.a)},\\; 2t)`;
        if (step.ordem === 2) return `\\mathbf{r}'(${num(x.t0)}) = (${num(rx)},\\; ${num(ry)})`;
        if (step.ordem === 3) {
          return `\\|\\mathbf{r}'(${num(x.t0)})\\| = ${sqrtLatex(`${num(rx)}^2 + ${num(ry)}^2`)} = ${num(mod)}`;
        }
        break;
      }
      default:
        break;
    }
    return undefined;
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
