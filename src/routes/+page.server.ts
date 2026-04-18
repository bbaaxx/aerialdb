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
	// We optimize by removing redundant SQL joins and fetching only necessary fields for the library view.
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

		db.select().from(categories).orderBy(categories.name),

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
	])) as [
		(typeof moves.$inferSelect)[],
		(typeof categories.$inferSelect)[],
		(typeof moves.$inferSelect)[]
	];

	// Performance: Map categories in memory to avoid redundant SQL JOINs and reduce data transfer
	const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat.name]));

	const movesData = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		description: null, // Not used in Library view
		imageUrl: move.imageUrl,
		videoUrl: null, // Not used in Library view
		level: move.level,
		contributorName: null, // Not used in Library view
		category: {
			id: move.categoryId,
			name: categoryMap.get(move.categoryId) || 'Unknown'
		}
	}));

	const featuredMove = featuredMoveRaw
		? {
				id: featuredMoveRaw.id,
				name: featuredMoveRaw.name,
				description: null, // Not used in HeroBanner
				imageUrl: featuredMoveRaw.imageUrl,
				videoUrl: null, // Not used in HeroBanner
				level: featuredMoveRaw.level,
				contributorName: null, // Not used in HeroBanner
				category: {
					id: featuredMoveRaw.categoryId,
					name: categoryMap.get(featuredMoveRaw.categoryId) || 'Unknown'
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
