# Formulários: React Hook Form + Zod

```
src/.../YourForm/
├── index.tsx      # Formulário + exportação
├── types.ts       # Interfaces + tipos
└── schema.ts      # Zod schema + infer
```

- Tipo sempre via `z.infer<typeof schema>` — nunca declarar manualmente
- Priorizar o uso de Controller, mas somente quando o input ou componente de input já não Controller
- Priorizar useForm, evitando register nos inputs
