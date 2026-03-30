<!-- Context: development/principles/svelte5-patterns | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Svelte 5 + Tailwind v4 Patterns

**Core Idea**: AerialDB uses Svelte 5 runes API exclusively with Tailwind CSS v4 for the redesigned landing page, while maintaining Svelte 4 admin pages.

## Key Constraints

- **Svelte 5 runes only** — No `$:` reactive statements, no legacy stores
- **Tailwind CSS v4** — CSS-based `@theme` config (not JS config)
- **Drizzle ORM** — Type assertions per DEBT-3 pattern for union types
- **Dark theme isolation** — Admin pages must not be affected by dark theme changes
- **Lucide icons** — Preferred over Font Awesome (tree-shakable)

## Svelte 5 Patterns

```svelte
<script lang="ts">
	// Props with interface
	interface Props {
		move: MoveWithCategoryRaw;
	}
	let { move }: Props = $props();

	// State
	let count = $state(0);

	// Derived
	let doubled = $derived(count * 2);

	// Effects
	$effect(() => {
		console.log(count);
	});
</script>
```

## Tailwind v4 Syntax

```css
/* layout.css */
@theme {
	--color-base: #1a1c29;
	--color-card: #242736;
	--font-display: 'Playfair Display', serif;
	--font-body: 'Inter', sans-serif;
}
```

## Page Data Typing

Use `$types` from SvelteKit for PageData types:

```ts
import type { PageData } from './$types';
```

## Related

- `../../../project-intelligence/lookup/design-tokens.md` — Design tokens
- `../../infrastructure/concepts/dual-environment.md` — Cloudflare deployment
