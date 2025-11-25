# 🤝 AerialDB - Agent Handoff Instructions

**Date:** November 20, 2025
**Status:** Phase 1 MVP - 60% Complete
**Your Mission:** Complete the Admin Dashboard & CRUD Operations

---

## 🎯 Quick Start (Read This First!)

### What You're Building
AerialDB is an aerial acrobatics moves database. Think "Wikipedia for aerial moves" - users can browse, search, and learn about 109 different aerial techniques.

### What's Already Done
- ✅ **Working public website** at http://localhost:5173/
  - Browse 109 moves with search & category filter
  - View detailed move pages with video embedding
  - Fully responsive design

- ✅ **Complete database** (SQLite)
  - 109 moves imported from TOON format
  - 9 categories (Zapato, Punta-Flex, Tijera, etc.)
  - Admin user ready (username: `admin`, password: `admin123`)

- ✅ **Solid foundation**
  - SvelteKit 5 + Drizzle ORM + Tailwind CSS
  - Auth system working
  - File upload directory prepared

### What You Need to Build
**Admin Dashboard** so the user can populate images, videos, and descriptions for the 109 moves.

**Core Features Needed:**
1. Admin authentication guard
2. Create new moves form
3. Edit existing moves form
4. Image upload (5MB max, JPEG/PNG/WebP)
5. Delete moves with confirmation
6. Admin dashboard (list all moves)

**Estimated Time:** 2-3 hours

---

## 📚 Essential Reading

### Primary Documentation
**Read this file completely before starting:** [`PROGRESS_NOTE.md`](./PROGRESS_NOTE.md)

It contains:
- Complete technical context
- Detailed feature specifications
- Code examples for image upload
- File location map
- Testing checklist
- Everything you need to know

### Quick Reference Files
- **Database Schema:** `src/lib/server/db/schema.ts`
- **Existing UI Patterns:** `src/routes/+page.svelte`, `src/lib/components/MoveCard.svelte`
- **Auth Example:** `src/routes/demo/lucia/` (login/signup patterns)
- **Data Import:** `scripts/init-db.ts` (reference for DB operations)

---

## 🚀 Getting Started

### 1. Verify Environment

```bash
# Dev server should already be running
# If not, start it:
npm run dev

# Open in browser:
# http://localhost:5173/
```

### 2. Test Current Features

**Browse the directory:**
- Go to http://localhost:5173/
- Try searching for "Superman" or "Angel"
- Filter by a category
- Click on a move to see detail page

**Test login:**
- Go to http://localhost:5173/demo/lucia/login
- Username: `admin`
- Password: `admin123`

### 3. Understand the Data Model

**Key Tables:**
```typescript
// moves table
{
  id: string (UUID)
  name: string (e.g., "Superman", "Angel")
  categoryId: string (FK to categories)
  description: string | null (empty for now)
  imageUrl: string | null (empty for now)
  videoUrl: string | null (empty for now)
  contributorName: string | null (e.g., "Fer Medina")
  createdBy: string (FK to user - who added it to platform)
  createdAt: timestamp
  updatedAt: timestamp
}

// categories table
{
  id: string
  name: string (e.g., "Zapato", "Punta-Flex")
  createdAt: timestamp
}
```

**Important:** `contributorName` is the original creator of the move (might not be a platform user). `createdBy` is the user who added it to the database.

---

## 🛠️ Implementation Guide

### Build Order (Follow This Sequence)

#### Step 1: Admin Layout & Auth Guard
**File:** `src/routes/admin/+layout.server.ts`

**Purpose:** Protect all `/admin/*` routes from unauthenticated access.

**Code Template:**
```typescript
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Check if user is logged in
  if (!event.locals.user) {
    throw redirect(302, '/demo/lucia/login');
  }

  return {
    user: event.locals.user
  };
};
```

**Test:** Try visiting http://localhost:5173/admin (should redirect to login)

---

#### Step 2: Image Upload API
**File:** `src/routes/api/upload/+server.ts`

**Purpose:** Handle image file uploads to `/static/uploads/`

**Requirements:**
- Max 5MB file size
- Only JPEG, PNG, WebP formats
- Generate unique filename (use `crypto.randomUUID()`)
- Save to `/static/uploads/{uuid}.{ext}`
- Return URL: `/uploads/{filename}`

