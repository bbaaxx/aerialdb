# AerialDB — Agent Guidelines

AerialDB is a SvelteKit 5 application for cataloging aerial acrobatics moves,
deployed on Cloudflare Pages with D1 (SQLite) and R2 storage.

---

## Project Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes API — no legacy stores)
- **Database:** Drizzle ORM over SQLite (libsql locally, Cloudflare D1 in prod)
- **Auth:** Custom session-based auth (SHA-256 tokens, Scrypt passwords via `@noble/hashes`)
- **Styling:** TailwindCSS v4 + `@tailwindcss/forms` + `@tailwindcss/typography`
- **i18n:** Paraglide JS (generated imports use `$lib/paraglide/`, source messages in `messages/en.json` + `es.json`)
- **Testing:** Vitest (unit + browser via Playwright) + Playwright (e2e)
- **Deployment:** Cloudflare Pages + D1 + R2

---

## Build, Lint & Test Commands

```bash
# Development
npm run dev               # Start dev server (vite dev)

# Type checking
npm run check             # svelte-kit sync + svelte-check
npm run check:watch       # Same, with file watching

# Linting & formatting
npm run lint              # prettier --check + eslint
npm run format            # prettier --write (auto-fix formatting)

# Building
npm run build             # vite build
npm run preview           # Preview the built output

# Project index regeneration
npm run generate:index    # Regenerate mdocs/PROJECT_INDEX.json + .md

# Testing — unit + browser
npm run test:unit         # vitest (watch mode)
npm run test:unit -- --run           # Run unit tests once (no watch)
npm run test:unit -- --run --reporter=verbose   # Verbose single run

# Run a single test file
npm run test:unit -- --run src/demo.spec.ts

# Run tests matching a name pattern
npm run test:unit -- --run -t "test name pattern"

# E2E tests (requires build first)
npm run test:e2e          # playwright test (uses built preview server)

# Run all tests once
npm test                  # test:unit --run + test:e2e

# Database
npm run db:push           # Push schema changes to DB
npm run db:generate       # Generate Drizzle migration files
npm run db:migrate        # Run migrations
npm run db:studio         # Open Drizzle Studio GUI
npm run db:seed           # Seed DB from src/lib/server/db/seed.ts
npm run db:init           # Initialize DB from scripts/init-db.ts
```

Use npm for this project. Do not switch commands to pnpm unless the package manager is intentionally changed across the repo.

`db:init` prepares a local database from `scripts/init-db.ts`. `db:seed` runs the catalog seed utility in `src/lib/server/db/seed.ts`.

### Test Projects

Vitest is split into two projects (see `vite.config.ts`):

| Project  | Includes                                    | Environment                    |
| -------- | ------------------------------------------- | ------------------------------ |
| `client` | `src/**/*.svelte.{test,spec}.{js,ts}`       | Chromium (headless Playwright) |
| `server` | `src/**/*.{test,spec}.{js,ts}` (non-svelte) | Node                           |

Run a specific project: `npm run test:unit -- --run --project=server`

### Known Validation Baseline

As of 2026-05-30, these commands pass cleanly:

- `npm run check`
- `npm run lint`
- `npm run test:unit -- --run`

If any of the commands above fail, treat it as a regression unless the current task intentionally changes that baseline.

---

## Environment Variables

```bash
# Required for local dev (copy .env.example → .env)
DATABASE_URL=file:local.db

# Required for R2 image uploads in production
PUBLIC_R2_URL=https://your-bucket.r2.dev
```

---

## Code Style

### Formatting (enforced by Prettier)

- **Indentation:** Tabs (not spaces)
- **Quotes:** Single quotes
- **Trailing commas:** None
- **Print width:** 100 characters
- **Svelte parser:** `prettier-plugin-svelte`
- **Tailwind class sorting:** `prettier-plugin-tailwindcss`

Always run `npm run format` before committing. CI runs `npm run lint` which checks
both Prettier and ESLint.

### TypeScript

- **Strict mode** enabled — all types must be explicit when not inferable
- `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`
- Import `.ts` extensions are allowed in imports
- Avoid `any`; use `unknown` and narrow types instead
- Use `satisfies` for object literals that must match a type (e.g., `actions satisfies Actions`)
- ESLint: `no-undef` is disabled (TypeScript handles it); `typescript-eslint` recommended rules apply

### Imports

- Use `$lib/` path alias for `src/lib/` imports
- Use `$env/dynamic/private` for server-side environment variables (Cloudflare-compatible)
- Do not import server modules in client-side components (`src/lib/server/` is server-only)
- Group imports: external packages first, then `$lib/` aliases, then relative paths

```ts
// Good
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { moves } from '$lib/server/db/schema';
```

### Naming Conventions

