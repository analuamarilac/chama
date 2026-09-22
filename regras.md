# Chama — Diário de decisões

> Produto: **Chama** · Empresa: **WeFind** · Ano: **2026**
> Design e desenvolvimento: **Ana Luiza Marilac**
>
> Este arquivo é um diário, não um resumo final. É atualizado a cada etapa,
> conforme as decisões são tomadas.

---

## 1. Problema

Hoje, quando uma loja parceira da WeFind precisa falar com o entregador de um pedido,
alguém liga direto para o celular pessoal dele. Isso gera três problemas:

1. **Exposição de dado pessoal** — o telefone particular do entregador circula entre lojas.
2. **Falta de controle operacional** — a operação não sabe que o contato aconteceu.
3. **Ausência de histórico** — não há registro, status nem métrica de atendimento.

O Chama substitui a ligação direta por uma **solicitação de contato registrada**:
a loja descreve o que precisa, o entregador é notificado dentro do canal da WeFind,
e a operação acompanha tudo. O telefone pessoal nunca circula.

---

## 2. Regras fixas de negócio

| ID | Regra |
|----|-------|
| RN01 | O código do pedido é apenas identificador de referência. Não precisa existir em base nem ser validado. |
| RN02 | Não existe lista intermediária de pedidos ou entregadores. A solicitação gera notificação direta para o entregador associado no serviço mockado. |
| RN03 | Toda solicitação cria um registro real no serviço mockado compartilhado. |
| RN04 | O entregador deve ser notificado. O canal precisa ser escolhido e justificado. |
| RN05 | O Admin lista todas as solicitações e mostra se foram atendidas ou não. |
| RN06 | O Admin permite filtro por status, no mínimo. |
| RN07 | `courierPhoneInternal` e `requesterPhone` são dados diferentes e nunca devem ser tratados como o mesmo campo. |
| RN08 | Login e autenticação não fazem parte do MVP. |
| RN09 | As experiências dos três perfis não ficam misturadas em uma única tela. |

---

## 3. Decisões de produto (P01–P04)

### P01 — O que define uma solicitação como atendida?

**Decisão:** ação explícita e única do entregador — botão **"Falei com a loja"** — que grava
`status: 'attended'` e `attendedAt`. Além disso, registra-se `viewedAt` quando o entregador
abre a solicitação, exibido no Admin como "Visualizada", **sem ser um status**.

**Por quê:**

- *Usuário:* o entregador não preenche nada; um toque encerra. Para a loja, "atendida" significa
  que alguém de fato falou com ela — não que alguém abriu uma tela.
- *Negócio:* separar *visualizou* de *atendeu* é o que torna a pendência acionável.
  "Viu há 8 minutos e não atendeu" é um sinal para a operação agir; sem isso, pendente é um buraco preto.
- *Implementação:* uma mutation e dois campos. `viewedAt` não cria status novo nem máquina de estados.

**Descartado neste ciclo:** múltiplos desfechos (resolvido / não consegui contato / cliente ausente).
É melhor produto, mas exige UI de seleção e relatório no Admin — incompatível com o MVP de 2h.
Registrado como recomendação para o próximo ciclo.

### P02 — Quais filtros ajudam o Admin?

**Decisão:** três, nesta ordem — **status** (obrigatório, RN06), **busca por código do pedido**
e **ordenação por data** (mais recentes primeiro, alternável).

**Por quê:**

- *Usuário:* a operação trabalha por exceção. Os caminhos reais são "abro em Pendentes" e
  "a loja ligou reclamando do PED-1042, cadê?".
- *Negócio:* status responde "estamos dando conta?"; busca responde "e esse caso aqui?".
- *Implementação:* filtros vivem na URL (`validateSearch` + Zod), conforme `.ai/frontend/INTEGRATION.md`.
  Ganho colateral: a URL filtrada é compartilhável — exatamente o que uma operação faz no dia a dia.

**Descartado por orçamento:** filtro por período e por canal. Filtro por entregador não se aplica
enquanto houver um único courier mockado (RN02).

### P03 — Qual o estado vazio do Entregador?

**Decisão:** dois estados vazios distintos, separados por abas **Pendentes / Histórico**.