**Code Template:**
```typescript
import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('image') as File;

  if (!file || file.size === 0) {
    return json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate size (5MB = 5 * 1024 * 1024 bytes)
  if (file.size > 5 * 1024 * 1024) {
    return json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  // Validate type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return json({ error: 'Invalid file type (JPEG, PNG, WebP only)' }, { status: 400 });
  }

  // Generate unique filename
  const ext = file.name.split('.').pop();
  const filename = `${crypto.randomUUID()}.${ext}`;

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join('static', 'uploads', filename), buffer);

  return json({ url: `/uploads/${filename}` });
};
```

**Test:** Use Postman or create a simple form to test upload

---

#### Step 3: Create Move Form
**Files:**
- `src/routes/admin/moves/new/+page.svelte`
- `src/routes/admin/moves/new/+page.server.ts`

**Purpose:** Admin can add new moves to the database

**Form Fields:**
- Move name (text input, required)
- Category (dropdown, required - load from DB)
- Contributor name (text input, optional)
- Description (textarea, optional)
- Image (file upload, optional)
- Video URL (text input, optional - YouTube/Vimeo)

**Server Code (`+page.server.ts`):**
```typescript
import { db } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { redirect, fail } from '@sveltejs/kit';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';

// Generate ID helper
function generateId(length: number = 10): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return encodeBase32LowerCaseNoPadding(bytes);
}

// Load categories for dropdown
export const load: PageServerLoad = async () => {
  const allCategories = await db.select().from(categories).orderBy(categories.name);
  return { categories: allCategories };
};

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();

    // Validate required fields
    const name = formData.get('name') as string;
    const categoryId = formData.get('category') as string;

    if (!name || !categoryId) {
      return fail(400, { error: 'Name and category are required' });
    }

    // Handle image upload
    let imageUrl = null;
    const imageFile = formData.get('image') as File;

    if (imageFile && imageFile.size > 0) {
      // Upload via API endpoint
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        imageUrl = url;
      }
    }

    // Insert move
    const moveId = generateId(10);
    await db.insert(moves).values({
      id: moveId,
      name,
      categoryId,
      description: formData.get('description') as string || null,
      imageUrl,
      videoUrl: formData.get('video_url') as string || null,
      contributorName: formData.get('contributor') as string || null,
      createdBy: locals.user!.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    throw redirect(303, `/moves/${moveId}`);
  }
} satisfies Actions;
```

**Client Code (`+page.svelte`):**
```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl px-4 py-8">
  <h1 class="mb-8 text-3xl font-bold">Add New Move</h1>

  <form method="POST" enctype="multipart/form-data" class="space-y-6">
    <!-- Move Name -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Move Name *
      </label>
      <input
        type="text"
        name="name"
        required
        class="w-full rounded-lg border px-3 py-2"
      />
    </div>

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Category *
      </label>
      <select
        name="category"
        required
        class="w-full rounded-lg border px-3 py-2"
      >
        <option value="">Select a category</option>
        {#each data.categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>

    <!-- Contributor -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Original Contributor
      </label>
      <input
        type="text"
        name="contributor"
        placeholder="e.g., Fer Medina"
        class="w-full rounded-lg border px-3 py-2"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Description
      </label>
      <textarea
        name="description"
        rows="4"
        class="w-full rounded-lg border px-3 py-2"
      ></textarea>
    </div>

    <!-- Image Upload -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Image (max 5MB, JPEG/PNG/WebP)
      </label>
      <input
        type="file"
        name="image"
        accept="image/jpeg,image/png,image/webp"
        class="w-full"
      />
    </div>

    <!-- Video URL -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Video URL (YouTube/Vimeo)
      </label>
      <input
        type="url"
        name="video_url"
        placeholder="https://youtube.com/watch?v=..."
        class="w-full rounded-lg border px-3 py-2"
      />
    </div>

    <!-- Submit -->
    <div class="flex gap-4">
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create Move
      </button>
      <a
        href="/admin"
        class="rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        Cancel
      </a>
    </div>
  </form>
</div>
```

**Test:** Create a new move with all fields

---

#### Step 4: Edit Move Form
**Files:**
- `src/routes/admin/moves/[id]/edit/+page.svelte`
- `src/routes/admin/moves/[id]/edit/+page.server.ts`

**Purpose:** Edit existing moves (pre-populate form with current data)

**Key Differences from Create:**
- Load existing move data in `load` function
- Pre-populate all form fields with current values
- Update instead of insert in form action
- Update `updatedAt` timestamp

