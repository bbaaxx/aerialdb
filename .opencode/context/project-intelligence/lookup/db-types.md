<!-- Context: project-intelligence/lookup/db-types | Priority: high | Version: 1.0 | Updated: 2026-03-28 -->

# Database Query Types

**Purpose**: Shared type definitions for Drizzle query type assertions.

## Types

```ts
// MoveWithCategoryRaw — moves with category (no timestamps)
export type MoveWithCategoryRaw = {
	id: string;
	name: string;
	description: string | null;
	imageUrl: string | null;
	videoUrl: string | null;
	contributorName: string | null;
	categoryId: string;
	categoryName: string;
};

// MoveWithCategoryRawFull — moves with timestamps
export type MoveWithCategoryRawFull = MoveWithCategoryRaw & {
	createdAt: Date | null;
	updatedAt: Date | null;
};

// SessionWithUser — auth session with user
export type SessionWithUser = {
	user: { id: string; username: string };
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
};
```

## Usage Pattern

```ts
// In page.server.ts:
const [result] = await db.select({...}).from(...)... as SessionWithUser[];

// Or for single result:
const [moveRaw] = await db.select({...}).from(...)... as MoveWithCategoryRawFull[];
```

## Location

**File**: `src/lib/server/db/types.ts`

## Related

- `../concepts/sveltekit-setup.md` — SvelteKit routing
- `../../development/data/concepts/db-type-assertions.md` — Full workaround explanation