| Situação | Mensagem |
|----------|----------|
| Nunca houve solicitação | "Nenhuma solicitação por aqui. Quando uma loja precisar falar com você, ela aparece nesta tela." |
| Havia pendentes, todas atendidas | "Tudo em dia. Você atendeu todas as solicitações." + atalho para o histórico |

**Por quê:**

- *Usuário:* vazio ambíguo gera desconfiança ("será que quebrou?"). O segundo estado é confirmação
  de trabalho concluído — sensação oposta ao primeiro.
- *Negócio:* o entregador precisa confiar que o app vai avisá-lo. Se não confiar, volta a atender
  pelo telefone pessoal e o produto morre.

### P04 — Qual canal de notificação representar?

**Decisão:** **push in-app** (`notificationChannel: 'push_app'`), representado por contador,
toast (`sonner`) e destaque visual do card novo.

**Por que WhatsApp foi descartado:** o problema que o Chama resolve é *a exposição do telefone
pessoal do entregador*. WhatsApp exige justamente um número de telefone do entregador — ou recria
a exposição, ou obriga a WeFind a manter uma linha por entregador. Escolher WhatsApp enfraqueceria
a tese central do produto.

- *Usuário:* o entregador já está com o app da WeFind aberto durante a jornada.
- *Negócio:* custo zero por mensagem, entrega e leitura rastreáveis, identidade dentro do produto.
  WhatsApp tem custo por conversa e depende de aprovação de template no BSP.
- *Implementação:* nenhuma integração. O campo `notificationChannel` já existe no modelo,
  preparado para multicanal.

**Limitação assumida:** push depende do app aberto ou de permissão concedida. Numa versão real,
a régua seria push → SMS após N minutos sem leitura. Registrado como pendência de Produto.

---

## 4. Identidade visual

A identidade **não foi inventada**. Foi fornecida pela designer em
`Chama-IDV-apresentacao-2026-final.pptx`, além dos arquivos `logo.png` e `simbolo.png`.

### Conceito

Um ponto inicia o contato e o arco mostra o chamado em movimento. O símbolo vive dentro da
letra "C" e mantém o nome reconhecível em tamanhos reduzidos.

### Paleta oficial

| Token | Hex | oklch | Papel |
|-------|-----|-------|-------|
| Azul profundo | `#17233C` | `oklch(0.259 0.050 263.8)` | estrutura, texto, superfícies escuras |
| Coral | `#FF5A3D` | `oklch(0.685 0.206 32.3)` | acionamento da marca |
| Creme | `#FFF8F3` | `oklch(0.983 0.010 58.2)` | fundo de página |
| Verde atendida | `#16856B` | `oklch(0.552 0.102 171.8)` | status atendida |
| Texto de apoio | `#667085` | `oklch(0.544 0.035 265.1)` | texto secundário |
| Borda | `#D9DEE7` | `oklch(0.899 0.013 262.4)` | divisores |

### Tipografia

**Space Grotesk** para marca, títulos e números de destaque · **Inter** para formulários,
tabelas, filtros e textos de apoio. (Definido pela IDV.)

### Acessibilidade — contrastes medidos

Todos os pares foram calculados, não estimados:

| Combinação | Contraste | Veredito |
|------------|-----------|----------|
| Navy sobre creme | 14,88:1 | ✅ AA |
| Navy sobre branco | 15,65:1 | ✅ AA |
| Branco sobre navy | 15,65:1 | ✅ AA |
| Texto de apoio sobre creme | 4,73:1 | ✅ AA |
| **Navy sobre coral** | **5,05:1** | ✅ AA |
| Coral sobre navy | 5,05:1 | ✅ AA |
| Branco sobre verde atendida | 4,56:1 | ✅ AA |
| Branco sobre coral | 3,10:1 | ❌ só texto grande / ícone |
| Coral sobre creme | 2,95:1 | ❌ reprova |

**Decisão derivada:** o botão primário é **coral com texto navy** (5,05:1), não coral com texto
branco (3,10:1, reprova AA). É também a combinação que já existe no próprio logo.

**Tokens de correção criados** porque o coral e o âmbar puros não servem para texto em fundo claro:

- `--brand-coral-text: #CB4731` (4,68:1 sobre branco) — para links e texto em coral.
- `--status-pending-text: #A16600` (4,52:1 sobre creme) — para o rótulo de pendência.

### Uso da cor em status

Conforme a IDV — *"Evite aplicar coral em todos os componentes"*:

| Elemento | Cor |
|----------|-----|
| Ação da marca (CTA principal) | Coral |
| Pendência | Âmbar |
| Atendimento | Verde `#16856B` |

Cor nunca aparece sozinha: todo status combina **cor + texto + ícone**, para não depender
de percepção cromática.

---

## 5. Hipóteses assumidas

Registradas explicitamente em vez de escondidas no código:

- **H01** — Não há base real de pedidos, então o código do pedido é referência textual livre (RN01).
- **H02** — Não há base de entregadores, então toda solicitação é associada a um entregador mockado (RN02).
- **H03** — Como não há autenticação (RN08), o solicitante informa o próprio telefone no formulário.
  Em produção esse dado viria do cadastro da loja.
- **H04** — "Acompanhar as alterações realizadas na visão do entregador" é lido como
  *ver status atualizado e horário do atendimento*, não como log completo de auditoria.
- **H05** — Os dados vivem em memória durante a sessão. Recarregar a página restaura o seed inicial.
- **H06** — **O protótipo deve ser testado em uma única aba**, trocando de perfil pelo seletor.
  O estado em memória pertence ao documento do navegador: duas abas criariam dois estados
  independentes e o fluxo entre perfis não se comunicaria. Por isso a troca de perfil usa
  navegação client-side (`Link` do TanStack Router), nunca recarregamento de página.
  Sincronizar abas exigiria `storage`/`BroadcastChannel` — fora do escopo, já que persistência
  não faz parte do MVP.
- **H08** — A loja da sessão é fixa (`MockedRequester`). Sem autenticação (RN08) não há como
  descobrir qual loja está usando a tela, então o protótipo fixa uma. As solicitações do seed
  pertencem a **outras** lojas — é isso que faz a listagem do Solicitante começar vazia e o
  estado vazio existir de verdade, em vez de ser código inalcançável.
- **H09** — O nome da loja não é digitado no formulário: viria do cadastro da loja em produção,
  como já previsto em H03. Por isso é preenchido pelo serviço, não pelo usuário.
- **H10** — O mock passou a ter **cinco entregadores** e **cinco lojas**. RN02 continua
  respeitada: não existe seleção manual de entregador — toda solicitação criada no protótipo
  nasce associada ao entregador da sessão. Os demais existem para que o painel da operação
  tenha volume plausível para coordenar, o que é o ponto da tela de Admin.
- **H11** — Cada perfil enxerga apenas o que lhe cabe: o Solicitante vê as solicitações da
  própria loja e o Entregador vê a própria caixa de entrada. O Admin vê tudo. Em produção
  esse recorte viria da autenticação (RN08), que está fora do MVP.
- **H07** — Como consequência de H06, a notificação do entregador (P04) é representada como
  **estado persistente** — contador de não lidas e marcação visual de "nova" — e não apenas
  como um toast efêmero, que só apareceria para quem estivesse com a tela aberta no instante
  exato do envio.

---

## 6. Decisões técnicas

- **Stack mantida do template:** React 19 + Vite + TanStack Router + TanStack Query + Tailwind 4
  + shadcn/Radix. Nada foi substituído.
- **Serviço mockado com latência simulada (~350ms).** Sem latência não existe estado de carregamento
  real para demonstrar, e o React Query ficaria decorativo.
- **React Query como estado compartilhado entre os três perfis.** Uma única `queryKey`;
  as mutations invalidam; qualquer visão montada re-renderiza. É assim que as três telas se
  conversam, sem Context e sem `useEffect`.
- **Zero `useEffect` no código do case**, conforme `.ai/frontend/STANDARDS.md`. Estado derivado é
  calculado no render; notificação dispara no `onSuccess` da mutation (evento), não em efeito.