**Server Code:**
```typescript
export const load: PageServerLoad = async ({ params }) => {
  const [move] = await db
    .select()
    .from(moves)
    .where(eq(moves.id, params.id))
    .limit(1);

  if (!move) {
    throw error(404, 'Move not found');
  }

  const allCategories = await db.select().from(categories).orderBy(categories.name);

  return { move, categories: allCategories };
};

export const actions = {
  default: async ({ request, params }) => {
    // Similar to create, but use UPDATE instead of INSERT
    await db
      .update(moves)
      .set({
        name,
        categoryId,
        description,
        imageUrl,
        videoUrl,
        contributorName,
        updatedAt: new Date()
      })
      .where(eq(moves.id, params.id));

    throw redirect(303, `/moves/${params.id}`);
  }
};
```

**Client Code:** Same as create form, but bind values to `data.move.*`

**Test:** Edit an existing move, verify changes persist

---

#### Step 5: Admin Dashboard
**File:** `src/routes/admin/+page.svelte`

**Purpose:** List all moves with quick edit/delete actions

**Features:**
- Table showing all moves
- Search/filter (optional for MVP)
- Edit button → `/admin/moves/{id}/edit`
- Delete button with confirmation
- "Add New Move" button → `/admin/moves/new`
- Show statistics (total moves, categories)

**Simple Implementation:**
```svelte
<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-8">
  <div class="mb-8 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <a
      href="/admin/moves/new"
      class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      + Add New Move
    </a>
  </div>

  <!-- Stats -->
  <div class="mb-8 grid gap-4 sm:grid-cols-3">
    <div class="rounded-lg border bg-white p-6">
      <p class="text-sm text-gray-600">Total Moves</p>
      <p class="text-3xl font-bold">{data.moves.length}</p>
    </div>
    <div class="rounded-lg border bg-white p-6">
      <p class="text-sm text-gray-600">Categories</p>
      <p class="text-3xl font-bold">{data.categories.length}</p>
    </div>
    <div class="rounded-lg border bg-white p-6">
      <p class="text-sm text-gray-600">Needs Media</p>
      <p class="text-3xl font-bold">
        {data.moves.filter(m => !m.imageUrl && !m.videoUrl).length}
      </p>
    </div>
  </div>

  <!-- Moves Table -->
  <div class="overflow-hidden rounded-lg border bg-white">
    <table class="w-full">
      <thead class="border-b bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
          <th class="px-4 py-3 text-left text-sm font-semibold">Category</th>
          <th class="px-4 py-3 text-left text-sm font-semibold">Media</th>
          <th class="px-4 py-3 text-right text-sm font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.moves as move}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">{move.name}</td>
            <td class="px-4 py-3 text-sm">{move.category.name}</td>
            <td class="px-4 py-3 text-sm">
              {#if move.imageUrl}📷{/if}
              {#if move.videoUrl}🎥{/if}
              {#if !move.imageUrl && !move.videoUrl}—{/if}
            </td>
            <td class="px-4 py-3 text-right text-sm">
              <a
                href="/admin/moves/{move.id}/edit"
                class="text-blue-600 hover:text-blue-700"
              >
                Edit
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
```

---

#### Step 6: Delete Functionality
**Add to edit form or dashboard**

**Simple approach:** Add delete button to edit form

```svelte
<form method="POST" action="?/delete" onsubmit="return confirm('Delete this move?')">
  <button
    type="submit"
    class="text-red-600 hover:text-red-700"
  >
    Delete Move
  </button>
</form>
```

**Server action:**
```typescript
export const actions = {
  delete: async ({ params }) => {
    // Optional: Delete associated image file
    const [move] = await db.select().from(moves).where(eq(moves.id, params.id));

    if (move?.imageUrl) {
      // Delete file from /static/uploads/
      const filename = move.imageUrl.split('/').pop();
      await unlink(join('static', 'uploads', filename)).catch(() => {});
    }

    // Delete from database
    await db.delete(moves).where(eq(moves.id, params.id));

    throw redirect(303, '/admin');
  }
};
```

---

## ✅ Testing Checklist

Before considering MVP complete:

- [ ] Can log in as admin
- [ ] Can create new move with all fields
- [ ] Can create move with only required fields (name + category)
- [ ] Image upload validates file size (reject >5MB)
- [ ] Image upload validates file type (reject non-JPEG/PNG/WebP)
- [ ] Can edit existing move
- [ ] Edit form pre-populates with current data
- [ ] Can replace image when editing
- [ ] YouTube URL embeds correctly on detail page
- [ ] Can delete move
- [ ] Delete confirmation appears
- [ ] Admin dashboard shows all moves
- [ ] Admin dashboard statistics are correct
- [ ] Non-logged-in users redirected from /admin
- [ ] Mobile responsive (test on narrow screen)
- [ ] No console errors in browser

