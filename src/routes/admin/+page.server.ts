import { getDb } from '$lib/server/db';
import { type AdminLeanMoveRaw, type AdminLeanMove } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Performance: Load moves and categories in parallel to reduce TTFB.
	// Optimization: Categories are fetched in full and resolved in-memory using a Map,
	// avoiding SQL JOIN overhead and redundant category name data transfer.
	// Lean Query: Using sql`CASE WHEN ...` to check for description presence without
	// fetching large text data, significantly reducing database I/O and payload size.
	// Type assertion needed: getDb() returns a union type (D1 | libsql)
	// that breaks .select({fields}) overload resolution
	const [allMovesRaw, allCategories] = (await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				hasDescription: sql<boolean>`CASE WHEN ${moves.description} IS NOT NULL AND ${moves.description} != '' THEN 1 ELSE 0 END`.as(
					'has_description'
				),
				imageUrl: moves.imageUrl,
				videoUrl: moves.videoUrl,
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

	const allMoves: AdminLeanMove[] = allMovesRaw.map((move) => ({
		...move,
		categoryName: categoryMap.get(move.categoryId) ?? 'Unknown'
	}));

	return {
		moves: allMoves,
		categories: allCategories
	};
};
