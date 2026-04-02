<!-- Context: implementation-baseline/examples | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Example: Typed Drizzle Select + Map

**Purpose**: Show current pattern for typed join projections.
**Last Updated**: 2026-04-01

## Use Case

Use when join result shape must be stable across D1/libsql environments.

## Code

```ts
const rows = (await (db as any)
	.select({ id: moves.id, categoryId: categories.id, categoryName: categories.name })
	.from(moves)
	.innerJoin(categories, eq(moves.categoryId, categories.id))) as MoveWithCategoryRaw[];

return rows.map((r) => ({ id: r.id, category: { id: r.categoryId, name: r.categoryName } }));
```

## Explanation

1. Assert raw result with shared type.
2. Map to route-facing nested model.
3. Keep UI payload predictable.

## 📂 Codebase References

**Full Implementation**:

- `src/routes/+page.server.ts` - Query and map workflow
- `src/lib/server/db/types.ts` - Raw type definitions

## Related

- concepts/db-union-typing-strategy.md
- errors/drizzle-union-inference.md
