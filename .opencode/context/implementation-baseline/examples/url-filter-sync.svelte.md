<!-- Context: implementation-baseline/examples | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Example: URL Filter Sync (Svelte)

**Purpose**: Show the current homepage filter sync pattern.
**Last Updated**: 2026-04-01

## Use Case

Use when a page should keep filters shareable/bookmarkable and server-driven.

## Code

```ts
function updateFilters() {
	const params = new URLSearchParams();
	if (searchQuery) params.set('q', searchQuery);
	if (selectedLevel) params.set('level', selectedLevel);
	goto(params.toString() ? `/?${params}` : '/', { replaceState: true, noScroll: true });
}
```

## Explanation

1. Build params from local state.
2. Navigate with `goto` to trigger server `load`.
3. Preserve UX with `replaceState` and `noScroll`.

## 📂 Codebase References

**Full Implementation**:

- `src/routes/+page.svelte` - Search/category/level sync logic

## Related

- concepts/landing-page-architecture.md
- guides/add-list-filter-end-to-end.md
