# Design System Port — Implementation Plan

**Created:** 2026-03-29
**Status:** Draft
**Scope:** Auth pages (Login, Signup) + Admin section (layout, dashboard, forms)
**Reference:** `main-page-redesign.md` (source design), `designer_notes_for_redesign.md`

---

## Overview

Port the dark theme design system from the main Exploration Library to the Auth pages (Login, Signup) and Admin section (layout, dashboard, forms). The main page redesign established:

- Dark navy palette (`#1A1C29` base, `#242736` card)
- Glassmorphism header with `backdrop-filter: blur(12px)`
- Purple accent (`#8A63F8`) for CTAs and active states
- Playfair Display serif headings + Inter sans-serif body
- Purple-to-indigo gradient buttons with glow shadow
- Pill-shaped badges (`rounded-full`)
- Level badge colors: teal (beginner), blue (intermediate), purple (advanced)

**Source design tokens:** See `main-page-redesign.md` § Design Tokens for full reference.

---

## Design Tokens to Apply

| Token              | Value                                                | Usage                            |
| ------------------ | ---------------------------------------------------- | -------------------------------- |
| Dark base          | `#1A1C29`                                            | Page background                  |
| Dark card          | `#242736`                                            | Card backgrounds, inputs         |
| Dark glass         | `rgba(36,39,54,0.7)` + `backdrop-filter: blur(10px)` | Auth card glass effect           |
| Primary accent     | `#8A63F8` (purple)                                   | CTAs, focus rings, active states |
| Accent gradient    | `from-purple-500 to-indigo-500`                      | Submit buttons                   |
| Accent glow        | `shadow-[0_0_15px_rgba(138,99,248,0.5)]`             | CTA buttons                      |
| Primary text light | `#A0A5C0`                                            | Labels, muted text               |
| Heading font       | Playfair Display (serif)                             | Page titles                      |
| Body font          | Inter (sans-serif)                                   | Form labels, body copy           |

---

## Current State vs Target

### Auth Pages (Login & Signup)

| Aspect      | Current                                          | Target                                                       |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------ |
| Background  | `bg-gradient-to-br from-blue-50 to-indigo-100`   | `bg-dark-base` (`#1A1C29`)                                   |
| Card        | White (`bg-white`), rounded-2xl, shadow-xl       | `bg-dark-card` (`#242736`), glass effect, purple border glow |
| Headings    | `text-gray-900`, system sans-serif               | Playfair Display, white                                      |
| Labels      | `text-gray-700`, medium weight                   | `text-primary-light` (`#A0A5C0`), normal weight              |
| Inputs      | White bg, `border-gray-300`, blue-500 focus ring | `bg-dark-card`, `border-gray-600`, purple focus ring         |
| Input text  | `text-gray-900`                                  | `text-gray-200`                                              |
| Placeholder | `text-gray-500`                                  | `text-gray-400`                                              |
| Submit btn  | `bg-blue-600`, rounded-lg                        | Gradient `from-purple-500 to-indigo-500`, glow shadow        |
| Error       | `border-red-200`, `bg-red-50`, `text-red-800`    | `border-red-500/50`, `bg-red-500/10`, `text-red-400`         |
| Links       | `text-blue-600`, underline                       | `text-accent-purple`, hover glow                             |

### Admin Layout

| Aspect      | Current                              | Target                                                 |
| ----------- | ------------------------------------ | ------------------------------------------------------ |
| Background  | `bg-zinc-50`                         | `bg-dark-base` (`#1A1C29`)                             |
| Header      | White bar, `border-zinc-200`         | Glassmorphism sticky bar (match Header.svelte pattern) |
| Header text | `text-zinc-900`                      | White                                                  |
| Nav links   | `text-zinc-700`, hover `bg-zinc-100` | `text-primary-light`, hover white + subtle bg          |
| Logout btn  | `border-zinc-300`, `text-zinc-700`   | Ghost button: `text-primary-light`, hover white        |
| Content     | White cards, `border-zinc-200`       | `bg-dark-card` cards, `border-gray-800`                |

### Admin Forms (New Move, Edit Move, Categories)

| Aspect      | Current                                           | Target                                                |
| ----------- | ------------------------------------------------- | ----------------------------------------------------- |
| Card bg     | White (`bg-white`)                                | `bg-dark-card` (`#242736`)                            |
| Card border | `border-zinc-200`                                 | `border-gray-800`                                     |
| Headings    | `text-zinc-900`                                   | White                                                 |
| Labels      | `text-zinc-700`                                   | `text-primary-light` (`#A0A5C0`)                      |
| Inputs      | White/dark bg, `border-zinc-300`, blue focus ring | `bg-dark-card`, `border-gray-600`, purple focus ring  |
| Input text  | `text-zinc-900` / `text-zinc-100`                 | `text-gray-200`                                       |
| Select      | White/dark bg, `border-zinc-300`                  | `bg-dark-card`, `border-gray-600`                     |
| File input  | `file:bg-blue-50`                                 | `file:bg-dark-card` (keep file styling subtle)        |
| Submit btn  | `bg-blue-600`                                     | Gradient `from-purple-500 to-indigo-500`, glow shadow |
| Cancel btn  | `border-zinc-300`, `text-zinc-700`                | Ghost: `border-gray-600`, `text-primary-light`        |
| Error/alert | `border-red-200`, `bg-red-50`                     | `border-red-500/50`, `bg-red-500/10`                  |

