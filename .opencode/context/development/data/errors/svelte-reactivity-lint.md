<!-- Context: development/data/errors/svelte-reactivity-lint | Priority: medium | Version: 1.0 | Updated: 2026-03-29 -->

# SvelteURLSearchParams / SvelteSet Replacement

**Symptom**: 2 ESLint errors from `svelte/prefer-svelte-reactivity` rule. Need to replace browser built-ins with Svelte 5 reactive equivalents.

## Errors

| File                      | Line | Replace                                     |
| ------------------------- | ---- | ------------------------------------------- |
| `src/routes/+page.svelte` | 25   | `URLSearchParams` → `SvelteURLSearchParams` |
| `src/routes/+page.svelte` | 60   | `Set` → `SvelteSet`                         |

## Fix

```svelte
<script lang="ts">
	// BEFORE
	const params = new URLSearchParams(url.search);
	const selected = new Set<string>();

	// AFTER
	import { SvelteURLSearchParams, SvelteSet } from 'svelte/reactivity';
	const params = new SvelteURLSearchParams(url.search);
	const selected = new SvelteSet<string>();
</script>
```

## Note

This applies to the landing page being redesigned. Admin pages may still use browser built-ins if not yet migrated.

## Related

- `./lint-svelte-ignore.md` — Stale svelte-ignore comments
- `./svelte-each-keys.md` — Missing key expressions
- `../../principles/svelte5-patterns.md` — Svelte 5 patterns
