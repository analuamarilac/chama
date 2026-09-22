- **NUNCA usar `useEffect` para**: derived state (calcule no render), sincronizar prop → state (use a prop direto ou `key={value}` para reset), data fetching (use React Query), reagir a evento do usuário (faça no handler), debounce de input (agende no handler com `useRef`).
- `useEffect` só é aceitável para conectar React a sistemas **externos** (APIs do browser, libs imperativas de terceiros, storage, analytics de mount).
- Antes de escrever um `useEffect`, pergunte: dá pra calcular no render? é só pra `setState` espelhando outro valor? é fetch? é resposta a evento? — se sim para qualquer uma, não use efeito.

## Referências

Ler somente os arquivos abaixo com o seu tipo de trabalho:

- Diretriz tailwind: .ai/frontend/TAILWIND.md
- Criação de componentes: .ai/frontend/COMPONENTS.md
- Criação de formulário: .ai/frontend/FORMS.md
- Integração com API: .ai/frontend/INTEGRATION.md
