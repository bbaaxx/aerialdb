<!-- Context: implementation-baseline/concepts | Priority: critical | Version: 1.0 | Updated: 2026-04-01 -->

# Concept: DB Union Typing Strategy

**Purpose**: Explain current approach for Drizzle typing with dual DB clients.
**Last Updated**: 2026-04-01

## Core Idea

`getDb(event)` can return different Drizzle client types (D1 or libsql), which weakens inference for `.select({ ... })` joins. Current implementation uses explicit shared result types and targeted assertions, then maps into stable route payload shapes.

## Key Points

- Union return from `getDb` breaks convenient join projection inference.
- Shared result models live in `src/lib/server/db/types.ts`.
- Query results are asserted to `MoveWithCategoryRaw[]` before mapping.
- Route responses expose nested category shape after map step.
- Strategy favors delivery speed with controlled typing debt.

## Quick Example

```ts
const rows = (await (db as any).select({...}).from(moves)) as MoveWithCategoryRaw[];
const data = rows.map((r) => ({ id: r.id, category: { id: r.categoryId, name: r.categoryName } }));
```

## 📂 Codebase References

**Implementation**:

- `src/lib/server/db/index.ts` - Runtime DB client selection
- `src/routes/+page.server.ts` - Assertion + mapping pattern

**Types**:

- `src/lib/server/db/types.ts` - Shared result types

## Deep Dive

**Reference**: https://orm.drizzle.team/docs/select

## Related

- examples/typed-drizzle-select-map.ts.md
- errors/drizzle-union-inference.md
