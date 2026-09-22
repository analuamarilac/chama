# Guia de Análise de Rotas React para Modelagem de Backend

> **Para quem é este documento:** este é um guia de instruções destinado a uma LLM. Dado o caminho de uma rota de uma aplicação React e acesso ao código-fonte, a LLM deve produzir um relatório estruturado que descreve **todas as entidades, dados e regras de negócio** envolvidas naquela tela. O relatório serve de insumo para o time de backend modelar dados e validar regras.

---

## 1. Objetivo

O propósito da análise é **traduzir uma tela do frontend em uma descrição explícita do seu domínio de dados e regras**. O frontend de uma aplicação React frequentemente carrega regras de negócio e suposições sobre os dados que não estão documentadas em nenhum outro lugar. A LLM deve agir como um arqueólogo: extrair esse conhecimento implícito do código e apresentá-lo de forma que um analista de backend, **sem nunca ter visto a tela**, consiga entender quais entidades existem, como elas se relacionam e quais regras governam seus dados.

A análise é **insumo**, não solução. O documento gerado descreve o que a tela precisa e o que ela faz; **cabe ao analista de backend tirar as conclusões** sobre como isso será implementado. Por isso a LLM não deve propor desenho de API (endpoints, métodos HTTP, rotas, nomes de serviços, contratos): isso é decisão do analista.

O entregável tem dois focos principais:

1. **Modelagem de dados e entidades** — quais objetos de domínio a tela manipula, seus atributos, tipos, obrigatoriedade e relacionamentos.
2. **Regras de negócio** — validações, cálculos, condições, permissões e fluxos que o frontend aplica e que o backend precisa conhecer (para replicar, para validar, ou para confirmar que já cobre).

A análise **não** é uma revisão de código frontend. Layout, CSS, acessibilidade e performance de renderização estão fora de escopo, exceto quando revelam uma regra de negócio.

---

## 2. Entradas necessárias

Antes de iniciar, a LLM deve ter:

- **O caminho da rota** a ser analisada (ex.: `/pedidos/:id`, `/checkout`, `/admin/usuarios`).
- **Acesso ao código-fonte** da aplicação React (repositório ou pasta).

Se a rota não for fornecida com clareza, ou se o código não estiver acessível, a LLM deve **pedir esses itens antes de prosseguir** — nunca inventar a estrutura do projeto.

---

## 3. Princípios da análise

Estes princípios valem para todo o relatório:

- **Baseie-se exclusivamente em evidências diretas.** Toda afirmação sobre uma entidade ou regra deve ser ancorada em um trecho real do código. Cite o arquivo e, quando possível, a linha. **Se não houver evidência direta, o dado não entra no relatório.**
- **NUNCA inferir — sempre perguntar.** A LLM não deve deduzir, supor ou inferir nada com base em nomes de variáveis, contexto, convenções ou intuição. Se um dado não puder ser lido diretamente do código (schema, tipo TypeScript, constante, chamada explícita), a LLM deve **parar e perguntar ao usuário** antes de continuar. Inferências e suposições são proibidas no relatório.
- **Dúvidas bloqueiam o relatório.** Antes de redigir qualquer seção, a LLM deve listar todas as suas dúvidas e perguntar ao usuário. Só deve prosseguir após receber respostas suficientes para confirmar os dados como explícitos. Não existe nível de "baixa confiança" que justifique incluir algo no relatório sem confirmação.
- **Pense como backend.** Ao descrever um campo, pergunte: "que tipo de coluna/atributo isso seria? é obrigatório? tem default? é único? é derivado?". O objetivo é alimentar modelagem, não descrever a UI.
- **Não desenhe a API.** Não proponha endpoints, métodos HTTP, rotas, nomes de serviços nem contratos de API. Descreva *o que* a tela precisa de dados e *quais regras* ela aplica — o *como* (a solução técnica) é conclusão do analista de backend. Se o código já contém uma chamada concreta a um serviço existente, isso pode ser anotado apenas como evidência, nunca como recomendação de desenho.
- **Distinga concern de frontend de concern de backend.** Um estado de "menu aberto/fechado" é só frontend. Uma regra de "pedido só pode ser cancelado se status = PENDENTE" é de domínio e deve ir para o relatório.
- **Seja exaustivo com fatos, preciso com dúvidas.** É melhor interromper a análise e perguntar ao usuário do que incluir no relatório algo que não foi confirmado diretamente no código.

