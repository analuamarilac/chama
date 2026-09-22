# INTEGRATION — API Integration Pattern

Reference for wiring a UI listing flow (page + filters + list + mutation) to a backend API in this codebase. Use placeholders consistently: `<Area>` (kebab-case domain folder), `<Feature>` (PascalCase concept), `Item` (single resource type), `service.listFeature(params)`.

## 1. Architecture

```
URL (search params)
   │
   ▼
Route file              routes/<feature>/index.tsx
   │  (TanStack Router; passes-through to Page)
   ▼
Page component          presentation/flows/<area>/pages/<feature>-page/index.tsx
   │  (composes UI, owns local UI state only)
   ▼
Page-local hook         presentation/flows/<area>/pages/<feature>-page/hooks/use<Feature>Data.ts
   │  (parses URL via Zod, computes filters, returns view-model)
   ▼
Service hook (query)    presentation/hooks/services/<area>/useGet<Feature>/index.ts
Service hook (mutation) presentation/hooks/services/<area>/useDelete<Feature>/index.ts
   │  (wraps useToastQuery / useToastMutation, owns query key + invalidation)
   ▼
Service factory         main/services/make<Feature>Service.ts
   │  (returns new <Feature>Service())
   ▼
Service class           domain/services/<area>/index.ts
   │  (one method per endpoint; uses makeHttpRequest)
   ▼
HTTP wrapper            main/infra/http/makeHttpRequest.ts
   │  (injects shared headers, delegates to vendor client)
   ▼
Backend
```

| Layer           | Responsibility                                                                                |
| --------------- | --------------------------------------------------------------------------------------------- |
| Route           | Declare path + component; auth guards via `beforeLoad`. No data fetching.                     |
| Page            | Compose subcomponents, own ephemeral UI state (e.g. `deletingId`), wire handlers.             |
| Page-local hook | Parse URL → typed filters; expose paginated view-model + handlers; route updates back to URL. |
| Service hook    | One per operation; sole owner of `queryKey` and `invalidateQueries`.                          |
| Service factory | Return a fresh service instance. Pure construction, no logic.                                 |
| Service class   | Translate domain DTOs ↔ HTTP request/response. No React, no state.                            |
| HTTP wrapper    | Inject cross-cutting headers; delegate to vendor HTTP client.                                 |
| DTOs            | Type contracts between service and consumer. Colocated with service.                          |

## 2. DTOs

Location: `domain/services/<area>/dtos/`

| File                        | Purpose                | Convention                                                                               |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| `<Verb><Feature>Request.ts` | Request params         | `interface <Verb><Feature>Request { ... }` — fields optional unless required by endpoint |
| `<Feature>.ts`              | Response payload shape | `interface <Feature>ListData { ... }` for list endpoints                                 |
| `index.ts`                  | Barrel                 | `export * from './<file>'` for each DTO                                                  |

Shared models (cross-area entities) live in `domain/models/` and are imported by DTO files.

```ts
// Request DTO — list/filter
export interface List<Feature>Request {
  id?: string | null
  name?: string | null
  sort?: SortOrder
  page?: number
  limit?: number
}

// Request DTO — single-target mutation
export interface Delete<Feature>Request {
  <featureId>: string
}

// Response DTO — list with server-computed pagination
export interface <Feature>ListData {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalItems: number
  totalPages: number
  <items>: Item[]
}
```

Response envelope: HTTP wrapper returns `{ data: <Feature>ListData, message?, statusCode?, ... }`. Consumers access `response?.data?.<items>`.

## 3. Service

One class per `<area>`. File: `domain/services/<area>/index.ts`. Factory: `main/services/make<Feature>Service.ts`.

```ts
import { makeHttpRequest } from '@main/infra/http'
import type { List<Feature>Request, <Feature>ListData, Delete<Feature>Request } from './dtos'

export class <Feature>Service {
  private readonly request = makeHttpRequest
  constructor() {}

  async list<Feature>(params: List<Feature>Request) {
    return this.request<<Feature>ListData>({
      url: '/<area>/<resource>',
      method: 'GET',
      params: { id: params.id, name: params.name, sort: params.sort, page: params.page, limit: params.limit },
    })
  }

  async delete<Feature>(params: Delete<Feature>Request) {
    return this.request({
      url: '/<area>/<resource>',
      method: 'DELETE',
      params: { <featureId>: params.<featureId> },
    })
  }
}
```

Factory:

```ts
import { <Feature>Service } from '@domain/services/<area>'
export function make<Feature>Service() {
  return new <Feature>Service()
}
```

Re-export every factory from `main/services/index.ts`.

HTTP wrapper (single source of cross-cutting headers):

```ts
export function makeHttpRequest<T>(params: HttpRequest) {
  return makeXprintsHttpClient().request<T>({
    ...params,
    headers: { ...params.headers, '<shared-header>': <SHARED_CONSTANT> },
  })
}
```

Service rules:

