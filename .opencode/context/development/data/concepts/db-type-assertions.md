<!-- Context: development/data/concepts/db-type-assertions | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Drizzle Union Type Workaround

**Core Idea**: When `getDb()` returns a D1|libsql union type that breaks `.select()` inference, use explicit type assertions on query results rather than trying to narrow the union.

## Key Points

- Root cause: `getDb()` in `src/lib/server/db/index.ts` returns `DrizzleD1 | DrizzleLibSQL` union
- This union breaks `.select({field: ...})` type inference in query results
- Solution: Cast query results with `as TypeName` after the query chain
- Define shared types in `src/lib/server/db/types.ts` for reuse across routes
- The `.map()` transformations in page.server.ts are fine to keep (data reshaping)

## Quick Example

```ts
// src/lib/server/db/types.ts
export type MoveWithCategoryRaw = {
	id: string;
	name: string;
	categoryId: string;
	categoryName: string;
	// ...
};

// In route files:
const movesDataRaw = await db.select({...}).from(moves) as MoveWithCategoryRaw[];
```

## Type Definitions Needed

| Type                      | Use Case                                 |
| ------------------------- | ---------------------------------------- |
| `MoveWithCategoryRaw`     | Moves with category name (no timestamps) |
| `MoveWithCategoryRawFull` | Moves with timestamps                    |
| `SessionWithUser`         | Auth session with user data              |

## Codebase References

| File                         | Role                                   |
| ---------------------------- | -------------------------------------- |
| `src/lib/server/db/index.ts` | Root cause: dual-environment getDb()   |
| `src/lib/server/db/types.ts` | Shared type definitions                |
| `src/routes/+page.server.ts` | Example: moves query needing assertion |

## Related

- `../errors/db-type-errors.md` — 52 TS errors this pattern fixes
- `../../lookup/database-schema.md` — Drizzle schema reference
