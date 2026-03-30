<!-- Context: project-intelligence/nav | Priority: high | Version: 3.0 | Updated: 2026-03-28 -->

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
├── living-notes.md            # Active issues, debt, open questions
├── concepts/
│   └── sveltekit-setup.md    # SvelteKit + Svelte 5 patterns
└── lookup/
    ├── commands.md           # NPM scripts reference
    ├── database-schema.md    # User/session tables
    └── dependencies.md        # Key packages
```

## Quick Routes

| What You Need              | File                          | Priority |
| -------------------------- | ----------------------------- | -------- |
| Tech stack & code patterns | `technical-domain.md`         | critical |
| Business context & users   | `business-domain.md`          | high     |
| Business-to-tech mapping   | `business-tech-bridge.md`     | high     |
| **NPM commands**           | `lookup/commands.md`          | high     |
| **Database schema**        | `lookup/database-schema.md`   | high     |
| SvelteKit setup            | `concepts/sveltekit-setup.md` | high     |
| Decision history           | `decisions-log.md`            | medium   |
| Current issues             | `living-notes.md`             | medium   |
| **Dependencies**           | `lookup/dependencies.md`      | medium   |

## Project Summary

- **What**: Aerial acrobatics move catalog
- **Stack**: SvelteKit 2 + Svelte 5 + Drizzle ORM + TailwindCSS v4
- **Deploy**: Cloudflare Pages + D1 + R2
- **Auth**: Custom session-based (SHA-256 + Scrypt)
- **i18n**: Paraglide JS (en + es)

## By Category

### concepts/

What and why — project-specific architecture decisions.

| File                 | Priority | Summary                                       |
| -------------------- | -------- | --------------------------------------------- |
| `sveltekit-setup.md` | high     | SvelteKit routing, hooks, server/client split |

### lookup/

Quick reference — commands, schema, dependencies.

| File                 | Priority | Summary                               |
| -------------------- | -------- | ------------------------------------- |
| `commands.md`        | high     | All npm scripts (dev, test, db, lint) |
| `database-schema.md` | high     | User + session tables (Drizzle ORM)   |
| `db-types.md`        | high     | Drizzle query type definitions        |
| `design-tokens.md`   | high     | Dark theme design tokens              |
| `dependencies.md`    | medium   | Key packages by category              |

## Loading Strategy

| Priority     | Load          | When                                      |
| ------------ | ------------- | ----------------------------------------- |
| **critical** | Always        | This navigation file, technical-domain.md |
| **high**     | On task match | Commands, schema, SvelteKit setup         |
| **medium**   | On demand     | Dependencies, decisions, issues           |

## Related Context

- **Cloudflare deployment** → `../../development/infrastructure/navigation.md`
- **Core standards** → `../../core/standards/navigation.md`