- **Filtros do Admin na URL** via `validateSearch` + Zod.
- **Desvio justificado de `.ai/frontend/INTEGRATION.md`:** o documento descreve `makeHttpRequest`,
  `useToastQuery` e `useToastMutation`, do pacote `@appswefit/xprints-react-web` — que **não está
  no `package.json`** deste template. Foi mantida a *arquitetura em camadas* do documento
  (route → page → page-hook → service hook → service), mas com `useQuery`/`useMutation` nativos
  e `sonner` para toast. Não há backend: o serviço é mockado em memória, então a camada HTTP
  não se aplica.
- **Áreas protegidas respeitadas:** `src/scripts` e `src/routes/xprints` não foram alterados nem criados.
- **Segundo desvio justificado de `INTEGRATION.md`:** o documento manda expor
  `isLoading || isFetching` como sinal único de carregamento. Aqui os dois são separados
  (`isLoading` e `isRefreshing`). Toda mutation invalida a query compartilhada; com os sinais
  colapsados, a lista inteira viraria esqueleto a cada atendimento e fecharia o card que o
  entregador acabou de abrir. `isLoading` cobre a primeira carga, quando não há o que mostrar.
- **Nomenclatura das query keys:** `INTEGRATION.md` usa `QUERY_KEYS`, mas `GLOBAL.md` — que o
  `CLAUDE.md` manda aplicar integralmente — determina PascalCase para objetos com valores
  constantes. Prevaleceu o `GLOBAL.md`: `QueryKeys`.
- **Posição do toast:** rodapé, não topo. O cabeçalho dos perfis é fixo e o toast o cobria.

---

## 7. Problemas pré-existentes do scaffold

Herdados do template, **não introduzidos por esta implementação**:

- `src/scripts/pages/PreviewPage/routes.ts` importa `#/xprints.json`, arquivo que não existe
  (o JSON está em `public/data/xprints.json`). O Vite não quebra porque nada importa a `PreviewPage`
  e ela é removida no tree-shaking; um `tsc --noEmit` acusaria. **Está em área protegida
  (`src/scripts`), portanto não foi corrigido.**
- `src/routes/xprints/` é citado pelo `CLAUDE.md` e pelo `.cursorignore`, mas não existe no
  material recebido. Nada foi criado no lugar.
- `README.md` veio vazio.
- `src/styles.css` importava Fraunces e Manrope do Google Fonts sem usar nenhuma das duas
  (`--font-sans` apontava para Inter), e importava `tw-animate-css` duas vezes. Ambos removidos
  ao reescrever os tokens.
- `src/styles.css` aplicava `min-height` a `#app`, mas o elemento raiz do `index.html` é `#root`
  — a regra nunca teve efeito. Corrigido para `#root`.
- Os componentes de `src/components/ui` (gerados pelo shadcn) acusam avisos de acessibilidade no
  Biome (`useSemanticElements`, `useFocusableInteractive`) em `breadcrumb`, `button-group` e
  outros. São arquivos do template, não foram tocados. **O código escrito para este case passa
  no `biome check` sem avisos.**

### Ajustes feitos no código do case (não pré-existentes)

- `AccordionTrigger` do template não define largura própria. No card do Entregador o botão
  crescia até o tamanho do texto e estourava a viewport (677px em uma tela de 390px), porque
  `truncate` só funciona com a cadeia inteira encolhível. Resolvido com `w-full min-w-0` no uso,
  sem alterar o componente do template.

---

## 8. Fora do escopo do MVP

Autenticação real · banco de dados · persistência entre sessões · envio real de push, SMS ou
WhatsApp · confirmação automática de atendimento · avaliação ou rating · mapa, rota ou rastreamento.

---

## 9. Pendências para Produto, Operações e Engenharia

**Produto**

- Como o código do pedido será associado ao entregador correto em produção?
- O entregador continua sendo o único responsável por declarar o atendimento?
- "Atendida" é definitivo ou reversível?
- Múltiplos desfechos de atendimento (resolvido / sem contato / cliente ausente) entram quando?

**Operações**

- Existe SLA de atendimento? Qual?
- Solicitações não atendidas precisam de escalonamento para a operação?
- Quais perfis podem ver cada telefone, além do recorte atual do Admin?

**Engenharia**

