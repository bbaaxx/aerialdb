import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { type LeanMove, type LeanMoveRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { eq, or, and, sql } from 'drizzle-orm';
import { escapeLike } from '$lib/utils/security';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const db = getDb(event);
	const { url } = event;

	// SECURITY: Trim and limit query length to mitigate DoS and unexpected behavior
	const query = (url.searchParams.get('q') || '').trim().slice(0, 100);
	const categoryFilter = (url.searchParams.get('category') || '').trim().slice(0, 100);

	// Return empty if query is less than 3 characters
	if (!query || query.length < 3) {
		return json({ moves: [] });
	}

	// Build search conditions - search both move name AND category name
	const conditions = [];

	// SECURITY: Escape SQLite wildcards to prevent broad/unintended searches
	const searchPattern = `%${escapeLike(query)}%`;

	// Search in move name OR category name using ESCAPE clause
	conditions.push(
		or(
			sql`${moves.name} LIKE ${searchPattern} ESCAPE '\\'`,
			sql`${categories.name} LIKE ${searchPattern} ESCAPE '\\'`
		)
	);

	// Add category filter if specified
	if (categoryFilter) {
		conditions.push(eq(moves.categoryId, categoryFilter));
	}

	// Fetch moves with category info
	// Lean Query: Only selecting fields needed for the search result list
	// to optimize performance and reduce payload size.
	// Type assertion needed: getDb() returns a union type (D1 | libsql)
	// that breaks .select({fields}) overload resolution
	const movesDataRaw = (await (db as any)
		.select({
			id: moves.id,
			name: moves.name,
			imageUrl: moves.imageUrl,
			level: moves.level,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(moves.name)
		.limit(50)) as (LeanMoveRaw & { categoryName: string })[];

	const movesData: LeanMove[] = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		imageUrl: move.imageUrl,
		level: move.level,
		category: {
			id: move.categoryId,
			name: move.categoryName
		}
	}));

	return json({ moves: movesData });
};
