# Veredito de cobertura dos geradores

Documento de referência para retomar pendências depois.  
**Atualizado em:** 16/06/2026 (CV v3 + AE v3 + polish infra)  
**Repositório:** `ufpb-geral`  
**Meta do roadmap:** [06-fase-variacao-geradores.md](./06-fase-variacao-geradores.md) — Probabilidade ≥4 cenários/tópico, Cálculo ≥4, Cálculo Vetorial ≥3.

---

## Resumo executivo

| Disciplina        | Versão geradores | Cenários (aprox.) | Cobertura ementa típica | Meta roadmap |
|-------------------|------------------|-------------------|-------------------------|--------------|
| **Cálculo 1**     | v3               | 40 tipos / 5 tópicos | ~85–90%                 | ✅ atingida  |
| **Cálculo Vetorial** | v3            | 30 tipos / 6 tópicos | ~70–80%                 | ✅ atingida  |
| **Probabilidade** | v2               | ~30 tipos / 6 tópicos | ~65–75%              | ✅ atingida  |
| **Análise Exploratória** | v3        | ~30 tipos / 5 tópicos | ~85–90%          | ✅ atingida  |

**Infraestrutura comum:** LaTeX e visuais cobrem todos os tipos v2/v3 de CV e AE v3. Smoke test inclui assert de diversidade (≥3 tipos) e visual não-vazio para CV e AE. Seeds showcase v3 para Prob, CV e AE.

---

## Cálculo 1 — estado após v3

### O que está implementado (5 tópicos, 40 cenários)

| Tópico           | Cenários | Tipos |
|------------------|----------|-------|
| Limites          | 9  | algebrico, trig, racional, radical, infinito, infinito-neg, substituicao, exp-log, lhopital |
| Continuidade     | 7  | afim, classificar, completar, lateral, tvi, trig-ponto, rolle |
| Derivadas        | 12 | polinomio, trig, exp-log, produto, quociente, tangente, definicao, taxa-relacionada, implicita, aprox-linear, segunda-teste, inversa-trig |
| Regra da cadeia  | 4  | potencia, trig, exp-log, avancada |
| Otimização       | 8  | parabola, geometrica, crescimento, concavidade, cilindro, caixa, segunda-derivada, esboco |

**Arquivos principais:** `src/domains/calculo/` (generators, solvers, `entities/types.ts`), seeds em `src/infrastructure/engagement/curated-seeds.ts`.

### Veredito

O motor cobre **~85–90%** de um Cálculo 1 típico (limites, derivadas, aplicações básicas). **Não está 100% completo.**

### Lacunas de conteúdo (prioridade para v4+)

| Área | O que falta |
|------|-------------|
| Limites | Teorema do sanduíche (squeeze), limites com `\|x\|`, limites trig em `x → a` (`a ≠ 0`) |
| Derivadas | Diferenciação logarítmica, mais variedade em taxas relacionadas |
| Teoremas | **MVT (Lagrange)** — Rolle existe, MVT não |
| Otimização | Problemas de custo/lucro/receita |
| Integração | Tópico inteiro ainda não existe |
| Rigor | Definição ε-δ (opcional para o público) |
| Esboço | Exercício integrado de esboço (não só teste de concavidade isolado) |

### Lacunas de polish (não bloqueiam uso, mas melhoram UX)

- LaTeX enriquecido para a maioria dos tipos v2/v3
- Gráficos visuais para a maioria dos tipos v2/v3 (só ~8 tipos com graph em `visual/builders/calculo.ts`)
- Gating de dificuldade ainda fraco em alguns templates
- Parâmetros fixos em alguns cenários (ex.: escada 10/6/2 em taxa-relacionada)
- 13 commits locais (theme + Cálculo v2/v3) ainda não enviados ao remoto

### Próximos passos sugeridos (quando retomar)

1. LaTeX + visuais dos tipos v2/v3
2. MVT + squeeze + |x|
3. Seeds showcase v3 já existem; revisar após novos tipos
4. Push quando conveniente

---

## Cálculo Vetorial — estado após v3

### O que está implementado (6 tópicos, 30 cenários)