- De onde virá o telefone do solicitante em produção (cadastro da loja)?
- Régua multicanal push → SMS: qual a janela antes do fallback?
- Como tratar falha de envio da notificação?
- Histórico e auditoria das mudanças de status são requisito de compliance?

---

## 10. Telas do Solicitante

A experiência do Solicitante foi dividida em duas telas, em vez de um formulário solto:

- **`/solicitante` — Minhas solicitações.** Listagem com o andamento de cada pedido de contato:
  enviada, vista pelo entregador e atendida. Tem estado vazio próprio e botão para criar.
- **`/solicitante/nova` — Solicitar contato.** Formulário à esquerda e painel de acompanhamento
  à direita.

**Por que a listagem existe:** sem ela, a loja envia a solicitação e fica no escuro — exatamente
a ansiedade que faz alguém pegar o telefone e ligar de novo. Mostrar *"vista pelo entregador às
14:32"* é o que sustenta a promessa do produto de que não é preciso ligar.

### Estados do painel de acompanhamento

| Estado | Quando | O que mostra |
|--------|--------|--------------|
| `idle` | Antes do envio | O que vai acontecer e a garantia de que o telefone do entregador não é exposto |
| `sending` | Durante o envio | Indicador de progresso |
| `sent` | Depois de confirmado | Protocolo, situação "Em andamento", canal de notificação e saídas |

O painel ocupa o mesmo espaço nos três estados, para o layout não saltar no momento do envio.
Usa `aria-live="polite"`: sem isso, quem usa leitor de tela não saberia que o envio concluiu.

### O formulário vira recibo

Depois do envio, o formulário **mantém os valores enviados e trava**, em vez de limpar.
Dois motivos: a pessoa consegue conferir o que mandou, e não existe o risco de reenviar a mesma
solicitação por engano. O botão "Fazer outra solicitação" remonta o formulário limpo — via
`key`, que é o padrão de reset recomendado em `.ai/frontend/STANDARDS.md`, e não por efeito.

### Identidade de sessão

O cabeçalho mostra um chip com a pessoa da sessão. Como RN08 exclui autenticação, o menu desse
chip declara explicitamente que a sessão é simulada e que o perfil é escolhido na tela inicial.
Um avatar com nome, sem esse aviso, sugeriria um login que o protótipo não tem. É também onde
vive a troca de perfil.

---

## 11. App do Entregador

A tela do entregador é apresentada **dentro de uma moldura de celular** a partir de `lg`, com
um painel explicativo ao lado. Abaixo desse ponto a moldura some e o conteúdo ocupa a tela
inteira — desenhar um celular dentro de um celular seria absurdo, e o telefone é o meio real
desse perfil. O conteúdo é renderizado uma única vez; a moldura aparece por CSS, para não
duplicar ids, estado e foco.

É o único perfil sem `ProfileShell`: breadcrumb e chip de sessão não caberiam em 390px. O
cabeçalho do app concentra tudo num menu — sessão simulada, "Como testar" e troca de perfil.

### A tela começa vazia — de propósito

O entregador da sessão (Diego Matias) passou a **iniciar sem nenhuma solicitação**. As doze do
seed foram redistribuídas entre os outros quatro entregadores. Sem isso, o estado vazio que a
tela precisa ter seria código inalcançável: a caixa de entrada abriria sempre cheia.

O fluxo de avaliação fica: abrir o Entregador (vazio) → criar uma solicitação no Solicitante →
voltar e ver a notificação chegar.

### Mudança no gatilho de `viewedAt` (P01)

Antes, a visualização era registrada ao **expandir o card**. No novo desenho o card já mostra
tudo — código, solicitante, telefone e mensagem —, então não existe mais evento de abrir.
O registro passou para o toque em **"Entrar em contato"**, que é o primeiro engajamento
deliberado com a solicitação. Continua sendo evento de usuário tratado no handler, nunca efeito.

**Limitação assumida:** um entregador que lê a mensagem na tela e liga pelo próprio telefone
não registra visualização. Em produção o gatilho natural seria a abertura da notificação push.

### Duas ações, não uma

