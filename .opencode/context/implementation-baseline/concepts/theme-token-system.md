<!-- Context: implementation-baseline/concepts | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Concept: Theme Token System

**Purpose**: Document the current dark theme token baseline for route/component work.
**Last Updated**: 2026-04-01

## Core Idea

The app defines shared dark-theme and typography tokens in `layout.css` via `@theme`, then applies them across route shells and reusable components for consistent visual behavior.

## Key Points

- Core colors: `dark-base`, `dark-card`, `accent-purple`, `primary-light`.
- Fonts are loaded in `+layout.svelte` and exposed as `--font-serif` / `--font-sans`.
- Root app shell enforces dark background and default text color.
- Shared components (`Header`, `SearchBar`, `HeroBanner`, `MoveCard`) consume same token vocabulary.

## Quick Example

```css
@theme {
	--color-dark-base: #1a1c29;
	--color-dark-card: #242736;
	--color-accent-purple: #8a63f8;
}
```

## 📂 Codebase References

**Implementation**:

- `src/routes/layout.css` - Theme token definitions
- `src/routes/+layout.svelte` - Font imports and root shell
- `src/lib/components/Header.svelte` - Tokenized header styling

## Deep Dive

**Reference**: https://tailwindcss.com/docs/theme

## Related

- guides/port-dark-design-system.md
- lookup/component-responsibility-map.md