| Tópico | Cenários | Tipos |
|--------|----------|-------|
| Vetores | 6 | módulo, soma, escalar, unitário, distância, paralelismo |
| Produto escalar | 4 | dot, ângulo, projeção, ortogonalidade |
| Produto vetorial | 3 | cross, área, produto misto |
| Retas/planos | 6 | diretor, paramétrica, plano, dist. ponto–plano, dist. ponto–reta, interseção reta–plano |
| Curvas | 6 | \|r'\|, vetor r', tangente, círculo, comprimento, hélice |
| Campos | 5 | ∇f 2D (3 funções), div 2D, rot 2D, ∇f 3D, div 3D |

**Arquivos principais:** `src/domains/calculo-vetorial/`, LaTeX em `latex/domains/calculo-vetorial.ts`, visuais em `visual/builders/calculo-vetorial.ts`.

### Veredito

Cobertura estimada **~70–80%** de um Cálculo Vetorial 1 típico. Meta roadmap **≥3 cenários/tópico** ✅ em todos os 6 tópicos.

### Lacunas de conteúdo (v4+)

| Área | O que falta |
|------|-------------|
| Vetores | subtração explícita, notação î ĵ k̂ |
| Retas/planos | eq. simétrica, plano por 3 pontos, reta–reta, plano–plano, reversas |
| Curvas | equação da reta tangente, aceleração r''(t), hélice 3D completa |
| Campos | curl 3D, linhas de campo, mais funções no gradiente 3D |
| Disciplina avançada | integrais de linha/superfície, Green, Stokes, Gauss |

### Infraestrutura

| Recurso | Estado |
|---------|--------|
| Solvers | ✅ 6/6 tópicos, 30 tipos |
| LaTeX | ✅ todos os 30 tipos |
| Visuais | ✅ todos os tipos (hélice = projeção xy; campos 3D = componentes) |
| Seeds | ✅ showcase v2 + v3 por tópico |
| Smoke | ✅ 2900/2900 + diversidade ≥3 tipos (v2+) |

---

## Análise Exploratória — estado após v3

### O que está implementado (5 tópicos, ~30 cenários)

| Tópico | Cenários | Tipos |
|--------|----------|-------|
| Tipos de dados | 4 | escala, gráfico adequado, frequência, média por escala |
| Medidas de tendência | 6 | média, mediana, moda, ponderada, escolha da medida, média geométrica |
| Medidas de dispersão | 4 | variância/desvio/amplitude, CV, populacional, MAD |
| Distribuições | 7 | IQR, ler boxplot, quartis, outliers, histograma, assimetria, cinco números |
| Correlação | 6 | Pearson (+/−/fraca), Spearman, interpretação, covariância |

**Arquivos principais:** `src/domains/analise-exploratoria/`, `lib/stats.ts`, LaTeX e visuais dedicados.

### Veredito

Cobertura estimada **~85–90%** de uma Análise Exploratória típica. Meta roadmap **≥3 cenários/tópico** ✅ em todos os 5 tópicos.

### Lacunas de conteúdo (v4+)

| Área | O que falta |
|------|-------------|
| Tendência | média harmônica, percentis como medida |
| Dispersão | quartis como dispersão, boxplot construído passo a passo |
| Distribuições | curva normal teórica, diagrama de ramos-e-folhas |
| Correlação | correlação parcial, diagrama de dispersão com reta de regressão |
| Inferência | amostragem, IC, testes — fora do escopo AE pura |

### Infraestrutura

| Recurso | Estado |
|---------|--------|
| Solvers | ✅ 5/5 tópicos, ~30 tipos |
| LaTeX | ✅ todos os tipos v3 |
| Visuais | ✅ todos os tipos (histograma, boxplot, scatter, linha temporal) |
| Seeds | ✅ showcase v3 por tópico |
| Smoke | ✅ diversidade ≥3 + visual não-vazio |

---

## Cálculo Vetorial — inventário legado (v1, substituído)

<details>
<summary>Estado v1 (histórico)</summary>

### Estado anterior (todos os geradores em **v1**, 1 exercício por tópico)

