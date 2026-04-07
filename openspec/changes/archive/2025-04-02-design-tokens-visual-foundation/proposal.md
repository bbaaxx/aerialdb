## Why

AerialDB is undergoing a full visual redesign to match the "Etheric Pro" / "Digital Observatory" design system created in Stitch. The current styling uses a generic zinc-based palette with Playfair Display headings and relies on borders for visual structure. Before any layout or component changes (Stages 2-7), we need to establish the correct visual foundation — colors, typography, spacing, and border conventions — so that all subsequent stages build on the right tokens from day one.

## What Changes

- Expand Tailwind CSS custom properties with the full "Etheric Pro" design token set: surface tiers, semantic colors, error palette, inverse colors, and accent alignment
- Replace the Playfair Display serif font with **Noto Serif** across all heading contexts
- Audit and replace structural `border` usage with tonal surface shifts ("No-Line" rule), keeping ghost borders only where needed for accessibility
- Define a consistent spacing token scale mapped to the design system's spacing values
- Define an editorial typography scale with six levels (display-lg through label-md) matching the Stitch mockups

## Capabilities

### New Capabilities

- `design-tokens`: Custom CSS properties and Tailwind theme extension covering surface tiers, semantic colors, error palette, inverse colors, and accent tokens for the "Digital Observatory" dark-first design system
- `typography-scale`: Editorial type scale with six defined levels (display-lg, headline-lg, title-lg, body-lg, body-md, label-md) using Noto Serif for display/headline and Inter for body/label
- `no-line-rule`: Border replacement convention — structural borders replaced with tonal surface shifts, ghost borders at `outline-variant` 15% opacity only for accessibility

### Modified Capabilities

_(No existing specs to modify — this is the first spec-driven change.)_

## Impact

- **`src/routes/+layout.svelte`** — Google Fonts link updated, theme CSS custom properties added/expanded
- **`src/routes/layout.css`** (or equivalent global stylesheet) — New `@theme` block with all custom properties
- **All Svelte components using borders** — Audited and updated per the no-line rule
- **All Svelte components using serif fonts** — Updated from Playfair Display to Noto Serif
- **Tailwind configuration** — Extended with new color aliases and type scale utilities
- **No database changes** — Purely visual/CSS layer
- **No breaking API changes** — Visual-only, no behavior changes
- **Existing tests may need visual snapshot updates** if they assert on specific class names
