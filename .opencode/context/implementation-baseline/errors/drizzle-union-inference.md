<!-- Context: implementation-baseline/errors | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Errors: Drizzle Union Inference

**Purpose**: Resolve common type issues when selecting joins from a union DB client.
**Last Updated**: 2026-04-01

## Error: Joined Select Type Mismatch

**Symptom**:

- TypeScript reports missing projected fields after `.select({ ... }).innerJoin(...)`.

**Cause**:

- `getDb(event)` returns union client types (D1/libsql), degrading projection inference.

**Solution**:

- Define shared raw result type in `src/lib/server/db/types.ts`.
- Apply assertion at query boundary and map to final payload shape.

**Prevention**:

- Keep route output mapping explicit.
- Reuse shared raw types across all affected routes.

## Quick Example

```ts
const rows = (await (db as any).select({...}).from(moves)) as MoveWithCategoryRaw[];
return rows.map((row) => ({ id: row.id, category: { id: row.categoryId, name: row.categoryName } }));
```

## 📂 Codebase References

**Implementation**:

- `src/lib/server/db/index.ts` - Union DB accessor
- `src/lib/server/db/types.ts` - Shared result contracts
- `src/routes/+page.server.ts` - Applied query pattern

## Reference

- https://orm.drizzle.team/docs/select

## Related

- concepts/db-union-typing-strategy.md
- examples/typed-drizzle-select-map.ts.md
