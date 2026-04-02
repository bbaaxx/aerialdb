<!-- Context: implementation-baseline/lookup | Priority: high | Version: 1.0 | Updated: 2026-04-01 -->

# Lookup: Component Responsibility Map

**Purpose**: Quick map of current component ownership on the public landing experience.
**Last Updated**: 2026-04-01

## Component Matrix

| Component   | Responsibility               | Key Inputs                    | Path                                    |
| ----------- | ---------------------------- | ----------------------------- | --------------------------------------- |
| Header      | Top bar + auth CTA           | `user`                        | `src/lib/components/Header.svelte`      |
| SearchBar   | Search input + clear         | `value`, `oninput`, `onclear` | `src/lib/components/SearchBar.svelte`   |
| FilterChips | Category/level toggles       | categories + callbacks        | `src/lib/components/FilterChips.svelte` |
| HeroBanner  | Featured move visual CTA     | `move`                        | `src/lib/components/HeroBanner.svelte`  |
| MoveCard    | Move summary card + favorite | `move`, favorited state       | `src/lib/components/MoveCard.svelte`    |

## Notes

- Page composition happens in `src/routes/+page.svelte`.
- Data provisioning happens in `src/routes/+page.server.ts`.
- Shared token styles are in `src/routes/layout.css`.

## Commands

```bash
npm run check
```

## Related

- concepts/landing-page-architecture.md
- concepts/theme-token-system.md
