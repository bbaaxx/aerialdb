# AerialDB - Phase 1 MVP Progress Note

**Date:** November 20, 2025
**Status:** Phase 1 Partially Complete - Ready for Admin Dashboard Implementation
**Dev Server:** Running at http://localhost:5173/

---

## 🎯 Project Overview

AerialDB is a database/directory application for aerial acrobatics moves built with:
- **SvelteKit 5** (with runes)
- **Drizzle ORM** + **SQLite** (local development)
- **Tailwind CSS v4**
- **Auth** (Oslo/Lucia pattern)
- **i18n** (Paraglide - already configured)

### Current Data
- **109 aerial moves** imported from TOON format
- **9 categories** (Zapato, Punta-Flex, Tijera, Arnes, Cristo, Extras, Sapo, Subidas, Zapato Doble)
- **1 admin user** (username: `admin`, password: `admin123`)

---

## ✅ Completed Features

### 1. Database Schema (`src/lib/server/db/schema.ts`)

Tables created:
- **`user`** - Auth users (existing from scaffold)
- **`session`** - Auth sessions (existing from scaffold)
- **`categories`** - Move categories (database-driven, can add more)
- **`moves`** - Aerial moves with:
  - `id` (TEXT PRIMARY KEY)
  - `name` (TEXT NOT NULL)
  - `categoryId` (TEXT NOT NULL, FK to categories)
  - `description` (TEXT, nullable)
  - `imageUrl` (TEXT, nullable)
  - `videoUrl` (TEXT, nullable)
  - `contributorName` (TEXT, nullable) - Original creator of the move
  - `createdBy` (TEXT NOT NULL, FK to user) - User who added it to platform
  - `createdAt`, `updatedAt` (INTEGER timestamps)

**Key Design Decision:** `contributorName` is a simple text field for MVP. The move creator might not be a platform user (e.g., famous aerialists). Separate from `createdBy` which tracks who added the entry.

### 2. Data Import System

Files:
- **`src/lib/utils/toon-parser.ts`** - Parses TOON format (custom format from `/db/db.toon`)
- **`scripts/init-db.ts`** - Combined schema creation + data seeding script

Run: `npm run db:init` to initialize database

**Important:** Script handles duplicate move IDs (same move in multiple categories) by generating new IDs.

### 3. Public Move Directory

**Route:** `/` (homepage)

Files:
- **`src/routes/+page.server.ts`** - Data loading with search/filter logic
- **`src/routes/+page.svelte`** - Directory UI with search bar + category filter
- **`src/lib/components/MoveCard.svelte`** - Move card component

Features implemented:
- ✅ Browse all 109 moves in responsive grid (3 cols on desktop, 2 on tablet, 1 on mobile)
- ✅ Search by move name (query param: `?q=searchterm`)
- ✅ Filter by category (query param: `?category=categoryId`)
- ✅ Combined search + filter (preserves both params)
- ✅ Empty state when no results
- ✅ "Clear filters" link
- ✅ Move count display

### 4. Move Detail Pages

**Route:** `/moves/[id]`

Files:
- **`src/routes/moves/[id]/+page.server.ts`** - Load single move with category
- **`src/routes/moves/[id]/+page.svelte`** - Detail page UI

Features implemented:
- ✅ YouTube video embedding (auto-extracts video ID from URL)
- ✅ Image display with placeholder fallback
- ✅ Category badge
- ✅ Contributor attribution
- ✅ Description section (shows empty state if null)
- ✅ "Back to directory" link
- ✅ "Edit this move" link (points to `/admin/moves/{id}/edit` - not yet built)

### 5. File Upload Infrastructure

Created:
- **`/static/uploads/`** directory for image storage

Configuration:
- Max file size: **5MB**
- Allowed formats: **JPEG, PNG, WebP**
- No optimization yet (deferred to Phase 2+)

---

## 🚧 Remaining Work (Next Agent Should Build)

### Phase 1 MVP - Critical Features

#### 1. Admin Authentication Guard
**Priority:** HIGH (required for all admin features)

Create: `src/routes/admin/+layout.server.ts`
- Check if user is authenticated
- Redirect to `/demo/lucia/login` if not logged in
- Load user info for admin pages

#### 2. Admin Dashboard
**Priority:** HIGH

Create: `src/routes/admin/+page.svelte`
- List all moves in table format
- Quick actions: Edit, Delete
- "Add New Move" button
- Statistics summary (total moves, categories, recent additions)

#### 3. Create Move Form
**Priority:** HIGH

Create: `src/routes/admin/moves/new/+page.svelte` + `+page.server.ts`

