# AerialDB Design Redesign — Master Plan

**Date:** 2026-04-01
**Status:** Approved — Ready for Implementation
**Source:** Stitch screens "Exploration Library (Logged Out)" + "Exploration Library (Logged In - Updated)" from the "Etheric Pro" design system

---

## Overview

This plan addresses the redesign of AerialDB's exploration library to match the new Stitch design mockups. It is organized into 9 stages, each building on the previous. Stages 1–7 cover the core redesign; stages 8–9 are fully deferred (Upload Flow + Premium Tier).

**Key principle:** Every stage should leave the app in a working, deployable state. No half-finished migrations.

### Decided Design Decisions

| #   | Decision           | Resolution                                                                                                             |
| --- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Move type taxonomy | **Column approach** — `move_type TEXT` on `moves`, nullable/optional. NOT a tag system.                                |
| 2   | Level rename       | **Rename in DB** — `professional` → `master`. Must migrate 100+ existing records AND update seed scripts.              |
| 3   | View counting      | **Simple counter** — `view_count INT DEFAULT 0` on `moves`. No analytics table.                                        |
| 4   | Premium flag       | **Fully deferred.** No `is_premium` column now. Premium concept may be entirely rethought — no paywall blocking moves. |
| 5   | Hero background    | **Hybrid** — curated default image + dynamic override from featured move when available.                               |
| 6   | Mobile sidebar     | **Hidden (Option A).** No sidebar on mobile. Desktop-only. Can enhance later.                                          |

---

## Stage 1 — Design Tokens & Visual Foundation

**Goal:** Update the visual language (colors, surfaces, typography, borders) to match the "Etheric Pro" / "Digital Observatory" design system before touching any layout or component changes.

### 1.1 Expand Tailwind theme tokens

Map the design system's named colors to Tailwind custom properties in `src/routes/layout.css`:

- Surface tiers: `surface`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`, `surface-container-lowest`
- Semantic colors: `primary`, `primary-container`, `secondary`, `on-surface`, `on-surface-variant`, `outline`, `outline-variant`
- Error palette: `error`, `error-container`, `on-error`, `on-error-container`
- Inverse colors: `inverse-surface`, `inverse-on-surface`, `inverse-primary`
- Accent tokens: keep `accent-purple` → align to `primary` (#cebdff) and `primary-container` (#9b7aff)

### 1.2 Replace Playfair Display with Noto Serif

- Update Google Fonts link in `+layout.svelte`: swap `Playfair Display` → `Noto Serif`
- Update `--font-serif` in theme: `'Noto Serif', Georgia, serif`

### 1.3 Implement the "No-Line" rule

- Audit all existing `border` and `border-*` usage across components
- Replace structural borders with tonal surface shifts (background-color transitions)
- Where borders are needed for accessibility, use `outline-variant` at 15% opacity ("Ghost Border")

### 1.4 Define spacing tokens

Map the design system spacing scale:

| Token        | Value  | Tailwind utility |
| ------------ | ------ | ---------------- |
| `spacing-4`  | 1rem   | `p-4`, `gap-4`   |
| `spacing-6`  | 1.5rem | `p-6`, `gap-6`   |
| `spacing-8`  | 2rem   | `p-8`, `gap-8`   |
| `spacing-10` | 2.5rem | `p-10`           |
| `spacing-12` | 3rem   | `p-12`           |
| `spacing-16` | 4rem   | `p-16`           |
| `spacing-24` | 6rem   | `p-24`           |

### 1.5 Typography scale

Define and apply the editorial type scale:

| Level         | Font       | Size            | Weight | Usage                          |
| ------------- | ---------- | --------------- | ------ | ------------------------------ |
| `display-lg`  | Noto Serif | 3.5rem (56px)   | 700    | Hero statements                |
| `headline-lg` | Noto Serif | 2.0rem (32px)   | 600    | Section anchors                |
| `title-lg`    | Inter      | 1.375rem (22px) | 500    | Card titles, component headers |
| `body-lg`     | Inter      | 1.0rem (16px)   | 400    | Body text                      |
| `body-md`     | Inter      | 0.875rem (14px) | 400    | Secondary body                 |
| `label-md`    | Inter      | 0.75rem (12px)  | 500    | Labels, metadata, tags         |

**Deliverable:** All visual tokens updated; app looks like the new design system but with old layout.

---

## Stage 2 — Header & Navigation Redesign

**Goal:** Replace the current minimal header with the full navigation bar from the mockups.

### 2.1 Navigation links

Add 4 nav items: **Library**, **Tutorials**, **Theory**, **Community**

- Library → `/` (existing home)
- Tutorials → `/tutorials` (placeholder for now)
- Theory → `/theory` (placeholder for now)
- Community → `/community` (placeholder for now)

### 2.2 Header search icon

Move search from a standalone SearchBar component to an **icon in the header** that expands/opens a search overlay or inline field.

- Search icon (magnifier) in the header bar
- Clicking opens a search input (slide-down or modal)
- Debounced search behavior preserved from current implementation

### 2.3 Upload Move button (logged in)

- Show **"Upload Move"** button with upload icon when user is authenticated
- Links to `/upload` route (placeholder for now, full flow in Stage 8)

### 2.4 Account menu (logged in)

Replace "Hi, username + Sign Out" with:

- **Account circle icon** button
- Dropdown menu on click with: Profile, My Library, Sign Out
- Dropdown uses `surface-container-high` + glassmorphism per design system

### 2.5 Glassmorphic header styling

Apply the floating pill/bar style:

- `surface-variant` at 50% opacity
- `backdrop-blur: 16px`
- Rounded corners (pill shape on larger screens)
- Remove current `border-bottom` in favor of tonal separation

**Deliverable:** Full navigation header matching the Stitch mockup.

---

## Stage 3 — Filter System Redesign

**Goal:** Replace chip-based filters with dropdown selects; add the "Style" dimension.

### 3.1 Schema: Add `style` column to `moves`

```sql
ALTER TABLE moves ADD COLUMN style TEXT;
-- Values: 'contemporary' | 'classical' | 'power' | 'flow' | NULL
```

- Add to Drizzle schema in `src/lib/server/db/schema.ts`
- Generate and run migration
- Update seed data with style values
- Update `+page.server.ts` to accept `?style=` query param

### 3.1b Data migration: Rename `professional` → `master`

This is a data migration, not a schema change:

```sql
UPDATE moves SET level = 'master' WHERE level = 'professional';
```

- Run as part of the same migration batch as §3.1
- Update Drizzle schema comment in `src/lib/server/db/schema.ts` (change `'professional'` → `'master'`)
- Update seed script `src/lib/server/db/seed.ts` — replace all `'professional'` values with `'master'`
- Update i18n messages if `professional` appears as a display string
- Scope: ~100+ existing records

### 3.2 Dropdown filter component

Create a reusable `FilterDropdown` component:

- Label (e.g., "Apparatus: All")
- Dropdown with options
- Design: `surface-container-lowest` bg, rounded, ghost border
- On change: updates URL params (same pattern as current chips)

### 3.3 Three-filter row

Replace `FilterChips` with a horizontal row of 3 dropdowns:

1. **Apparatus** — populated from `categories` table
2. **Level** — Beginner / Intermediate / Advanced / Master (note: "Master" replaces "Professional" — requires DB migration of 100+ records + seed script update)
3. **Style** — Contemporary / Classical / Power / Flow

### 3.4 Results count

Add "Showing {n} moves" text aligned with the filter row.

### 3.5 Update server load function

Extend `+page.server.ts`:

- Parse `style` query param
- Add `style` condition to query builder
- Return `styleFilter` to page data

**Deliverable:** Three dropdown filters replacing chip filters; style dimension queryable.

---

## Stage 4 — Move Card Redesign

**Goal:** Update move cards to match the new design with stats, type icons, and badges.

### 4.1 Schema: Add `move_type` column (nullable, optional)

```sql
ALTER TABLE moves ADD COLUMN move_type TEXT;
-- Values: 'static' | 'dynamic' | 'drop' | 'transition' | NULL
```

- Add to Drizzle schema (nullable — not all moves need a type)
- Generate and run migration
- Update seed data

### 4.2 Schema: View tracking

**Decided: Simple counter column.** Add `view_count INTEGER DEFAULT 0` to `moves`. Increment on move detail page load. No analytics/junction table.

```sql
ALTER TABLE moves ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
```

### 4.3 Schema: Favorite tracking

Create `user_favorites` table:

```sql
CREATE TABLE user_favorites (
    user_id TEXT NOT NULL REFERENCES user(id),
    move_id TEXT NOT NULL REFERENCES moves(id),
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, move_id)
);
```

### 4.4 Card layout update

New card structure (top to bottom):

1. **Image area** with aspect ratio (same as current)
2. **Level badge** — overlaid on image (top-left or top-right)
3. **"New" badge** — conditionally shown for moves created in last 7 days
4. **Move name** — title-lg font
5. **"Category: {name}"** — label-md, on-surface-variant color
6. **Move type icon** — cyclone (dynamic), accessibility_new (static), south (drop), sync_alt (transition)
7. **Stats row** — view count (visibility icon) + favorite count (heart icon)

### 4.5 "New" badge logic

- Compare `move.createdAt` to current date
- Show "New" badge if within 7 days
- Styling: small pill, primary color, surface-container background

### 4.6 Hover/interaction updates

- Keep current hover lift effect
- Update shadow to match design system: `0 20px 40px rgba(0,0,0,0.4)`
- Background: `surface-container-low` (no border)

**Deliverable:** Move cards match the Stitch design with stats, badges, type icons.

---

## Stage 5 — Hero Banner Update

**Goal:** Update the hero section to include move description and new CTAs.

### 5.1 Add description to hero

- Display `move.description` below the title
- Truncate to 2–3 lines with ellipsis
- Use `body-lg` / `on-surface-variant` color

### 5.2 "Watch Tutorial" button

- Show **play_circle** icon + "Watch Tutorial" text
- Only displayed when `move.videoUrl` is present
- Links to video (opens in new tab or inline player)

### 5.3 "Save to Library" button

- Heart/Bookmark icon + "Save to Library" text
- Only shown for logged-in users
- Toggles `user_favorites` entry (requires API endpoint)
- Persisted to DB (not just client state like current implementation)

### 5.4 Background image (Hybrid approach)

**Decided: Hybrid** — curated default image + dynamic override from featured move when available.

- Curated atmospheric hero image as default background
- If featured move has an image, use it as override
- Heavy gradient overlay from left for text readability
- Matches the "Digital Observatory" aesthetic
- Fallback gracefully when no move image is available

**Deliverable:** Hero banner with description, Watch Tutorial, Save to Library.

---

## Stage 6 — Library Explorer Sidebar (Logged In)

**Goal:** Add the left sidebar that appears when a user is authenticated.

### 6.1 Sidebar component

Create `LibraryExplorer.svelte`:

- Fixed/sticky left sidebar (hidden on mobile, visible on lg+)
- "Library Explorer" header with user's level badge
- Move type filter: All Moves / Static / Dynamic / Drops / Transitions (icon buttons)
- Grid/List view toggle (grid_view icon)

### 6.2 Integration with main layout

- Show sidebar only when `data.user` exists
- Main content area adjusts: adds left margin/padding on lg+
- **Mobile: completely hidden.** No sidebar on mobile — desktop only. Can enhance later.

### 6.3 Move type filtering

- Clicking a move type icon filters the moves grid
- Update URL params with `?type=static|dynamic|drop|transition`
- Server load function parses `type` param and adds condition

### 6.4 Grid/List view toggle

- Grid view: current card grid (3-col)
- List view: horizontal cards (image left, details right)
- Store preference in localStorage or user preferences

**Deliverable:** Sidebar with move type filters and view toggle for logged-in users.

---

## Stage 7 — Footer & Static Pages

**Goal:** Add the footer and placeholder pages for linked sections.

### 7.1 Footer component

Create `Footer.svelte` with:

- AerialDB logo/wordmark
- Links: Privacy Policy, Terms of Service, Contact, Safety Guidelines
- Copyright line: "© 2026 AerialDB Exploration Library. The Digital Observatory."
- Background: `surface-container-lowest` or darker than main bg
- Layout: horizontal links on desktop, stacked on mobile

### 7.2 Static placeholder pages

Create minimal pages (skeleton + "Coming Soon" message):

- `/tutorials/+page.svelte`
- `/theory/+page.svelte`
- `/community/+page.svelte`

### 7.3 Legal/static pages

Create content pages:

- `/privacy/+page.svelte` — Privacy Policy
- `/terms/+page.svelte` — Terms of Service
- `/contact/+page.svelte` — Contact info
- `/safety/+page.svelte` — Safety Guidelines

**Deliverable:** Footer on all pages; nav links route to real pages.

---

## Stage 8 — Upload Flow & User Library (Deferred)

**Goal:** Enable move uploads and personal library management. This stage is **deferred** and may not be included in the initial redesign release.

### 8.1 Upload Move route

- `/upload/+page.svelte` — form with: name, category, level, style, moveType, description, contributor, image upload, video URL
- `/upload/+page.server.ts` — form action handling
- Image upload to R2
- Server-side validation

### 8.2 My Library page

- `/library/+page.svelte` — user's saved/favorited moves
- Filter by move type, category, level
- Remove from library action

### 8.3 Account profile page

- `/account/+page.svelte` — basic profile info
- Update username
- View upload history

### 8.4 Upload review workflow (admin)

- Admin can review user-submitted moves
- Approve/reject with feedback
- Approved moves appear in public library

---

## Stage 9 — Premium Tier (Fully Deferred — May Never Ship)

**Goal:** Implement gated premium content. This stage is **fully deferred** and may be entirely excluded. The premium concept will likely be rethought — moves will NOT be blocked behind a paywall.

### 9.1 Schema: Premium flags

```sql
ALTER TABLE moves ADD COLUMN is_premium INTEGER DEFAULT 0;
-- OR
CREATE TABLE user_subscriptions (
    user_id TEXT NOT NULL REFERENCES user(id),
    tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
    expires_at INTEGER,
    PRIMARY KEY (user_id)
);
```

### 9.2 Premium CTA section

"Deepen Your Practice" section:

- Shown to non-premium users
- Marketing copy about exclusive content
- "Explore Pro Library" CTA button
- Place above footer on the main library page

### 9.3 Content gating

- Moves with `is_premium = true` shown as locked cards (blurred image, lock icon)
- Clicking opens upsell modal
- Premium users see all content normally

### 9.4 Pro Library page

- `/pro/+page.svelte` — curated sequences, exclusive content
- Requires subscription
- Integration with payment provider (out of scope for now)

---

## Cross-Cutting Concerns

These apply across all stages:

### Testing

- Update existing `MoveCard.svelte.spec.ts` and `page.svelte.spec.ts` after each stage
- Add tests for new components (FilterDropdown, LibraryExplorer, Footer)
- Server tests for new query params (style, type filters)
- DB migration tests

### i18n

- All new user-visible strings must go into `messages/en.json` and `messages/es.json`
- Import from `$lib/paraglide/messages.js`
- New strings: nav items, filter labels, badge text, footer links, CTA copy

### Accessibility

- Minimum 44px hit targets per design system
- Keyboard navigation for dropdowns, sidebar, account menu
- ARIA labels for icon-only buttons
- Focus management for search overlay

### Dark Mode

- The new design is dark-only; verify all components work on the dark surface hierarchy
- If light mode is desired later, the design system tokens support it but it's out of scope

---

## Dependency Map

```
Stage 1 (Tokens) ──► Stage 2 (Header) ──► Stage 5 (Hero)
                   ──► Stage 3 (Filters)
                   ──► Stage 4 (Cards)  ──► Stage 6 (Sidebar)
                                        ──► Stage 5 (Hero)
