<!-- Context: development/infrastructure/errors/cloudflare-deployment-errors | Priority: medium | Version: 1.0 | Updated: 2026-03-28 -->

# Cloudflare Deployment Errors

**Purpose**: Common errors when deploying AerialDB to Cloudflare and their fixes.

## Build Errors

### Missing adapter

- **Symptom**: `Cannot find module '@sveltejs/adapter-cloudflare'`
- **Cause**: Adapter package not installed
- **Solution**: `npm install -D @sveltejs/adapter-cloudflare`
- **Prevention**: Ensure `svelte.config.js` uses `adapter-cloudflare`
- **Frequency**: Common on first deploy

## Database Errors

### Table not found

- **Symptom**: `table moves does not exist` or `SQLITE_ERROR: no such table`
- **Cause**: Schema migration not applied to D1
- **Solution**:
  ```bash
  npx drizzle-kit generate:sqlite
  npx wrangler d1 execute aerialdb-production --file=./drizzle/XXXX.sql
  ```
- **Prevention**: Always apply migrations after schema changes
- **Frequency**: Common after schema changes

## Runtime Errors

### Platform undefined

- **Symptom**: `TypeError: Cannot read property 'env' of undefined` or `"platform is undefined"`
- **Cause**: Using bare `db` export instead of `getDb(event)` in route files
- **Solution**: Replace all `import { db }` with `import { getDb }` and use `getDb(event)`
- **Code**:

  ```ts
  // Wrong
  import { db } from '$lib/server/db';
  const result = await db.select().from(moves);

  // Correct
  import { getDb } from '$lib/server/db';
  const db = getDb(event);
  const result = await db.select().from(moves);
  ```

- **Prevention**: Never import `db` directly in route files
- **Frequency**: Common during development
- **References**: `src/lib/server/db/index.ts`

## R2 / Image Errors

### Images not uploading

- **Symptom**: Upload silently fails or returns 500
- **Cause**: R2 binding misconfigured or missing
- **Solution**:
  1. Check Pages Settings → Functions → R2 binding exists
  2. Verify variable name is `IMAGES` and bucket is `aerialdb-images`
  3. Check `wrangler.toml` matches binding names
  4. Check browser console for errors
- **Prevention**: Verify bindings after any Pages project reconfiguration
- **Frequency**: Occasional

### Images not displaying

- **Symptom**: Broken image links in production
- **Cause**: R2 public access not configured or wrong URL
- **Solution**:
  1. Enable R2 public access or add custom domain
  2. Update `PUBLIC_R2_URL` env var
  3. If migrated, run URL update SQL:
     ```sql
     UPDATE moves SET image_url = REPLACE(image_url, '/uploads/', 'https://images.yourdomain.com/')
     WHERE image_url IS NOT NULL;
     ```
- **Frequency**: Occasional after initial deployment

## Related

- `../guides/cloudflare-deployment.md` — Full deployment steps
- `../lookup/cloudflare-commands.md` — Wrangler commands for debugging
