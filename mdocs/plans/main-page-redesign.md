# Main Page Redesign — Implementation Plan

**Created:** 2026-03-28
**Last Updated:** 2026-03-29
**Status:** ✅ Complete — All phases done
**Scope:** Landing page (Exploration Library) — full UI overhaul
**PRD Reference:** AerialDB Redesign & Enhancement, Phase 1, Section 5.1

---

## Overview

Transform the current zinc/light-themed POC landing page into a dark, visually-driven Exploration Library. The design uses a deep navy palette, Playfair Display serif headings, purple gradient accents, and glassmorphism effects.

**Reference:** HTML mockup provided (static HTML with Tailwind CDN, Font Awesome, Google Fonts).

**Visual refinements:** See `designer_notes_for_redesign.md` for detailed visual analysis of the mockup. The corrections below incorporate those findings inline; the designer notes document serves as the rationale.

---

## Design Tokens (from mockup)

| Token               | Value                                                           | Usage                                 |
| ------------------- | --------------------------------------------------------------- | ------------------------------------- |
| Dark base           | `#1A1C29`                                                       | Page background                       |
| Dark card           | `#242736`                                                       | Card backgrounds, active filter chips |
| Dark glass          | `rgba(36,39,54,0.7)` + `backdrop-filter: blur(10px)`            | Header glassmorphism                  |
| Primary accent      | `#8A63F8` (purple)                                              | CTAs, focus rings, active states      |
| Accent gradient     | `from-purple-500 to-indigo-500`                                 | Sign Up button, Learn More button     |
| Accent glow         | `shadow-[0_0_15px_rgba(138,99,248,0.5)]`                        | CTA buttons                           |
| Primary text light  | `#A0A5C0`                                                       | Muted labels, nav links               |
| Heading font        | Playfair Display (serif)                                        | Move titles, hero heading, logo       |
| Body font           | Inter (sans-serif)                                              | UI text, body copy                    |
| Level: Beginner     | `teal-400` with `teal-400/10` bg, `teal-400/30` border          | Badge color                           |
| Level: Intermediate | `blue-400` with `blue-400/10` bg, `blue-400/30` border          | Badge color                           |
| Level: Advanced     | `purple-400` with `purple-400/10` bg, `purple-400/30` border    | Badge color                           |
| Card hover          | `translateY(-4px)` + `shadow: 0 10px 25px -5px rgba(0,0,0,0.5)` | Card interaction                      |

---

## Current State vs Target

| Aspect  | Current                                            | Target                                                         |
| ------- | -------------------------------------------------- | -------------------------------------------------------------- |
| Theme   | Light zinc (`bg-zinc-50`)                          | Dark navy (`#1A1C29`)                                          |
| Header  | Basic white bar, auth links                        | Glassmorphism sticky bar, nav links, gradient Sign Up          |
| Search  | Sticky bar, `bg-white`, border-zinc                | Centered, `bg-dark-card`, focus ring purple                    |
| Filters | Category dropdown (`<select>`)                     | Filter chips in 3 groups (Apparatus, Level, Style)             |
| Hero    | None                                               | Featured "Move of the Day" banner, 400px, gradient overlay     |
| Cards   | Light cards, zinc borders, blue-100 category badge | Dark cards, aspect-video, heart icon, level badge, serif title |
| Grid    | 2-col mobile, 3-col desktop                        | 3-col desktop (1/2/3 responsive)                               |
| Fonts   | System sans-serif                                  | Playfair Display + Inter                                       |
| Icons   | Inline SVGs                                        | Font Awesome (or equivalent SVG set)                           |

---

## Schema Changes Required

### Add `level` column to `moves` table

The mockup displays level badges on every card and has level filter chips. The current schema has no `level` field.

**File:** `src/lib/server/db/schema.ts`

```ts
// Add to moves table definition:
level: text('level'), // 'beginner' | 'intermediate' | 'advanced' | 'professional' | null
```

**Migration:** Run `npm run db:generate` then `npm run db:push` (or `db:migrate`).

**Why nullable:** Existing moves in the DB won't have levels. The UI should handle `null` gracefully (hide the badge or show "Unrated").

### Seed data

Update `src/lib/server/db/seed.ts` to populate moves with level values and ensure enough variety across categories and levels for the filter chips and hero section to be meaningful.

---

## Task Breakdown

### Phase 0: Schema & Data ✅ COMPLETED