### Admin Dashboard

| Aspect      | Current                         | Target                                   |
| ----------- | ------------------------------- | ---------------------------------------- |
| Page bg     | `bg-zinc-50`                    | `bg-dark-base`                           |
| Stats cards | White, `border-zinc-200`        | `bg-dark-card`, `border-gray-800`        |
| Stat labels | `text-zinc-600`                 | `text-primary-light`                     |
| Stat values | `text-zinc-900`                 | White                                    |
| Table       | White header, `border-zinc-200` | `bg-dark-card` header, `border-gray-800` |
| Table text  | `text-zinc-700`                 | `text-gray-300`                          |

---

## Task Breakdown

### Phase 1: Auth Pages

#### Task 1A — Login Page Redesign

- **File:** `src/routes/auth/login/+page.svelte`
- **Changes:**
  1. Container: Replace `bg-gradient-to-br from-blue-50 to-indigo-100` with `bg-dark-base`
  2. Card: Replace `bg-white` with `bg-dark-card`, add `border border-gray-800`, add subtle `shadow-2xl`
  3. Heading: Replace `text-gray-900` with white, add `font-serif` (Playfair Display)
  4. Subtitle: Replace `text-gray-600` with `text-primary-light`
  5. Labels: Replace `text-gray-700` with `text-primary-light`
  6. Inputs:
     - Replace `bg-white`/`bg-zinc-50` with `bg-dark-card`
     - Replace `border-gray-300` with `border-gray-600`
     - Replace `text-gray-900` with `text-gray-200`
     - Replace `placeholder-gray-400` with `placeholder-gray-400` (keep)
     - Replace `focus:ring-blue-500` with `focus:border-accent-purple` + `focus:ring-1 focus:ring-accent-purple`
  7. Error state: Update border to `border-red-500`, bg to `bg-red-500/10`, text to `text-red-400`
  8. Submit button: Replace `bg-blue-600` with gradient `from-purple-500 to-indigo-500`, add glow shadow
  9. Links: Replace `text-blue-600` with `text-accent-purple hover:drop-shadow-[0_0_8px_rgba(138,99,248,0.6)]`
  10. Sign up link text: `text-primary-light`
- **Validation:** Page renders with dark theme, form is functional
- **Dependencies:** None

#### Task 1B — Signup Page Redesign

- **File:** `src/routes/auth/signup/+page.svelte`
- **Changes:** Same pattern as Task 1A (Login page)
- **Additional:**
  - Confirm password field styling matches password field
  - Help text: Replace `text-gray-500` with `text-gray-400`
- **Validation:** Page renders with dark theme, form is functional
- **Dependencies:** Task 1A (can run in parallel)

### Phase 2: Admin Layout

#### Task 2A — Admin Layout Header Redesign

- **File:** `src/routes/admin/+layout.svelte`
- **Changes:**
  1. Container: Replace `bg-zinc-50` with `bg-dark-base`
  2. Header bar:
     - Replace `bg-white border-b border-zinc-200` with glassmorphism pattern:
       ```svelte
       class="sticky top-0 z-50 border-b border-white/5" style="background: linear-gradient(180deg,
       rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
       ```
  3. Logo: Replace `text-zinc-900` with white, add `font-serif`
  4. Nav links: Replace `text-zinc-700 hover:bg-zinc-100` with `text-primary-light hover:text-white hover:bg-white/5`
  5. Active nav: Add `text-white` instead of `text-zinc-700`
  6. Username: Replace `text-zinc-600` with `text-primary-light`
  7. Logout button: Replace `border-zinc-300 text-zinc-700 hover:bg-zinc-50` with ghost button style: `text-primary-light hover:text-white hover:bg-white/5 border border-gray-700`
- **Consideration:** The admin layout should reuse the `Header` component pattern from `src/lib/components/Header.svelte` if possible, or replicate its glassmorphism styling
- **Validation:** Header matches main page header aesthetic
- **Dependencies:** None

### Phase 3: Admin Forms

#### Task 3A — New Move Form Redesign