---

## 🎨 UI Guidelines

**Match existing design patterns:**
- Use existing Tailwind classes from `src/routes/+page.svelte`
- Color scheme: `blue-600` for primary actions, `zinc-*` for neutrals
- Forms: `rounded-lg border px-3 py-2`
- Buttons: `rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700`
- Cards/containers: `rounded-lg border bg-white p-6`

**Reference existing components:**
- Look at `src/lib/components/MoveCard.svelte` for styling patterns
- Look at `src/routes/demo/lucia/login/+page.svelte` for form patterns

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '$env/dynamic/private'"
**Solution:** This error occurs in standalone scripts. The DB connection already handles this with try/catch fallback to `process.env`

### Issue: Image upload fails silently
**Solution:** Check:
- `/static/uploads/` directory exists
- File permissions allow writing
- File size validation in both client and server
- Network tab in browser DevTools for errors

### Issue: Form action doesn't trigger
**Solution:** Ensure:
- Form has `method="POST"`
- Form has `enctype="multipart/form-data"` if uploading files
- Action name matches: `action="?/actionName"` and `export const actions = { actionName: ... }`

### Issue: Database query returns undefined
**Solution:**
- Check table/column names match schema exactly (camelCase in code, snake_case in DB)
- Use `.limit(1)` and destructure: `const [result] = await db.select()...`
- Check for typos in column references

---

## 📞 Questions to Ask User (If Needed)

1. **UI Polish Level:** Should admin UI be basic (works but plain) or match public UI quality?
2. **Image Management:** Should editing a move replace the old image file or keep both?
3. **Category CRUD:** Build category management UI or add categories via DB directly?
4. **Validation:** How strict? Require all fields or allow minimal entries?

---

## 🎯 Success Criteria

**MVP is complete when:**
- User can log in to `/admin`
- User can create moves with images/videos from admin panel
- User can edit all 109 existing moves to add media
- User can delete moves they created
- No blocking bugs or console errors
- Mobile responsive works

**Deliverable:**
A working admin system where the user (project owner) can populate content for the 109 moves over time.

---

## 🚨 Important Reminders

1. **Don't overthink it:** This is MVP, not production. Basic UI is fine.
2. **Follow existing patterns:** Match the code style in existing files
3. **Test as you go:** Build → test → fix → repeat for each step
4. **Use Svelte 5 runes:** `$state`, `$derived`, `$props` (not stores)
5. **Security:** Form actions are CSRF-protected by default, file validation on server
6. **Git:** Consider committing after each major step

---

## 📂 File Structure Reference

```
src/
├── routes/
│   ├── +page.svelte (✅ done - public directory)
│   ├── +page.server.ts (✅ done - load moves)
│   ├── moves/[id]/
│   │   ├── +page.svelte (✅ done - detail page)
│   │   └── +page.server.ts (✅ done - load move)
│   ├── admin/ (⚠️ TO BUILD)
│   │   ├── +layout.server.ts (auth guard)
│   │   ├── +page.svelte (dashboard)
│   │   ├── +page.server.ts (load all moves)
│   │   └── moves/
│   │       ├── new/+page.svelte (create form)
│   │       ├── new/+page.server.ts (create action)
│   │       └── [id]/edit/+page.svelte (edit form)
│   │       └── [id]/edit/+page.server.ts (edit/delete actions)
│   └── api/ (⚠️ TO BUILD)
│       └── upload/+server.ts (image upload endpoint)
├── lib/
│   ├── components/
│   │   ├── MoveCard.svelte (✅ done)
│   │   └── admin/ (⚠️ TO BUILD - optional)
│   │       └── ImageUpload.svelte (reusable upload component)
│   └── server/
│       ├── db/
│       │   ├── schema.ts (✅ done - database schema)
│       │   └── index.ts (✅ done - db connection)
│       └── auth.ts (✅ done - auth functions)
└── ...
```

---

## 💪 You've Got This!

The foundation is solid. Database is populated. Public UI is working beautifully. All you need to do is build the admin interface following the patterns already established in the codebase.

**Estimated time:** 2-3 hours for a working MVP admin system.

**Read PROGRESS_NOTE.md for complete technical details, then start coding!** 🚀

---

**Good luck! The user is counting on you to make it easy for them to populate those 109 moves with beautiful images and videos.** 📸🎥