| Tópico | O que gera hoje | Variação real |
|--------|-----------------|---------------|
| `vetores` | Módulo de um vetor em R² ou R³ | Só números aleatórios; **sempre** “calcule o módulo” |
| `produto-escalar` | `u·v` numérico em R³ | Sem ângulo, projeção ou ortogonalidade |
| `produto-vetorial` | `u × v` numérico em R³ | Sem área de paralelogramo/triângulo |
| `retas-planos` | Vetor diretor `PQ` entre dois pontos | **Só reta**; nome do tópico promete planos, mas não há equação de plano |
| `curvas` | Velocidade `\|r'(t)\|` para `r(t)=(at, t²+b)` | Uma família de curva; sem vetor velocidade, tangente ou comprimento de arco |
| `campos` | Gradiente de `f(x,y)=x²+y²` em um ponto | Função fixa; sem rotacional, divergente ou outros campos |

**Total:** 6 cenários distintos no sistema inteiro (1 por tópico). Meta roadmap: **≥3 por tópico** → **0/6 tópicos** atendem.

### O que a ementa típica de Cálculo Vetorial inclui e ainda falta

#### Vetores
- [ ] Soma, subtração, multiplicação por escalar
- [ ] Vetor unitário / normalização
- [ ] Vetores colineares / paralelos / ortogonais (teste)
- [ ] Distância entre pontos
- [ ] Componentes e notação `î, ĵ, k̂`

#### Produto escalar
- [x] Cálculo numérico `u·v` (único cenário)
- [ ] Ângulo entre vetores (`cos θ = u·v / |u||v|`)
- [ ] Projeção ortogonal de um vetor sobre outro
- [ ] Teste de perpendicularidade

#### Produto vetorial
- [x] Cálculo `u × v` (único cenário)
- [ ] Área do paralelogramo / triângulo
- [ ] Vetor perpendicular a dois dados
- [ ] Produto misto (volume do paralelepípedo) — opcional

#### Retas e planos
- [x] Vetor diretor de reta por dois pontos
- [ ] Equação paramétrica da reta (completa)
- [ ] Equação simétrica / vetorial da reta
- [ ] **Equação do plano** (ponto + normal, ou três pontos)
- [ ] Distância ponto–reta, ponto–plano
- [ ] Interseção reta–plano, reta–reta, plano–plano
- [ ] Posições relativas (paralelas, concorrentes, reversas)

#### Curvas parametrizadas
- [x] Módulo da velocidade em um template fixo
- [ ] Vetor velocidade `r'(t)` (não só o módulo)
- [ ] Vetor tangente / reta tangente
- [ ] Curvas em R³ (hélice, etc.)
- [ ] Comprimento de arco (introdução)
- [ ] Aceleração (opcional)

#### Campos escalares e vetoriais
- [x] Gradiente de `x²+y²`
- [ ] Gradiente de funções variadas (`xy`, `x²y`, trig, etc.)
- [ ] Campo vetorial `F(x,y)` e visualização
- [ ] **Rotacional** (curl) — citado na descrição do tópico
- [ ] **Divergente** — citado na descrição do tópico
- [ ] Linhas de campo / fluxo (visual)

### Infraestrutura

| Recurso | Estado |
|---------|--------|
| Solvers | ✅ 6/6 tópicos |
| Visuais | ✅ 6/6 (`visual/builders/calculo-vetorial.ts`) — bons para o que existe |
| LaTeX | ✅ básico (`latex/domains/calculo-vetorial.ts`) |
| Seeds curadas | ⚠️ só `curated-1` v1 |
| Smoke tests | ✅ passando |

### Veredito Cálculo Vetorial

**Não está completo.** Funciona como MVP: um exercício mecânico por tópico. Cobertura estimada **~35–45%** da ementa. O gap principal é **variação de cenários** (roadmap) e **conteúdo de planos/campos** que o catálogo já anuncia mas não gera.

### Plano de expansão sugerido (v2)

Priorizar cenários com maior impacto pedagógico:

1. **Vetores:** módulo (manter) + soma + unitário + paralelismo
2. **Produto escalar:** dot + ângulo + projeção
3. **Produto vetorial:** cross + área
4. **Retas-planos:** diretor + eq. paramétrica + **eq. do plano** + distância ponto–plano
5. **Curvas:** velocidade escalar + vetor `r'(t)` + tangente
6. **Campos:** gradiente variado + divergente 2D + rotacional 2D

