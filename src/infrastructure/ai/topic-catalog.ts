/** Catálogo compacto para prompts de IA — tópicos ativos e formato de `dados`. */
export const AI_TOPIC_CATALOG = `
Tópicos disponíveis (topicoId → dados.tipo e campos):

probabilidade.espaco-amostral → { tipo:"espaco-amostral", experimento:"moeda"|"dado"|"dado-duplo", pergunta:"cardinalidade"|"listar" }
probabilidade.eventos → { tipo:"eventos", operacao:"uniao"|"intersecao"|"complemento", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.classica → { tipo:"probabilidade-classica", corAlvo, cores:{cor:qtd} }
probabilidade.condicional → { tipo:"condicional", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.independencia → { tipo:"independencia", nOmega, nA, nB, nAinterB, descricaoA, descricaoB }
probabilidade.variaveis-discretas → { tipo:"variaveis-discretas", pergunta:"esperanca"|"probabilidade", valores[], probabilidades[], valorAlvo? }

calculo.limites → tipos: limite-algebrico | limite-trig | limite-racional | limite-radical | limite-infinito | limite-infinito-neg | limite-substituicao | limite-exp-log | limite-lhopital
calculo.continuidade → tipos: continuidade-afim | continuidade-classificar | continuidade-completar | continuidade-lateral | continuidade-tvi | continuidade-trig-ponto | continuidade-rolle
calculo.derivadas → tipos: derivadas-polinomio | derivadas-trig | derivadas-exp-log | derivadas-produto | derivadas-quociente | derivadas-tangente | derivadas-definicao | derivadas-taxa-relacionada | derivadas-implicita | derivadas-aprox-linear | derivadas-segunda-teste | derivadas-inversa-trig
calculo.regra-cadeia → tipos: regra-cadeia-potencia | regra-cadeia-trig | regra-cadeia-exp-log | regra-cadeia-avancada
calculo.otimizacao → tipos: otimizacao-parabola | otimizacao-geometrica | otimizacao-crescimento | otimizacao-concavidade | otimizacao-cilindro | otimizacao-caixa | otimizacao-segunda-derivada | otimizacao-esboco
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

analise-exploratoria.tipos-dados → tipos: tipos-dados (escala) | tipos-dados-grafico (gráfico adequado)
analise-exploratoria.medidas-tendencia → tipos: media-aritmetica | medidas-tendencia-mediana | medidas-tendencia-moda | medidas-tendencia-ponderada
analise-exploratoria.medidas-dispersao → tipos: medidas-dispersao (variancia|desvio|amplitude) | medidas-dispersao-cv
analise-exploratoria.distribuicoes → tipos: distribuicoes (IQR) | distribuicoes-quartis | distribuicoes-outliers | distribuicoes-ler-boxplot
analise-exploratoria.correlacao → tipos: correlacao | correlacao-negativa | correlacao-fraca
`;
