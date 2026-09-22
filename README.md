# Chama

**Contato rápido, protegido e rastreável entre lojas parceiras e entregadores.**

Um produto WeFind · Case de Product Design · 2026
Design e desenvolvimento por **Ana Luiza Marilac**

---

## O problema

Quando uma loja parceira da WeFind precisa falar com o entregador de um pedido, hoje alguém
liga direto para o celular pessoal dele. Isso quebra em três pontos:

- **expõe um dado pessoal** do entregador, que circula entre lojas;
- **tira a operação do circuito** — ninguém além dos dois sabe que o contato aconteceu;
- **não deixa rastro** — sem registro, sem status, sem métrica.

O Chama substitui a ligação direta por uma **solicitação de contato registrada**. A loja descreve
o que precisa, o entregador é notificado dentro do app da WeFind e a operação acompanha o
atendimento. O telefone pessoal nunca circula.

## Os três perfis

| Perfil | Rota | O que faz |
|--------|------|-----------|
| **Início** | `/` | Seletor de perfil, ajuda e acesso à página Sobre. Existe apenas para avaliação. |
| **Sobre o Chama** | `/sobre` | O problema, o fluxo da solução e as decisões de produto, em linguagem corrida. |
| **Solicitante** | `/solicitante` | Listagem das solicitações da loja, com o andamento de cada uma. |
| **Nova solicitação** | `/solicitante/nova` | Formulário de pedido de contato, com painel de acompanhamento ao lado. |
| **Entregador** | `/entregador` | App mobile do entregador, apresentado em moldura de celular. Começa vazio e recebe as solicitações criadas no Solicitante. |
| **Admin** | `/admin` | Painel da operação: indicadores, filtros e tabela completa. |
| **Admin — Entregadores** | `/admin/entregadores` | Carga de solicitações por entregador e suas linhas internas. |
| **Admin — Configurações** | `/admin/configuracoes` | Parâmetros em vigor no protótipo. |

As três visões compartilham **o mesmo serviço mockado em memória**. Criar uma solicitação no
Solicitante faz ela aparecer no Entregador; atendê-la no Entregador atualiza o Admin.

## Como rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

Outros comandos:

```bash
npm run build   # build de produção
npm run check   # lint + formatação (Biome)
```

## Como testar o protótipo

> **Use uma única aba.** Os dados vivem em memória, e o estado pertence ao documento do
> navegador — duas abas criam dois estados independentes que não se comunicam. Navegue pelo
> seletor de perfis da página inicial, que usa navegação client-side.

Roteiro sugerido:

1. Abra `/` e escolha **Solicitante**. A listagem começa vazia — as solicitações do seed
   pertencem a outras lojas.
2. Clique em **Nova solicitação**, preencha e envie. Anote o protocolo.
3. Troque para **Entregador**. A tela começa vazia; depois do envio, a solicitação chega com
   a faixa de **nova solicitação recebida**.
4. **"Entrar em contato"** liga para a loja e registra a visualização.
5. **"Marcar como atendida"** conclui a solicitação, que vai para o Histórico.
6. Volte para **Solicitante**: a listagem mostra quando foi vista e quando o contato aconteceu.
7. Troque para **Admin**. O status agora é *Atendida*, com data e hora. Experimente o filtro
   por status e a busca por código — ambos vão para a URL e o link é compartilhável.

O cabeçalho tem um botão **Ajuda** com este mesmo roteiro, e a página
**[Sobre o Chama](/sobre)** explica o problema e as decisões sem precisar abrir o código.

A página inicial existe **apenas para avaliação**. No produto real, cada perfil tem seu próprio
acesso e nunca enxerga as telas dos outros.

## Decisões

O arquivo **[`regras.md`](./regras.md)** é o diário de decisões do projeto. Registra as regras
fixas de negócio, as decisões de produto e UX com suas justificativas, as hipóteses assumidas,
as decisões técnicas, o que ficou fora de escopo e as pendências que seriam levadas para
Produto, Operações e Engenharia.

Resumo das quatro decisões centrais:

| | Decisão | Em uma linha |
|---|---|---|
| **P01** | Atendimento | O entregador declara explicitamente ("Falei com a loja"). Visualizar não conclui. |
| **P02** | Filtros do Admin | Status (obrigatório), busca por código e ordenação por data — todos na URL. |
| **P03** | Estado vazio | Dois estados distintos: "nunca chegou nada" e "você atendeu tudo". |
| **P04** | Notificação | Push no app. WhatsApp foi descartado por exigir o telefone do entregador — justamente o que o produto protege. |

## Stack

React 19 · TypeScript · Vite · TanStack Router · TanStack Query · Tailwind CSS 4 ·
shadcn/Radix · React Hook Form + Zod · Biome

Mantida integralmente do template do projeto. Nada foi substituído.

## Estrutura

```
src/
├─ domain/chama/              # tipos, configuração e serviço mockado compartilhado
├─ presentation/
│  ├─ components/brand/       # logo
│  ├─ components/chama/       # componentes compartilhados entre perfis
│  ├─ constants/              # rotas e chaves de cache
│  ├─ flows/<perfil>/pages/   # uma pasta por perfil
│  ├─ hooks/services/chama/   # um hook por operação; donos da invalidação
│  └─ utils/                  # formatação de data e telefone
├─ routes/                    # rotas finas (TanStack Router, file-based)
└─ components/ui/             # design system do template (shadcn)
```

Convenções seguidas de `.ai/`: um componente por arquivo em `index.tsx` + `types.ts` +
`styles.ts`; estilos com `tailwind-variants`; exports no fim do arquivo; **nenhum `useEffect`**
para estado derivado, busca de dados ou resposta a evento do usuário.

## Identidade e acessibilidade

A paleta e a tipografia vêm da identidade visual do produto: azul profundo `#17233C`,
coral `#FF5A3D`, creme `#FFF8F3` e verde `#16856B` para atendimento; Space Grotesk em marca e
títulos, Inter na interface.

Todos os pares de cor usados em texto foram **medidos**, não estimados. Duas consequências
diretas no código:

- o botão primário é coral com texto **navy** (5,05:1), porque coral com texto branco dá
  3,10:1 e reprova no AA;
- existem tokens específicos (`--brand-coral-text`, `--status-pending`) para os casos em que a
  cor pura não tem contraste suficiente sobre fundo claro.

Status nunca dependem só de cor: combinam sempre **cor + ícone + rótulo**. A tabela do Admin
respeita `prefers-reduced-motion` e os dois telefones — o da loja e a linha interna do
entregador — têm colunas, ícones e componentes próprios, para que nunca sejam confundidos.

## Deploy

Configurado para a Vercel em [`vercel.json`](./vercel.json), com rewrite de SPA para que as
rotas de perfil funcionem em acesso direto.

## Escopo

Não fazem parte deste MVP: autenticação, banco de dados, persistência entre sessões, envio real
de push/SMS/WhatsApp, confirmação automática de atendimento, avaliação, mapa ou rastreamento.
As limitações e o raciocínio por trás de cada corte estão em [`regras.md`](./regras.md).
