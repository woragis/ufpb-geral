/** Catálogo compacto para prompts de IA — tópicos ativos e formato de `dados`. */
export const AI_TOPIC_CATALOG = `
Tópicos disponíveis (topicoId → dados.tipo e campos):

probabilidade.espaco-amostral → { tipo:"espaco-amostral", experimento:"moeda"|"dado"|"dado-duplo", pergunta:"cardinalidade"|"listar" }
probabilidade.eventos → { tipo:"eventos", operacao:"uniao"|"intersecao"|"complemento", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.classica → { tipo:"probabilidade-classica", corAlvo, cores:{cor:qtd} }
probabilidade.condicional → { tipo:"condicional", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.independencia → { tipo:"independencia", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.variaveis-discretas → { tipo:"variaveis-discretas", pergunta:"esperanca"|"probabilidade", valores[], probabilidades[], valorAlvo? }

calculo.limites → { tipo:"limite-algebrico", a, coeficiente, constante }  // lim (x→a) (coef*x²-const)/(x-a), const=coef*a²
calculo.continuidade → { tipo:"continuidade", a, m1, b1, m2, b2, continua }
calculo.derivadas → { tipo:"derivadas", coeficientes[], expoentes[], x0 }
calculo.regra-cadeia → { tipo:"regra-cadeia", a, b, n, x0 }
calculo.otimizacao → { tipo:"otimizacao", a, b, c }  // f(x)=ax²+bx+c, a>0
calculo.integrais-indefinidas → { tipo:"integrais-indefinidas", n }  // ∫x^n dx
calculo.integrais-definidas → { tipo:"integrais-definidas", a, b, c, d }  // ∫(cx+d)dx
calculo.area → { tipo:"area", m, b, a, c }
calculo.sequencias → { tipo:"sequencias", numeradorCoef, numeradorConst, denominadorCoef, denominadorConst }
calculo.series → { tipo:"series", a1, r, n }
calculo.taylor → { tipo:"taylor", funcao:"exponencial"|"seno", x0, grau }
calculo.edos → { tipo:"edos", k, y0, x }

calculo-vetorial.vetores → { tipo:"vetores", dimensao:2|3, componentes[] }
calculo-vetorial.produto-escalar → { tipo:"produto-escalar", u[], v[] }
calculo-vetorial.produto-vetorial → { tipo:"produto-vetorial", u[3], v[3] }
calculo-vetorial.retas-planos → { tipo:"retas-planos", p1[3], p2[3] }
calculo-vetorial.curvas → { tipo:"curvas", a, b, t0 }
calculo-vetorial.campos → { tipo:"campos", x0, y0 }

analise-exploratoria.tipos-dados → { tipo:"tipos-dados", variavel, exemplos[], escalaCorreta:"nominal"|"ordinal"|"intervalar"|"razao" }
analise-exploratoria.medidas-tendencia → { tipo:"media-aritmetica", valores[] }
analise-exploratoria.medidas-dispersao → { tipo:"medidas-dispersao", valores[], pergunta:"variancia"|"desvio"|"amplitude" }
analise-exploratoria.distribuicoes → { tipo:"distribuicoes", q1, q2, q3 }
analise-exploratoria.correlacao → { tipo:"correlacao", xs[], ys[] }
`;
