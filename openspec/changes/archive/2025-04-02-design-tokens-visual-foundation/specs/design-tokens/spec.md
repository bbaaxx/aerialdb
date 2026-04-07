## ADDED Requirements

### Requirement: Surface tier tokens defined

The system SHALL define seven surface tier CSS custom properties in the Tailwind `@theme` block: `--color-surface`, `--color-surface-container-lowest`, `--color-surface-container-low`, `--color-surface-container`, `--color-surface-container-high`, `--color-surface-container-highest`.

#### Scenario: Surface tiers available as Tailwind utilities

- **WHEN** a component uses `bg-surface-container` class
- **THEN** the element receives the corresponding surface container background color

#### Scenario: Surface hierarchy provides tonal separation

- **WHEN** two adjacent components use `bg-surface-container-low` and `bg-surface-container` respectively
- **THEN** they are visually distinguishable by color contrast alone, without requiring borders

### Requirement: Semantic color tokens defined

The system SHALL define the following semantic color tokens as CSS custom properties: `--color-primary`, `--color-primary-container`, `--color-secondary`, `--color-on-surface`, `--color-on-surface-variant`, `--color-outline`, `--color-outline-variant`.

#### Scenario: Primary color replaces accent-purple

- **WHEN** a component uses `bg-primary` or `text-primary`
- **THEN** the color resolves to `#cebdff` (the Etheric Pro primary)

#### Scenario: Primary container available for lighter variants

- **WHEN** a component uses `bg-primary-container`
- **THEN** the color resolves to `#9b7aff` (the Etheric Pro primary-container)

### Requirement: Error palette tokens defined

The system SHALL define error palette tokens: `--color-error`, `--color-error-container`, `--color-on-error`, `--color-on-error-container`.

#### Scenario: Error states use semantic error token

- **WHEN** a component displays an error state using `text-error` or `border-error`
- **THEN** the color resolves to the design system error color

### Requirement: Inverse color tokens defined

The system SHALL define inverse color tokens: `--color-inverse-surface`, `--color-inverse-on-surface`, `--color-inverse-primary`.

#### Scenario: Inverse surface for overlays

- **WHEN** a component uses `bg-inverse-surface`
- **THEN** the element receives a light background suitable for overlays on dark surfaces

### Requirement: Legacy tokens mapped to new tokens

The system SHALL map existing `--color-dark-base` to `--color-surface-container-low` and `--color-dark-card` to `--color-surface-container`. The `--color-accent-purple` token SHALL be aliased to `--color-primary`.

#### Scenario: Existing dark-base usage continues working

- **WHEN** a component still references `bg-dark-base`
- **THEN** the color resolves to the same value as `bg-surface-container-low`

#### Scenario: Accent-purple aliases to primary

- **WHEN** a component uses `text-accent-purple` or `bg-accent-purple`
- **THEN** the color resolves to the same value as `text-primary` / `bg-primary`