- **File:** `src/routes/admin/moves/new/+page.svelte`
- **Changes:**
  1. Page title: Replace `text-zinc-900` with white, add `font-serif`
  2. Subtitle: Replace `text-zinc-600` with `text-primary-light`
  3. Error alert: Update to dark theme error style
  4. Form cards:
     - Replace `bg-white border-zinc-200` with `bg-dark-card border-gray-800`
     - Replace `text-zinc-900` headings with white
  5. Labels: Replace `text-zinc-700` with `text-primary-light`
  6. Inputs:
     - Replace `bg-zinc-50`/`bg-zinc-800` with `bg-dark-card`
     - Replace `border-zinc-300`/`border-zinc-700` with `border-gray-600`
     - Replace `text-zinc-900`/`text-zinc-100` with `text-gray-200`
     - Replace `focus:ring-blue-500` with purple focus ring
  7. Select: Same treatment as inputs
  8. File input: Keep file styling subtle, match dark theme
  9. Submit button: Gradient purple-to-indigo with glow
  10. Cancel button: Ghost style — `border-gray-600 text-primary-light hover:bg-white/5`
  11. Image preview border: Replace `border-zinc-200` with `border-gray-700`
- **Validation:** Form is functional, dark theme consistent
- **Dependencies:** Task 2A

#### Task 3B — Edit Move Form Redesign

- **File:** `src/routes/admin/moves/[id]/edit/+page.svelte`
- **Changes:** Same pattern as Task 3A
- **Dependencies:** Task 2A

#### Task 3C — Categories Page Redesign

- **File:** `src/routes/admin/categories/+page.svelte`
- **Changes:** Same card/table darkening as other admin pages
- **Dependencies:** Task 2A

### Phase 4: Admin Dashboard

#### Task 4A — Dashboard Stats & Table Redesign

- **File:** `src/routes/admin/+page.svelte`
- **Changes:**
  1. Page bg: `bg-dark-base`
  2. Stats cards: `bg-dark-card border-gray-800`
  3. Stat labels: `text-primary-light`
  4. Stat values: White
  5. Table: Dark card header, `border-gray-800`
  6. Table text: `text-gray-300`
  7. Action links: Purple accent
- **Validation:** Dashboard renders correctly with dark theme
- **Dependencies:** Task 2A

### Phase 5: Polish

#### Task 5A — Dark Mode Toggle Consideration

- **Scope:** The main page uses `dark:` variants since the base is already dark. Auth and admin pages should follow the same pattern — dark is the base, no toggle needed for this phase.
- **Action:** Verify all pages use `dark:` variants correctly where applicable (though base is dark, some components may need explicit `dark:` for contrast)
- **Dependencies:** All previous phases

#### Task 5B — Responsive Check

- **Scope:** Auth pages and admin should be mobile-friendly
- **Checks:**
  - Auth cards: Full-width on mobile, `max-w-md` on desktop
  - Admin header: Mobile menu consideration (out of scope for this phase, but ensure no horizontal scroll)
  - Forms: Stack properly on mobile
- **Dependencies:** All previous phases

---

## Execution Order (Dependency Graph)

```
Phase 1 (Auth Pages)
  1A ─┐
  1B ─┘ (parallel)

Phase 2 (Admin Layout)
  2A (depends on Phase 1 understanding — can run parallel with Phase 1)

Phase 3 (Admin Forms)
  3A ─┐
  3B ─┤ (parallel — all depend on Phase 2)
  3C ─┘

Phase 4 (Admin Dashboard)
  4A (depends on Phase 2)

Phase 5 (Polish)
  5A ─┐ (parallel)
  5B ─┘
```

**Recommended parallelization:** Phase 1A + 1B can run together. Phase 3A, 3B, 3C are independent of each other.

---

## Files to Modify

| File                                            | Action | Phase |
| ----------------------------------------------- | ------ | ----- |
| `src/routes/auth/login/+page.svelte`            | Modify | 1A    |
| `src/routes/auth/signup/+page.svelte`           | Modify | 1B    |
| `src/routes/admin/+layout.svelte`               | Modify | 2A    |
| `src/routes/admin/moves/new/+page.svelte`       | Modify | 3A    |
| `src/routes/admin/moves/[id]/edit/+page.svelte` | Modify | 3B    |
| `src/routes/admin/categories/+page.svelte`      | Modify | 3C    |
| `src/routes/admin/+page.svelte`                 | Modify | 4A    |

---

## Out of Scope

- Move Detail View redesign (separate plan)
- Auth-backed favorites persistence
- Video player
- Routine builder
- Community features
- "My Training" section
- Mobile admin navigation menu
- Dark/light mode toggle (dark is base for this project)
- Image upload redesign (keep functional, update styling only)

---

## Validation Checklist

After all phases complete:

- [ ] `npm run check` — no type errors
- [ ] `npm run lint` — no lint errors
- [ ] `npm run test:unit -- --run` — existing tests pass
- [ ] `npm run build` — production build succeeds
- [ ] Login page: Dark theme applied, form functional
- [ ] Signup page: Dark theme applied, form functional
- [ ] Admin layout: Glassmorphism header matches main page
- [ ] Admin forms: Dark theme, inputs have purple focus rings
- [ ] Admin dashboard: Stats and table use dark theme
- [ ] All buttons use purple gradient with glow (where appropriate)
- [ ] All text uses correct color tokens (primary-light for labels, white for headings)
- [ ] Error states use red-500/purple theme
- [ ] Links use accent-purple
- [ ] Responsive: Auth and admin usable on mobile
