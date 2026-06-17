import type { Problem, Step } from "@/core/domain/problem";
import { frac, num, sqrtLatex, text, vecInline } from "@/core/presentation/math/latex-helpers";
import type {
  CamposData,
  CurvasData,
  ProdutoEscalarData,
  ProdutoVetorialData,
  RetasPlanosData,
  VetoresData,
} from "@/domains/calculo-vetorial/entities/types";
import { cross, dot, modulo, round2 } from "@/domains/calculo-vetorial/lib/vec";

function dados<T>(p: Problem): T {
  return p.dados as T;
}

export function cvStepCalculo(problem: Problem, step: Step): string | undefined {
  const d = problem.dados as { tipo?: string };
  switch (d.tipo) {
    case "vetores":
      return stepVetoresModulo(dados(problem), step);
    case "vetores-soma":
      return stepVetoresSoma(dados(problem), step);
    case "vetores-escalar":
      return stepVetoresEscalar(dados(problem), step);
    case "vetores-unitario":
      return stepVetoresUnitario(dados(problem), step);
    case "vetores-distancia":
      return stepVetoresDistancia(dados(problem), step);
    case "vetores-paralelo":
      return stepVetoresParalelo(dados(problem), step);
    case "produto-escalar":
      return stepDot(dados(problem), step);
    case "produto-escalar-angulo":
      return stepAngulo(dados(problem), step);
    case "produto-escalar-projecao":
      return stepProjecao(dados(problem), step);
    case "produto-escalar-ortogonal":
      return stepOrtogonal(dados(problem), step);
    case "produto-vetorial":
      return stepCross(dados(problem), step);
    case "produto-vetorial-area":
      return stepArea(dados(problem), step);
    case "produto-vetorial-misto":
      return stepMisto(dados(problem), step);
    case "retas-planos":
      return stepRetasDiretor(dados(problem), step);
    case "retas-planos-parametrica":
      return stepRetasParametrica(dados(problem), step);
    case "retas-planos-plano":
      return stepRetasPlano(dados(problem), step);
    case "retas-planos-distancia":
      return stepRetasDistanciaPlano(dados(problem), step);
    case "retas-planos-distancia-reta":
      return stepRetasDistanciaReta(dados(problem), step);
    case "retas-planos-intersecao":
      return stepRetasIntersecao(dados(problem), step);
    case "curvas":
      return stepCurvasModulo(dados(problem), step);
    case "curvas-velocidade-vetor":
      return stepCurvasVelocidade(dados(problem), step);
    case "curvas-tangente":
      return stepCurvasTangente(dados(problem), step);
    case "curvas-circulo":
      return stepCurvasCirculo(dados(problem), step);
    case "curvas-comprimento":
      return stepCurvasComprimento(dados(problem), step);
    case "curvas-helice":
      return stepCurvasHelice(dados(problem), step);
    case "campos":
      return stepCamposGradiente(dados(problem), step);
    case "campos-divergente":
      return stepCamposDiv(dados(problem), step);
    case "campos-rotacional":
      return stepCamposRot(dados(problem), step);
    case "campos-gradiente-3d":
      return stepCamposGrad3d(dados(problem), step);
    case "campos-divergente-3d":
      return stepCamposDiv3d(dados(problem), step);
    default:
      return undefined;
  }
}

function stepVetoresModulo(
  d: Extract<VetoresData, { tipo: "vetores" }>,
  step: Step,
): string | undefined {
  const sq = d.componentes.reduce((a, c) => a + c * c, 0);
  const mod = round2(Math.sqrt(sq));
  if (step.ordem === 1) {
    const terms = d.componentes.map((c) => `${num(c)}^2`).join(" + ");
    return `\\|\\mathbf{v}\\| = ${sqrtLatex(terms)}`;
  }
  if (step.ordem === 2) {
    return `\\|\\mathbf{v}\\| = ${sqrtLatex(num(sq))} = ${num(mod)}`;
  }
  return undefined;
}

function stepVetoresSoma(
  d: Extract<VetoresData, { tipo: "vetores-soma" }>,
  step: Step,
): string | undefined {
  const soma = d.u.map((ui, i) => ui + d.v[i]!);
  if (step.ordem === 1) {
    return `\\mathbf{u}+\\mathbf{v} = ${vecInline(...d.u)} + ${vecInline(...d.v)}`;
  }
  if (step.ordem === 2) return `\\mathbf{u}+\\mathbf{v} = ${vecInline(...soma)}`;
  return undefined;
}