- **Files:** kebab-case for utilities (`toon-parser.ts`), PascalCase for Svelte components (`MoveCard.svelte`)
- **Variables/functions:** camelCase
- **Types/interfaces:** PascalCase
- **Database tables:** snake_case (Drizzle schema)
- **SvelteKit route files:** follow SvelteKit conventions (`+page.svelte`, `+page.server.ts`, `+server.ts`)
- **Interface for component props:** named `Props`

### Svelte 5 Patterns (Runes API)

Always use Svelte 5 runes — no Svelte 4 stores, no `$:` reactive statements.

```svelte
<script lang="ts">
	// Props
	interface Props {
		move: { id: number; name: string };
		onSelect?: (id: number) => void;
	}
	let { move, onSelect }: Props = $props();

	// State
	let count = $state(0);

	// Derived
	let doubled = $derived(count * 2);

	// Effects
	$effect(() => {
		console.log(count);
	});
</script>
```

### SvelteKit Route Patterns

```ts
// +page.server.ts — load function
export const load: PageServerLoad = async (event) => {
  const db = getDb(event);           // Always use getDb(event), not the db export
  const results = await db.select().from(moves);
  return { moves: results };
};

// +page.server.ts — form actions
export const actions = {
  create: async (event) => { ... },
  update: async (event) => { ... },
  delete: async (event) => { ... }
} satisfies Actions;
```

### Database Access

- **Always** use `getDb(event)` in route files — it supports both local libsql and Cloudflare D1
- The bare `db` export from `$lib/server/db` is for scripts only (local dev)
- Schema is in `src/lib/server/db/schema.ts`; do not use raw SQL in routes
- Use Drizzle query builder — no string-interpolated SQL
- No `(db as any)` casts needed — `getDb()` returns a typed `Database` (`BaseSQLiteDatabase<'async', any, typeof schema>`) that resolves query builder chains correctly

```ts
import { getDb } from '$lib/server/db';
import type { Database } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const db = getDb(event);
const move = await db.select().from(moves).where(eq(moves.id, id)).get();
```

### Error Handling

- Use SvelteKit's `error()` helper for HTTP errors in load functions and actions
- Throw `redirect()` for auth guards; do not return redirect objects
- In API routes (`+server.ts`), return `Response` objects with appropriate status codes
- Never expose internal error details to the client; log server-side

```ts
import { error, redirect } from '@sveltejs/kit';

// In load functions
if (!event.locals.user) throw redirect(302, '/auth/login');
if (!move) throw error(404, 'Move not found');
```

### Authentication & Authorization

- `event.locals.user` and `event.locals.session` are populated by `hooks.server.ts`
- Admin routes check auth in `+layout.server.ts` load function. **Important:** Layout guards do not automatically protect form actions (`+page.server.ts` actions); these must explicitly check `event.locals.user`.
- Never store plaintext passwords; use `hashPassword` / `verifyPassword` from `$lib/server/password`
- Session token is stored as SHA-256 hash in DB; raw token lives only in the cookie

### UI / Styling Conventions

TailwindCSS v4 — no CSS modules, no `<style>` blocks except for non-Tailwind cases.

| Element          | Classes                                                           |
| ---------------- | ----------------------------------------------------------------- |
| Primary button   | `rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700` |
| Secondary button | `rounded-lg border border-zinc-300 px-6 py-2.5 hover:bg-zinc-50`  |
| Input            | `rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500`    |
| Card             | `rounded-lg border shadow-sm hover:shadow-md`                     |
| Background       | `bg-zinc-50 dark:bg-zinc-950`                                     |
| Border           | `border-zinc-200 dark:border-zinc-800`                            |

- Mobile-first responsive design; use `sm:`, `lg:`, `xl:` breakpoints
- Full dark mode via `dark:` variants on every element that has a background or border
- Primary accent color: `blue-600`; neutral palette: `zinc-*`

### i18n

- Use Paraglide message functions for all user-visible strings
- Messages live in `messages/en.json` and `messages/es.json`
- Import from `$lib/paraglide/messages.js` (generated — do not edit directly)
- If generated files appear under `src/paraglide/`, run `npm run check` or the Paraglide generator path configured in `vite.config.ts` before assuming imports are wrong.

---

## Agent Start Here

Read these files first based on the task:

| Task Area             | Start With                                             |
| --------------------- | ------------------------------------------------------ |
| General conventions   | `AGENTS.md`                                            |
| Current project map   | `mdocs/PROJECT_INDEX.md`, `mdocs/PROJECT_INDEX.json`   |
| Security lessons      | `.Jules/sentinel.md`                                   |
| API endpoints         | `src/routes/api/README.md`                             |
| Shared components     | `src/lib/components/README.md`                         |
| TOON imports          | `mdocs/TOON_FORMAT.md`, `src/lib/utils/toon-parser.ts` |
| Cloudflare deployment | `mdocs/CLOUDFLARE_DEPLOYMENT.md`, `wrangler.toml`      |
| OpenSpec work         | `openspec/config.yaml`, `openspec/specs/`              |