---

## 4. Metodologia de análise (passo a passo)

A LLM deve seguir esta sequência. Cada passo alimenta o seguinte.

### Passo 1 — Localizar a definição da rota e o componente de entrada

A aplicação pode usar diferentes estratégias de roteamento. Identifique qual é o caso:

- **React Router** — procure por `createBrowserRouter`, `<Routes>`, `<Route path=...>`, ou arquivos como `routes.tsx` / `App.tsx`. O `element`/`Component` da rota é o componente de página.
- **Roteamento por arquivos (Next.js Pages Router)** — a rota corresponde a um arquivo em `pages/`. `pages/pedidos/[id].tsx` ↔ `/pedidos/:id`.
- **Next.js App Router** — a rota corresponde a uma pasta em `app/` com um `page.tsx`. Verifique também `layout.tsx`, `loading.tsx` e `error.tsx` associados.
- **Remix / TanStack Router / outros** — identifique a convenção equivalente.

Registre: arquivo da definição da rota, parâmetros de rota (ex.: `:id`), query params esperados, e o arquivo do **componente de página**.

### Passo 2 — Mapear a árvore de componentes

A partir do componente de página, percorra recursivamente os componentes filhos relevantes. O objetivo não é desenhar a UI inteira, mas encontrar **onde os dados entram e onde as regras vivem**. Dê atenção especial a:

- Formulários e seus campos.
- Tabelas, listas e cards (cada um costuma representar uma entidade ou coleção).
- Componentes que recebem dados via props vindos de uma chamada de API.
- Modais e drawers acionados na tela (frequentemente disparam mutações).

### Passo 3 — Rastrear a origem e o destino dos dados

Esta é a parte mais importante para a modelagem. Encontre **todos os pontos onde a tela lê ou escreve dados**. Procure por:

- **Chamadas HTTP diretas** — `fetch(...)`, `axios.get/post/put/patch/delete`, instâncias de cliente HTTP.
- **Hooks de data fetching** — `useQuery`, `useMutation`, `useInfiniteQuery` (TanStack Query / React Query), `useSWR`, `useQuery`/`useMutation` do Apollo (GraphQL).
- **Camada de serviços** — pastas como `services/`, `api/`, `repositories/`, `gateways/`, `http/`. Funções como `getPedido(id)`, `criarUsuario(payload)`.
- **Loaders / data fetching no servidor** — `loader` do React Router, `getServerSideProps` / `getStaticProps` do Next.js, Server Components (`async function Page()`), `fetch` em componentes server.
- **Estado global** — stores Redux, Zustand, Jotai, Recoil, ou Context Providers que abastecem a tela.
- **WebSocket / SSE / polling** — fontes de dados em tempo real.

Para cada interação encontrada, registre, **do ponto de vista do domínio**: que dado a tela precisa, o que ela fornece para obtê-lo ou registrá-lo, o que espera receber, e quando isso acontece (no carregamento da tela, ao submeter um formulário, ao clicar em um botão, etc.). O foco é a *necessidade de dados* — não o desenho da API. Não registre nem proponha métodos HTTP, rotas ou contratos; detalhes técnicos concretos vistos no código (uma chamada já existente, por exemplo) entram apenas como evidência no campo "origem no código".

### Passo 4 — Identificar as entidades de domínio

Com os dados mapeados, identifique os **objetos de domínio**. As melhores fontes para isso são:

- **Tipos TypeScript** — `interface Pedido`, `type Usuario`, definições em arquivos `types.ts` / `models/` / `dtos/`. Estes são a fonte mais confiável de atributos e tipos.
- **Formatos de resposta da API** — o shape do JSON consumido revela a entidade mesmo sem tipos.
- **Campos de formulários** — cada input mapeia para um atributo; o `name` do campo costuma ser o nome do atributo.
- **Colunas de tabelas e propriedades exibidas em listas/cards.**
- **Validações e transformações** — confirmam tipos e obrigatoriedade.

Agrupe atributos relacionados em entidades coerentes. Distinga **entidades** (objetos de domínio com identidade própria, ex.: `Pedido`, `Cliente`, `Produto`) de **objetos de valor / DTOs** (estruturas auxiliares sem identidade, ex.: `Endereco`, `FiltroDeBusca`, `LinhaDoPedido`). Identifique **relacionamentos** observando aninhamento de objetos, IDs referenciados (`clienteId`) e listas embutidas.

