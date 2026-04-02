<!-- Context: implementation-baseline/guides | Priority: critical | Version: 1.0 | Updated: 2026-04-01 -->

# Guide: Add List Filter End-to-End

**Purpose**: Add a new homepage filter with consistent server/client behavior.
**Last Updated**: 2026-04-01

## Prerequisites

- Familiar with `src/routes/+page.svelte` and `+page.server.ts`
- Filter source column available in schema/query

**Estimated time**: 20 min

## Steps

### 1. Add URL param parsing in server load

```ts
const apparatusFilter = url.searchParams.get('apparatus') || '';
if (apparatusFilter) conditions.push(eq(moves.apparatus, apparatusFilter));
```

### 2. Return filter value in load payload

- Add `apparatusFilter` to `return { ... }` from `+page.server.ts`.

### 3. Initialize client state from payload

- In `+page.svelte`, set `$state(data.apparatusFilter || null)`.

### 4. Include param in `updateFilters()`

- Add `params.set('apparatus', selectedApparatus)` when selected.

### 5. Wire UI control to state + update

- Add control in `FilterChips` (or page UI) and trigger update handler.

## Verification

```bash
npm run check && npm run test:unit -- --run
```

## 📂 Codebase References

**Workflow Orchestration**:

- `src/routes/+page.svelte` - Client state and URL updates
- `src/routes/+page.server.ts` - Server condition building

**Integration Points**:

- `src/lib/components/FilterChips.svelte` - Chip interaction model

## Troubleshooting

| Issue                               | Solution                                   |
| ----------------------------------- | ------------------------------------------ |
| Filter UI updates but results don't | Ensure server `conditions.push(...)` added |
| URL updates but state resets        | Initialize state from `data.<filter>`      |

## Related

- concepts/landing-page-architecture.md
- examples/url-filter-sync.svelte.md
