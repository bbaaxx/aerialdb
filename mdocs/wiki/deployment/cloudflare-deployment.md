---
id: 'cloudflare-deployment'
title: 'Cloudflare Deployment'
lifecycle: stable
category: 'deployment'
created: '2026-06-04'
updated: '2026-06-04'
related_initiatives: ['install-mdocs']
tags: ['deployment', 'cloudflare', 'd1', 'r2', 'pages']
---

# Cloudflare Deployment

This guide walks you through deploying AerialDB to Cloudflare's free tier using:

- **Cloudflare Pages** for hosting
- **Cloudflare D1** for SQLite database
- **Cloudflare R2** for image storage

**Total Cost: $0** (within generous free limits)

---

## Prerequisites

1. **Cloudflare Account** - Create one at https://dash.cloudflare.com/sign-up
2. **GitHub Account** - For automatic deployments
3. **Wrangler CLI** - Already installed via `npm install -D wrangler`

---

## Step 1: Set Up Cloudflare D1 Database

### 1.1 Create D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create production database
npx wrangler d1 create aerialdb-production
```

**Copy the database ID** from the output. It will look like:

```
✅ Successfully created DB 'aerialdb-production'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 1.2 Update wrangler.toml

Open `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "aerialdb-production"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Your actual ID
```

### 1.3 Generate and Apply Database Schema

First, generate the SQL schema from Drizzle:

```bash
# Generate schema
npx drizzle-kit generate:sqlite
```

This creates a migration file in `drizzle/` directory. Now apply it to D1:

```bash
# Apply schema to D1 database
npx wrangler d1 execute aerialdb-production --file=./drizzle/0000_xxxx.sql
```

(Replace `0000_xxxx.sql` with your actual migration file name)

---

## Step 2: Set Up Cloudflare R2 Storage

### 2.1 Create R2 Bucket

```bash
# Create bucket for image storage
npx wrangler r2 bucket create aerialdb-images
```

### 2.2 Configure R2 Public Access (Optional)

For public image access, you have two options:

**Option A: Public Bucket (Easier)**

1. Go to Cloudflare Dashboard → R2
2. Select `aerialdb-images` bucket
3. Click "Settings" → "Public Access"
4. Enable public access and note the public URL

**Option B: Custom Domain (Recommended)**

1. Go to your R2 bucket settings
2. Add a custom domain (e.g., `images.yourdomain.com`)
3. Update image URLs in your code to use this domain

---

## Step 3: Seed Database with Initial Data

You'll need to migrate your existing 109 moves to D1. Create a seed script:

### 3.1 Create Seed File for D1

Create `scripts/seed-d1.ts`:

```typescript
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/lib/server/db/schema';

// Import your TOON parser
import { parseToonFile } from '../src/lib/utils/toon-parser';
import { readFileSync } from 'fs';

async function seed() {
	// This will run in Cloudflare Workers context
	// You'll need to execute this locally and generate SQL
	const toonData = readFileSync('./db/db.toon', 'utf-8');
	const parsed = parseToonFile(toonData);

	// Generate SQL INSERT statements
	console.log('-- Categories');
	for (const cat of parsed.categories) {
		console.log(
			`INSERT INTO categories (id, name, created_at) VALUES ('${cat.id}', '${cat.name}', ${Date.now()});`
		);
	}

	console.log('\\n-- Moves');
	for (const move of parsed.moves) {
		console.log(
			`INSERT INTO moves (id, name, category_id, contributor_name, created_by, created_at, updated_at) VALUES ('${move.id}', '${move.name.replace(/'/g, "''")}', '${move.categoryId}', ${move.contributorName ? `'${move.contributorName}'` : 'NULL'}, 'admin-user-id', ${Date.now()}, ${Date.now()});`
		);
	}
}

seed();
```

### 3.2 Run Seed Script

```bash
# Generate seed SQL
npx tsx scripts/seed-d1.ts > seed.sql

