import { getDb } from '$lib/server/db';
import { type LeanMove } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { desc, eq, isNotNull, and, sql } from 'drizzle-orm';
import { escapeLike } from '$lib/utils/security';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { url } = event;

	// SECURITY: Trim and limit query length
	const searchQuery = (url.searchParams.get('q') || '').trim().slice(0, 100);
	const categoryFilter = (url.searchParams.get('category') || '').trim().slice(0, 100);
	const levelFilterRaw = (url.searchParams.get('level') || '').trim().slice(0, 100);

	// SECURITY: Whitelist validation for level parameter
	const allowedLevels = ['beginner', 'intermediate', 'advanced', 'professional'];
	const levelFilter = allowedLevels.includes(levelFilterRaw) ? levelFilterRaw : '';

	// Build query conditions
	const conditions = [];

	if (searchQuery) {
		// SECURITY: Escape SQLite wildcards
		const searchPattern = `%${escapeLike(searchQuery)}%`;
		conditions.push(sql`${moves.name} LIKE ${searchPattern} ESCAPE '\\'`);
	}

	if (categoryFilter) {
		conditions.push(eq(moves.categoryId, categoryFilter));
	}

	if (levelFilter) {
		conditions.push(eq(moves.level, levelFilter));
	}

	// Performance: Fetch moves, categories, and featured move in a single batch to reduce network round-trips.
	// Optimization: Categories are fetched in full and resolved in-memory using a Map,
	// avoiding SQL JOIN overhead and redundant category name data transfer.
	// Lean Query: Selecting only the fields needed for the home page (cards + hero)
	// to reduce database transfer and memory usage.
	const [movesDataRaw, allCategories, featuredMoveResults] = await db.batch([
		db
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

		db.select().from(categories).orderBy(categories.name),

		db
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
	]);

	const featuredMoveRaw = featuredMoveResults[0];

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