O design separa **"Entrar em contato"** (liga para a loja, `tel:`) de **"Marcar como atendida"**
(declara o atendimento). P01 continua valendo: ligar não conclui — só a declaração explícita
conclui. A ação de atendimento foi renomeada de "Falei com a loja" para "Marcar como atendida",
seguindo o design.

### Divergência de copy do mockup

O mockup diz *"Quando um cliente solicitar contato"*. Foi implementado como **"Quando uma loja
solicitar contato"**: quem abre solicitações é a loja parceira, e "cliente" já designa o
consumidor final nas mensagens das próprias solicitações. Manter as duas acepções na mesma
tela geraria ambiguidade.

---

## 12. Painel do Admin (CRM)

O Admin deixou de ser uma página única e passou a ter barra lateral e três seções:

| Seção | Rota | Para quê |
|-------|------|----------|
| Solicitações | `/admin` | Indicadores, filtros e a tabela completa |
| Entregadores | `/admin/entregadores` | Carga por entregador e suas linhas internas |
| Configurações | `/admin/configuracoes` | Parâmetros do protótipo, somente leitura |

**Por que só o Admin tem barra lateral:** é o único perfil que passa o turno inteiro na tela e
alterna entre assuntos. Solicitante e Entregador entram para resolver uma coisa e sair — um
cabeçalho simples serve melhor. No mobile a barra vira gaveta, porque uma coluna fixa comeria
metade da largura de uma tabela que já é larga.

### Canal de origem

A tabela ganhou a coluna **Canal**, que registra por onde a loja abriu a solicitação
(`originChannel`: App ou Web). **Não confundir com `notificationChannel`**, que é por onde o
entregador é avisado (P04, push no app). São eixos diferentes da mesma jornada e por isso são
dois campos, não um. Solicitações criadas no protótipo nascem como Web, que é a verdade.

### Filtros

Além de status (RN06) e busca, o painel ganhou **filtro por período** com seletor de intervalo.
Ele estava descartado por orçamento em P02 e voltou porque aparece no design do painel — e
porque "as pendentes desta semana" é uma pergunta real da operação. A busca passou a cobrir
também o nome da loja solicitante. Todos os filtros continuam na URL, então o recorte é
compartilhável por link.

### Ações por linha e ficha de detalhes

Cada linha tem um menu com **Ver detalhes**, **Copiar protocolo** e **Copiar telefone da loja**.
A ficha abre em gaveta lateral com a mensagem completa, os dois contatos (cada um no seu
componente, RN07), os dois canais e a linha do tempo. A tabela serve para varrer muitas linhas;
a gaveta, para entender uma.

---

## 13. Páginas institucionais do protótipo

Além das três visões de perfil, o protótipo tem duas páginas que existem para quem avalia,
não para o produto:

- **Início (`/`)** — seletor de perfil, com o aviso explícito de que a troca de perfis é um
  recurso de avaliação e de que, no produto real, cada perfil tem seu próprio acesso (RN09).
- **Sobre o Chama (`/sobre`)** — versão legível do raciocínio: o problema, o fluxo da solução,
  as quatro decisões de produto com suas justificativas, a regra dos dois telefones (RN07),
  a medição de contraste e os limites do MVP. Serve para que a avaliação do case não dependa
  de abrir o código.
- **Ajuda** — diálogo acessível pelo cabeçalho, com o roteiro de teste e o aviso de aba única
  (H06), que é a informação mais fácil de esquecer e a que mais atrapalha quem testa.

O botão com o nome da autora, no cabeçalho e na página Sobre, abre o portfólio em nova aba.

### Divergência consciente do mockup

O mockup da tela inicial traz o botão principal em coral com texto branco. Foi implementado
com texto **azul profundo**: branco sobre coral dá 3,10:1 e reprova no WCAG AA, enquanto azul
profundo dá 5,05:1. É a mesma decisão já registrada na seção 4, aplicada de forma consistente.

---

## 14. Como o MVP foi verificado

Além de `npm run build` e `npm run check`, o fluxo completo foi exercitado com Playwright
dirigindo o navegador de verdade — 60 verificações, todas passando:

- **Fluxo ponta a ponta:** criar solicitação no Solicitante → aparecer no Entregador marcada
  como nova → expandir (registra visualização) → atender → refletir como *Atendida* no Admin.
