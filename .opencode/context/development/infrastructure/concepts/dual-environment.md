<!-- Context: development/infrastructure/concepts/dual-environment | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Dual-Environment Architecture

**Purpose**: AerialDB runs identically in local dev and Cloudflare production with zero code changes.

## Core Idea

The app detects its environment at runtime via `getDb(event)` — local SQLite via libsql in dev, Cloudflare D1 via `platform.env.DB` in prod. Images follow the same pattern: `/static/uploads/` locally, R2 via `platform.env.IMAGES` in prod.

## Key Points

- `getDb(event)` in `src/lib/server/db/index.ts` is the single switching point for database access
- Bare `db` export is **scripts only** — never use in route files
- R2 binding `IMAGES` available via `event.platform.env.IMAGES` in production
- `wrangler.toml` defines bindings: `DB` (D1), `IMAGES` (R2)
- `nodejs_compat` compatibility flag required for crypto APIs in Workers

## When to Use

- Adding new server-side database queries
- Configuring deployment bindings
- Debugging environment-specific issues

## Quick Example

```ts
import { getDb } from '$lib/server/db';
export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const moves = await db.select().from(moves);
	return { moves };
};
```

## Codebase References

| File                         | Role                                |
| ---------------------------- | ----------------------------------- |
| `src/lib/server/db/index.ts` | `getDb(event)` dual-mode connection |
| `wrangler.toml`              | D1 + R2 binding config              |
| `src/hooks.server.ts`        | Platform context injection          |

## Related

- `../guides/cloudflare-deployment.md` — Full deployment steps
- `../lookup/cloudflare-commands.md` — Wrangler CLI reference
