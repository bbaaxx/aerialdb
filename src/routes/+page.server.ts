import { getDb } from '$lib/server/db';
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
	const [movesDataRaw, allCategories, [featuredMoveRaw]] = (await Promise.all([
		(db as any)
			.select({
				id: moves.id,
				name: moves.name,
				description: moves.description,
				imageUrl: moves.imageUrl,
				videoUrl: moves.videoUrl,
				level: moves.level,
				contributorName: moves.contributorName,
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
				description: moves.description,
				imageUrl: moves.imageUrl,
				videoUrl: moves.videoUrl,
				level: moves.level,
				contributorName: moves.contributorName,
				categoryId: moves.categoryId
			})
			.from(moves)
			.where(isNotNull(moves.imageUrl))
			.orderBy(desc(moves.createdAt))
			.limit(1)
	])) as [
		(typeof moves.$inferSelect)[],
		(typeof categories.$inferSelect)[],
		(typeof moves.$inferSelect)[]
	];

	// Build in-memory category lookup for O(1) resolution
	const categoryMap = new Map(allCategories.map((c) => [c.id, c.name]));

	const movesData = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		description: move.description,
		imageUrl: move.imageUrl,
		videoUrl: move.videoUrl,
		level: move.level,
		contributorName: move.contributorName,
		category: {
			id: move.categoryId,
			name: categoryMap.get(move.categoryId) ?? 'Unknown'
		}
	}));

	const featuredMove = featuredMoveRaw
		? {
				id: featuredMoveRaw.id,
				name: featuredMoveRaw.name,
				description: featuredMoveRaw.description,
				imageUrl: featuredMoveRaw.imageUrl,
				videoUrl: featuredMoveRaw.videoUrl,
				level: featuredMoveRaw.level,
				contributorName: featuredMoveRaw.contributorName,
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