### Passo 5 — Extrair as regras de negócio

Regras de negócio raramente estão rotuladas como tal. Elas se escondem em vários lugares. Inspecione sistematicamente (ver o checklist da seção 5) e, para cada regra encontrada, registre o gatilho, a condição e o comportamento esperado.

### Passo 6 — Identificar fluxos e estados da tela

Mapeie os estados que a tela pode assumir (carregando, vazio, erro, sucesso, sem permissão) e os fluxos de ação do usuário (ex.: "preencher formulário → validar → submeter → confirmar"). Foque nos estados e transições que **dependem de dados ou regras do backend**, não em estados puramente visuais.

### Passo 7 — Consolidar lacunas e perguntar ao usuário

Liste tudo que ficou ambíguo, contraditório ou não rastreável. **Antes de redigir o relatório, a LLM deve apresentar essas perguntas ao usuário e aguardar resposta.** Apenas após obter esclarecimentos suficientes a LLM deve prosseguir para a redação. Itens não esclarecidos ficam registrados na Seção 6 como perguntas abertas — nunca são incluídos nas outras seções do relatório.

---

## 5. Onde as regras de negócio se escondem (checklist)

A LLM deve verificar **cada um** destes pontos. Eles são as fontes mais comuns de regras de negócio implícitas:

- **Schemas de validação** — `zod`, `yup`, `joi`, `superstruct`, ou regras inline de `react-hook-form` / `Formik`. Revelam obrigatoriedade, formatos, tamanhos mínimos/máximos, faixas numéricas, padrões (regex), enums.
- **Renderização condicional** — `{condicao && <X/>}`, ternários, `switch`. Mostram quando algo aparece e sob quais condições — frequentemente uma regra ("só exibe o botão de aprovar se o usuário for gestor").
- **Habilitar / desabilitar** — `disabled={...}`, campos somente leitura. Indicam pré-condições ("não pode editar um pedido já faturado").
- **Cálculos e valores derivados** — `useMemo`, funções utilitárias, expressões aritméticas. Ex.: total = soma dos itens + frete − desconto. O backend pode precisar replicar ou ser a fonte de verdade desses cálculos.
- **Controle de acesso** — checagens de papel/permissão (`user.role`, `hasPermission(...)`), *feature flags*, rotas protegidas. Revelam regras de autorização.
- **Valores default e iniciais** — `defaultValues`, estado inicial de `useState`, valores pré-preenchidos. Indicam defaults que o backend talvez deva aplicar.
- **Transformações antes de enviar/exibir** — formatação de datas, conversão de moeda, mapeamento de enums para rótulos, normalização de payload. Revelam diferença entre o modelo de UI e o modelo de domínio.
- **Máscaras e formatações de input** — CPF, CNPJ, telefone, moeda. Indicam o formato canônico esperado e validações.
- **Tratamento de erros** — `try/catch`, checagem de `status` HTTP, mensagens de erro específicas. Revelam códigos/erros que o backend retorna e como devem ser interpretados.
- **Limites de UI** — paginação (`pageSize`), `maxLength`, limites de upload, debounce de busca. Podem refletir restrições do backend.
- **Efeitos colaterais** — `useEffect` que dispara chamadas, refetch após mutação, invalidação de cache. Mostram dependências entre ações.
- **Ordenação, filtros e busca** — quais campos são filtráveis/ordenáveis; sugere índices e parâmetros de query no backend.
- **Estados de máquina** — bibliotecas como XState ou enums de status manipulados na tela revelam o ciclo de vida de uma entidade.
- **Constantes e enums** — arquivos de `constants`, `enums`, listas de opções de `select`. Definem os valores válidos de um campo.
- **Comentários e nomes** — comentários `// TODO`, `// regra:`, nomes de funções (`validarLimiteDeCredito`) frequentemente nomeiam a regra diretamente.

---

## 6. Convenções do relatório

Para manter consistência, o relatório deve adotar:

**Identificadores estáveis.** Cada entidade recebe um código (`ENT-01`, `ENT-02`...) e cada regra de negócio recebe um código (`RN-01`, `RN-02`...), para referência cruzada.

**Somente dados explícitos.** O relatório contém apenas dados que puderam ser lidos diretamente do código (schemas, tipos TypeScript, constantes, chamadas explícitas a serviços). Não existe nível de confiança "Inferido" ou "Suposição" no relatório — se um dado não for explícito, a LLM deve perguntar ao usuário antes de incluí-lo. A coluna "Origem" em todas as tabelas é obrigatória e deve sempre apontar para o arquivo (e linha, quando possível) de onde o dado foi lido.

