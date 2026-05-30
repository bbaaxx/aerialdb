# Project Index: aerialdb

**Updated:** 2026-05-30  
**Version:** 0.0.1  
**Package manager:** npm  
**Runtime:** Node.js >=18.0.0

## Overview

AerialDB is a SvelteKit 2 + Svelte 5 app for cataloging aerial acrobatics moves. It runs locally against SQLite/libsql and deploys to Cloudflare Pages with D1 and R2 bindings.

## Entry Points

| Area        | Commands                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Development | npm run dev, npm run build, npm run preview                                                                   |
| Quality     | npm run check, npm run lint, npm run format                                                                   |
| Testing     | npm run test:unit, npm run test:unit -- --run, npm run test:e2e, npm test                                     |
| Database    | npm run db:push, npm run db:generate, npm run db:migrate, npm run db:studio, npm run db:seed, npm run db:init |

## Source Map

| `Path`                         | `Purpose`                                                        |
| ------------------------------ | ---------------------------------------------------------------- |
| `src/routes/`                  | SvelteKit pages, layouts, form actions, and API endpoints        |
| `src/lib/components/`          | Shared Svelte UI components                                      |
| `src/lib/server/auth.ts`       | Session token generation, validation, cookies, invalidation      |
| `src/lib/server/password.ts`   | Scrypt password hashing and verification                         |
| `src/lib/server/db/index.ts`   | `getDb(event)` dual-mode DB factory and local script `db` export |
| `src/lib/server/db/schema.ts`  | Drizzle schema for `user`, `session`, `categories`, and `moves`  |
| `src/lib/server/db/seed.ts`    | Catalog seed utility                                             |
| `src/lib/utils/toon-parser.ts` | Parser for custom TOON import format                             |
| `messages/`                    | Source i18n message JSON                                         |
| `wrangler.toml`                | Cloudflare Pages, D1, and R2 binding config                      |

## Routes

| Route                  | Methods           | Auth                            | Files                                                                   |
| ---------------------- | ----------------- | ------------------------------- | ----------------------------------------------------------------------- |
| /                      | GET               | public                          | `src/routes/+layout.server.ts`, `+page.server.ts`, `+page.svelte`       |
| /admin                 | GET               | user required by layout         | `src/routes/admin/+layout.server.ts`, `+page.server.ts`, `+page.svelte` |
| /admin/categories      | GET, POST actions | user required; actions re-check | `src/routes/admin/categories/+page.server.ts`, `+page.svelte`           |
| /admin/moves/[id]/edit | GET, POST actions | user required; actions re-check | `src/routes/admin/moves/[id]/edit/+page.server.ts`, `+page.svelte`      |
| /admin/moves/new       | GET, POST action  | user required; action re-check  | `src/routes/admin/moves/new/+page.server.ts`, `+page.svelte`            |
| /api/search            | GET               | public                          | `src/routes/api/search/+server.ts`                                      |
| /api/test-db           | GET               | admin required                  | `src/routes/api/test-db/+server.ts`                                     |
| /api/upload            | POST              | admin required                  | `src/routes/api/upload/+server.ts`                                      |
| /auth/login            | GET, POST action  | anonymous redirects home        | `src/routes/auth/login/+page.server.ts`, `+page.svelte`                 |
| /auth/logout           | POST              | optional session                | `src/routes/auth/logout/+server.ts`                                     |
| /auth/signup           | GET, POST action  | anonymous redirects home        | `src/routes/auth/signup/+page.server.ts`, `+page.svelte`                |
| /community             | GET               | public                          | `src/routes/community/+page.svelte`                                     |
| /moves/[id]            | GET               | public                          | `src/routes/moves/[id]/+page.server.ts`, `+page.svelte`                 |
| /theory                | GET               | public                          | `src/routes/theory/+page.svelte`                                        |
| /tutorials             | GET               | public                          | `src/routes/tutorials/+page.svelte`                                     |
| /upload                | GET               | user via UI link                | `src/routes/upload/+page.svelte`                                        |

## Database Schema

| Table        | Purpose                    | Important Columns                                                                                                                           |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`       | Auth users and roles       | `id`, `age`, `username`, `password_hash`, `role`                                                                                            |
| `session`    | Session storage            | `id`, `user_id`, `expires_at`                                                                                                               |
| `categories` | Base techniques/categories | `id`, `name`, `created_at`                                                                                                                  |
| `moves`      | Catalog entries            | `id`, `name`, `category_id`, `description`, `image_url`, `video_url`, `level`, `contributor_name`, `created_by`, `created_at`, `updated_at` |

Indexes on `moves` optimize name ordering, category filters, level filters, and featured-move selection by `created_at`.

## Shared Components

| Component              | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `FilterChips.svelte`   | Category and level filters                            |
| `Header.svelte`        | Navigation, search overlay, mobile menu, account menu |
| `HeroBanner.svelte`    | Featured move banner                                  |
| `MoveCard.svelte`      | Move-card display and favorite affordance             |
| `SearchBar.svelte`     | Controlled search input                               |
| `YouTubeFacade.svelte` | Lazy YouTube iframe facade                            |

Component prop details are in `src/lib/components/README.md`.

## Key Docs

| File                             | Use                                      |
| -------------------------------- | ---------------------------------------- |
| `AGENTS.md`                      | Authoritative coding-agent guidance      |
| `src/routes/api/README.md`       | API contracts                            |
| `src/lib/components/README.md`   | Component registry                       |
| `mdocs/TOON_FORMAT.md`           | TOON import format                       |
| `.Jules/sentinel.md`             | Security and reliability lessons learned |
| `mdocs/CLOUDFLARE_DEPLOYMENT.md` | Cloudflare deployment                    |