Meta v2: **≥3 cenários/tópico** (18+ tipos no total).

</details>

---

## Probabilidade — inventário completo

### Estado atual (todos os geradores em **v1**)

| Tópico | Cenários hoje | Detalhe |
|--------|---------------|---------|
| `espaco-amostral` | **3 experimentos × 2 perguntas = 6** | moeda, dado, dado-duplo; cardinalidade ou listar |
| `eventos` | **3 operações** | união, interseção, complemento — só **cardinalidades** (`nOmega=20` fixo), não probabilidades |
| `classica` | **1 template** | urna com bolas coloridas; sorteio de uma bola |
| `condicional` | **1 template** | `P(A\|B)` via contagens; 3 histórias fixas |
| `independencia` | **1 template** | “A e B são independentes?” via `\|A∩B\|` vs `\|A\|·\|B\|/|Ω|`; 3 histórias |
| `variaveis-discretas` | **2 perguntas** | `E[X]` ou `P(X=k)` com tabela aleatória |

**Total:** ~11 combinações estruturais. Meta roadmap: **≥4 cenários/tópico** → só **espaço amostral** (6) atende de forma clara; **eventos** (3) fica no limite; os outros **4 tópicos ficam abaixo**.

### Por que parece pouca variação (observação do usuário)

1. **Um template dominante por tópico** — urna, Venn com números, tabela discreta se repetem com outros números, mas o enunciado é estruturalmente igual.
2. **Sem combinatória rica** — não há baralho, permutações, “retirada sem reposição de 2 bolas”, dados com soma, etc.
3. **Eventos não calculam `P(A∪B)`** — só `|A∪B|`; a ponte para probabilidade clássica é fraca.
4. **Condicional e independência** são o mesmo diagrama de Venn com pergunta diferente.
5. **Variáveis discretas** — só esperança e um `P(X=k)`; sem variância, sem `P(X≤k)`, sem distribuições nomeadas.
6. **Dificuldade** altera ranges numéricos, não o tipo de problema.

### O que a ementa típica de Probabilidade 1 inclui e ainda falta

#### Espaço amostral e experimentos
- [x] Moeda, dado, dois dados
- [ ] Baralho (52 cartas, naipes, figuras)
- [ ] Urna como espaço amostral (antes de probabilidade)
- [ ] Espaços maiores (três dados, moeda + dado)
- [ ] Eventos compostos descritos em linguagem natural com contagem real

#### Eventos e operações
- [x] União, interseção, complemento (cardinalidade)
- [ ] Mesmas operações em **probabilidade** `P(A∪B) = P(A)+P(B)-P(A∩B)`
- [ ] Eventos mutuamente exclusivos (identificar e simplificar)
- [ ] Princípio da inclusão-exclusão (3 eventos — opcional)
- [ ] Diagrama de árvore (visual + contagem)

#### Probabilidade clássica
- [x] Urna, uma bola, cor alvo
- [ ] **Retirada sem reposição** (2+ bolas, hipergeométrica intro)
- [ ] **Retirada com reposição**
- [ ] Dado: probabilidade da soma, máximo, etc.
- [ ] Baralho: uma carta, probabilidade de naipe/figura
- [ ] Problemas de contagem (`C(n,k)`, `P(n,k)`) antes de dividir por `|Ω|`
- [ ] Amostragem de comitês, senhas, anagramas (clássica aplicada)

#### Probabilidade condicional
- [x] `P(A|B)` por contagens
- [ ] `P(A|B)` por probabilidades dadas (tabela ou enunciado)
- [ ] **Teorema de Bayes**
- [ ] **Lei da probabilidade total**
- [ ] Problemas em duas etapas (árvore de probabilidade)

#### Independência
- [x] Testar se `P(A∩B) = P(A)P(B)` com cardinalidades
- [ ] Definição com `P` em vez de contagens
- [ ] Independentes vs mutuamente exclusivos (contraste explícito)
- [ ] Independência de mais de dois eventos (opcional)