**Evidência.** Toda afirmação relevante cita a origem no formato `caminho/do/arquivo.tsx` (com linha, se possível).

**Tipos neutros.** Ao descrever atributos, use tipos agnósticos de linguagem (`string`, `inteiro`, `decimal`, `booleano`, `data`, `data-hora`, `enum`, `UUID`, `objeto`, `lista<...>`) — não tipos específicos de TypeScript ou de um banco.

**Português objetivo.** Descreva regras de forma declarativa: "Um pedido só pode ser cancelado quando seu status é `PENDENTE` ou `EM_SEPARACAO`."

---

## 7. Estrutura do entregável

O relatório de saída é um documento markdown com **as seções fixas abaixo, nesta ordem**. Se uma seção não tiver conteúdo, mantenha-a e escreva "Nada identificado" — não a omita. O **Anexo A** traz o template preenchível que materializa essa estrutura: a LLM deve produzir o relatório copiando o template e preenchendo cada campo. As descrições abaixo explicam o conteúdo esperado de cada seção.

### Seção 0 — Identificação

Cabeçalho com: rota analisada, arquivo do componente de página, estratégia de roteamento detectada, parâmetros de rota e query params, data da análise e versão/commit do código (se disponível).

### Seção 1 — Resumo executivo

De 1 a 3 parágrafos, em linguagem acessível, respondendo: o que esta tela faz do ponto de vista de negócio, quais entidades principais ela manipula e quais são as regras de negócio mais críticas. Um gestor de backend deve entender o essencial lendo só esta seção.

### Seção 2 — Necessidades de dados

Esta seção descreve **quais dados a tela precisa consumir e produzir, e em que momento** — sem propor como o backend deve atendê-los. É insumo para o analista decidir o desenho da solução. Para cada interação de dados identificada no Passo 3, descreva em tabela:

| Campo | Conteúdo |
|---|---|
| Identificador | `DAD-01` |
| Natureza | Leitura (a tela consome dados) / Escrita (a tela registra ou envia dados) |
| Disparo | Quando ocorre (carregamento da tela, submit de formulário, clique, intervalo de polling...) |
| Dados de entrada | O que a tela fornece para obter ou registrar a informação (parâmetros de rota, filtros, campos preenchidos) |
| Dados resultantes | O que a tela espera obter ou efetivar (resumido; detalhar atributos na Seção 3) |
| Entidades envolvidas | Códigos `ENT-xx` relacionados |
| Origem no código | Arquivo(s) e linha(s) onde a interação foi lida diretamente no código |

Descreva cada necessidade em termos de domínio — por exemplo, "ao abrir a tela, é necessário obter os dados de um Pedido a partir do identificador da rota" — e **não** em termos de desenho de API (sem métodos HTTP, rotas ou contratos). Se a aplicação obtém dados via Server Components ou loaders, registre isso como observação.

### Seção 3 — Entidades de domínio

O coração do entregável. Para **cada entidade**, apresente:

- **Código e nome** (`ENT-01 — Pedido`).
- **Descrição** — a responsabilidade da entidade no domínio.
- **Classificação** — Entidade / Objeto de valor / DTO de UI.
- **Tabela de atributos**:

| Atributo | Tipo | Obrigatório | Default | Descrição / regra | Origem |
|---|---|---|---|---|---|
| `id` | UUID | Sim | — | Identificador único | `types/pedido.ts` |
| `status` | enum | Sim | `PENDENTE` | Valores: PENDENTE, PAGO, CANCELADO | `constants/status.ts` |

- **Identificador(es)** — qual campo identifica a entidade.
- **Relacionamentos** — lista no formato "`Pedido` 1—N `ItemDoPedido`", "`Pedido` N—1 `Cliente` (via `clienteId`)".
- **Operações observadas na tela** — quais ações CRUD a tela realiza sobre a entidade (criar, ler, atualizar, excluir, listar).

Inclua, ao final da seção, um **diagrama textual de relacionamentos** (lista de relações ou bloco mermaid `erDiagram`) para visão geral.

### Seção 4 — Regras de negócio

Para **cada regra** identificada (via checklist da seção 5), apresente:

| Campo | Conteúdo |
|---|---|
| Código | `RN-01` |
| Nome | Título curto da regra |
| Tipo | Validação / Cálculo / Autorização / Fluxo de estado / Restrição de dados / Default |
| Entidade(s) | Códigos `ENT-xx` afetados |
| Gatilho | O que aciona a verificação da regra |
| Condição | A condição lógica, declarada de forma precisa |
| Comportamento esperado | O que acontece quando a condição é/não é satisfeita |
| Implicação para o backend | O backend deve **aplicar**, **validar**, **fornecer dado para** ou apenas **estar ciente** da regra |
| Origem no código | Arquivo(s) e linha(s) onde a regra foi lida diretamente no código |

Agrupe as regras por tipo para facilitar a leitura. Para cálculos, escreva a fórmula explicitamente.

### Seção 5 — Fluxos e estados

Descreva os principais fluxos de ação do usuário na tela e o ciclo de vida das entidades centrais. Use uma lista de passos ou um diagrama mermaid (`flowchart` ou `stateDiagram`). Foque em transições que dependem de dados ou regras do backend (ex.: estados de um `Pedido`: `PENDENTE → PAGO → EM_SEPARACAO → ENVIADO → ENTREGUE`, com `CANCELADO` como ramo). Inclua os estados de tela relevantes (carregando, vazio, erro, sem permissão) quando refletirem respostas do backend.

### Seção 6 — Lacunas e perguntas para o time

Lista objetiva de tudo que não pôde ser determinado com certeza a partir do código. **Atenção: esta seção registra apenas perguntas abertas — nenhum dado desta seção deve ter sido incluído nas seções anteriores do relatório.** Se algo chegou aqui, significa que a LLM perguntou ao usuário e não obteve resposta suficiente, ou que o item foi identificado após a redação como algo que merece validação pelo time.

- Dados usados na tela cuja origem não foi encontrada no código.
- Contradições entre o código e o comportamento esperado.
- Comportamentos que parecem responsabilidade do backend mas não estão visíveis no frontend (ex.: cálculo que pode ser feito no servidor).
- Perguntas diretas e numeradas para o time de produto/backend responder.

### Seção 7 — Glossário

Tabela com os termos de domínio usados no relatório e seus significados, para alinhar vocabulário entre frontend, backend e produto.

---

## 8. Boas práticas e armadilhas a evitar

- **Não confundir estado de UI com entidade de domínio.** `isModalOpen`, `activeTab`, `isLoading` não são entidades.
- **Não tratar DTO de tela como entidade final.** O frontend pode achatar ou combinar entidades para exibição; sinalize quando o modelo de UI divergir do provável modelo de domínio.
- **Não assumir que o frontend é a fonte de verdade.** Uma validação no frontend pode estar incompleta ou divergir do backend. O relatório descreve o que o frontend *faz*, e cabe ao backend decidir o que é canônico — deixe isso claro.
- **Atenção a regras duplicadas.** A mesma regra pode aparecer em vários componentes; consolide em uma única `RN-xx`.
- **Cuidado com dados mockados.** Fixtures, mocks e dados de teste podem parecer reais; verifique se a fonte é uma API de verdade.
- **GraphQL exige atenção extra.** Em GraphQL, a *query* define exatamente quais campos a tela usa — pode ser um subconjunto da entidade. Registre tanto os campos consumidos quanto o tipo completo, se acessível no schema.
- **Não documentar o que é irrelevante para backend.** Animações, breakpoints e estilos não entram no relatório.
- **Quando em dúvida, SEMPRE pergunte ao usuário antes de continuar** — nunca coloque dados não confirmados no relatório, mesmo marcados como inferência ou suposição. A dúvida bloqueia a redação até ser resolvida.

---

## 9. Resumo do processo

1. Receber a rota e confirmar acesso ao código.
2. Localizar a definição da rota e o componente de página (Passo 1).
3. Mapear a árvore de componentes relevante (Passo 2).
4. Rastrear todas as entradas e saídas de dados (Passo 3).
5. Identificar as entidades de domínio e seus atributos **apenas com base em evidências diretas no código** (Passo 4).
6. Extrair as regras de negócio usando o checklist da seção 5 (Passo 5).
7. Mapear fluxos e estados (Passo 6).
8. Consolidar lacunas e dúvidas (Passo 7). **Antes de redigir o relatório, apresentar ao usuário todas as perguntas abertas e aguardar resposta.**
9. Montar o relatório a partir do template do Anexo A, seguindo as seções fixas da seção 7, incluindo **apenas dados confirmados diretamente no código ou esclarecidos pelo usuário**.
10. Revisar: toda afirmação tem origem direta no código citada? Nenhum dado foi inferido ou suposto? Lacunas abertas estão na Seção 6? Nenhum endpoint ou desenho de API foi sugerido?
11. Salvar o documento gerado em `public/docs/<rota-do-url>/README.md`

