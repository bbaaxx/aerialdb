## ADDED Requirements

### Requirement: Account circle icon button

The header SHALL display an account circle icon button when the user is authenticated. Clicking this button SHALL toggle a dropdown menu.

#### Scenario: Account icon visible when logged in

- **WHEN** an authenticated user views the header
- **THEN** an account circle icon button is visible in the header

#### Scenario: Account icon hidden when not logged in

- **WHEN** an unauthenticated user views the header
- **THEN** no account circle icon is displayed

### Requirement: Account dropdown menu items

The dropdown menu SHALL contain three items: Profile, My Library, and Sign Out.

#### Scenario: Dropdown opens on click

- **WHEN** authenticated user clicks the account circle icon
- **THEN** a dropdown menu appears with "Profile", "My Library", and "Sign Out" options

#### Scenario: Dropdown closes on second click

- **WHEN** authenticated user clicks the account circle icon while dropdown is open
- **THEN** the dropdown menu closes

#### Scenario: Dropdown closes on outside click

- **WHEN** dropdown is open and user clicks outside the dropdown area
- **THEN** the dropdown menu closes

#### Scenario: Dropdown closes on Escape key

- **WHEN** dropdown is open and user presses the Escape key
- **THEN** the dropdown menu closes

### Requirement: Profile link navigates to account page

The "Profile" menu item SHALL navigate to `/account`.

#### Scenario: Profile navigation

- **WHEN** user clicks "Profile" in the account dropdown
- **THEN** the browser navigates to `/account`

### Requirement: My Library link navigates to library page

The "My Library" menu item SHALL navigate to `/library`.

#### Scenario: My Library navigation

- **WHEN** user clicks "My Library" in the account dropdown
- **THEN** the browser navigates to `/library`

### Requirement: Sign Out performs logout

The "Sign Out" menu item SHALL navigate to `/auth/logout` to end the user's session.

#### Scenario: Sign Out navigation

- **WHEN** user clicks "Sign Out" in the account dropdown
- **THEN** the browser navigates to `/auth/logout` and the session is terminated

### Requirement: Dropdown glassmorphic styling

The account dropdown menu SHALL use glassmorphic styling with `surface-container-high` background and `backdrop-filter: blur`, consistent with the design system.

#### Scenario: Dropdown visual appearance

- **WHEN** the account dropdown is open
- **THEN** it displays with a `surface-container-high` background, blur effect, and rounded corners matching the design system

### Requirement: Keyboard accessible dropdown

The dropdown SHALL be keyboard accessible with proper ARIA attributes.

#### Scenario: Keyboard activation

- **WHEN** user focuses the account icon and presses Enter or Space
- **THEN** the dropdown menu opens

#### Scenario: ARIA attributes

- **WHEN** the account icon renders
- **THEN** it has `aria-haspopup="true"` and `aria-expanded` reflecting the dropdown state
