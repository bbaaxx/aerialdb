import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { type LeanMove, type LeanMoveRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { and, eq, or, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const db = getDb(event);
	const { url } = event;

	let query = url.searchParams.get('q')?.trim() || '';
	const categoryFilter = url.searchParams.get('category') || '';

	// SECURITY: Limit query length to prevent DoS
	if (query.length > 100) {
		query = query.substring(0, 100);
	}

	// Return empty if query is less than 3 characters
	if (!query || query.length < 3) {
		return json({ moves: [] });
	}

	// SECURITY: Escape SQL LIKE wildcards to prevent unintended data exposure
	// and overly broad searches.
	const escapedQuery = query.replace(/[\\%_]/g, '\\$&');
	const searchPattern = `%${escapedQuery}%`;

	// Build search conditions - search both move name AND category name
	const conditions = [];

	// Search in move name OR category name
	// Using sql template for ESCAPE clause as standard like() helper doesn't specify it
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