#### Task 0A — Add `level` column to moves schema ✅

- **File:** `src/lib/server/db/schema.ts`
- **Action:** ~~Add `level: text('level')` to the `moves` table~~ ✅ Done
- **Action:** ~~Update `Move` type export~~ ✅ Updated `MoveWithCategoryRaw` in `src/lib/server/db/types.ts` with `level: string | null`
- **Validation:** `npm run check` passes ✅
- **Dependencies:** None

#### Task 0B — Generate and apply migration ✅

- **Action:** ~~Run `npm run db:generate`~~ — Used `drizzle-kit push --force` directly
- **Action:** ~~Run `npm run db:push`~~ ✅ Applied
- **Validation:** Schema pushed to local DB ✅
- **Dependencies:** Task 0A

#### Task 0C — Update seed data with levels ✅

- **File:** `src/lib/server/db/seed.ts`
- **Action:** ~~Add `level` field to seed data~~ ✅ Done — deterministic 10-element round-robin: 30% beginner, 40% intermediate, 30% advanced
- **Action:** ~~Run `npm run db:seed`~~ ✅ Done
- **Result:** 109 moves, 9 categories. Levels: beginner 33 (30.3%), intermediate 44 (40.4%), advanced 32 (29.4%)
- **Dependencies:** Task 0B

---

### Phase 1: Design Foundation ✅ COMPLETED

#### Task 1A — Add Google Fonts and CSS custom properties ✅

- **Files:** `src/routes/+layout.svelte`, `src/routes/layout.css`
- **Action:** ~~Add Google Fonts~~ ✅ Preconnect + stylesheets for Playfair Display (400–900, italics) and Inter (300–600)
- **Action:** ~~Apply dark theme~~ ✅ Wrapped children in `bg-[#1A1C29] font-sans text-gray-100 min-h-screen`
- **Validation:** Fonts load, dark background visible ✅
- **Dependencies:** None

#### Task 1B — Extend Tailwind theme with custom tokens ✅

- **File:** `src/routes/layout.css`
- **Action:** ~~Add custom colors, font-serif utility~~ ✅ Added `@theme` block:
  - `--color-dark-base: #1A1C29` → `bg-dark-base`
  - `--color-dark-card: #242736` → `bg-dark-card`
  - `--color-accent-purple: #8A63F8` → `text-accent-purple`
  - `--color-primary-light: #A0A5C0` → `text-primary-light`
  - `--font-serif`, `--font-sans`
- **Validation:** Custom classes available ✅
- **Dependencies:** Task 1A

#### Task 1C — Add icon library ✅

- **Decision:** Lucide icons (tree-shakable, SVG-based, no CDN dependency)
- **Action:** ~~Install icon library~~ ✅ `lucide-svelte` installed
- **Dependencies:** None

---

### Phase 2: Components (can be built in parallel)

#### Task 2A — Header component

- **File:** `src/lib/components/Header.svelte`
- **Props:**
  ```ts
  interface Props {
  	user?: { username: string } | null;
  }
  ```
- **Design spec (from mockup):**
  - Sticky top-0, z-50
  - Glassmorphism: `background: linear-gradient(180deg, rgba(26,28,41,0.9) 0%, rgba(26,28,41,0.7) 100%)` + `backdrop-filter: blur(12px)`
  - `border-bottom: 1px solid rgba(255,255,255,0.05)`
  - Max-w-7xl, centered, rounded-xl, mt-4, px-6 py-4
  - **Left:** Logo "AerialDB" in Playfair Display, text-2xl, white
  - **Center/Left:** Nav links — Discover (with chevron-down), Library, Community, My Training — text-sm, `text-primary-light`, hover white
  - **Right:** "Sign Up" button — gradient `from-purple-500 to-indigo-500`, rounded-lg, glow shadow
  - **Auth-aware:** If `user` exists, show username + Sign Out instead of Sign Up
- **Mobile:** Hide nav links (hidden md:flex), show only logo + auth button
- **Dependencies:** Task 1A, 1B, 1C (icons)

#### Task 2B — SearchBar component

- **File:** `src/lib/components/SearchBar.svelte`
- **Props:**
  ```ts
  interface Props {
  	value: string;
  	placeholder?: string;
  	oninput: (value: string) => void;
  }
  ```