function stepVetoresEscalar(
  d: Extract<VetoresData, { tipo: "vetores-escalar" }>,
  step: Step,
): string | undefined {
  const scaled = d.componentes.map((c) => d.k * c);
  if (step.ordem === 1) {
    return `${num(d.k)}\\,\\mathbf{v} = ${num(d.k)} \\cdot ${vecInline(...d.componentes)}`;
  }
  if (step.ordem === 2) return `= ${vecInline(...scaled)}`;
  return undefined;
}

function stepVetoresUnitario(
  d: Extract<VetoresData, { tipo: "vetores-unitario" }>,
  step: Step,
): string | undefined {
  const m = modulo(d.componentes);
  const unit = d.componentes.map((c) => round2(c / m));
  if (step.ordem === 1) {
    return `\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|},\\quad \\|\\mathbf{v}\\| = ${num(round2(m))}`;
  }
  if (step.ordem === 2) return `\\hat{\\mathbf{v}} = ${vecInline(...unit)}`;
  return undefined;
}

function stepVetoresDistancia(
  d: Extract<VetoresData, { tipo: "vetores-distancia" }>,
  step: Step,
): string | undefined {
  const dx = d.q[0] - d.p[0];
  const dy = d.q[1] - d.p[1];
  const dz = d.q[2] - d.p[2];
  const dist = round2(Math.sqrt(dx * dx + dy * dy + dz * dz));
  if (step.ordem === 1) {
    return `\\overrightarrow{PQ} = ${vecInline(...d.q)} - ${vecInline(...d.p)} = ${vecInline(dx, dy, dz)}`;
  }
  if (step.ordem === 2) {
    return `d = \\|\\overrightarrow{PQ}\\| = ${sqrtLatex(`${num(dx)}^2+${num(dy)}^2+${num(dz)}^2`)} = ${num(dist)}`;
  }
  return undefined;
}

function stepVetoresParalelo(
  d: Extract<VetoresData, { tipo: "vetores-paralelo" }>,
  step: Step,
): string | undefined {
  const cr = cross(d.u, d.v);
  if (step.ordem === 1) {
    return `\\mathbf{u}\\times\\mathbf{v} = ${vecInline(...cr)}`;
  }
  if (step.ordem === 2) {
    const par = cr.every((c) => c === 0);
    return par ? text("Produto vetorial nulo ") + "\\Rightarrow" + text(" vetores paralelos") : text("Produto vetorial não nulo");
  }
  return undefined;
}

function stepDot(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar" }>,
  step: Step,
): string | undefined {
  const res = dot(d.u, d.v);
  if (step.ordem === 1) {
    const terms = d.u.map((ui, i) => `${num(ui)} \\cdot ${num(d.v[i]!)}`);
    return `\\mathbf{u}\\cdot\\mathbf{v} = ${terms.join(" + ")}`;
  }
  if (step.ordem === 2) return `\\mathbf{u}\\cdot\\mathbf{v} = ${num(res)}`;
  return undefined;
}

