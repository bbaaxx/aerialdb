## 1. i18n & Placeholder Routes

- [x] 1.1 Add navigation and header i18n strings to `messages/en.json`: nav labels (Library, Tutorials, Theory, Community), menu items (Profile, My Library, Sign Out), Upload Move button text, search placeholder, Coming Soon page title and message
- [x] 1.2 Add matching i18n strings to `messages/es.json` with Spanish translations
- [x] 1.3 Create `/tutorials/+page.svelte` placeholder page with "Coming Soon" message and link back to library
- [x] 1.4 Create `/theory/+page.svelte` placeholder page with "Coming Soon" message and link back to library
- [x] 1.5 Create `/community/+page.svelte` placeholder page with "Coming Soon" message and link back to library
- [x] 1.6 Create `/upload/+page.svelte` placeholder page with "Coming Soon" message (linked from Upload Move button)

## 2. Header Component Rewrite

- [x] 2.1 Rewrite `Header.svelte` with full nav bar structure: logo, nav links (Library, Tutorials, Theory, Community), search icon, Upload Move button, account icon / Sign Up button
- [x] 2.2 Implement active nav link detection using `$page.url.pathname` with visual active state styling
- [x] 2.3 Apply glassmorphic header styling: `surface-variant` at 50% opacity, `backdrop-filter: blur(16px)`, rounded corners, no structural borders
- [x] 2.4 Implement "Upload Move" button with upload icon — visible only when `user` is authenticated, links to `/upload`
- [x] 2.5 Implement "Sign Up" button for unauthenticated users (replaces current auth section logic)

## 3. Search Integration

- [x] 3.1 Add search icon button to the header that toggles an inline search input field
- [x] 3.2 Wire the inline search to debounce (300ms) and update URL `?q=` param, reusing existing `SearchBar.svelte` debounce logic
- [x] 3.3 Add close/collapse behavior for search input (close icon, Escape key)
- [x] 3.4 Handle search from non-library pages: redirect to `/?q=<query>` when search is submitted on a different page

## 4. Account Menu

- [x] 4.1 Add account circle icon button to header (visible only when authenticated)
- [x] 4.2 Implement dropdown menu with three items: Profile (`/account`), My Library (`/library`), Sign Out (`/auth/logout`)
- [x] 4.3 Apply glassmorphic dropdown styling: `surface-container-high` background, `backdrop-filter`, rounded corners
- [x] 4.4 Add click-outside and Escape-key dismissal for the dropdown
- [x] 4.5 Add ARIA attributes: `aria-haspopup="true"`, `aria-expanded` toggling, keyboard Enter/Space activation

## 5. Layout Integration

- [x] 5.1 Move `<Header>` from `+page.svelte` to `+layout.svelte` so it renders on all pages
- [x] 5.2 Pass `data.user` from layout to Header component (already available via `+layout.server.ts`)
- [x] 5.3 Remove `<Header>` invocation from `+page.svelte`
- [x] 5.4 Remove standalone `<SearchBar>` from `+page.svelte` main content area

## 6. Mobile Responsive

- [x] 6.1 Implement hamburger menu: hide nav links below `lg` breakpoint, show hamburger icon button
- [x] 6.2 Implement mobile nav panel: clicking hamburger reveals nav links in a slide-down or dropdown panel
- [x] 6.3 Ensure search icon and account icon remain accessible in mobile header layout

## 7. Verification

- [x] 7.1 Run `npm run check` to verify no type errors
- [x] 7.2 Run `npm run lint` to verify formatting and linting passes
- [x] 7.3 Manual verification: header renders on all pages with correct nav links, active states, and responsive behavior
- [x] 7.4 Manual verification: search integration works from header on library page and redirects from other pages
- [x] 7.5 Manual verification: account dropdown opens/closes correctly with keyboard and click, items navigate to correct routes
