import { getDb } from '$lib/server/db';
import { type MoveWithCategoryRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { desc, eq, isNotNull, like, or } from 'drizzle-orm';
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

	// Fetch moves with category info
	// Type assertion needed: getDb() returns a union type (D1 | libsql)
	// that breaks .select({fields}) overload resolution
	const movesDataRaw = (await (db as any)
		.select({
			id: moves.id,
			name: moves.name,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			level: moves.level,
			contributorName: moves.contributorName,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(conditions.length > 0 ? or(...conditions) : undefined)
		.orderBy(moves.name)) as MoveWithCategoryRaw[];

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
			name: move.categoryName
		}
	}));

	// Fetch all categories for filter
	const allCategories = await db.select().from(categories).orderBy(categories.name);

	// Fetch a featured move (independent of search/filter params)
	const [featuredMoveRaw] = (await (db as any)
		.select({
			id: moves.id,
			name: moves.name,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			level: moves.level,
			contributorName: moves.contributorName,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(isNotNull(moves.imageUrl))
		.orderBy(desc(moves.createdAt))
		.limit(1)) as MoveWithCategoryRaw[];

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
					name: featuredMoveRaw.categoryName
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