- Generic param `<T>` on `request` is the **response data type** (the body of `data`).
- Build query params inline in the method. If conditional, accumulate into a `Record<string, string>` and spread.
- Service methods do not throw on non-2xx — they return the wrapped response and let hooks decide.

## 4. Hooks

Location: `presentation/hooks/services/<area>/<hookName>/index.ts`. One hook per operation. Re-export from sibling `index.ts`.

### Query hook

```ts
import { useToastQuery } from '@appswefit/xprints-react-web/hooks'
import { QUERY_KEYS } from '@constants/query-enum'
import { make<Feature>Service } from '@main/services'

export function useGet<Feature>(params?: List<Feature>Request) {
  const service = make<Feature>Service()
  const { data, isLoading, isFetching, isError, refetch } = useToastQuery({
    queryKey: [QUERY_KEYS.<FEATURE>, params?.limit, params?.page, params?.sort],
    queryFn: () => service.list<Feature>(params || {}),
    queryParams: params,
    staleTime: Number.POSITIVE_INFINITY,
  })
  return { data, isLoading: isLoading || isFetching, isError, refetch }
}
```

Conventions:

- Query key: `[QUERY_KEYS.<FEATURE>, ...filterValues]`. Order: stable, primitive values only.
- `isLoading` returned to consumers is `isLoading || isFetching` — refetches are visible to UI.
- Errors are surfaced through `useToastQuery` (toast side-effect) — no try/catch in the hook.
- Service is instantiated inside the hook body (cheap; factory returns a fresh instance).

### Mutation hook

```ts
import { useToastMutation } from '@appswefit/xprints-react-web/hooks'
import { useQueryClient } from '@tanstack/react-query'

export function useDelete<Feature>() {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending, isError, isSuccess } = useToastMutation({
    mutationFn: async (params: Delete<Feature>Request) => {
      const service = make<Feature>Service()
      const response = await service.delete<Feature>(params)
      if (!response?.message) {
        return { ...response, message: '<fallback success message>', type: 'SUCCESS' as const, success: true, statusCode: 200 }
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.<FEATURE>] })
    },
  })
  return { mutate, mutateAsync, isPending, isError, isSuccess }
}
```

Conventions:

- Mutation hooks return only the names actually consumed: `mutate`, `mutateAsync`, `isPending`, `isError`, `isSuccess`.
- Invalidation happens **only** in `onSuccess`, by query-key root (`[QUERY_KEYS.<FEATURE>]`) — invalidates every variant.
- If the backend response lacks a user-facing `message`, normalize it into a SUCCESS envelope so the toast layer renders.
- Service instance lives inside `mutationFn`, not at hook scope.

## 5. Route + URL-Driven Filters

Routes use TanStack Router file-based routing under `app/`. Auth-gated branches go under `_private/`.

The Zod schema for the URL search params lives next to the page-local hook and is **exported** so the route can wire it as `validateSearch`. This makes the route the canonical owner of the URL contract while keeping the schema colocated with the consumer.

```ts
// presentation/flows/<area>/pages/<feature>-page/hooks/use<Feature>Data.ts
export const <feature>SearchSchema = z.object({
  page: z.coerce.number().default(1),
  sort: z.enum(['asc', 'desc']).default('desc'),
})
export type <Feature>Search = z.infer<typeof <feature>SearchSchema>
```

```ts
// app/<area>/_private/<feature>/index.tsx
import { <Feature>Page } from '@flows/private/pages/<feature>-page'
import { <feature>SearchSchema } from '@flows/private/pages/<feature>-page/hooks/use<Feature>Data'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/<area>/_private/<feature>/')({
  component: <Feature>Page,
  validateSearch: <feature>SearchSchema,
})
```

The page-local hook still parses inside `select` so that types resolve correctly regardless of when `routeTree.gen.ts` is regenerated. Once the gen file picks up `validateSearch`, the parse becomes redundant from a runtime standpoint but is harmless and keeps the hook self-contained:

```ts
const search = useSearch({
  from: "/<area>/_private/<feature>/",
  select: (search) => <feature>SearchSchema.parse(search),
});
```

When **not** to add `validateSearch`: routes that don't read or write query params (no filters, pagination, or shareable URL state) do not need the schema. Add it the moment any data starts living in the query string.

URL-as-source-of-truth:

- Reading: `useSearch({ from, select })` parses the URL on every render.
- Writing: `navigate({ to, search: { ...search, ...updates } })` — always merge, never replace.

Filter helper API exposed by the page-local hook:

- `currentPage`, `sortOrder` (or other typed filter values)
- `handlePageChange(newPage: number)`
- `handleSortClick()` (or `handleFilterChange(key, value)`) — these call an internal `updateFilters(updates: Partial<<Feature>Search>)`
- Resetting a filter that affects ordering should also reset `page` to 1.

## 6. UI Wiring

```
<Feature>Page  (index.tsx)
├── use<Feature>Data()                         → URL → view-model + handlers
├── useDelete<Feature>() / use<Verb><Feature>()→ mutations
├── <Feature>LoadingState                      → when isLoading
├── <Feature>EmptyState                        → when list.length === 0
└── <Feature>TableLayout (sortOrder, onSort)   → header + sort affordance
    └── children: rows mapped from data.list   → each row owns its mutation trigger
```

