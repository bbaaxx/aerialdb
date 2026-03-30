<!-- Context: development/data/errors/db-type-errors | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Drizzle Union Type Errors

**Symptom**: 52 TypeScript errors across route files, all caused by `getDb()` returning a D1|libsql union type that breaks `.select({field: ...})` type inference.

## Root Cause

`src/lib/server/db/index.ts` — `getDb()` returns `DrizzleD1 | DrizzleLibSQL` union. Drizzle ORM can't infer the correct type when the driver is a union.

## Affected Files

| File                                            | Error Count | Query Type             |
| ----------------------------------------------- | ----------- | ---------------------- |
| `src/lib/server/auth.ts`                        | 1           | `validateSessionToken` |
| `src/routes/+page.server.ts`                    | 10          | moves select           |
| `src/routes/admin/+page.server.ts`              | 1           | moves select           |
| `src/routes/api/search/+server.ts`              | 10          | moves select           |
| `src/routes/moves/[id]/+page.server.ts`         | 12          | move select            |
| `src/routes/admin/+page.svelte`                 | 10          | consuming typed data   |
| `src/routes/+page.svelte`                       | 3           | consuming typed data   |
| `src/routes/admin/moves/new/+page.svelte`       | 2           | form data types        |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | 3           | form data types        |

## Fix

1. Create `src/lib/server/db/types.ts` with shared type definitions
2. Add `as TypeName` assertions to all affected queries
3. Svelte file errors should resolve automatically once server load functions return properly typed data

## Exit Criteria

- `npm run check` — 0 TypeScript errors
- `npm run build` — success
- No runtime behavior changed

## Related

- `../concepts/db-type-assertions.md` — Full workaround pattern
- `../../../project-intelligence/lookup/db-types.md` — Type definitions
