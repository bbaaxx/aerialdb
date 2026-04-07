## Context

The current `Header.svelte` is a 44-line component rendering only a logo and auth state (username + sign-out link). The Stitch mockups require a full navigation bar with 4 nav links, integrated search, upload button, and account dropdown — all wrapped in a glassmorphic floating pill style.

The header currently lives in `src/lib/components/Header.svelte` and is invoked from `src/routes/+page.svelte` with `user` data passed as a prop. The `SearchBar.svelte` component is rendered separately in the main content area. This design consolidates search into the header.

Stage 1 (Design Tokens & Visual Foundation) is assumed complete, providing all surface/semantic color tokens and typography scales used below.

## Goals / Non-Goals

**Goals:**

- Deliver a navigation header matching the Stitch mockup with glassmorphic styling
- Integrate search into the header via an icon-triggered inline field
- Add 4 navigation links with active-state indication
- Provide authenticated-user features: Upload Move button, account dropdown menu
- Create placeholder routes for new nav destinations
- Ensure mobile-responsive behavior: hamburger/nav collapse on small screens

**Non-Goals:**

- Implementing the upload flow (Stage 8, deferred)
- Implementing actual content for Tutorials/Theory/Community pages (Stage 7)
- Sidebar implementation (Stage 6)
- Any database or schema changes
- Implementing "My Library" or "Profile" pages (Stage 8)

## Decisions

### D1: Header rendered in root layout, not per-page

**Decision:** Move `<Header>` from `+page.svelte` to `+layout.svelte` so it appears on every page.

**Rationale:** The navigation bar is a global element — users should see it on auth pages, detail pages, and all future routes. The root layout already has access to `data.user` from `+layout.server.ts`.

**Alternative considered:** Keep in `+page.svelte` and add to each page individually — rejected because it leads to duplication and inconsistency.

### D2: Search implemented as a header-integrated expandable field

**Decision:** Search icon in the header bar. Clicking it slides open an inline search input field within the header (not a modal overlay). The existing `SearchBar.svelte` component is retained but now rendered inside the header's expanded state rather than in the main page content.

**Rationale:** Slide-down/inline is simpler to implement, maintains context (user can still see the page), and matches the Stitch mockups. A full modal overlay would add complexity with focus trapping and backdrop management.

**Alternative considered:** Full-screen search overlay — rejected as over-engineered for this use case.

### D3: Account menu as a client-side dropdown

**Decision:** Account circle icon triggers a positioned dropdown rendered with CSS (absolute positioning relative to the icon button). No portal or floating-ui library needed.

**Rationale:** The dropdown is simple (3 items: Profile, My Library, Sign Out). CSS positioning is sufficient. Adding a dependency like `floating-ui` is not warranted.

**Alternative considered:** Using `floating-ui` for robust positioning — rejected to avoid new dependencies for a simple dropdown.

### D4: Mobile navigation via hamburger menu

**Decision:** On screens below `lg` breakpoint, nav links collapse into a hamburger menu that slides down or opens a mobile nav panel.

**Rationale:** The Stitch mockups are desktop-focused. A hamburger menu is the standard responsive pattern. The mobile sidebar is explicitly hidden per the master plan decisions (Option A).

### D5: Active nav link detection via `$page.url.pathname`

**Decision:** Use SvelteKit's `$page` store to detect the current route and apply active styling to the matching nav link.

**Rationale:** Standard SvelteKit pattern. No custom state management needed. Works with all navigation methods (clicks, browser back/forward).

### D6: i18n for all new user-facing strings

**Decision:** All nav labels, menu items, and search text are added to `messages/en.json` and `messages/es.json` via Paraglide.

**Rationale:** Project convention requires i18n for all user-visible strings. Early addition prevents tech debt.

## Risks / Trade-offs

- **[Layout shift in +page.svelte]** Removing `<SearchBar>` from the main content and `<Header>` from `+page.svelte` changes the page structure → Careful testing of the home page layout after the move. Search state (query, debounce) needs to be lifted to the layout or passed via URL params (already using URL params).

- **[Header height on mobile]** Adding nav links + search + account menu to a mobile header could make it very tall → Use hamburger menu on mobile to collapse nav links. Search remains as icon-triggered.

- **[Glassmorphic performance]** `backdrop-filter: blur()` can cause paint thrashing on lower-end devices → The current header already uses `backdrop-filter: blur(12px)`, so no regression. Increase to 16px is minimal.

- **[Placeholder routes are dead ends]** `/tutorials`, `/theory`, `/community` will show "Coming Soon" → Acceptable. Clear UX with a message and link back to library. Full content comes in Stage 7.
