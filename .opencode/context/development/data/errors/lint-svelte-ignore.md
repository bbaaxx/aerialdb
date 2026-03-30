<!-- Context: development/data/errors/lint-svelte-ignore | Priority: medium | Version: 1.0 | Updated: 2026-03-29 -->

# Stale svelte-ignore Comments

**Symptom**: 30 ESLint errors from `svelte/no-unused-svelte-ignore` rule across 3 files. The svelte-ignore comments are stale — the rules they disable are no longer being flagged.

## Affected Files

| File                                            | Stale Comments |
| ----------------------------------------------- | -------------- |
| `src/routes/auth/login/+page.svelte`            | 8              |
| `src/routes/auth/signup/+page.svelte`           | 8              |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | 16             |

## Fix

Remove the `svelte-ignore` comments from each file. The rules they disabled are no longer triggering errors.

## Example

```svelte
<!-- BEFORE (stale) -->
<!-- svelte-ignore a11y_autofocus -->
<input type="text" bind:value />

<!-- AFTER (clean) -->
<input type="text" bind:value />
```

## Related

- `./svelte-each-keys.md` — Missing key expressions
- `./svelte-reactivity-lint.md` — URLSearchParams replacement
