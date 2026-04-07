<!-- Context: implementation-baseline/guides | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Guide: Admin CRUD UX Pattern

**Purpose**: Reuse current inline-edit and confirm-delete behavior from admin categories.
**Last Updated**: 2026-04-01

## Prerequisites

- SvelteKit form actions available
- `use:enhance` workflow understood

**Estimated time**: 20 min

## Steps

### 1. Track edit and delete state

- Use `$state` for `editingId`, `editingName`, `deletingId`.

### 2. Implement inline edit form

- Render edit inputs conditionally when row id matches `editingId`.

### 3. Implement delete confirmation state

- Show explicit confirm/cancel actions before destructive submit.

### 4. Use `use:enhance` for action responses

- On success: reset state and call `invalidateAll()`.

### 5. Surface action errors per row

- Display form error for matching action/id context.

## Verification

```bash
npm run check
```

## 📂 Codebase References

**Implementation**:

- `src/routes/admin/categories/+page.svelte` - Inline edit/delete UX
- `src/routes/admin/categories/+page.server.ts` - CRUD actions backend

## Troubleshooting

| Issue                   | Solution                              |
| ----------------------- | ------------------------------------- |
| Row stuck in edit mode  | Ensure cancel resets both id and name |
| Data stale after action | Call `invalidateAll()` on success     |

## Related

- lookup/route-dataflow-reference.md
- errors/drizzle-union-inference.md
