<!-- Context: development/infrastructure/lookup/cloudflare-commands | Priority: medium | Version: 1.0 | Updated: 2026-03-28 -->

# Cloudflare Wrangler Commands

**Purpose**: Quick reference for Wrangler CLI operations on D1 and R2.

## D1 Database

| Action          | Command                                                                   |
| --------------- | ------------------------------------------------------------------------- |
| Create DB       | `npx wrangler d1 create <name>`                                           |
| Run SQL file    | `npx wrangler d1 execute <name> --file=./path.sql`                        |
| Run SQL command | `npx wrangler d1 execute <name> --command="SELECT * FROM moves LIMIT 10"` |
| Export backup   | `npx wrangler d1 export <name> --output=backup.sql`                       |
| List databases  | `npx wrangler d1 list`                                                    |

## R2 Storage

| Action        | Command                                                        |
| ------------- | -------------------------------------------------------------- |
| Create bucket | `npx wrangler r2 bucket create <name>`                         |
| List objects  | `npx wrangler r2 object list <bucket>`                         |
| Upload file   | `npx wrangler r2 object put <bucket>/<key> --file=./localfile` |
| Download file | `npx wrangler r2 object get <bucket>/<key> --file=./output`    |
| Delete file   | `npx wrangler r2 object delete <bucket>/<key>`                 |

## Schema & Migrations

| Action           | Command                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Generate SQL     | `npx drizzle-kit generate:sqlite`                                                                                 |
| Apply migration  | `npx wrangler d1 execute <name> --file=./drizzle/XXXX.sql`                                                        |
| Generate + apply | `npx drizzle-kit generate:sqlite && npx wrangler d1 execute <name> --file=./drizzle/$(ls -t drizzle/ \| head -1)` |

## Database Names

| Binding  | D1 Name               | R2 Name           |
| -------- | --------------------- | ----------------- |
| `DB`     | `aerialdb-production` | —                 |
| `IMAGES` | —                     | `aerialdb-images` |

## Related

- `../guides/cloudflare-deployment.md` — Full deployment steps
- `../lookup/cloudflare-limits.md` — Free tier limits
