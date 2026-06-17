# Fase 8 — Export PDF

## Objetivo

Baixar PDF com enunciado, figuras (SVG→raster) e solução completa.

## Stack candidata

- `@react-pdf/renderer` ou `puppeteer` print da página `/print/[seed]`
- Rota server-side que renderiza HTML estático + `window.print()` client-side (MVP)

## Conteúdo do PDF

1. Cabeçalho (disciplina, tópico, dificuldade)
2. Enunciado (KaTeX pré-renderizado ou imagem)
3. Figuras
4. Todos os passos + resposta final

## Critério de aceite

- Botão “Exportar PDF” gera arquivo válido offline.
