## ADDED Requirements

### Requirement: Search icon in header

The header SHALL display a search icon (magnifier) that, when clicked, reveals an inline search input field within the header area.

#### Scenario: Search icon visible in header

- **WHEN** the header renders
- **THEN** a search icon (magnifier) is visible in the header bar

#### Scenario: Search input expands on icon click

- **WHEN** user clicks the search icon
- **THEN** an inline search input field appears within the header

#### Scenario: Search input collapses on close

- **WHEN** user clicks the close/clear icon or presses Escape while search is open
- **THEN** the search input field collapses back to the icon-only state

### Requirement: Search uses debounced URL params

The search input SHALL debounce user input (300ms) and update the URL `?q=` parameter, preserving the existing server-driven search behavior.

#### Scenario: Debounced search updates URL

- **WHEN** user types in the search input
- **THEN** after 300ms of inactivity, the URL updates with `?q=<query>` and the server load function processes the search

#### Scenario: Clearing search removes URL param

- **WHEN** user clears the search input
- **THEN** the `?q=` parameter is removed from the URL and results reset

### Requirement: Search only active on library page

The search overlay SHALL only affect the library (home) page results. On other pages, the search icon MAY still be visible but redirects to the library with the search query.

#### Scenario: Search on library page filters results

- **WHEN** user is on `/` and types in the search input
- **THEN** move results are filtered by the search query

#### Scenario: Search from non-library page redirects

- **WHEN** user is on a page other than `/` and submits a search
- **THEN** the browser navigates to `/?q=<query>` to show filtered results

### Requirement: Existing SearchBar component removed from main content

The standalone `SearchBar.svelte` component SHALL be removed from the main page content area (`+page.svelte`) since search is now integrated into the header.

#### Scenario: No standalone search bar on home page

- **WHEN** user views the home page
- **THEN** no standalone search bar appears in the main content area; search is only accessible via the header icon