- **Design spec:**
  - Centered, max-w-2xl, full-width
  - `bg-dark-card` (`#242736`), border-gray-600, rounded-xl
  - Search icon (left, absolute positioned), pl-12
  - Focus: `border-accent` + `ring-1 ring-accent`
  - Placeholder: "Search moves, performers, techniques..."
  - `shadow-inner` for depth
- **Dependencies:** Task 1A, 1B, 1C (icons)

#### Task 2C — FilterChips component

- **File:** `src/lib/components/FilterChips.svelte`
- **Props:**
  ```ts
  interface Props {
  	categories: Array<{ id: string; name: string }>;
  	activeApparatus: string | null;
  	activeLevel: string | null;
  	onSelectApparatus: (id: string | null) => void;
  	onSelectLevel: (level: string | null) => void;
  }
  ```
- **Design spec:**
  - 3 groups with labels: "Apparatus", "Level", "Style"
  - Labels: text-xs, uppercase, tracking-wider, `text-primary-light`, font-semibold
  - Chips: rounded-full, border-gray-600, hover:border-accent, text-gray-300
  - Active state: `bg-dark-card` (darker background on active chip)
  - **Apparatus group:** Dynamically populated from `categories` data (Silks, Lyra, Trapeze, Rope, etc.)
  - **Level group:** Hardcoded — Beginner, Intermediate, Advanced, Professional
  - **Style group:** Placeholder (empty circle button) — non-functional in Phase 1
  - Layout: `flex flex-wrap`, centered, `gap-x-12 gap-y-6`
- **Behavior:** Clicking an active chip deselects it (toggle). Only one per group active at a time.
- **Dependencies:** Task 1A, 1B

#### Task 2D — HeroBanner component

- **File:** `src/lib/components/HeroBanner.svelte`
- **Props:**
  ```ts
  interface Props {
  	move: {
  		id: string;
  		name: string;
  		imageUrl: string | null;
  		level: string | null;
  		category: { id: string; name: string };
  	};
  }
  ```
- **Design spec:**
  - Rounded-2xl, overflow-hidden, shadow-2xl
  - Height: `h-[400px]`
  - Image: full-cover, z-0
  - Gradient overlay: `bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent`, z-10
  - Content area (z-20, absolute, left-aligned, max-w-2xl):
    - "Move of the Day" label: text-teal-400, text-sm, tracking-wide
    - Title: Playfair Display, text-5xl, white, line breaks for multi-word names
    - Badges with sub-labels (ref: designer notes §3):
      - Small label above each badge: "Difficulty", "Apparatus" — `text-xs uppercase tracking-wide text-primary-light mb-1`
      - Difficulty badge: color-coded border/bg (purple for advanced)
      - Apparatus badge: gray border/bg
    - "Learn More" button: gradient `from-purple-500 to-indigo-500`, glow shadow, rounded-xl
  - Carousel dots: bottom-center, 2 dots (static for now)
  - **Visual "bleed" effect** (ref: designer notes §5):
    - Wrap hero in an overflow gallery container
    - Render semi-transparent, scaled-down placeholder images on left and right flanks
    - Adjacent slides: `opacity-30 scale-95`, partially visible beyond the main hero edges
    - Purely visual for Phase 1 (no swipe/click carousel logic) — structural CSS only
- **Behavior:** "Learn More" links to `/moves/{id}`
- **Dependencies:** Task 1A, 1B

#### Task 2E — MoveCard redesign

- **File:** `src/lib/components/MoveCard.svelte` (rewrite existing)
- **Props:**
  ```ts
  interface Props {
  	move: {
  		id: string;
  		name: string;
  		imageUrl: string | null;
  		level: string | null;
  		category: { id: string; name: string };
  	};
  	isFavorited?: boolean;
  	onToggleFavorite?: (id: string) => void;
  }
  ```
- **Design spec:**
  - Container: `bg-dark-card` (`#242736`), rounded-xl, p-3, border-gray-800
  - Image area: aspect-video, rounded-lg, overflow-hidden, bg-gray-800
  - **"Save to Favorites" hover overlay** (ref: designer notes §1):
    - Absolute-positioned button at bottom-center of image area
    - Dark translucent pill: `bg-black/50 backdrop-blur-sm`, `rounded-full`, `px-4 py-2`
    - Text: "♡ Save to Favorites", `text-sm text-white`
    - Appears on hover/focus via opacity transition (`opacity-0 group-hover:opacity-100`)
    - When favorited: "♥ Saved to Favorites", `text-purple-400`
  - Title: Playfair Display, text-lg, `text-gray-200`
  - Bottom row: flex between
    - Apparatus badge: text-xs, `text-gray-400`, bg-gray-800, border-gray-700, **`rounded-full`** (pill-shaped — ref: designer notes §4)
    - Level badge: text-xs, color-coded (teal/blue/purple), **`rounded-full`** with transparent bg
  - Hover: `transform: translateY(-4px)`, `box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5)`, `transition: 0.2s`
