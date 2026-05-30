# AerialDB

AerialDB is a SvelteKit 5 application for cataloging aerial acrobatics moves. It uses Drizzle ORM with SQLite locally, Cloudflare D1 in production, and Cloudflare R2 for image uploads.

## Stack

- SvelteKit 2 + Svelte 5 runes
- TailwindCSS v4
- Drizzle ORM over SQLite/libsql and Cloudflare D1
- Custom session auth with SHA-256 session tokens and Scrypt password hashes
- Paraglide JS i18n with messages in `messages/en.json` and `messages/es.json`
- Vitest, Playwright, and `vitest-browser-svelte`

## Setup

Use npm for this project. `.npmrc` enables `engine-strict`, and `package.json` requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

Minimum local environment:

```bash
DATABASE_URL=file:local.db
```

Production image uploads also require `PUBLIC_R2_URL`.

## Commands

```bash
npm run dev
npm run check
npm run lint
npm run test:unit -- --run
npm run test:e2e
npm run build
```

Database commands:

```bash
npm run db:push
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:init
```

`db:init` initializes a local database from `scripts/init-db.ts`. `db:seed` runs the TypeScript seeding utility at `src/lib/server/db/seed.ts`.

## Documentation Map

- `AGENTS.md` - full coding-agent guidelines, conventions, and route map
- `mdocs/PROJECT_INDEX.md` - current project index for humans
- `mdocs/PROJECT_INDEX.json` - current project index for tools
- `src/routes/api/README.md` - API endpoint contracts
- `src/lib/components/README.md` - shared component registry
- `mdocs/TOON_FORMAT.md` - custom `.toon` import format
- `.Jules/sentinel.md` - security and reliability lessons learned

## Deployment

The app builds for Cloudflare Pages via `@sveltejs/adapter-cloudflare`. Bindings are declared in `wrangler.toml`:

- `DB` for Cloudflare D1
- `IMAGES` for Cloudflare R2

See `mdocs/CLOUDFLARE_DEPLOYMENT.md` for deployment details.
