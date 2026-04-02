<!-- Context: project-intelligence/concepts/sveltekit-setup | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# SvelteKit Project Setup

**Purpose**: AerialDB uses SvelteKit 2 with Svelte 5 runes API for full-stack development.

## Core Idea

SvelteKit handles routing, server-side rendering, and API endpoints. Svelte 5 runes (`$state`, `$derived`, `$effect`) replace legacy stores for reactivity. All server code lives in `src/lib/server/` and route files use `+page.server.ts` for data loading.

## Key Points

- **Routes**: File-based routing in `src/routes/`. `+page.svelte` = UI, `+page.server.ts` = load/actions
- **Hooks**: `hooks.server.ts` runs middleware (auth, i18n) on every request
- **Layouts**: `+layout.svelte` wraps pages; `+layout.server.ts` runs before page loads
- **Server-only**: `src/lib/server/` never imported in client components
- **Dual-mode DB**: `getDb(event)` switches between local libsql and Cloudflare D1

## Quick Example

```ts
// src/routes/moves/+page.server.ts
export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const moves = await db.select().from(movesSchema);
	return { moves };
};
```

## Codebase References

| File                         | Role                         |
| ---------------------------- | ---------------------------- |
| `src/routes/+page.svelte`    | Home page                    |
| `src/hooks.server.ts`        | Auth + i18n middleware       |
| `src/lib/server/db/index.ts` | `getDb(event)` dual-mode     |
| `svelte.config.js`           | SvelteKit + MDsveX + adapter |

## Related

- `../lookup/database-schema.md` — User/session tables
- `../lookup/commands.md` — NPM scripts reference
- `../../development/infrastructure/guides/cloudflare-deployment.md` — Deployment guide