function stepAngulo(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-angulo" }>,
  step: Step,
): string | undefined {
  const uv = dot(d.u, d.v);
  const mu = modulo(d.u);
  const mv = modulo(d.v);
  const cos = uv / (mu * mv);
  const deg = round2((Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI);
  if (step.ordem === 1) {
    return `\\mathbf{u}\\cdot\\mathbf{v} = ${num(uv)},\\; \\|\\mathbf{u}\\| = ${num(round2(mu))},\\; \\|\\mathbf{v}\\| = ${num(round2(mv))}`;
  }
  if (step.ordem === 2) {
    return `\\cos\\theta = ${frac(num(uv), `${num(round2(mu))}\\cdot${num(round2(mv))}`)} = ${num(round2(cos))}`;
  }
  if (step.ordem === 3) return `\\theta \\approx ${num(deg)}^\\circ`;
  return undefined;
}

function stepProjecao(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-projecao" }>,
  step: Step,
): string | undefined {
  const uv = dot(d.u, d.v);
  const mv2 = dot(d.v, d.v);
  const scalar = round2(uv / mv2);
  const vec = d.v.map((vi) => round2(scalar * vi));
  if (step.ordem === 1) {
    return `\\mathrm{proj}_{\\mathbf{v}}\\mathbf{u} = ${frac("\\mathbf{u}\\cdot\\mathbf{v}", "\\mathbf{v}\\cdot\\mathbf{v}")}\\mathbf{v}`;
  }
  if (step.ordem === 2) {
    return `= ${num(scalar)}\\,${vecInline(...d.v)} = ${vecInline(...vec)}`;
  }
  return undefined;
}

function stepOrtogonal(
  d: Extract<ProdutoEscalarData, { tipo: "produto-escalar-ortogonal" }>,
  step: Step,
): string | undefined {
  const uv = dot(d.u, d.v);
  if (step.ordem === 1) return `\\mathbf{u}\\cdot\\mathbf{v} = ${num(uv)}`;
  if (step.ordem === 2) return uv === 0 ? text("Sim") : text("Não");
  return undefined;
}

function stepCross(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial" }>,
  step: Step,
): string | undefined {
  const r = cross(d.u, d.v);
  const [u1, u2, u3] = d.u;
  const [v1, v2, v3] = d.v;
  if (step.ordem === 1) {
    return `\\mathbf{u}\\times\\mathbf{v} = \\begin{vmatrix}\\mathbf{i}&\\mathbf{j}&\\mathbf{k}\\\\${num(u1)}&${num(u2)}&${num(u3)}\\\\${num(v1)}&${num(v2)}&${num(v3)}\\end{vmatrix}`;
  }
  if (step.ordem === 2) {
    return `= (${num(u2)}\\cdot${num(v3)}-${num(u3)}\\cdot${num(v2)},\\; -(${num(u1)}\\cdot${num(v3)}-${num(u3)}\\cdot${num(v1)}),\\; ${num(u1)}\\cdot${num(v2)}-${num(u2)}\\cdot${num(v1)})`;
  }
  if (step.ordem === 3) return `\\mathbf{u}\\times\\mathbf{v} = ${vecInline(...r)}`;
  return undefined;
}

function stepArea(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial-area" }>,
  step: Step,
): string | undefined {
  const cr = cross(d.u, d.v);
  const area = round2(modulo(cr));
  if (step.ordem === 1) return `\\mathbf{u}\\times\\mathbf{v} = ${vecInline(...cr)}`;
  if (step.ordem === 2) return `\\text{área} = \\|\\mathbf{u}\\times\\mathbf{v}\\| = ${num(area)}`;
  return undefined;
}

function stepMisto(
  d: Extract<ProdutoVetorialData, { tipo: "produto-vetorial-misto" }>,
  step: Step,
): string | undefined {
  const cr = cross(d.v, d.w);
  const vol = Math.abs(dot(d.u, cr));
  if (step.ordem === 1) return `\\mathbf{v}\\times\\mathbf{w} = ${vecInline(...cr)}`;
  if (step.ordem === 2) return `|\\mathbf{u}\\cdot(\\mathbf{v}\\times\\mathbf{w})| = ${num(vol)}`;
  return undefined;
}

function stepRetasDiretor(
  d: Extract<RetasPlanosData, { tipo: "retas-planos" }>,
  step: Step,
): string | undefined {
  const dir = d.p2.map((v, i) => v - d.p1[i]!) as [number, number, number];
  if (step.ordem === 1) {
    return `\\overrightarrow{PQ} = ${vecInline(...d.p2)} - ${vecInline(...d.p1)}`;
  }
  if (step.ordem === 2) return `\\overrightarrow{PQ} = ${vecInline(...dir)}`;
  return undefined;
}

function stepRetasParametrica(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-parametrica" }>,
  step: Step,
): string | undefined {
  const ponto = d.p0.map((v, i) => v + d.diretor[i]!) as [number, number, number];
  if (step.ordem === 1) {
    return `\\mathbf{r}(t) = ${vecInline(...d.p0)} + t\\,${vecInline(...d.diretor)}`;
  }
  if (step.ordem === 2) {
    return `\\mathbf{r}(1) = ${vecInline(...d.p0)} + ${vecInline(...d.diretor)} = ${vecInline(...ponto)}`;
  }
  return undefined;
}

function stepRetasPlano(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-plano" }>,
  step: Step,
): string | undefined {
  const [a, b, c] = d.normal;
  const dVal = a * d.ponto[0] + b * d.ponto[1] + c * d.ponto[2];
  if (step.ordem === 1) return `${num(a)}x ${num(b)}y ${num(c)}z = d`;
  if (step.ordem === 2) {
    return `d = ${num(a)}\\cdot${num(d.ponto[0])} + ${num(b)}\\cdot${num(d.ponto[1])} + ${num(c)}\\cdot${num(d.ponto[2])} = ${num(dVal)}`;
  }
  return undefined;
}

function stepRetasDistanciaPlano(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-distancia" }>,
  step: Step,
): string | undefined {
  const [a, b, c, d0] = d.coeficientes;
  const nume = Math.abs(a * d.ponto[0] + b * d.ponto[1] + c * d.ponto[2] - d0);
  const den = Math.sqrt(a * a + b * b + c * c);
  const dist = round2(nume / den);
  if (step.ordem === 1) {
    return `d = ${frac(`|${num(a)}x+${num(b)}y+${num(c)}z-${num(d0)}|`, sqrtLatex(`${num(a)}^2+${num(b)}^2+${num(c)}^2`))}`;
  }
  if (step.ordem === 2) return `d = ${frac(num(nume), num(round2(den)))} = ${num(dist)}`;
  return undefined;
}

function stepRetasDistanciaReta(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-distancia-reta" }>,
  step: Step,
): string | undefined {
  const w = d.ponto.map((pi, i) => pi - d.p0[i]!) as [number, number, number];
  const cr = cross(w, d.diretor);
  const dist = round2(modulo(cr) / modulo(d.diretor));
  if (step.ordem === 1) {
    return `d = ${frac(`\\|(\\overrightarrow{P_0P})\\times\\mathbf{v}\\|`, `\\|\\mathbf{v}\\|`)}`;
  }
  if (step.ordem === 2) return `d = ${num(dist)}`;
  return undefined;
}

function stepRetasIntersecao(
  d: Extract<RetasPlanosData, { tipo: "retas-planos-intersecao" }>,
  step: Step,
): string | undefined {
  const [a, b, c, dPlano] = d.coeficientes;
  const nv = a * d.diretor[0] + b * d.diretor[1] + c * d.diretor[2];
  const np0 = a * d.p0[0] + b * d.p0[1] + c * d.p0[2];
  const t = (dPlano - np0) / nv;
  const ponto = d.p0.map((v, i) => round2(v + t * d.diretor[i]!));
  if (step.ordem === 1) {
    return `${num(a)}x+${num(b)}y+${num(c)}z = ${num(dPlano)}\\quad\\text{com}\\quad \\mathbf{r}(t)=${vecInline(...d.p0)}+t\\,${vecInline(...d.diretor)}`;
  }
  if (step.ordem === 2) {
    return `t = ${frac(num(dPlano - np0), num(nv))} = ${num(round2(t))}`;
  }
  if (step.ordem === 3) return `\\mathbf{r}(t) = ${vecInline(...ponto)}`;
  return undefined;
}

function stepCurvasModulo(
  d: Extract<CurvasData, { tipo: "curvas" }>,
  step: Step,
): string | undefined {
  const rx = d.a;
  const ry = 2 * d.t0;
  const mod = round2(Math.sqrt(rx * rx + ry * ry));
  if (step.ordem === 1) return `\\mathbf{r}'(t) = (${num(d.a)},\\; 2t)`;
  if (step.ordem === 2) return `\\mathbf{r}'(${num(d.t0)}) = (${num(rx)},\\; ${num(ry)})`;
  if (step.ordem === 3) {
    return `\\|\\mathbf{r}'(${num(d.t0)})\\| = ${sqrtLatex(`${num(rx)}^2+${num(ry)}^2`)} = ${num(mod)}`;
  }
  return undefined;
}

function stepCurvasVelocidade(
  d: Extract<CurvasData, { tipo: "curvas-velocidade-vetor" }>,
  step: Step,
): string | undefined {
  if (d.familia === "reta") {
    if (step.ordem === 1) return `\\mathbf{r}'(t) = (${num(d.a)},\\; ${num(d.c ?? 0)})`;
    if (step.ordem === 2) return `\\mathbf{r}'(${num(d.t0)}) = ${vecInline(d.a, d.c ?? 0)}`;
    return undefined;
  }
  if (step.ordem === 1) return `\\mathbf{r}'(t) = (${num(d.a)},\\; 2t)`;
  if (step.ordem === 2) return `\\mathbf{r}'(${num(d.t0)}) = ${vecInline(d.a, 2 * d.t0)}`;
  return undefined;
}

function stepCurvasTangente(
  d: Extract<CurvasData, { tipo: "curvas-tangente" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `\\mathbf{r}'(t) = (${num(d.a)},\\; 2t)`;
  if (step.ordem === 2) return `\\mathbf{T} = \\mathbf{r}'(${num(d.t0)}) = ${vecInline(d.a, 2 * d.t0)}`;
  return undefined;
}

function stepCurvasCirculo(d: Extract<CurvasData, { tipo: "curvas-circulo" }>, step: Step): string | undefined {
  if (step.ordem === 1) return `\\mathbf{r}'(t) = (-\\sin t,\\; \\cos t)`;
  if (step.ordem === 2) return `\\|\\mathbf{r}'(t)\\| = 1`;
  return undefined;
}

function stepCurvasComprimento(
  d: Extract<CurvasData, { tipo: "curvas-comprimento" }>,
  step: Step,
): string | undefined {
  const speed = Math.sqrt(d.a * d.a + d.b * d.b);
  const comp = round2(speed * (d.t2 - d.t1));
  if (step.ordem === 1) {
    return `\\|\\mathbf{r}'(t)\\| = ${sqrtLatex(`${num(d.a)}^2+${num(d.b)}^2`)} = ${num(round2(speed))}`;
  }
  if (step.ordem === 2) {
    return `L = ${num(round2(speed))}\\cdot(${num(d.t2)}-${num(d.t1)}) = ${num(comp)}`;
  }
  return undefined;
}

function stepCurvasHelice(d: Extract<CurvasData, { tipo: "curvas-helice" }>, step: Step): string | undefined {
  const mod = round2(Math.sqrt(2));
  if (step.ordem === 1) return `\\mathbf{r}'(t) = (-\\sin t,\\; \\cos t,\\; 1)`;
  if (step.ordem === 2) return `\\|\\mathbf{r}'(t)\\| = ${sqrtLatex("2")} = ${num(mod)}`;
  return undefined;
}

function stepCamposGradiente(
  d: Extract<CamposData, { tipo: "campos" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\; \\frac{\\partial f}{\\partial y}\\right)`;
  if (step.ordem === 2) {
    if (d.funcao === "xy") return `\\nabla f(${num(d.x0)}, ${num(d.y0)}) = ${vecInline(d.y0, d.x0)}`;
    if (d.funcao === "x2y") {
      return `\\nabla f(${num(d.x0)}, ${num(d.y0)}) = ${vecInline(2 * d.x0 * d.y0, d.x0 * d.x0)}`;
    }
    return `\\nabla f(${num(d.x0)}, ${num(d.y0)}) = ${vecInline(2 * d.x0, 2 * d.y0)}`;
  }
  return undefined;
}

function stepCamposDiv(
  d: Extract<CamposData, { tipo: "campos-divergente" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `P = ${num(d.a)}x ${num(d.b)},\\; Q = ${num(d.c)}y ${num(d.d)}`;
  if (step.ordem === 2) return `\\mathrm{div}\\,\\mathbf{F} = ${num(d.a)} + ${num(d.c)} = ${num(d.a + d.c)}`;
  return undefined;
}

function stepCamposRot(
  d: Extract<CamposData, { tipo: "campos-rotacional" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `\\mathrm{rot}\\,\\mathbf{F} = \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}`;
  if (step.ordem === 2) return `= ${num(d.b)} - ${num(d.a)} = ${num(d.b - d.a)}`;
  return undefined;
}

function stepCamposGrad3d(
  d: Extract<CamposData, { tipo: "campos-gradiente-3d" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `\\nabla f = (2x,\\; 2y,\\; 2z)`;
  if (step.ordem === 2) {
    return `\\nabla f(${num(d.x0)}, ${num(d.y0)}, ${num(d.z0)}) = ${vecInline(2 * d.x0, 2 * d.y0, 2 * d.z0)}`;
  }
  return undefined;
}

function stepCamposDiv3d(
  d: Extract<CamposData, { tipo: "campos-divergente-3d" }>,
  step: Step,
): string | undefined {
  if (step.ordem === 1) return `\\mathrm{div}\\,\\mathbf{F} = \\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z}`;
  if (step.ordem === 2) return `= ${num(d.a)} + ${num(d.b)} + ${num(d.c)} = ${num(d.a + d.b + d.c)}`;
  return undefined;
}
