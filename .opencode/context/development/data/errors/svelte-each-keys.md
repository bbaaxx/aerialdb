<!-- Context: development/data/errors/svelte-each-keys | Priority: medium | Version: 1.0 | Updated: 2026-03-29 -->

# Missing Key Expressions in Each Blocks

**Symptom**: 4 ESLint errors from `svelte/require-each-key` rule. Svelte requires unique key expressions for each blocks.

## Affected Files

| File                                            | Line | Loop            |
| ----------------------------------------------- | ---- | --------------- |
| `src/routes/admin/+page.svelte`                 | 103  | categories loop |
| `src/routes/admin/+page.svelte`                 | 167  | levels loop     |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | 144  | categories loop |
| `src/routes/admin/moves/new/+page.svelte`       | 89   | categories loop |

## Fix

Add `(item.id)` as the key expression to each block:

```svelte
<!-- BEFORE -->
{#each categories as item}
	<option>{item.name}</option>
{/each}

<!-- AFTER -->
{#each categories as item (item.id)}
	<option>{item.name}</option>
{/each}
```

## Related

- `./lint-svelte-ignore.md` — Stale svelte-ignore comments
- `./svelte-reactivity-lint.md` — URLSearchParams replacement
