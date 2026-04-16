<!-- Context: implementation-baseline/concepts | Priority: critical | Version: 1.0 | Updated: 2026-04-01 -->

# Concept: Landing Page Architecture

**Purpose**: Capture how the homepage combines server filtering with client URL state.
**Last Updated**: 2026-04-01

## Core Idea

The landing page keeps filters in URL query params and re-loads data from `+page.server.ts` for every filter change. Client state mirrors server-provided params to keep navigation, reloads, and shareable URLs consistent.

## Key Points

- `+page.svelte` owns interactive filter state and debounced search input.
- `goto()` updates query params; no local-only data filtering for main list source.
- `+page.server.ts` parses `q`, `category`, and `level` and builds Drizzle conditions.
- Featured move is fetched independently from active filter params.
- UI loading uses `$navigating` for transition feedback.

## Quick Example

```ts
const params = new URLSearchParams();
if (searchQuery) params.set('q', searchQuery);
if (selectedCategory) params.set('category', selectedCategory);
goto(params.toString() ? `/?${params}` : '/');
```

## 📂 Codebase References

**Implementation**:

- `src/routes/+page.svelte` - Client filter state and URL sync
- `src/routes/+page.server.ts` - Query param parsing and DB filtering

**Types**:

- `src/routes/$types.d.ts` - Route data contracts

## Deep Dive

**Reference**: https://kit.svelte.dev/docs/load

## Related

- concepts/db-union-typing-strategy.md
- guides/add-list-filter-end-to-end.md
- lookup/route-dataflow-reference.md
