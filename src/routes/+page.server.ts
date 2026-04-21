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

	// Performance: Lean Queries - only fetch fields needed for the home page UI.
	// Performance: In-memory relational mapping - fetch all categories once and map names in-memory
	// to avoid redundant JOINs and reduce database payload size.

	// Define lean types for better maintainability and type safety
	interface LeanMove {
		id: string;
		name: string;
		imageUrl: string | null;
		level: string | null;
		categoryId: string;
	}

	interface LeanCategory {
		id: string;
		name: string;
	}

	// Type assertion (db as any) needed: getDb() returns a union type (D1 | libsql)
	// that breaks .select({fields}) overload resolution.
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

		(db as any)
			.select({
				id: categories.id,
				name: categories.name
			})
			.from(categories)
			.orderBy(categories.name),

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
	])) as [LeanMove[], LeanCategory[], LeanMove[]];

	// Create a category map for efficient in-memory lookup
	const categoryMap = new Map<string, string>(allCategories.map((c) => [c.id, c.name]));

	const movesData = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		imageUrl: move.imageUrl,
		level: move.level,
		category: {
			id: move.categoryId,
			name: categoryMap.get(move.categoryId) || 'Unknown'
		}
	}));

	const featuredMove = featuredMoveRaw
		? {
				id: featuredMoveRaw.id,
				name: featuredMoveRaw.name,
				imageUrl: featuredMoveRaw.imageUrl,
				level: featuredMoveRaw.level,
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
