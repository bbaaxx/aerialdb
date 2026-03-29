<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-03-27 -->

# Technical Domain — AerialDB

**Purpose**: Tech stack, architecture, and development patterns for AerialDB.
**Last Updated**: 2026-03-27

## Quick Reference

- **Update Triggers**: Tech stack changes | New patterns | Architecture decisions
- **Audience**: Developers, AI agents

## Primary Stack

| Layer      | Technology                 | Version                 | Rationale                                       |
| ---------- | -------------------------- | ----------------------- | ----------------------------------------------- |
| Framework  | SvelteKit 2                | ^2.47                   | File-based routing, SSR, Cloudflare adapter     |
| UI Runtime | Svelte 5 (runes)           | ^5.41                   | Reactive primitives ($state, $derived, $effect) |
| Language   | TypeScript                 | ^5.9                    | Strict mode, bundler moduleResolution           |
| Database   | SQLite via Drizzle ORM     | ^0.44                   | D1 in prod, libsql locally                      |
| Styling    | TailwindCSS v4             | ^4.1                    | Utility-first, dark mode, @tailwindcss/forms    |
| Auth       | Custom session-based       | @oslojs + @noble/hashes | SHA-256 tokens, Scrypt passwords                |
| i18n       | Paraglide JS               | ^2.4                    | Compile-time, message functions                 |
| Deploy     | Cloudflare Pages + D1 + R2 | wrangler ^4.50          | Edge runtime, R2 image storage                  |
| Testing    | Vitest + Playwright        | ^4.0 / ^1.56            | Unit (Node+Browser) + E2E                       |

## Code Patterns

### Page Load Function

```ts
import { getDb } from '$lib/server/db';
import { moves } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const [move] = await db.select().from(moves).where(eq(moves.id, event.params.id)).limit(1);
	if (!move) throw error(404, 'Move not found');
	return { move };
};
```

### Form Action

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const db = getDb(event);
		const formData = await event.request.formData();
		const name = formData.get('name') as string;
		if (!name) return fail(400, { error: 'Name is required' });
		await db.insert(moves).values({ id: generateId(), name, ... });
		throw redirect(303, `/moves/${id}`);
	}
} satisfies Actions;
```

### API Endpoint

```ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const db = getDb(event);
	const query = event.url.searchParams.get('q') || '';
	if (!query || query.length < 3) return json({ moves: [] });
	const results = await db
		.select()
		.from(moves)
		.where(like(moves.name, `%${query}%`));
	return json({ moves: results });
};
```

### Svelte 5 Component

```svelte
<script lang="ts">
	interface Props {
		move: { id: string; name: string; description: string | null };
		onSelect?: (id: string) => void;
	}
	let { move, onSelect }: Props = $props();
	let hovered = $state(false);
</script>

<a
	href="/moves/{move.id}"
	class="group block rounded-lg border border-zinc-200 shadow-sm
	hover:shadow-md dark:border-zinc-800"
>
	<h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{move.name}</h3>
</a>
```

## Naming Conventions

| Type                | Convention           | Example                         |
| ------------------- | -------------------- | ------------------------------- |
| Files (utils)       | kebab-case           | `toon-parser.ts`                |
| Components          | PascalCase           | `MoveCard.svelte`               |
| Routes              | SvelteKit convention | `+page.server.ts`, `+server.ts` |
| Variables/functions | camelCase            | `getUserProfile`                |
| Types/interfaces    | PascalCase           | `Props`, `Session`, `Database`  |
| DB tables           | snake_case           | `user_profiles`, `categories`   |
| DB columns          | snake_case           | `password_hash`, `created_at`   |

## Code Standards

- TypeScript strict mode — explicit types when not inferable
- Always use `getDb(event)` in route files (dual-mode: libsql local / D1 prod)
- Drizzle query builder — no raw SQL or string interpolation
- Svelte 5 runes API only — no `$:` reactive statements, no legacy stores
- Props defined as `interface Props { ... }` with `$props()` destructuring
- Actions use `satisfies Actions` for type safety
- `error()` for HTTP errors, `redirect()` for navigation, `fail()` for form validation
- Run `npm run format` before commits; CI runs `npm run lint`

## Security Requirements

- Custom session auth: SHA-256 hashed tokens in DB, raw token in cookie only
- Passwords hashed with Scrypt via `@noble/hashes`
- Auth guard in admin `+layout.server.ts` — not duplicated in each page
- `event.locals.user` / `event.locals.session` populated by `hooks.server.ts`
- Form validation via `fail()` — never expose internal errors to client
- Server-only code in `src/lib/server/` — never imported in `.svelte` files
- Input validated before DB insertion; no string-interpolated SQL

## Architecture

```
src/
├── routes/            # SvelteKit file-based routing
│   ├── admin/         # Protected (auth guard in layout)
│   ├── api/           # JSON endpoints (+server.ts)
│   ├── auth/          # Login, signup, logout
│   └── moves/         # Public move detail pages
├── lib/
│   ├── server/        # Server-only (db, auth, password)
│   ├── components/    # Shared Svelte components
│   ├── paraglide/     # Generated i18n (do not edit)
│   └── utils/         # Shared utilities
```

## Database Access

- Schema: `src/lib/server/db/schema.ts` — Drizzle table definitions
- Connection: `src/lib/server/db/index.ts` — `getDb(event)` dual-mode
- Local: `DATABASE_URL=file:local.db` via libsql
- Prod: `platform.env.DB` (Cloudflare D1 binding)
- Commands: `db:push`, `db:generate`, `db:migrate`, `db:seed`, `db:init`

## Testing

- **Unit**: `npm run test:unit` — Vitest (server: Node, client: Chromium via Playwright)
- **E2E**: `npm run test:e2e` — Playwright (requires build first)
- **Run once**: `npm run test:unit -- --run`
- **Single file**: `npm run test:unit -- --run src/demo.spec.ts`

## 📂 Codebase References

| Context             | File                                              | Description                      |
| ------------------- | ------------------------------------------------- | -------------------------------- |
| DB Schema           | `src/lib/server/db/schema.ts`                     | All Drizzle table definitions    |
| DB Connection       | `src/lib/server/db/index.ts`                      | `getDb(event)` dual-mode factory |
| Auth Logic          | `src/lib/server/auth.ts`                          | Session token management         |
| Password Hashing    | `src/lib/server/password.ts`                      | Scrypt hash/verify               |
| Hooks               | `src/hooks.server.ts`                             | Auth + i18n middleware           |
| Example Component   | `src/lib/components/MoveCard.svelte`              | Svelte 5 runes pattern           |
| Example API         | `src/routes/api/search/+server.ts`                | Typed GET handler                |
| Example Page Load   | `src/routes/moves/[id]/+page.server.ts`           | Load function pattern            |
| Example Form Action | `src/routes/admin/moves/new/+page.server.ts`      | Actions with file upload         |
| Config              | `package.json`, `tsconfig.json`, `vite.config.ts` | Project configuration            |

## Related Files

- `business-domain.md` — Business context and problem statement
- `business-tech-bridge.md` — Business-to-technical mapping
- `decisions-log.md` — Decision history with rationale
- `living-notes.md` — Active issues and open questions
