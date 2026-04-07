## ADDED Requirements

### Requirement: Structural borders replaced with tonal surface shifts

The system SHALL NOT use `border` classes for structural separation between content areas (cards, sections, panels). Instead, visual separation SHALL be achieved through surface tier background-color differences.

#### Scenario: Cards have no border

- **WHEN** a MoveCard or similar card component renders
- **THEN** the card has no `border` or `border-*` classes, using `bg-surface-container` on a `bg-surface-container-low` page for tonal separation

#### Scenario: Section dividers have no border

- **WHEN** content sections need visual separation
- **THEN** sections use different surface tier backgrounds instead of `border-b` or `border-t`

### Requirement: Ghost borders for accessible interactive elements

Interactive elements that require visible boundaries for accessibility (form inputs, select dropdowns) SHALL use ghost borders: `border border-outline-variant/15`.

#### Scenario: Text inputs use ghost border

- **WHEN** a form input renders
- **THEN** the input has `border border-outline-variant/15` for subtle visual boundary

#### Scenario: Focus state overrides ghost border

- **WHEN** a form input receives focus
- **THEN** the border changes to `border-primary` or `ring-primary` for clear focus indication

### Requirement: Error and semantic borders preserved

Borders used for semantic meaning (error states, active indicators, level badges) SHALL be preserved. These are NOT structural borders.

#### Scenario: Error form fields show error border

- **WHEN** a form field has a validation error
- **THEN** the field displays `border-error` to communicate the error state

#### Scenario: Active filter indicators preserve border

- **WHEN** a filter chip is in the active/selected state
- **THEN** the chip retains its border as a semantic indicator of selection

### Requirement: Header border-bottom replaced

The Header component's `border-bottom: 1px solid rgba(255,255,255,0.05)` SHALL be removed and replaced with tonal separation via backdrop-blur and surface background.

#### Scenario: Header has no border-bottom

- **WHEN** the Header component renders
- **THEN** there is no `border-bottom` or `border-b-*` class, with visual separation achieved through `backdrop-blur` and a semi-transparent surface background

### Requirement: Table borders converted to tonal separation

Table borders (`border-b` in table headers and rows) SHALL be replaced with alternating surface tiers or removed entirely.

#### Scenario: Table header rows use surface tier instead of border

- **WHEN** a table header row renders
- **THEN** the header uses `bg-surface-container-high` instead of `border-b` for visual separation from table body