Form fields:
- Move name (required)
- Category dropdown (required, load from categories table)
- Contributor name (optional text field)
- Description (textarea)
- Image upload (file input, 5MB max)
- Video URL (text input for YouTube/Vimeo)

Form actions:
- Handle image upload to `/static/uploads/`
- Generate unique filename (e.g., `{moveId}-{timestamp}.jpg`)
- Store image path in `imageUrl` field
- Validate file size and format
- Insert move into database
- Redirect to move detail page on success

#### 4. Edit Move Form
**Priority:** HIGH

Create: `src/routes/admin/moves/[id]/edit/+page.svelte` + `+page.server.ts`

- Pre-populate form with existing move data
- Allow changing all fields (name, category, contributor, description, image, video)
- Handle image replacement (delete old file if replacing)
- Update `updatedAt` timestamp
- Redirect to move detail page on success

#### 5. Delete Move
**Priority:** MEDIUM

Add to edit page or dashboard:
- Delete button with confirmation dialog
- Delete associated image file from `/static/uploads/`
- Remove from database
- Redirect to admin dashboard

#### 6. Image Upload Component
**Priority:** HIGH

Create: `src/lib/components/admin/ImageUpload.svelte`

Features:
- File input with drag-and-drop
- Image preview before upload
- File size validation (5MB max)
- Format validation (JPEG, PNG, WebP)
- Display current image if editing
- "Remove image" option

#### 7. Category Management (Optional for MVP)
**Priority:** LOW (can add categories directly in DB for now)

Create: `src/routes/admin/categories/+page.svelte`
- List all categories
- Add new category
- Edit category name
- Delete category (with warning if moves exist)

---

## 📁 Key File Locations

### Database
- Schema: `src/lib/server/db/schema.ts`
- DB connection: `src/lib/server/db/index.ts`
- Data files: `db/db.toon` (TOON format), `local.db` (SQLite database)

### Routes
- Homepage: `src/routes/+page.svelte` + `+page.server.ts`
- Move detail: `src/routes/moves/[id]/+page.svelte` + `+page.server.ts`
- Admin (to build): `src/routes/admin/...`

### Components
- Move card: `src/lib/components/MoveCard.svelte`
- Admin components (to build): `src/lib/components/admin/...`

### Utilities
- TOON parser: `src/lib/utils/toon-parser.ts`
- Auth: `src/lib/server/auth.ts`

### Scripts
- Initialize DB: `scripts/init-db.ts` (run: `npm run db:init`)

### Static Files
- Uploads directory: `static/uploads/` (images stored here)

---

## 🔧 Technical Implementation Notes

### Database Connection
`src/lib/server/db/index.ts` supports both:
- SvelteKit runtime (imports from `$env/dynamic/private`)
- Standalone scripts (falls back to `process.env.DATABASE_URL`)

### Image Upload Implementation Guide

Create: `src/routes/api/upload/+server.ts`

```typescript
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('image') as File;

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    return json({ error: 'File too large' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return json({ error: 'Invalid file type' }, { status: 400 });
  }

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const filename = `${crypto.randomUUID()}.${ext}`;

  // Save to /static/uploads/
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join('static', 'uploads', filename), buffer);

  return json({ url: `/uploads/${filename}` });
};
```

### Form Actions Pattern (SvelteKit)

Example for create move:

```typescript
// src/routes/admin/moves/new/+page.server.ts
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();

    // Handle image upload first
    const imageFile = formData.get('image') as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      // Upload image via API or handle directly
      // Store imageUrl
    }

    // Insert into database
    await db.insert(moves).values({
      id: generateId(10),
      name: formData.get('name'),
      categoryId: formData.get('category'),
      description: formData.get('description'),
      imageUrl,
      videoUrl: formData.get('video_url'),
      contributorName: formData.get('contributor'),
      createdBy: locals.user.id, // From auth
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true };
  }
};
```

---

## 🎨 UI/UX Patterns Established

### Tailwind Color Scheme
- Primary: `blue-600` / `blue-100` (accent color)
- Background: `zinc-50` (light) / `zinc-950` (dark)
- Cards: `white` / `zinc-900`
- Borders: `zinc-200` / `zinc-800`
- Text: `zinc-900` / `zinc-100`

### Component Patterns
- Cards: Rounded-lg, border, shadow-sm, hover:shadow-md
- Forms: Rounded-lg inputs, focus:ring-blue-500
- Buttons: Follow existing patterns in auth demo (`/demo/lucia/`)
- Empty states: Centered icon + message

### Responsive Breakpoints
- Mobile: Default (1 column)
- Tablet: `sm:` (640px+) - 2 columns
- Desktop: `lg:` (1024px+) - 3 columns

