import { getDb } from '$lib/server/db';
import { type AdminLeanMove } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Performance: Fetch moves and categories in a single batch to reduce network round-trips.
	// Selective Field Fetching: Using computed booleans for presence indicators instead of fetching large text fields.
	// Optimization: Categories are resolved in-memory using a Map to avoid SQL JOIN overhead.
	const [movesDataRaw, allCategories] = await db.batch([
		db
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				hasDescription:
					sql<boolean>`CASE WHEN ${moves.description} IS NOT NULL AND ${moves.description} != '' THEN 1 ELSE 0 END`.as(
						'has_description'
					),
				hasImage:
					sql<boolean>`CASE WHEN ${moves.imageUrl} IS NOT NULL AND ${moves.imageUrl} != '' THEN 1 ELSE 0 END`.as(
						'has_image'
					),
				hasVideo:
					sql<boolean>`CASE WHEN ${moves.videoUrl} IS NOT NULL AND ${moves.videoUrl} != '' THEN 1 ELSE 0 END`.as(
						'has_video'
					),
				contributorName: moves.contributorName,
				createdAt: moves.createdAt,
				updatedAt: moves.updatedAt
			})
			.from(moves)
			.orderBy(moves.name),

		db.select().from(categories).orderBy(categories.name)
	]);

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
