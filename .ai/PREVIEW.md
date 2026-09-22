# Preview Generator

## Objetivo
Preencher o array `previews` em `public/data/xprints.json`.

## Estrutura de cada preview
```json
{ "title": "Nome da página", "description": "Descrição breve do propósito", "path": "/rota" }
```

## Como encontrar as rotas

1. Liste os arquivos em `src/routes/` — o router usa **TanStack Router file-based routing**
2. Ignore os diretórios/arquivos: `__root.tsx`, `xprints/`
3. Cada arquivo `index.tsx` ou `[nome].tsx` representa uma rota; o path é derivado do caminho relativo a `src/routes/`
   - `src/routes/index.tsx` → `"/"`
   - `src/routes/about/index.tsx` → `"/about"`
   - `src/routes/products/$id.tsx` → `"/products/$id"`
4. Para cada rota encontrada, leia o componente de página importado para extrair título e descrição contextual

## Regras
- Não alterar nada dentro de `src/routes/xprints/`
- **Ignorar rotas dinâmicas** (arquivos/segmentos com `$`, ex: `$id.tsx`, `$slug/`) a menos que o usuário solicite explicitamente
- Se solicitado, **peça ao usuário que informe os valores** a substituir em cada segmento dinâmico antes de gerar o preview (ex: `$id` → qual valor usar no `path`)
- `description` deve ser uma frase curta em português descrevendo o propósito da tela
- Após montar o array, sobrescreva apenas a chave `previews` em `public/data/xprints.json`
