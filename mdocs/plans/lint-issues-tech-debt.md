# Lint Issues & Technical Debt

**Created:** 2026-03-29
**Status:** 🔴 Pending — 102 lint errors in main source
**Scope:** ESLint errors in `src/` (excluding `.opencode/`, `scripts/`, `demo/`)
**Complementary to:** `technical-debt-and-pending.md`

---

## Overview

The technical debt plan (`technical-debt-and-pending.md`) resolved DEBT-1 through DEBT-4, but lint was not fully audited. Running `npm run lint` reveals 102 errors in the main application source code.

---

## Current Lint State

```
npm run lint → ✗ 102 problems (102 errors, 0 warnings)
```

**Excluded via `eslint.config.js` ignores:**

- `.opencode/**` — tooling code
- `scripts/**` — build scripts
- `src/routes/demo/**` — deleted demo code

---

## Error Breakdown

### 1. `@typescript-eslint/no-explicit-any` — ~70 errors

**Root Cause:** DEBT-3 fix pattern uses `(db as any)` to bypass TypeScript's union type resolution on `getDb()` return type (D1 | libsql).

**Affected locations:**

| File                                          | Count | Pattern                                  |
| --------------------------------------------- | ----- | ---------------------------------------- |
| `src/lib/server/db/index.ts`                  | 5     | Drizzle client setup                     |
| `src/lib/server/auth.ts`                      | 1     | `db as any` select                       |
| `src/routes/+page.server.ts`                  | 2     | `db as any` selects                      |
| `src/routes/admin/+page.server.ts`            | 1     | `db as any` select                       |
| `src/routes/admin/categories/+page.server.ts` | 3     | `db as any` selects                      |
| `src/routes/api/search/+server.ts`            | 1     | `db as any` select                       |
| `src/routes/moves/[id]/+page.server.ts`       | 1     | `db as any` select (with eslint-disable) |
| `src/app.d.ts`                                | 1     | Environment type                         |
| `src/routes/admin/+layout.svelte`             | 1     | Event type                               |
| Test files (spec.ts)                          | ~40+  | Mock setups                              |

**Recommended Fix:** Add eslint-disable comment at project level or fix per-file:

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
```

Or refactor `getDb()` to return a single typed client (Option B from DEBT-3).

---

### 2. `svelte/no-unused-svelte-ignore` — ~30 errors

**Root Cause:** Stale `svelte-ignore` comments for rules that were disabled or fixed.

**Affected files:**

| File                                            | Count | Issue                        |
| ----------------------------------------------- | ----- | ---------------------------- |
| `src/routes/auth/login/+page.svelte`            | 8     | Old DEBT-4 `$state` warnings |
| `src/routes/auth/signup/+page.svelte`           | 8     | Old DEBT-4 `$state` warnings |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | 16    | Old DEBT-4 `$state` warnings |

**Recommended Fix:** Remove the stale svelte-ignore comments (or delete them if the rule is disabled).

---

### 3. `svelte/require-each-key` — 4 errors

**Root Cause:** `{#each}` blocks missing key expressions.

**Affected files:**

| File                                            | Line | Item            |
| ----------------------------------------------- | ---- | --------------- |
| `src/routes/admin/+page.svelte`                 | 103  | categories loop |
| `src/routes/admin/+page.svelte`                 | 167  | levels loop     |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | 144  | categories loop |
| `src/routes/admin/moves/new/+page.svelte`       | 89   | categories loop |

**Recommended Fix:** Add key expression:

```svelte
{#each categories as category (category.id)}
```

---

### 4. `prefer-const` / `@typescript-eslint/no-unused-vars` — 4 errors

| File                                    | Line | Issue                          |
| --------------------------------------- | ---- | ------------------------------ |
| `src/routes/+page.server.ts`            | 16   | `conditions` should be `const` |
| `src/routes/api/search/+server.ts`      | 21   | `conditions` should be `const` |
| `src/routes/auth/login/+page.server.ts` | 1    | `hashPassword` unused import   |

**Recommended Fix:** Auto-fix with `npm run lint -- --fix`

---

### 5. `svelte/prefer-svelte-reactivity` — 2 errors

**Root Cause:** Using native `URLSearchParams` and `Set` instead of Svelte's reactive versions.

**Affected file:** `src/routes/+page.svelte`

| Line | Issue                                               |
| ---- | --------------------------------------------------- |
| 25   | `URLSearchParams` should be `SvelteURLSearchParams` |
| 60   | `Set` should be `SvelteSet`                         |

**Recommended Fix:** Replace with Svelte 5 reactive primitives.

---

## Implementation Plan

```
1. Remove stale svelte-ignore comments (login, signup, edit pages)
2. Fix svelte/require-each-key (add keys to admin loops)
3. Change let → const where applicable (prefer-const)
4. Add eslint-disable for no-explicit-any (DEBT-3 pattern)
5. Optional: Replace URLSearchParams/Set with Svelte equivalents
```

**Priority:** LOW-MEDIUM (does not block build or tests)

---

## Files to Modify

| File                                            | Changes                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `src/routes/auth/login/+page.svelte`            | Remove 8 stale svelte-ignore comments                                 |
| `src/routes/auth/signup/+page.svelte`           | Remove 8 stale svelte-ignore comments                                 |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | Remove 16 stale svelte-ignore comments                                |
| `src/routes/admin/+page.svelte`                 | Add keys to 2 each blocks                                             |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | Add key to 1 each block                                               |
| `src/routes/admin/moves/new/+page.svelte`       | Add key to 1 each block                                               |
| `src/routes/+page.server.ts`                    | Change `let` → `const`                                                |
| `src/routes/api/search/+server.ts`              | Change `let` → `const`                                                |
| `src/routes/auth/login/+page.server.ts`         | Remove unused `hashPassword` import                                   |
| `src/routes/+page.svelte`                       | SvelteSet/SvelteURLSearchParams or ignore                             |
| `eslint.config.js`                              | Add `@typescript-eslint/no-explicit-any: off` or project-wide disable |

---

## Validation Checklist

- [ ] `npm run lint` — 0 errors in `src/` (excluding demo routes)
- [ ] `npm run lint -- --fix` — auto-fixes applied
- [ ] Manual fixes for svelte-ignore comments and each keys