- **RN07:** a linha interna do entregador **não** aparece em nenhum ponto da tela do Entregador;
  no Admin, os dois telefones existem em colunas separadas e rotuladas.
- **RN06:** filtro por status altera a URL e esconde os registros de outros status.
- **P02:** busca por código filtra corretamente e a URL filtrada é restaurada ao abrir o link.
- **Formulário:** validação bloqueia envio vazio; o telefone é formatado durante a digitação.
- **Responsivo:** sem scroll horizontal em 390px no Solicitante e no Entregador.
- **Console limpo:** nenhum erro de runtime durante todo o percurso.

O roteiro de teste é um script auxiliar de verificação e não foi versionado no projeto.

---

## 15. Registro de mudanças de decisão

| Quando | O que mudou | Por quê |
|--------|-------------|---------|
| Etapa 0 | Paleta corrigida de `#192439`/`#FE593D` para `#17233C`/`#FF5A3D` | Os primeiros valores foram amostrados dos PNGs e carregavam desvio de antialiasing. A IDV oficial trouxe os valores exatos. |
| Etapa 0 | Tipografia mudou de Manrope para **Space Grotesk** | Recomendação preliminar feita antes de ler a IDV, que já definia Space Grotesk + Inter. |
| Etapa 0 | Status "pendente" deixou de ser coral e passou a **âmbar**; "atendida" passou a **verde `#16856B`** | A IDV determina coral apenas para ação da marca: *"Evite aplicar coral em todos os componentes"*. |
| Entregador | Tela passou a ser apresentada em moldura de celular, com painel explicativo ao lado | Pedido de design. Reforça que a experiência é mobile-first sem esconder o raciocínio de quem avalia no desktop. |
| Entregador | Entregador da sessão passou a iniciar sem solicitações | Sem isso o estado vazio nunca apareceria. As do seed foram para os outros entregadores. |
| Entregador | `viewedAt` deixou de ser registrado ao expandir o card | O card do novo desenho já mostra tudo; não há mais evento de abrir. Passou para o toque em "Entrar em contato". |
| Entregador | "Falei com a loja" virou "Marcar como atendida", e surgiu "Entrar em contato" | Seguindo o design. A separação entre ligar e declarar o atendimento reforça P01. |
| CRM | Admin ganhou barra lateral e foi dividido em três seções | Pedido de design da designer ("algo mais CRM"). A densidade e a permanência na tela justificam a navegação persistente, que os outros perfis não precisam. |
| CRM | Modelo ganhou `originChannel` (App/Web) | A coluna "Canal" do design precisa de um dado que varie. Mantido separado de `notificationChannel` para não misturar "por onde entrou" com "por onde avisa". |
| CRM | Mock passou a ter 5 entregadores, 5 lojas e 12 solicitações | Um painel de operação com duas linhas não demonstra filtro, busca nem carga por entregador. |
| CRM | Filtro por período entrou no escopo | Estava descartado em P02 por orçamento; voltou porque aparece no design e responde a uma pergunta real da operação. |
| Redesenho | Cabeçalho das telas internas passou de navy para claro, com breadcrumb e chip de sessão | Alinhamento ao design da tela de Solicitante enviado pela designer; aplicado aos três perfis para manter consistência. |
| Redesenho | Modelo ganhou `requesterId` e `requesterStoreName` | Sem identificar a loja, a listagem do Solicitante mostraria solicitações de todas as lojas e o estado vazio nunca apareceria. Também permite ao entregador saber qual loja o chamou. |
| Redesenho | Limite da mensagem subiu de 300 para 500 caracteres | O contador do design enviado indica 500. |
| Redesenho | Códigos de pedido do seed passaram de `PED-` para `WF-` | Consistência com o exemplo `WF-48291` do design. |
| Redesenho | Formulário deixou de limpar após o envio | Vira recibo do que foi enviado e evita reenvio acidental. |
| Etapa 0 | Solicitante passou de mobile-first para **desktop-first** | A IDV define: *"Desktop para Solicitante e Admin. Mobile-first para Entregador."* Faz sentido operacional — o operador da loja atende no balcão, com computador. A aplicação segue responsiva. |