---

## 🧪 Testing & Quality Assurance

### Current Test Coverage
- No tests written yet (test setup exists: Vitest + Playwright)

### Manual Testing Checklist (Next Agent)
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Combined search + filter works
- [ ] Move detail page loads correctly
- [ ] YouTube video embeds display
- [ ] Image placeholders show when no image
- [ ] Mobile responsive design
- [ ] Admin login required for admin routes
- [ ] Image upload works (5MB, JPEG/PNG/WebP)
- [ ] Create move form validation
- [ ] Edit move form pre-population
- [ ] Delete move with confirmation

---

## 🚀 How to Continue Development

### 1. Start the Dev Server
```bash
npm run dev
```
App runs at: http://localhost:5173/

### 2. Access Existing Pages
- Homepage (directory): http://localhost:5173/
- Move detail: http://localhost:5173/moves/{moveId}
- Login: http://localhost:5173/demo/lucia/login

### 3. Login Credentials
- Username: `admin`
- Password: `admin123`

### 4. Database Management
```bash
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:init      # Re-initialize database (WARNING: deletes data)
```

### 5. Recommended Build Order
1. **Admin layout** with auth guard (`src/routes/admin/+layout.server.ts`)
2. **Image upload API** (`src/routes/api/upload/+server.ts`)
3. **Create move form** (`src/routes/admin/moves/new/`)
4. **Edit move form** (`src/routes/admin/moves/[id]/edit/`)
5. **Admin dashboard** (`src/routes/admin/+page.svelte`)
6. **Delete functionality**
7. **Test everything**

---

## 📦 Phase 2+ Features (Future)

After MVP is complete, consider:

### Enhanced Features
- Rich text descriptions (MDSvex or TipTap editor)
- Tags system (many-to-many with `move_tags` table)
- Difficulty levels (Beginner, Intermediate, Advanced, Expert)
- Advanced search (by tags, difficulty, description content)
- Bulk import UI for TOON files

### Public Features
- SEO optimization (meta tags, sitemap, structured data)
- Social sharing (OG images, share buttons)
- Multi-user contributor system (roles: viewer, contributor, admin)
- Community features (favorites, ratings, comments)

### Admin Features
- Analytics dashboard (popular moves, search queries)
- Contributor management UI
- Image optimization (resize, compress, WebP conversion)
- Video thumbnail extraction
- Audit log (who changed what)

### Infrastructure
- Migrate to cloud storage (Cloudinary, R2) for images
- Production deployment guide
- Backup/restore system
- Performance monitoring

---

## ⚠️ Important Notes for Next Agent

### Security Considerations
1. **CSRF Protection:** SvelteKit handles this by default for form actions
2. **File Upload Validation:** Always validate on server side, not just client
3. **SQL Injection:** Using Drizzle ORM protects against this
4. **Path Traversal:** Don't trust user input for file paths
5. **Admin Password:** Change default password before production!

### Performance Notes
1. Currently loading all moves at once (109 is fine, but consider pagination if it grows)
2. No image optimization yet - add later if needed
3. SQLite is fine for MVP, but consider PostgreSQL for production

### Code Quality
1. Project uses Prettier + ESLint (run: `npm run format`, `npm run lint`)
2. TypeScript strict mode enabled
3. Follow existing patterns for consistency
4. Use Svelte 5 runes (`$state`, `$derived`, `$props`)

### Git Commits
- User has been creating commits manually
- Current branch: `master`
- No `.gitignore` entries for `local.db` or `/static/uploads/` yet (add these!)

---

## 📞 Handoff Questions for User

Before continuing, the next agent should ask:

1. **Admin UI Priority:** Should admin dashboard be basic (simple table) or polished (match public UI)?
2. **Image Handling:** Keep simple file upload or integrate Cloudinary/similar service now?
3. **Video Support:** Only YouTube or also Vimeo/direct video files?
4. **Category Management:** Build UI now or add categories via DB for MVP?
5. **Multi-language:** Implement move name/description translations now or later?

---

## 🎯 Success Criteria for MVP Completion

MVP is complete when:
- [x] Users can browse and search 109 moves
- [x] Users can view individual move details
- [ ] Admin can log in
- [ ] Admin can create new moves with images/videos
- [ ] Admin can edit existing moves
- [ ] Admin can delete moves
- [ ] Image upload works (5MB limit, correct formats)
- [ ] Video URLs embed correctly (YouTube)
- [ ] App is mobile-responsive
- [ ] No console errors in browser

---

**Ready for handoff!** Next agent has all context needed to build admin dashboard and complete Phase 1 MVP. Estimated time: 2-3 hours for core admin features.