Stage 2 (Header)  ──► Stage 7 (Footer + Pages)
Stage 4 (Cards)   ──► Stage 6 (Sidebar)
Stage 6 (Sidebar) ──► Stage 8 (Upload + Library) [deferred]
Stage 8           ──► Stage 9 (Premium) [deferred]
```

**Recommended execution order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → (8 → 9 deferred)

---

## Database Migration Summary

All schema changes consolidated here for a single view. These changes are distributed across Stages 3–4.

### New columns on `moves` table

| Column       | Type      | Default | Stage | Notes                                                                        |
| ------------ | --------- | ------- | ----- | ---------------------------------------------------------------------------- |
| `style`      | `TEXT`    | `NULL`  | 3     | Values: `'contemporary'` \| `'classical'` \| `'power'` \| `'flow'` \| `NULL` |
| `move_type`  | `TEXT`    | `NULL`  | 4     | Values: `'static'` \| `'dynamic'` \| `'drop'` \| `'transition'` \| `NULL`    |
| `view_count` | `INTEGER` | `0`     | 4     | Simple counter, incremented on move detail page load                         |

### New table: `user_favorites`

```sql
CREATE TABLE user_favorites (
    user_id TEXT NOT NULL REFERENCES user(id),
    move_id TEXT NOT NULL REFERENCES moves(id),
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, move_id)
);
```

### Data migration: `level` value rename

```sql
UPDATE moves SET level = 'master' WHERE level = 'professional';
```

- **Stage:** 3 (filter redesign)
- **Scope:** ~100+ existing records
- **Also update:** seed script (`src/lib/server/db/seed.ts`), Drizzle schema comment, i18n messages

### Migration strategy

All three `ALTER TABLE` additions + the new table + data migration can be done in a single Drizzle migration file. Execute with `npm run db:generate` then `npm run db:migrate`. For local dev, `npm run db:push` applies schema directly.

### Current `moves` schema (for reference)

```ts
// Existing columns in src/lib/server/db/schema.ts
export const moves = sqliteTable('moves', {
	id: text('id').primaryKey(), // TEXT (UUID)
	name: text('name').notNull(),
	categoryId: text('category_id')
		.notNull()
		.references(() => categories.id),
	description: text('description'),
	imageUrl: text('image_url'),
	videoUrl: text('video_url'),
	level: text('level'), // TEXT — values being renamed
	contributorName: text('contributor_name'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
	// NEW: style, move_type, view_count (added in Stages 3-4)
});
```

---

## Open Questions

~~All open questions have been resolved. See the Decided Design Decisions table at the top of this document.~~

**No remaining open questions. Plan is approved for implementation.**
