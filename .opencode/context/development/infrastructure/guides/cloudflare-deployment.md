<!-- Context: development/infrastructure/guides/cloudflare-deployment | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Cloudflare Deployment Guide

**Purpose**: Deploy AerialDB to Cloudflare Pages + D1 + R2 ($0/month)

## Prerequisites

- Cloudflare account + Wrangler CLI (`npm install -D wrangler`)
- GitHub repo with the project
- `npx wrangler login` authenticated

## Steps

### 1. Create D1 Database

```bash
npx wrangler d1 create aerialdb-production
# Copy database_id from output
```

Update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "aerialdb-production"
database_id = "YOUR_DATABASE_ID"
```

### 2. Apply Schema

```bash
npx drizzle-kit generate:sqlite
npx wrangler d1 execute aerialdb-production --file=./drizzle/0000_xxxx.sql
```

### 3. Create R2 Bucket

```bash
npx wrangler r2 bucket create aerialdb-images
```

Update `wrangler.toml`:

```toml
[[r2_buckets]]
bucket_name = "aerialdb-images"
binding = "IMAGES"
```

**Public access**: Dashboard → R2 → bucket → Settings → Public Access (or custom domain `images.yourdomain.com`)

### 4. Seed Database

```bash
npx tsx scripts/seed-d1.ts > seed.sql
npx wrangler d1 execute aerialdb-production --file=./seed.sql
```

Seed script uses TOON parser (`src/lib/utils/toon-parser`) to generate SQL INSERTs.

### 5. Deploy to Pages

1. Dashboard → Workers & Pages → Create → Connect to Git
2. Select repo, configure:
   - **Build command:** `npm run build`
   - **Build output:** `.svelte-kit/cloudflare`
3. Add bindings in Settings → Functions:
   - D1: variable `DB` → `aerialdb-production`
   - R2: variable `IMAGES` → `aerialdb-images`
4. (Optional) Add env var `SESSION_SECRET`

### 6. Migrate Existing Images (if any)

```bash
for file in static/uploads/*; do
  npx wrangler r2 object put aerialdb-images/$(basename $file) --file=$file
done
```

Update URLs in DB:

```sql
UPDATE moves SET image_url = REPLACE(image_url, '/uploads/', 'https://images.yourdomain.com/')
WHERE image_url IS NOT NULL;
```

### 7. Custom Domain (Optional)

1. Pages project → Custom domains → Add domain
2. R2 bucket → Settings → Add custom domain (e.g., `images.aerialdb.com`)

## Verification

- Homepage loads with all moves
- Search + category filtering works
- Admin login + CRUD operations work
- Image upload goes to R2
- Visit `https://your-project.pages.dev`

## Troubleshooting

- **Build fails**: `npm install -D @sveltejs/adapter-cloudflare`
- **"table not found"**: Re-run schema migration (step 2)
- **"platform undefined"**: Use `getDb(event)` not bare `db` export
- See `../errors/cloudflare-deployment-errors.md` for full error reference

## Codebase References

| File                           | Role                     |
| ------------------------------ | ------------------------ |
| `wrangler.toml`                | D1 + R2 bindings         |
| `src/lib/server/db/index.ts`   | `getDb(event)` dual-mode |
| `scripts/seed-d1.ts`           | TOON → SQL seed script   |
| `src/lib/utils/toon-parser.ts` | TOON file parser         |

## Related

- `../concepts/dual-environment.md` — Local vs prod architecture
- `../lookup/cloudflare-commands.md` — Wrangler CLI quick ref
- `../lookup/cloudflare-limits.md` — Free tier limits
