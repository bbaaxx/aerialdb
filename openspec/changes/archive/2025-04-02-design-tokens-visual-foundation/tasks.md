## 1. Design Token Foundation

- [x] 1.1 Expand `@theme` block in `src/routes/layout.css` with all surface tier tokens (`surface`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`) using the Etheric Pro color values
- [x] 1.2 Add semantic color tokens to `@theme` block: `primary` (#cebdff), `primary-container` (#9b7aff), `secondary`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`
- [x] 1.3 Add error palette tokens: `error`, `error-container`, `on-error`, `on-error-container`
- [x] 1.4 Add inverse color tokens: `inverse-surface`, `inverse-on-surface`, `inverse-primary`
- [x] 1.5 Map legacy tokens: `dark-base` → `surface-container-low`, `dark-card` → `surface-container`, `accent-purple` → `primary`

## 2. Typography System

- [x] 2.1 Update Google Fonts `<link>` in `src/routes/+layout.svelte`: replace Playfair Display with Noto Serif (weights 400-900), add `&display=swap`
- [x] 2.2 Update `--font-serif` in `@theme` from `'Playfair Display', Georgia, serif` to `'Noto Serif', Georgia, serif`
- [x] 2.3 Add 6-level type scale to `@theme` block: `display-lg` (3.5rem/1.1), `headline-lg` (2rem/1.2), `title-lg` (1.375rem/1.3), `body-lg` (1rem/1.5), `body-md` (0.875rem/1.5), `label-md` (0.75rem/1.4)
- [ ] 2.4 Verify all `font-serif` usages render with Noto Serif (no component changes needed — just visual verification)

## 3. No-Line Rule: Border Audit & Replacement

- [x] 3.1 `MoveCard.svelte` — Remove `border border-gray-800/50` from card wrapper; card uses `bg-surface-container` for tonal separation
- [x] 3.2 `MoveCard.svelte` — Convert level badge borders to tonal only (remove `border` from badge classes, keep background color for semantic meaning)
- [x] 3.3 `HeroBanner.svelte` — Remove `border` from level badge and category pill classes; keep semantic color backgrounds
- [x] 3.4 `Header.svelte` — Remove `border-bottom: 1px solid rgba(255,255,255,0.05)` from inline style; rely on backdrop-blur and surface background for separation
- [x] 3.5 `FilterChips.svelte` — Remove structural borders from chip classes; use surface tier backgrounds for active/inactive states
- [x] 3.6 `moves/[id]/+page.svelte` — Remove `border-b border-white/5` from sticky header, `border border-gray-700` and `border-gray-800` from content containers
- [x] 3.7 `+page.svelte` (home) — Remove `border border-gray-600` from "Explore All Moves" button; use surface tier background instead
- [x] 3.8 `SearchBar.svelte` — Convert `border border-gray-600` to ghost border `border border-outline-variant/15`; update focus ring to use `primary` token
- [x] 3.9 Auth pages (`login/+page.svelte`, `signup/+page.svelte`) — Replace card borders with tonal surfaces; convert input borders to ghost borders `border-outline-variant/15`; preserve error state borders with `border-error`
- [x] 3.10 Admin pages (`+page.svelte`, `+layout.svelte`, categories, moves/edit, moves/new) — Replace card/panel `border-gray-800` with surface tier backgrounds; convert input borders to ghost borders; preserve error borders; convert table header `border-b` to `bg-surface-container-high`

## 4. Root Layout Update

- [x] 4.1 Update root wrapper in `+layout.svelte`: replace `bg-[#1A1C29]` with `bg-surface-container-low`; replace `text-gray-100` with `text-on-surface`

## 5. Verification

- [x] 5.1 Run `npm run check` — confirm no TypeScript/Svelte errors from token changes
- [x] 5.2 Run `npm run lint` — confirm formatting passes
- [x] 5.3 Visual review: load the app and verify all pages render correctly with new tokens, no regressions in layout, colors are from the new palette
- [x] 5.4 Verify Noto Serif loads correctly and displays in all `font-serif` contexts (hero headings, move card names, header logo, section headings)