Responsibilities:

- **Page**: orchestration only. Holds short-lived UI state (e.g. `deletingId`), wires handlers, decides which state component to render via a `StateGuard` inline function returning the loading/empty component or `null`.
- **Toolbar/Header (TableLayout)**: receives current filter values as props; emits change callbacks. Stateless re-renders.
- **Rows / cells**: pure render of one `Item` plus per-row action callbacks `(id) => void`.

State location rules:

- Filter state → URL (via page-local hook).
- Server data → React Query (via service hook).
- Transient UI state (which row is mid-mutation, modal open) → `useState` in the page.

## 7. Data Flow — List

1. User navigates to `/<area>/<feature>?page=2&sort=asc`.
2. Route renders `<Feature>Page`.
3. `use<Feature>Data` calls `useSearch` and parses with the Zod schema (defaults applied for missing keys).
4. Hook calls `useGet<Feature>({ page, limit, sort })`.
5. `useGet<Feature>` builds `queryKey = [QUERY_KEYS.<FEATURE>, limit, page, sort]` and runs `service.list<Feature>(params)`.
6. Service issues `GET /<area>/<resource>?page=...&sort=...` via `makeHttpRequest`.
7. HTTP wrapper attaches shared headers; vendor client returns `{ data, ...envelope }`.
8. Hook returns `{ data, isLoading, ... }`. Page-local hook maps `data?.data?.<items>` into the view-model and merges server pagination flags.
9. Page renders `<Feature>TableLayout` with rows, or the loading/empty state component.

## 8. Data Flow — Mutation

1. User clicks the row action (e.g. delete).
2. Page sets `deletingId = item.id` (local state) and calls `mutation.mutateAsync({ <featureId>: item.id })`.
3. Mutation hook runs `service.<verb><Feature>(params)`.
4. Service issues the corresponding HTTP method against `/<area>/<resource>`.
5. On resolved response with no `message`, the hook normalizes a SUCCESS envelope so the toast renders.
6. `onSuccess` calls `queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.<FEATURE>] })`.
7. Active list query refetches; UI re-renders with new data.
8. Page clears `deletingId` in `finally`, then optionally navigates (e.g. previous page if the deleted row was the last on the current page).

## 9. Filter Flow

1. User interacts with a filter control (sort toggle, page button, search input).
2. Handler in page-local hook computes the next partial state, e.g. `{ sort: 'asc', page: 1 }`.
3. Handler calls internal `updateFilters(partial)`.
4. `updateFilters` calls `navigate({ to, search: { ...search, ...partial } })`.
5. URL changes; `useSearch` re-parses; new `currentPage` / `sortOrder` flow through the hook.
6. `useGet<Feature>` sees a new `queryKey` → triggers refetch.
7. `useToastQuery` returns new data; UI re-renders. No imperative refetch call needed.

Rule: filters that change ordering or filtering reset `page` to 1 in the same `updateFilters` call.

## 10. Conventions

- One service class per `<area>`; one method per endpoint.
- Service factories live in `main/services/` and return `new <Feature>Service()`.
- HTTP cross-cutting headers (auth, project id, etc.) injected only in `makeHttpRequest`.
- Service methods return the raw response envelope; never throw for HTTP-level errors.
- DTOs colocated with the service in `domain/services/<area>/dtos/`, exported via a barrel `index.ts`.
- Cross-area domain entities live in `domain/models/`.
- One hook per operation under `presentation/hooks/services/<area>/<hookName>/index.ts`.
- Query keys are tuples starting with `QUERY_KEYS.<FEATURE>` followed by primitive filter values in a stable order.
- All query keys live in a single `QUERY_KEYS` enum-like object in `presentation/constants/query-enum.ts`.
- Loading flag exposed by query hooks is `isLoading || isFetching`.
- Mutation hooks own invalidation; pages never call `invalidateQueries` directly.
- Errors and success toasts are handled by the `useToastQuery` / `useToastMutation` wrappers — no try/catch in hooks or pages, except a local `try/finally` purely to clear transient UI state.
- URL is the source of truth for filter and pagination state; parsed with a Zod schema that supplies defaults via `.default()`.
- Any route that reads or writes query params declares `validateSearch: <feature>SearchSchema` on the route definition. The schema is exported from the page-local hook file so route + hook share a single source of truth for the URL contract.
- The page-local hook keeps `select: (search) => <feature>SearchSchema.parse(search)` to guarantee correct typing independent of `routeTree.gen.ts` regeneration timing.
- Search-param updates always merge: `navigate({ to, search: { ...search, ...partial } })`.
- Pages contain only orchestration + ephemeral UI state. Server state via hooks; filter state via URL.
- Page-local artifacts (constants, types, hooks, components) live next to the page in `presentation/flows/<area>/pages/<feature>-page/`.
- Auth-gated routes live under an `_private/` segment with a `beforeLoad` redirect guard.