O sucesso da análise se mede por uma pergunta: **um analista de backend consegue, lendo apenas o relatório, modelar os dados e tirar suas conclusões sobre as regras desta tela sem precisar abrir o código React?**

---

## Anexo A — Template do relatório de análise

A LLM deve produzir o relatório copiando o bloco abaixo e substituindo cada marcador `‹…›` pelo conteúdo apurado. Repita os blocos `DAD-xx`, `ENT-xx` e `RN-xx` quantas vezes for necessário. Mantenha todas as seções, mesmo que vazias (escreva "Nada identificado").

```markdown
# Análise da Rota: ‹/caminho/da/rota›

## 0. Identificação
- Rota analisada: ‹/caminho/da/rota›
- Parâmetros de rota: ‹:id, ... ou "nenhum"›
- Query params: ‹lista ou "nenhum"›
- Data da análise: ‹AAAA-MM-DD›

## 1. Resumo executivo
‹1 a 3 parágrafos em linguagem de negócio: o que a tela faz, quais entidades principais
manipula e quais são as regras de negócio mais críticas.›

## 2. Necessidades de dados

### DAD-01 — ‹nome da necessidade de dado›
- Natureza: ‹Leitura / Escrita›
- Disparo: ‹quando ocorre›
- Dados de entrada: ‹o que a tela fornece — parâmetros, filtros, campos›
- Dados resultantes: ‹o que a tela espera obter ou efetivar›
- Entidades envolvidas: ‹ENT-xx, ...›

### DAD-02 — ‹...›
‹repetir o bloco›

## 3. Entidades de domínio

### ENT-01 — ‹Nome da entidade›
- Descrição: ‹responsabilidade da entidade no domínio›
- Classificação: ‹Entidade / Objeto de valor / DTO de UI›
- Atributos:

| Atributo | Tipo | Obrigatório | Default | Descrição / regra | Origem |
|---|---|---|---|---|---|
| ‹nome› | ‹tipo neutro› | ‹Sim / Não› | ‹valor ou —› | ‹descrição ou regra associada› | ‹arquivo:linha› |

- Identificador(es): ‹campo(s) que identificam a entidade›
- Relacionamentos: ‹ex.: ENT-01 1—N ENT-02; ENT-01 N—1 ENT-03 (via campo `xId`)›
- Operações observadas na tela: ‹Criar / Ler / Atualizar / Excluir / Listar›

### ENT-02 — ‹...›
‹repetir o bloco›

### Diagrama de relacionamentos
‹lista de relações entre entidades ou um diagrama (ex.: mermaid erDiagram)›

## 4. Regras de negócio

### RN-01 — ‹nome curto da regra›
- Tipo: ‹Validação / Cálculo / Autorização / Fluxo de estado / Restrição de dados / Default›
- Entidade(s): ‹ENT-xx, ...›
- Gatilho: ‹o que aciona a verificação da regra›
- Condição: ‹a condição lógica, declarada de forma precisa›
- Comportamento esperado: ‹o que acontece quando a condição é / não é satisfeita›
- Implicação para o backend: ‹Aplicar / Validar / Fornecer dado para / Estar ciente›
- Origem no código: ‹arquivo:linha›

### RN-02 — ‹...›
‹repetir o bloco; agrupar as regras por tipo›

## 5. Fluxos e estados
‹lista de passos dos principais fluxos do usuário e/ou diagrama (ex.: mermaid flowchart
ou stateDiagram). Inclua o ciclo de vida das entidades centrais e os estados de tela
relevantes — carregando, vazio, erro, sem permissão — quando refletirem dados do backend.›

## 6. Lacunas e perguntas para o time
1. ‹dado usado na tela cuja origem não foi encontrada no código›
2. ‹contradição entre código e comportamento esperado›
3. ‹pergunta objetiva para o time de produto ou backend›
‹...›

## 7. Glossário
| Termo | Significado |
|---|---|
| ‹termo de domínio› | ‹definição› |
```
