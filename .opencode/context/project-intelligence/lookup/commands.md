<!-- Context: project-intelligence/lookup/commands | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# NPM Scripts Reference

**Purpose**: Quick reference for all npm scripts in AerialDB.

## Development

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

## Testing

| Command                      | Description                    |
| ---------------------------- | ------------------------------ |
| `npm run test:unit`          | Vitest unit tests (watch mode) |
| `npm run test:unit -- --run` | Run unit tests once            |
| `npm run test:e2e`           | Playwright e2e tests           |
| `npm test`                   | Run all tests (unit + e2e)     |

## Database

| Command               | Description                 |
| --------------------- | --------------------------- |
| `npm run db:push`     | Push schema to database     |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate`  | Run migrations              |
| `npm run db:studio`   | Open Drizzle Studio GUI     |
| `npm run db:seed`     | Seed DB from seed script    |

## Code Quality

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `npm run check`  | Type checking (svelte-check) |
| `npm run lint`   | ESLint + Prettier check      |
| `npm run format` | Auto-format code             |

## Related

- `../concepts/sveltekit-setup.md` — SvelteKit patterns
- `../../development/infrastructure/guides/cloudflare-deployment.md` — Deployment commands
