- Não criar mais de um componente por arquivo, separe o código para melhor organização. Só crie mais de um se for solicitado.

## Estrutura de Pasta

```
src/.../ComponentName/
├── index.tsx      # Componente + exportação
├── types.ts       # Interfaces + tipos
└── styles.ts      # Estilos
```

## Template Rápido

```bash
# Crie a pasta
mkdir -p src/.../MyComponent

# Crie os arquivos
touch src/.../MyComponent/{index.tsx,types.ts,styles.ts}
```
