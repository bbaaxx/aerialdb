import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import type { AdminLeanMove } from '$lib/server/db/types';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Performance: Load moves and categories in parallel to improve dashboard load time
	// Lean Query: Selecting only required fields for the admin table to reduce database transfer.
	// Optimization: Categories are fetched once and resolved in-memory using a Map,
	// avoiding SQL JOIN overhead and redundant category name data transfer per row.
	// We use a boolean flag for description presence to avoid fetching large text blobs.
	const [movesRaw, allCategories] = await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				hasDescription: sql<boolean>`CASE WHEN ${moves.description} IS NOT NULL AND ${moves.description} != '' THEN 1 ELSE 0 END`,
				imageUrl: moves.imageUrl,
				videoUrl: moves.videoUrl,
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

	const allMoves: AdminLeanMove[] = (movesRaw as any[]).map((move) => ({
		...move,
		categoryName: categoryMap.get(move.categoryId) || 'Uncategorized',
		hasDescription: Boolean(move.hasDescription)
	}));

	return {
		moves: allMoves,
		categories: allCategories
	};
};
