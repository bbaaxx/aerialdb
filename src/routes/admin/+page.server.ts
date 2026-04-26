import { getDb } from '$lib/server/db';
import { type AdminLeanMove, type AdminLeanMoveRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Performance: Load moves and categories in parallel to improve dashboard load time.
	// Optimization: Using "Lean Queries" to fetch only necessary fields and avoiding large text transfer
	// by using existence flags for description and media.
	// Optimization: Categories are resolved in-memory using a Map to avoid SQL JOIN overhead.
	// Note: Type assertion (db as any) is needed to resolve Drizzle type union conflicts.
	const [movesRaw, allCategories] = (await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				hasDescription: sql<number>`CASE WHEN ${moves.description} IS NOT NULL AND ${moves.description} != '' THEN 1 ELSE 0 END`,
				hasImageUrl: sql<number>`CASE WHEN ${moves.imageUrl} IS NOT NULL AND ${moves.imageUrl} != '' THEN 1 ELSE 0 END`,
				hasVideoUrl: sql<number>`CASE WHEN ${moves.videoUrl} IS NOT NULL AND ${moves.videoUrl} != '' THEN 1 ELSE 0 END`,
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

	const allMoves: AdminLeanMove[] = movesRaw.map((move) => ({
		id: move.id,
		name: move.name,
		categoryId: move.categoryId,
		description: Boolean(move.hasDescription),
		imageUrl: Boolean(move.hasImageUrl),
		videoUrl: Boolean(move.hasVideoUrl),
		contributorName: move.contributorName,
		categoryName: categoryMap.get(move.categoryId) ?? 'Uncategorized',
		createdAt: move.createdAt,
		updatedAt: move.updatedAt
	}));

	return {
		moves: allMoves,
		categories: allCategories
	};
};
