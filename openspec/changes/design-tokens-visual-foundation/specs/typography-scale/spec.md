## ADDED Requirements

### Requirement: Noto Serif replaces Playfair Display

The system SHALL use Noto Serif as the serif font family, replacing Playfair Display. The `--font-serif` CSS custom property SHALL be set to `'Noto Serif', Georgia, serif`.

#### Scenario: Google Fonts loads Noto Serif

- **WHEN** the application loads in a browser
- **THEN** the Google Fonts stylesheet link requests the Noto Serif font family (weights 400-900)

#### Scenario: Playfair Display no longer loaded

- **WHEN** the application loads in a browser
- **THEN** no Google Fonts request is made for Playfair Display

#### Scenario: Components using font-serif display Noto Serif

- **WHEN** a component applies the `font-serif` Tailwind class
- **THEN** the text renders in Noto Serif font

### Requirement: Display-lg type level defined

The system SHALL define a `--text-display-lg` type level at 3.5rem (56px) with line-height 1.1, font-weight 700, using the serif font.

#### Scenario: Hero statements use display-lg

- **WHEN** a component uses `text-display-lg` class
- **THEN** text renders at 56px / line-height 1.1 in Noto Serif bold

### Requirement: Headline-lg type level defined

The system SHALL define a `--text-headline-lg` type level at 2rem (32px) with line-height 1.2, font-weight 600, using the serif font.

#### Scenario: Section anchors use headline-lg

- **WHEN** a component uses `text-headline-lg` class
- **THEN** text renders at 32px / line-height 1.2 in Noto Serif semibold

### Requirement: Title-lg type level defined

The system SHALL define a `--text-title-lg` type level at 1.375rem (22px) with line-height 1.3, font-weight 500, using the sans-serif font.

#### Scenario: Card titles use title-lg

- **WHEN** a component uses `text-title-lg` class
- **THEN** text renders at 22px / line-height 1.3 in Inter medium

### Requirement: Body-lg type level defined

The system SHALL define a `--text-body-lg` type level at 1rem (16px) with line-height 1.5, font-weight 400, using the sans-serif font.

#### Scenario: Body text uses body-lg

- **WHEN** a component uses `text-body-lg` class
- **THEN** text renders at 16px / line-height 1.5 in Inter regular

### Requirement: Body-md type level defined

The system SHALL define a `--text-body-md` type level at 0.875rem (14px) with line-height 1.5, font-weight 400, using the sans-serif font.

#### Scenario: Secondary body text uses body-md

- **WHEN** a component uses `text-body-md` class
- **THEN** text renders at 14px / line-height 1.5 in Inter regular

### Requirement: Label-md type level defined

The system SHALL define a `--text-label-md` type level at 0.75rem (12px) with line-height 1.4, font-weight 500, using the sans-serif font.

#### Scenario: Labels and metadata use label-md

- **WHEN** a component uses `text-label-md` class
- **THEN** text renders at 12px / line-height 1.4 in Inter medium

### Requirement: Google Fonts include font-display swap

The system SHALL include `&display=swap` in the Google Fonts URL for Noto Serif to prevent flash of invisible text.

#### Scenario: Font loading does not block rendering

- **WHEN** the browser loads the Google Fonts stylesheet
- **THEN** the `font-display: swap` directive is active, showing fallback fonts immediately
