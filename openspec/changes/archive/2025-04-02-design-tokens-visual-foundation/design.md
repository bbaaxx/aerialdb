## Context

AerialDB currently uses a minimal Tailwind theme with four custom properties (`dark-base`, `dark-card`, `accent-purple`, `primary-light`) and two font families (Inter + Playfair Display). The app is dark-mode only with a base background of `#1A1C29` and card background of `#242736`. Borders are used extensively (96 occurrences across components) for structural separation — `border-gray-800/50`, `border-gray-700`, `border-gray-600`, `border-white/5`.

The Stitch design mockups define a richer "Etheric Pro" / "Digital Observatory" visual language with a full surface tier hierarchy, semantic color tokens, and a "no-line" border philosophy. This change establishes that visual foundation before any layout or component redesign (Stages 2-7 of the master plan).

Current files that will be modified:

- `src/routes/layout.css` — Tailwind `@theme` block (currently 4 custom properties)
- `src/routes/+layout.svelte` — Google Fonts links, root wrapper classes
- All components using `border-*` classes (96 occurrences across ~15 files)
- All components using `font-serif` (8 occurrences across 5 files)

## Goals / Non-Goals

**Goals:**

- Define the complete "Etheric Pro" design token set as Tailwind CSS custom properties
- Switch serif font from Playfair Display to Noto Serif
- Establish the "no-line" border convention — tonal surface shifts replace structural borders
- Define and document the spacing and typography scales
- Leave the app visually consistent (same layout) but with the new design system tokens applied

**Non-Goals:**

- Layout changes (header, sidebar, filters, hero, cards) — those are Stages 2-7
- Component structural changes (adding badges, stats, new elements)
- Database or API changes
- Light mode support (dark-only for now, tokens can support it later)
- New Svelte components or routes

## Decisions

### 1. Token storage: Tailwind v4 `@theme` block in `layout.css`

**Decision:** Add all new tokens as CSS custom properties inside the existing `@theme { }` block in `src/routes/layout.css`.

**Rationale:** Tailwind v4's `@theme` directive is the canonical way to define design tokens. It generates the correct utility classes automatically. No need for a separate `tailwind.config.ts` file — Tailwind v4 uses CSS-first configuration.

**Alternative considered:** A separate `tokens.css` file imported into layout.css. Rejected because `@theme` must be in a single location for Tailwind to process correctly.

### 2. Surface tier hierarchy

**Decision:** Define 7 surface tier tokens matching the Material Design 3 / Etheric Pro naming convention.

```
surface-container-lowest  → #0F1117  (deepest)
surface-container-low     → #1A1C29  (current dark-base)
surface                   → #1E2030  (base)
surface-container         → #242736  (current dark-card)
surface-container-high    → #2A2D3E  (elevated)
surface-container-highest → #333650  (most elevated)
```

**Rationale:** The tier system provides tonal separation without borders. Components at different elevation levels use different surface colors, creating visual hierarchy through color contrast instead of lines.

### 3. Font replacement approach

**Decision:** Swap Playfair Display for Noto Serif in both the Google Fonts `<link>` and the `--font-serif` CSS variable. All existing `font-serif` Tailwind classes continue working without changes.

**Rationale:** Noto Serif has better Unicode coverage, better web rendering at display sizes, and matches the Stitch mockups exactly. Since we're only changing the font family definition, no component-level changes are needed — every component using `font-serif` automatically picks up Noto Serif.

### 4. No-line rule: phased border removal

**Decision:** Replace structural borders with tonal surface shifts. Categorize the 96 border usages into:

- **Remove** (card outlines, section dividers): Replace `border border-gray-800` with surface-container backgrounds
- **Convert to ghost borders** (inputs, focusable elements): `border border-outline-variant/15`
- **Keep** (error states, active indicators): Semantic borders remain

**Rationale:** The "Digital Observatory" aesthetic uses color and elevation for structure, not lines. Ghost borders at 15% opacity provide accessibility for form elements without the visual weight of full borders.

### 5. Typography scale implementation

**Decision:** Define the 6-level type scale as Tailwind `@theme` font-size utilities with explicit line-height and letter-spacing values. Use `--font-*` custom properties for the font-family assignments.

```
--text-display-lg: 3.5rem/1.1  (Noto Serif, 700)
--text-headline-lg: 2rem/1.2   (Noto Serif, 600)
--text-title-lg: 1.375rem/1.3  (Inter, 500)
--text-body-lg: 1rem/1.5       (Inter, 400)
--text-body-md: 0.875rem/1.5   (Inter, 400)
--text-label-md: 0.75rem/1.4   (Inter, 500)
```

**Rationale:** Tailwind v4 allows defining font-size with line-height in `@theme` using the `fontSize` namespace. Components then use `text-display-lg` etc. instead of manual `text-[56px] leading-tight` values.

## Risks / Trade-offs

- **Visual regression during migration** → After updating tokens, the app will look different but should remain functional. No layout changes means risk of broken layouts is minimal. Visual review needed after each sub-step.
- **Border removal may reduce accessibility** → Form inputs and interactive elements retain ghost borders. We'll audit focus states specifically. High-contrast testing recommended post-migration.
- **Google Fonts network dependency** → Noto Serif is a larger font file than Playfair Display headings. Add `font-display: swap` to the Google Fonts URL to prevent FOIT.
- **96 border occurrences** → Large audit surface. Will be handled systematically per-component, not as a global find-replace.
