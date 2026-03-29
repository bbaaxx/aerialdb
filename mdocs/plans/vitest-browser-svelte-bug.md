# vitest-browser-svelte Svelte 5 Compatibility Bug

**Date:** 2026-03-29  
**Status:** Known Bug - Workstream TBD  
**Severity:** Medium (blocks 16 component tests)

## Issue

`vitest-browser-svelte@2.0.1` and `@2.1.0` have a bug causing Svelte 5 component tests to fail when rendering components with nested object props.

**Error:**

```
TypeError: Cannot read properties of undefined (reading 'includes')
❯ render node_modules/vitest-browser-svelte/src/pure.js:43:18
```

**Affected Tests:**

- `src/lib/components/MoveCard.svelte.spec.ts` — all 16 browser tests fail

**Working Tests:**

- `src/routes/page.svelte.spec.ts` — passes (simpler props)
- Server-side tests — all pass

## Root Cause

The `render()` function in `vitest-browser-svelte` internally fails when processing Svelte 5 components that use `$props()` with nested object types. The library's prop processing code attempts to call `.includes()` on an undefined value.

## Reproduction

```typescript
const move = {
	id: '1',
	name: 'Star',
	imageUrl: null as string | null,
	level: null as string | null,
	category: { id: 'cat-1', name: 'Silks' }
};

render(MoveCard, { target: document.createElement('div'), props: { move } });
// ❌ Fails with "Cannot read properties of undefined (reading 'includes')"
```

## Workaround Options

1. **Skip browser tests** — Mark affected tests with `describe.skip` until library is fixed
2. **Rewrite as server tests** — Move component tests to non-browser environment
3. **Pin library version** — If older version works, pin to that (but we're already on latest)
4. **Use `@testing-library/svelte`** — Alternative approach (different API)

## Resolution Path

1. Check if issue is reported on [vitest-browser-svelte GitHub](https://github.com/nickvdyck/vitest-browser-svelte)
2. If not, file a bug report with reproduction steps
3. Monitor for fix in subsequent release
4. When fixed, remove any workarounds

## References

- `vitest-browser-svelte` npm: https://www.npmjs.com/package/vitest-browser-svelte
- MoveCard test file: `src/lib/components/MoveCard.svelte.spec.ts`
