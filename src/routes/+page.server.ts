import { getDb } from '$lib/server/db';
import { type LeanMoveRaw, type LeanMove } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { desc, eq, isNotNull, like, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { url } = event;

	const searchQuery = url.searchParams.get('q') || '';
	const categoryFilter = url.searchParams.get('category') || '';
	const levelFilter = url.searchParams.get('level') || '';

	// Build query conditions
	const conditions = [];

	if (searchQuery) {
		conditions.push(like(moves.name, `%${searchQuery}%`));
	}

	if (categoryFilter) {
		conditions.push(eq(moves.categoryId, categoryFilter));
	}

	if (levelFilter) {
		conditions.push(eq(moves.level, levelFilter));
	}

	// Performance: Fetch moves, categories, and featured move in parallel to reduce TTFB.
	// Optimization: Categories are fetched in full and resolved in-memory using a Map,
	// avoiding SQL JOIN overhead and redundant category name data transfer.
	// Lean Query: Selecting only the fields needed for the home page (cards + hero)
	// to reduce database transfer and memory usage.
	const [movesDataRaw, allCategories, [featuredMoveRaw]] = (await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				imageUrl: moves.imageUrl,
				level: moves.level,
				categoryId: moves.categoryId
			})
			.from(moves)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.orderBy(moves.name),

		(db as any).select().from(categories).orderBy(categories.name),

		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				imageUrl: moves.imageUrl,
				level: moves.level,
				categoryId: moves.categoryId
			})
			.from(moves)
			.where(isNotNull(moves.imageUrl))
			.orderBy(desc(moves.createdAt))
			.limit(1)
	])) as [LeanMoveRaw[], (typeof categories.$inferSelect)[], LeanMoveRaw[]];

	// Build in-memory category lookup for O(1) resolution
	const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

	const movesData: LeanMove[] = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		imageUrl: move.imageUrl,
		level: move.level,
		category: {
			id: move.categoryId,
			name: categoryMap.get(move.categoryId) ?? 'Unknown'
		}
	}));

	const featuredMove: LeanMove | null = featuredMoveRaw
		? {
				id: featuredMoveRaw.id,
				name: featuredMoveRaw.name,
				imageUrl: featuredMoveRaw.imageUrl,
				level: featuredMoveRaw.level,
				category: {
					id: featuredMoveRaw.categoryId,
					name: categoryMap.get(featuredMoveRaw.categoryId) ?? 'Unknown'
				}
			}
		: null;

	return {
		moves: movesData,
		categories: allCategories,
		searchQuery,
		categoryFilter,
		levelFilter,
		featuredMove
	};
};
