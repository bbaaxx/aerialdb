<!-- Context: project-intelligence/nav | Priority: high | Version: 2.0 | Updated: 2026-03-27 -->

# Project Intelligence — AerialDB

> Start here for quick project understanding. AerialDB catalogs aerial acrobatics moves.

## Structure

```
project-intelligence/
├── navigation.md              # This file — quick overview
├── technical-domain.md        # Stack, patterns, code examples
├── business-domain.md         # Business context and problem statement
├── business-tech-bridge.md    # Business → technical mapping
├── decisions-log.md           # Major decisions with rationale
└── living-notes.md            # Active issues, debt, open questions
```

## Quick Routes

| What You Need              | File                      | Priority |
| -------------------------- | ------------------------- | -------- |
| Tech stack & code patterns | `technical-domain.md`     | critical |
| Business context & users   | `business-domain.md`      | high     |
| Business-to-tech mapping   | `business-tech-bridge.md` | high     |
| Decision history           | `decisions-log.md`        | medium   |
| Current issues             | `living-notes.md`         | medium   |

## Project Summary

- **What**: Aerial acrobatics move catalog
- **Stack**: SvelteKit 2 + Svelte 5 + Drizzle ORM + TailwindCSS v4
- **Deploy**: Cloudflare Pages + D1 + R2
- **Auth**: Custom session-based (SHA-256 + Scrypt)
- **i18n**: Paraglide JS (en + es)

## Usage

**New Agent/Developer**:

1. Start with this file (`navigation.md`)
2. Read `technical-domain.md` for code patterns
3. Read `business-domain.md` for domain context

**Quick Reference**:

- Code patterns → `technical-domain.md`
- Business focus → `business-domain.md`
- Decision context → `decisions-log.md`
