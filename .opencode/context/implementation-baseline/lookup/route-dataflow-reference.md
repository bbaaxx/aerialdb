<!-- Context: implementation-baseline/lookup | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Lookup: Route Dataflow Reference

**Purpose**: Quick route-to-dataflow map for key implemented areas.
**Last Updated**: 2026-04-01

## Dataflow Table

| Route               | Server Source                                 | UI Surface                                 | Notes                              |
| ------------------- | --------------------------------------------- | ------------------------------------------ | ---------------------------------- |
| `/`                 | `src/routes/+page.server.ts`                  | `src/routes/+page.svelte`                  | URL params drive DB filters        |
| `/admin`            | `src/routes/admin/+page.server.ts`            | `src/routes/admin/+page.svelte`            | Dashboard stats + table            |
| `/admin/categories` | `src/routes/admin/categories/+page.server.ts` | `src/routes/admin/categories/+page.svelte` | CRUD with enhanced forms           |
| `/auth/login`       | `src/routes/auth/login/+page.server.ts`       | `src/routes/auth/login/+page.svelte`       | Form action with inline errors     |
| `/auth/signup`      | `src/routes/auth/signup/+page.server.ts`      | `src/routes/auth/signup/+page.svelte`      | Field-specific validation feedback |

## Paths

```
src/routes/+page.svelte - Main landing composition
src/routes/+page.server.ts - Landing query/filter logic
src/lib/server/db/types.ts - Shared typed route payload shaping
```

## Related

- concepts/landing-page-architecture.md
- guides/add-list-filter-end-to-end.md