Agent/tooling directories in this repo:

| Directory          | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `.opencode/`       | OpenCode agents, skills, commands, and context                      |
| `.Jules/`          | Jules/Sentinel notes, especially security and reliability learnings |
| `.claude/`         | Claude Code settings and hooks when present                         |
| `.omc/`            | OMC project memory/config when present                              |
| `.vscode/mcp.json` | Editor MCP configuration when present                               |

Prefer current source code over generated indexes if they disagree, then update the stale doc as part of the task.

---

## Jules Automation Rules

Jules must treat `ENHANCEMENT_PLAN.md` and explicitly labeled GitHub issues as the source of truth for autonomous work.

- Do not create speculative PRs from broad prompts like "improve UX", "optimize performance", or "find security improvements".
- Implement exactly one explicit task ID from `ENHANCEMENT_PLAN.md` or one GitHub issue per PR.
- Before coding, check open PRs and recent merged PRs for duplicate or overlapping work.
- If overlap exists, stop and report the existing PR/commit instead of creating another PR.
- PR titles from Jules must include the agent name and task ID when available, e.g. `Palette: UX-P0-001 hide public edit link`.
- Keep PRs small, scoped, and reviewable. Do not bundle unrelated improvements.
- Use npm commands only: `npm run check`, `npm run lint`, and relevant tests.
- If no suitable task is explicitly provided, Jules should first look for suitable tasks in `ENHANCEMENT_PLAN.md` and GitHub issues. If none fit, Jules may propose one concrete enhancement with rationale and acceptance criteria, but must not modify code or create a PR until approved.
- Scheduled Jules tasks should be audit/recommendation only unless a specific task ID is included.
- Avoid repeating already merged hardening/optimization work, especially session-cookie, CSP, and category-query changes.

---

## Route Map

| Route                    | Methods           | Auth                            | Purpose                                      |
| ------------------------ | ----------------- | ------------------------------- | -------------------------------------------- |
| `/`                      | GET               | Public                          | Move library with search/filter query params |
| `/moves/[id]`            | GET               | Public                          | Move detail page                             |
| `/tutorials`             | GET               | Public                          | Coming-soon tutorials page                   |
| `/theory`                | GET               | Public                          | Coming-soon theory page                      |
| `/community`             | GET               | Public                          | Coming-soon community page                   |
| `/auth/login`            | GET, POST action  | Anonymous redirects home        | Login and create session                     |
| `/auth/signup`           | GET, POST action  | Anonymous redirects home        | Register and create session                  |
| `/auth/logout`           | POST              | Optional session                | Invalidate current session and redirect home |
| `/upload`                | GET               | User via UI link                | Upload/create move UI                        |
| `/admin`                 | GET               | User required by layout         | Admin move list dashboard                    |
| `/admin/categories`      | GET, POST actions | User required; actions re-check | Manage categories                            |
| `/admin/moves/new`       | GET, POST action  | User required; action re-check  | Create move                                  |
| `/admin/moves/[id]/edit` | GET, POST actions | User required; actions re-check | Edit/delete move                             |
| `/api/search`            | GET               | Public                          | JSON move search endpoint                    |
| `/api/upload`            | POST              | Admin required                  | R2 image upload endpoint                     |
| `/api/test-db`           | GET               | Admin required                  | Database connectivity check                  |

API contracts are documented in `src/routes/api/README.md`.

---

## Project Structure Notes

```
src/
  lib/
    server/       # Server-only code (never import in .svelte files)
      auth.ts     # Session token generation & validation
      password.ts # Scrypt hashing & verification
      db/
        index.ts  # getDb(event) — dual-mode DB connection
        schema.ts # Drizzle table definitions
        seed.ts   # DB seeding utility
    components/   # Shared Svelte components
    utils/        # Shared utilities (toon-parser, etc.)
  routes/         # SvelteKit file-based routing
    admin/        # Protected admin pages (auth guard in layout)
    api/          # API endpoints (+server.ts)
    auth/         # Login/signup/logout
    moves/        # Public move detail pages
```

---

## Cloudflare Specifics

- Adapter: `@sveltejs/adapter-cloudflare` — build output goes to `.svelte-kit/cloudflare`
- `platform.env.DB` — Cloudflare D1 binding (see `wrangler.toml`)
- `platform.env.IMAGES` — Cloudflare R2 binding
- Compatibility flags: `nodejs_compat` (required for crypto APIs)
- Do not use Node built-ins that are unavailable in Cloudflare Workers without the compat flag
