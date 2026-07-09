# AerialDB Enhancement Plan

## Purpose

This document captures UX and product enhancement opportunities discovered during review of the current AerialDB system. It is structured so each finding can be converted into actionable implementation tasks.

## Summary

AerialDB has a strong technical foundation: searchable move catalog, move detail pages, admin CRUD, responsive dark UI, SvelteKit server loading, i18n infrastructure, and Cloudflare-ready deployment.

The largest enhancement opportunities are expectation mismatches, incomplete user journeys, discovery gaps, and admin workflow friction. Most high-impact improvements are UI/state/routing work rather than schema-heavy changes.

## Priority Legend

- **P0:** High-impact issue causing confusion, broken expectations, or dead-end behavior.
- **P1:** Important UX improvement likely to affect core user satisfaction or retention.
- **P2:** Workflow and polish improvement that improves efficiency or clarity.
- **P3:** Accessibility, consistency, and content-quality polish.

## P0 Findings

| Area | Finding | Current Signal | User Impact | Recommended Action |
| --- | --- | --- | --- | --- |
| Public move detail | Admin edit affordance is visible to public users | Move detail page renders edit link unconditionally | Public users see action they may not be allowed to use; trust hit | Render edit link only for authenticated/admin users or move edit action into admin-only context |
| Header account menu | Account dropdown links point to routes that do not exist | `/account` and `/library` links appear in `Header.svelte` | Users hit dead ends | Remove links until implemented or create placeholder/account/library pages |
| Upload CTA | Header upload link points to `/upload`, which is a coming-soon page | Authenticated header exposes upload action | Logged-in users trying to contribute hit a dead end | Route CTA to `/admin/moves/new` if admin-only, or implement public upload flow |

## P1 Findings

| Area | Finding | Current Signal | User Impact | Recommended Action |
| --- | --- | --- | --- | --- |
| Global search | Search auto-submits after debounce and closes overlay | Header search submits after 300ms typing pause | Users can be navigated away before finishing input | Keep search open while typing and submit on Enter/button, or add live results panel |
| Favorites | Favorite state is client-local only | `MoveCard` uses local `Set` in home page state | "Saved" disappears on refresh; user expectation broken | Persist favorites via user account or localStorage, or rename affordance to avoid promise of persistence |
| Coming soon pages | Tutorials, theory, community, and upload are generic placeholders | Same basic coming-soon UI across routes | Navigation feels hollow | Add useful context, calls to action, and alternatives per page |
| Move discovery | Move detail page is a dead end after description | No related moves, next/previous, or category trail | Users must manually go back to continue browsing | Add related moves by category/level and previous/next navigation |
| Catalog metadata | Move cards do not show media/content completeness | Cards show image, category, level only | Users cannot judge whether a move has video/description before click | Add small metadata badges for video, image, description, and contributor |

## P2 Findings

| Area | Finding | Current Signal | User Impact | Recommended Action |
| --- | --- | --- | --- | --- |
| Mobile filters | Filter chips can become crowded as categories grow | Filter chips render all categories and levels inline | Mobile users may struggle scanning/filtering | Add active-filter summary and clear-all control; consider collapsible category groups |
| Admin dashboard | Dashboard is list-centric rather than workflow-centric | Stats exist, but table requires manual search | Admins must hunt for incomplete content | Add quick queues/filters: needs image, needs video, needs description, incomplete |
| Admin forms | Long create/edit forms have no draft protection | No dirty-state warning or draft save | Accidental navigation can lose work | Add dirty-state warning and local draft persistence for new/edit move forms |
| Media upload | File upload and video URL feedback are minimal | Plain file input and URL field | Errors discovered late | Add drag/drop upload zone, client file size/type validation, and video URL preview |
| i18n consistency | Many user-visible strings remain hardcoded | Mixed Paraglide and literal English strings | Spanish locale incomplete and inconsistent | Move visible strings into `messages/en.json` and `messages/es.json` |

## P3 Findings

| Area | Finding | Current Signal | User Impact | Recommended Action |
| --- | --- | --- | --- | --- |
| Accessibility | Delete modal lacks robust dialog behavior | Modal has no clear focus trap or dialog semantics | Keyboard/screen reader experience weaker | Add `role="dialog"`, focus trap, initial focus, Escape close, and focus return |
| Accessibility | Media status uses emoji/title-only cues in admin table | Icons rely on `title` attributes | Screen reader users may miss status | Use accessible labels or visually hidden text for media status |
| Content credibility | Move detail lacks freshness/source context | Contributor shown, but no updated date/source/variation info | Users cannot judge reliability or recency | Add last updated, contributor/source links, variations, prerequisites |
| Visual consistency | Some pages still use hardcoded gradients/buttons outside shared patterns | Auth/admin/public pages differ slightly | UI feels less systematized | Extract shared button/card/status patterns or standardize classes |

## Suggested Implementation Order

1. **Fix broken expectations:** hide public edit action, remove or implement dead account links, route upload CTA correctly.
2. **Improve discovery:** add related moves and metadata badges on cards.
3. **Make favorites real:** persist favorites or change the language/interaction.
4. **Refine search:** make search deliberate or add live result suggestions.
5. **Upgrade admin workflow:** add content-quality queues and better filtering.
6. **Protect contributor work:** add form dirty-state warnings and drafts.
7. **Improve content placeholders:** make coming-soon pages useful and specific.
8. **Complete i18n/a11y polish:** migrate hardcoded strings and improve modal/table semantics.

## Actionable Task Candidates

### P0 Tasks

- Add auth-aware conditional rendering for move detail edit link.
- Remove `/account` and `/library` links from account menu or create matching routes.
- Change authenticated upload CTA to `/admin/moves/new` or implement `/upload` flow.

### P1 Tasks

- Replace debounced auto-submit search with explicit submit or live search suggestions.
- Persist favorites using localStorage for anonymous users and database storage for authenticated users.
- Add related moves section to move detail pages using same category and/or level.
- Add media/completeness badges to `MoveCard`.
- Replace generic coming-soon pages with route-specific content and CTAs.

### P2 Tasks

- Add active filter summary and clear-all control to library page.
- Add admin dashboard quick filters for incomplete media/content.
- Add unsaved-change warning to create/edit move forms.
- Add local draft persistence for move creation.
- Add client-side image validation and video URL preview.
- Migrate remaining hardcoded strings to Paraglide messages.

### P3 Tasks

- Add accessible dialog behavior to delete confirmation modal.
- Replace emoji-only media indicators with accessible status components.
- Add last updated/contributor/source metadata to move detail pages.
- Standardize button/card/status styles across public, auth, and admin pages.

## Product Direction

AerialDB should evolve from a static catalog into a guided aerial skill library.

For learners:

- Help users answer "What can I learn next?" with related moves, levels, prerequisites, and media/content completeness.

For contributors/admins:

- Help admins answer "What needs work?" with quality queues and faster edit workflows.

For returning users:

- Help users answer "Where did I leave off?" with persistent favorites, recent views, and personalized continuation paths.

## Notes

- Current workspace checkout may lag recently merged PRs; re-sync local `dev` before implementing tasks from this plan.
- Prefer small, focused PRs: one UX behavior or workflow improvement per change.
- Preserve existing Svelte 5 runes patterns and Paraglide i18n conventions.