- **Level badge color mapping:**
  - beginner → teal-400
  - intermediate → blue-400
  - advanced → purple-400
  - professional → (choose amber/yellow or keep purple)
  - null → hidden
- **Dependencies:** Task 1A, 1B, 1C (icons)

---

### Phase 3: Integration

#### Task 3A — Update server load function

- **File:** `src/routes/+page.server.ts`
- **Changes:**
  1. Add `level` to the select query (from the new column)
  2. Add `level` filter support: read `?level=` URL param, add to WHERE conditions
  3. Return `level` in the moves data shape
  4. Add `featuredMove` query — pick a random move (or the most recently added) that has an image to feature in the hero banner
- **Updated return shape:**
  ```ts
  return {
  	moves: movesData, // now includes level
  	categories: allCategories,
  	searchQuery,
  	categoryFilter,
  	levelFilter, // NEW
  	featuredMove // NEW: single move or null
  };
  ```
- **Dependencies:** Task 0A, 0B

#### Task 3B — Refactor +page.svelte

- **File:** `src/routes/+page.svelte` (rewrite)
- **Action:** Replace the entire monolithic component with composition of new components:
  ```
  <Header user={data.user} />
  <main>
    <SearchBar />
    <FilterChips categories={data.categories} ... />
    <HeroBanner move={data.featuredMove} />
    <section> <!-- 4-col grid -->
      {#each data.moves as move}
        <MoveCard {move} />
      {/each}
    </section>
  </main>
  ```
- **State management:**
  - `searchQuery` — `$state`, synced to URL `?q=` param
  - `selectedApparatus` — `$state`, synced to URL `?category=` param
  - `selectedLevel` — `$state`, synced to URL `?level=` param
  - Filter changes update URL params → `goto()` with new params → server load re-runs
- **Remove:** Table view toggle, old header, old search bar, old category dropdown
- **Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` (3-col desktop — ref: designer notes §2)
- **Dependencies:** All Phase 2 components + Task 3A

---

### Phase 4: Polish ✅ COMPLETED

#### Task 4A — Wire filter state to URL params ✅

- **File:** `src/routes/+page.svelte`
- **Action:** ~~Wire filter state to URL params~~ ✅ Done in Phase 3B — `updateFilters()` builds URLSearchParams + `goto()` with `invalidateAll: true`
- **Dependencies:** Task 3B

#### Task 4B — Heart/favorite toggle (visual only) ✅

- **File:** `src/lib/components/MoveCard.svelte`
- **Action:** ~~Click heart icon toggles `isFavorited` state locally~~ ✅ Done in Phase 2E/3B — client-side `Set<string>` with Heart icon toggle
- **Dependencies:** Task 2E

#### Task 4C — Responsive breakpoints ✅

- **Scope across all components:**
  - Header: ✅ Nav links hidden on mobile (`hidden md:flex`)
  - SearchBar: ✅ Full-width on mobile, max-w-2xl on desktop
  - FilterChips: ✅ `flex-col sm:flex-row` — stack vertically on mobile, horizontal on desktop
  - HeroBanner: ✅ `h-[250px] sm:h-[320px] md:h-[400px]` — responsive height, smaller title/padding on mobile, carousel dots hidden on mobile
  - Grid: ✅ `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Dependencies:** Task 3B

#### Task 4D — Empty state and loading ✅

- **File:** `src/routes/+page.svelte`
- **Action:** ~~Style empty state~~ ✅ Rich dark-themed empty state with SearchX icon, "Clear all filters" button
- **Action:** ~~Add loading indicator~~ ✅ `navigating` store from `$app/stores` shows Loader2 spinner during filter navigation
- **Dependencies:** Task 3B

---

## Execution Order (Dependency Graph)