# Execute on D1
npx wrangler d1 execute aerialdb-production --file=./seed.sql
```

---

## Step 4: Deploy to Cloudflare Pages

### 4.1 Push to GitHub

```bash
git add .
git commit -m "feat: cloudflare deployment setup"
git push origin main
```

### 4.2 Connect Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Select your GitHub repository
5. Configure build settings:
   - **Project name:** `aerialdb`
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `.svelte-kit/cloudflare`

### 4.3 Add Environment Bindings

In the Cloudflare Pages project settings:

1. Go to **Settings** → **Functions**
2. Under **D1 database bindings:**
   - Variable name: `DB`
   - D1 database: `aerialdb-production`
3. Under **R2 bucket bindings:**
   - Variable name: `IMAGES`
   - R2 bucket: `aerialdb-images`

### 4.4 Add Environment Variables (Optional)

If you need session secrets or other env vars:

1. Go to **Settings** → **Environment variables**
2. Add:
   - `SESSION_SECRET` = (generate a random string)

---

## Step 5: Migrate Existing Images to R2 (If Applicable)

If you have existing images in `/static/uploads/`:

### 5.1 Upload Images to R2

```bash
# Upload all images at once
for file in static/uploads/*; do
  npx wrangler r2 object put aerialdb-images/$(basename $file) --file=$file
done
```

### 5.2 Update Image URLs in Database

You'll need to update the `image_url` column to use R2 URLs instead of local paths.

If using custom domain:

```sql
UPDATE moves
SET image_url = REPLACE(image_url, '/uploads/', 'https://images.yourdomain.com/')
WHERE image_url IS NOT NULL;
```

---

## Step 6: Test Your Deployment

1. Cloudflare will automatically build and deploy your site
2. Visit your deployment URL (e.g., `https://aerialdb.pages.dev`)
3. Test the following:
   - [ ] Homepage loads with all 109 moves
   - [ ] Search functionality works
   - [ ] Category filtering works
   - [ ] Admin login works (use demo credentials)
   - [ ] Create new move
   - [ ] Upload image (goes to R2)
   - [ ] Edit move
   - [ ] Delete move (removes from R2)

---

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to your Pages project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `aerialdb.com`)
5. Follow the DNS instructions

### 7.2 Configure R2 Custom Domain

1. Go to R2 → `aerialdb-images` → **Settings**
2. Click **Add custom domain**
3. Enter subdomain (e.g., `images.aerialdb.com`)
4. Update DNS records as instructed

---

## Local Development vs Production

The codebase now supports **dual-mode operation**:

### Local Development

- Uses local SQLite database (`local.db`)
- Stores images in `/static/uploads/`
- Run with: `npm run dev`

### Cloudflare Production

- Uses Cloudflare D1 (accessed via `platform.env.DB`)
- Stores images in R2 (accessed via `platform.env.IMAGES`)
- Auto-deployed via GitHub push

**No code changes needed!** The app automatically detects the environment.

---

## Monitoring & Debugging

### View D1 Database

```bash
# List all moves
npx wrangler d1 execute aerialdb-production --command="SELECT * FROM moves LIMIT 10"

# View categories
npx wrangler d1 execute aerialdb-production --command="SELECT * FROM categories"
```

### View R2 Objects

```bash
# List all images
npx wrangler r2 object list aerialdb-images

# Download an image
npx wrangler r2 object get aerialdb-images/filename.jpg --file=./downloaded.jpg
```

### View Deployment Logs

1. Go to Cloudflare Dashboard
2. Navigate to your Pages project
3. Click **View logs** on any deployment

---

## Free Tier Limits

Your project is **well within** Cloudflare's free limits:

### D1 (SQLite)

- ✅ **Database:** First database free
- ✅ **Storage:** 5 GB (you'll use ~1 MB)
- ✅ **Reads:** 5 million/day (you'll use ~1000/day)
- ✅ **Writes:** 100,000/day (you'll use ~10/day)

### R2 (Object Storage)

- ✅ **Storage:** 10 GB free (you'll use ~100 MB for images)
- ✅ **Reads:** Unlimited (egress is free!)
- ✅ **Writes:** 1 million/month (you'll use ~100/month)

### Pages (Hosting)

- ✅ **Bandwidth:** Unlimited
- ✅ **Builds:** 500/month (you'll use ~10/month)
- ✅ **Requests:** Unlimited

**You will never hit these limits with this project!**

---

## Troubleshooting

### Build Fails: "Cannot find module '@sveltejs/adapter-cloudflare'"

```bash
npm install -D @sveltejs/adapter-cloudflare
```

### Database Errors: "table moves does not exist"

```bash
# Re-run schema migration
npx drizzle-kit generate:sqlite
npx wrangler d1 execute aerialdb-production --file=./drizzle/XXXX.sql
```

### Images Not Uploading

1. Check R2 binding in Pages settings
2. Verify bucket name matches `wrangler.toml`
3. Check browser console for errors

### "Platform is undefined" Errors

- Ensure you're accessing database via `getDb(event)` not `db` directly
- Check that all server files import `getDb` from `$lib/server/db`

---

## Next Steps

Once deployed:

1. **Add Admin User**: Create your own admin account via the signup page
2. **Populate Content**: Add images and descriptions to your 109 moves
3. **SEO**: Add meta tags to improve discoverability
4. **Analytics**: Consider adding Cloudflare Web Analytics (free)
5. **Backups**: Periodically export D1 database:
   ```bash
   npx wrangler d1 export aerialdb-production --output=backup.sql
   ```

---

## Cost Breakdown

| Service          | Free Tier       | Your Usage          | Monthly Cost |
| ---------------- | --------------- | ------------------- | ------------ |
| Cloudflare Pages | Unlimited       | ~1000 requests/day  | **$0**       |
| D1 Database      | 5GB, 5M reads   | ~1MB, ~1000 reads   | **$0**       |
| R2 Storage       | 10GB, 1M writes | ~100MB, ~100 writes | **$0**       |
| **TOTAL**        |                 |                     | **$0**       |

---

**Congratulations!** 🎉 Your AerialDB is now deployed globally on Cloudflare's edge network with zero monthly costs!

Need help? Check the [Cloudflare Docs](https://developers.cloudflare.com/) or open an issue in your repository.

## Referenced By

_Auto-generated by mdocs_

- install-mdocs