#### Variáveis aleatórias discretas
- [x] `E[X]`, `P(X=k)` com tabela genérica
- [ ] **Variância** `Var(X)` e desvio padrão
- [ ] `P(X ≤ k)`, `P(a < X ≤ b)`
- [ ] Função de distribuição acumulada `F(x)`
- [ ] Distribuições nomeadas: **Bernoulli**, **Binomial**, **Geométrica**, **Poisson** (intro)
- [ ] `E[aX+b]`, `Var(aX+b)` (opcional)

#### Tópicos ausentes no catálogo (disciplina inteira)
- [ ] Probabilidade 2 / contínua
- [ ] Covariância, correlação
- [ ] Simulação / frequência relativa (Estatística)

### Infraestrutura

| Recurso | Estado |
|---------|--------|
| Solvers | ✅ 6/6 |
| Visuais | ✅ 6/6 — Venn, urna, barras (`visual/builders/probabilidade.ts`) |
| LaTeX | ✅ razoável (`latex/domains/probabilidade.ts`) |
| Seeds curadas | ⚠️ só `curated-1` v1 |
| Utils | `simplificarFracao` em `utils/math.ts` |

### Veredito Probabilidade

**Não está completo** em cobertura nem em variação. O usuário está certo: **há pouca variação perceptível**. Cobertura estimada **~50–60%** da Probabilidade 1 típica. O motor é sólido para o que existe, mas precisa de **expansão v2 com múltiplos `CENARIOS` por tópico** (padrão já usado em Cálculo 1).

### Plano de expansão sugerido (v2)

Meta: **≥4 cenários/tópico** (24+ tipos), priorizando variedade perceptível:

| Tópico | Cenários a adicionar |
|--------|----------------------|
| Espaço amostral | baralho, urna-listar, moeda×dado, três lançamentos |
| Eventos | `P(A∪B)`, `P(A∩B)`, exclusivos, dado com soma |
| Clássica | urna 2 sem reposição, com reposição, dado/soma, baralho, comitês `C(n,k)` |
| Condicional | contagens (manter), tabela `P`, árvore 2 estágios, Bayes |
| Independência | teste cardinalidade (manter), teste com `P`, contraste exclusivo vs independente |
| Var. discretas | `E[X]`, `Var(X)`, `P(X≤k)`, Binomial `B(n,p)` intro |

Depois: seeds showcase v2, asserts de diversidade no smoke (≥3 enunciados distintos em 20 seeds).

---

## Comparativo com Cálculo 1 (referência de “completo”)

Cálculo 1 v3 usa o padrão:

```typescript
const CENARIOS = ["algebrico", "trig", ...] as const;
const tipo = ctx.rng.pick(CENARIOS);
// switch (tipo) { ... }
```

Probabilidade e Cálculo Vetorial ainda usam geradores **monolíticos v1** sem esse padrão. A expansão deve seguir o mesmo modelo de `entities/types.ts` + discriminated union `tipo` + solver switch.

---

## Checklist global de retomada

- [ ] Cálculo 1 v4: MVT, squeeze, LaTeX/visuais v2/v3
- [x] Cálculo Vetorial v3: ≥3 cenários/tópico + LaTeX/visuais/seeds
- [x] Probabilidade v2: ≥4 cenários/tópico + Bayes + binomial
- [x] Análise Exploratória v3: ~30 tipos + LaTeX/visuais/seeds/smoke
- [x] Smoke: assert de diversidade (v2+)
- [ ] Cálculo Vetorial v4: reta–reta, curl 3D, visuais 3D avançados
- [ ] Push dos commits locais

---

## Referências no código

| Disciplina | Domínio | Visuais | LaTeX |
|------------|---------|---------|-------|
| Cálculo 1 | `src/domains/calculo/` | `src/infrastructure/visual/builders/calculo.ts` | `src/infrastructure/latex/domains/calculo.ts` |
| Cálculo Vetorial | `src/domains/calculo-vetorial/` | `src/infrastructure/visual/builders/calculo-vetorial.ts` | `src/infrastructure/latex/domains/calculo-vetorial.ts` |
| Probabilidade | `src/domains/probabilidade/` | `src/infrastructure/visual/builders/probabilidade.ts` | `src/infrastructure/latex/domains/probabilidade.ts` |
| Seeds | `src/infrastructure/engagement/curated-seeds.ts` | | |
| Roadmap variação | `docs/roadmap/06-fase-variacao-geradores.md` | | |
