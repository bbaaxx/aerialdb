import { getDb } from '$lib/server/db';
import { type AdminLeanMoveRaw, type AdminLeanMove } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Performance: Fetch moves and categories in parallel to reduce TTFB.
	// Selective Field Fetching: Using computed booleans for presence indicators instead of fetching large text fields.
	// Optimization: Categories are resolved in-memory using a Map to avoid SQL JOIN overhead.
	const [movesDataRaw, allCategories] = (await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				hasDescription: sql<boolean>`CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END`,
				hasImage: sql<boolean>`CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END`,
				hasVideo: sql<boolean>`CASE WHEN video_url IS NOT NULL AND video_url != '' THEN 1 ELSE 0 END`,
				contributorName: moves.contributorName,
				createdAt: moves.createdAt,
				updatedAt: moves.updatedAt
			})
			.from(moves)
			.orderBy(moves.name),

		db.select().from(categories).orderBy(categories.name)
	])) as [AdminLeanMoveRaw[], (typeof categories.$inferSelect)[]];

	// Build in-memory category lookup for O(1) resolution
	const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

	const movesData: AdminLeanMove[] = movesDataRaw.map((move) => ({
		...move,
		categoryName: categoryMap.get(move.categoryId) ?? 'Uncategorized',
		// SQLite returns 0/1 for computed booleans, convert to boolean for consistency
		hasDescription: !!move.hasDescription,
		hasImage: !!move.hasImage,
		hasVideo: !!move.hasVideo
	}));

	return {
		moves: movesData,
		categories: allCategories
	};
};
