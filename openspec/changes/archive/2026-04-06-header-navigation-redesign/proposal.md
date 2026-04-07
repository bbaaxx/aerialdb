## Why

The current header is a minimal logo + auth bar with no navigation links, no search integration, and no account menu. The Stitch mockups define a full glassmorphic navigation bar with 4 nav items, an integrated search icon, an "Upload Move" button for logged-in users, and an account dropdown. This stage replaces the existing `Header.svelte` with that full navigation experience, which is a prerequisite for all subsequent stages (footer, static pages, sidebar).

## What Changes

- Replace `Header.svelte` with a full navigation bar containing 4 nav links: Library, Tutorials, Theory, Community
- Move search from the standalone `SearchBar.svelte` component into a header-embedded icon that opens an inline search field or overlay
- Add an "Upload Move" button (visible only when authenticated) linking to `/upload` (placeholder route)
- Replace "Hi, username + Sign Out" with an account circle icon + dropdown menu (Profile, My Library, Sign Out) with glassmorphic styling
- Restyle the entire header with glassmorphic pill/bar aesthetic: `surface-variant` at 50% opacity, `backdrop-blur: 16px`, rounded corners, tonal separation instead of border
- Create placeholder routes for `/tutorials`, `/theory`, `/community` (minimal "Coming Soon" pages needed for nav links to resolve)
- Add i18n strings for all new nav labels, menu items, and search-related text in `messages/en.json` and `messages/es.json`

## Capabilities

### New Capabilities

- `nav-header`: Full navigation header with nav links, search integration, upload button, and account menu
- `search-overlay`: Header-embedded search triggered by icon, with debounced behavior matching current SearchBar
- `account-menu`: Dropdown account menu with profile, library, and sign-out options for authenticated users

### Modified Capabilities

## Impact

- **Components modified**: `Header.svelte` (major rewrite), `SearchBar.svelte` (moved into header context or replaced)
- **Layout**: `+page.svelte` — search bar removed from main content, header receives user + search state
- **New routes**: `/tutorials`, `/theory`, `/community` — placeholder pages
- **i18n**: New strings in `messages/en.json` and `messages/es.json` for nav items, menu labels, search placeholder
- **Dependencies**: `lucide-svelte` icons (already in project) — new icons needed: search, upload, account circle, dropdown chevron
- **No database changes**: This stage is purely frontend
- **No breaking changes**: Existing functionality preserved, just relocated
