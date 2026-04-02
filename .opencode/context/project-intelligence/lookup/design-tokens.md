<!-- Context: project-intelligence/lookup/design-tokens | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Design Tokens — Dark Theme

**Purpose**: Color and typography tokens for the AerialDB dark theme redesign.

## Colors

| Token           | Hex                             | Usage                          |
| --------------- | ------------------------------- | ------------------------------ |
| Dark base       | `#1A1C29`                       | Page background                |
| Dark card       | `#242736`                       | Card backgrounds               |
| Primary accent  | `#8A63F8`                       | Purple accent (buttons, links) |
| Accent gradient | `from-purple-500 to-indigo-500` | Gradient overlays              |

## Typography

| Token        | Font             | Usage                |
| ------------ | ---------------- | -------------------- |
| Heading font | Playfair Display | Serif headings       |
| Body font    | Inter            | Sans-serif body text |

## Interaction

| Token      | Value                            | Usage                 |
| ---------- | -------------------------------- | --------------------- |
| Card hover | `translateY(-4px) + deep shadow` | MoveCard hover effect |

## Constraints

- Dark theme must not break admin pages (light theme preserved there)
- Use Tailwind v4 CSS-based `@theme` config
- Lucide icons preferred (tree-shakable)

## Related

- `../../../development/principles/svelte5-patterns.md` — Svelte 5 + Tailwind v4 constraints
- `../../business-domain.md` — Aerial acrobatics context
