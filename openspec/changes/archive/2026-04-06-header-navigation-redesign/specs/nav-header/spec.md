## ADDED Requirements

### Requirement: Navigation header renders on all pages

The system SHALL render a navigation header in the root layout (`+layout.svelte`) that is visible on every page of the application.

#### Scenario: Header visible on home page

- **WHEN** user navigates to `/`
- **THEN** the navigation header is displayed at the top of the page

#### Scenario: Header visible on move detail page

- **WHEN** user navigates to `/moves/[id]`
- **THEN** the navigation header is displayed at the top of the page

#### Scenario: Header visible on auth pages

- **WHEN** user navigates to `/auth/login`
- **THEN** the navigation header is displayed at the top of the page

### Requirement: Navigation links display four items

The header SHALL display four navigation links: Library, Tutorials, Theory, and Community. Each link SHALL navigate to its respective route.

#### Scenario: Library link navigation

- **WHEN** user clicks the "Library" nav link
- **THEN** the browser navigates to `/`

#### Scenario: Tutorials link navigation

- **WHEN** user clicks the "Tutorials" nav link
- **THEN** the browser navigates to `/tutorials`

#### Scenario: Theory link navigation

- **WHEN** user clicks the "Theory" nav link
- **THEN** the browser navigates to `/theory`

#### Scenario: Community link navigation

- **WHEN** user clicks the "Community" nav link
- **THEN** the browser navigates to `/community`

### Requirement: Active nav link visual indication

The system SHALL visually indicate which navigation link corresponds to the current page route.

#### Scenario: Active link on home page

- **WHEN** user is on the `/` route
- **THEN** the "Library" nav link displays an active visual state (distinct color or underline)

#### Scenario: Active link on tutorials page

- **WHEN** user is on the `/tutorials` route
- **THEN** the "Tutorials" nav link displays an active visual state

#### Scenario: No active link on unmatched route

- **WHEN** user is on a route not matching any nav link (e.g., `/auth/login`)
- **THEN** no nav link displays an active state

### Requirement: Header displays AerialDB logo

The header SHALL display the "AerialDB" wordmark as a clickable link that navigates to the home page.

#### Scenario: Logo links to home

- **WHEN** user clicks the "AerialDB" logo text
- **THEN** the browser navigates to `/`

### Requirement: Mobile navigation collapses to hamburger menu

On screens below the `lg` breakpoint, navigation links SHALL collapse into a hamburger menu that expands to reveal the nav items when activated.

#### Scenario: Mobile hamburger menu closed by default

- **WHEN** user views the header on a screen below `lg` breakpoint
- **THEN** navigation links are hidden and a hamburger icon button is visible

#### Scenario: Mobile hamburger menu opens on click

- **WHEN** user clicks the hamburger icon on mobile
- **THEN** navigation links become visible in a dropdown or slide-down panel

#### Scenario: Desktop shows full nav links

- **WHEN** user views the header on a screen at or above `lg` breakpoint
- **THEN** all navigation links are visible inline without a hamburger menu

### Requirement: Glassmorphic header styling

The header SHALL use a glassmorphic visual style with `surface-variant` background at 50% opacity, `backdrop-blur: 16px`, and rounded corners. The header SHALL NOT use a visible border for structural separation.

#### Scenario: Header has glassmorphic appearance

- **WHEN** the header renders on any page
- **THEN** it displays with a semi-transparent blurred background and rounded corners, without visible border lines

### Requirement: Upload Move button for authenticated users

The header SHALL display an "Upload Move" button with an upload icon when the user is authenticated. The button SHALL link to `/upload`.

#### Scenario: Upload button visible when logged in

- **WHEN** an authenticated user views the header
- **THEN** an "Upload Move" button with upload icon is visible in the header

#### Scenario: Upload button hidden when not logged in

- **WHEN** an unauthenticated user views the header
- **THEN** no "Upload Move" button is displayed

#### Scenario: Upload button navigates to upload route

- **WHEN** authenticated user clicks the "Upload Move" button
- **THEN** the browser navigates to `/upload`

### Requirement: Sign Up button for unauthenticated users

The header SHALL display a "Sign Up" call-to-action button when the user is not authenticated, linking to the signup page.

#### Scenario: Sign Up button visible when logged out

- **WHEN** an unauthenticated user views the header
- **THEN** a "Sign Up" button is visible in the header

#### Scenario: Sign Up button hidden when logged in

- **WHEN** an authenticated user views the header
- **THEN** no "Sign Up" button is displayed