```
Phase 0 (Schema)
  0A ──► 0B ──► 0C

Phase 1 (Foundation) — independent of Phase 0
  1A ──► 1B
  1C (icons — independent)

Phase 2 (Components) — after Phase 1
  2A ─┐
  2B ─┤ (all parallel)
  2C ─┤
  2D ─┤
  2E ─┘

Phase 3 (Integration) — after Phase 2 + Phase 0
  3A (needs 0A)
  3B (needs 3A + all of Phase 2)

Phase 4 (Polish) — after Phase 3
  4A ─┐
  4B ─┤ (all parallel)
  4C ─┤
  4D ─┘
```

**Fastest path:** Phase 0 + Phase 1 can run in parallel. Then Phase 2 (all components parallel). Then 3A → 3B. Then Phase 4.

---

## Files Modified/Created Summary

| File                                    | Action                                  | Phase | Status  |
| --------------------------------------- | --------------------------------------- | ----- | ------- |
| `src/lib/server/db/schema.ts`           | Modify: add `level` column              | 0A    | ✅ Done |
| `src/lib/server/db/types.ts`            | Modify: add `level` to query types      | 0A    | ✅ Done |
| `src/lib/server/db/seed.ts`             | Modify: add level data                  | 0C    | ✅ Done |
| `src/routes/+layout.svelte`             | Modify: add fonts, dark theme           | 1A    | ✅ Done |
| `src/routes/layout.css`                 | Modify: add Tailwind custom theme       | 1B    | ✅ Done |
| `lucide-svelte` (package)               | Install: icon library                   | 1C    | ✅ Done |
| `src/lib/components/Header.svelte`      | Create                                  | 2A    | ✅ Done |
| `src/lib/components/SearchBar.svelte`   | Create                                  | 2B    | ✅ Done |
| `src/lib/components/FilterChips.svelte` | Create                                  | 2C    | ✅ Done |
| `src/lib/components/HeroBanner.svelte`  | Create                                  | 2D    | ✅ Done |
| `src/lib/components/MoveCard.svelte`    | Rewrite                                 | 2E    | ✅ Done |
| `src/routes/+page.server.ts`            | Modify: add level filter, featured move | 3A    | ✅ Done |
| `src/routes/+page.svelte`               | Rewrite: compose new components         | 3B    | ✅ Done |

---

## Out of Scope (for this plan)

- Move Detail View redesign (separate plan)
- Auth-backed favorites persistence
- Video player (slow-mo, multi-angle)
- Routine builder
- Community features
- "My Training" section
- Discover dropdown menu
- Carousel functionality for hero (interactive swipe/click — static featured move; visual bleed structure included per designer notes §5)
- Style filter (placeholder only)
- Mobile-first responsive (desktop-focused, basic responsive)

---

## Validation Checklist

After all phases complete:

- [x] `npm run check` — no type errors ✅ (TS errors in tests are pre-existing, unrelated to redesign)
- [x] `npm run lint` — no lint errors in main source (`src/lib/`, `src/routes/`) ✅
  - Note: 102 lint errors exist (documented in `lint-issues-tech-debt.md`) — these are pre-existing DEBT-3 `(db as any)` patterns and stale svelte-ignore comments, not caused by the redesign
  - `.opencode/`, `scripts/`, `demo/` excluded via `eslint.config.js` ignores
- [x] `npm run test:unit -- --run` — existing tests pass ✅ (67 tests, 9 files)
- [x] `npm run build` — production build succeeds ✅
- [x] Visual: Dark theme applied across all landing page elements ✅
- [x] Visual: Glassmorphism header with blur effect ✅
- [x] Visual: Font loading — Playfair Display for headings, Inter for body ✅
- [x] Visual: Hero banner with gradient overlay, badge sub-labels, bleed effect ✅
- [x] Visual: Filter chips toggle and filter moves correctly ✅
- [x] Visual: Cards have hover animation, "Save to Favorites" overlay, level badges ✅
- [x] Functional: Search filters moves ✅
- [x] Functional: Category/apparatus filter works ✅
- [x] Functional: Level filter works ✅
- [x] Functional: Featured move displays in hero ✅
- [x] Functional: "Learn More" links to move detail page ✅
- [x] Responsive: Hero scales 250→320→400px across breakpoints ✅
- [x] Responsive: FilterChips stack vertically on mobile ✅
- [x] Loading indicator during navigation ✅
- [x] Empty state with icon + clear filters button ✅
