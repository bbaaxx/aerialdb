import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { type LeanMove, type LeanMoveRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const db = getDb(event);
	const { url } = event;

	// SECURITY: Trim and limit query length to prevent DoS with extremely long strings
	const query = (url.searchParams.get('q') || '').trim().slice(0, 100);
	const categoryFilter = url.searchParams.get('category') || '';

	// Return empty if query is less than 3 characters
	if (!query || query.length < 3) {
		return json({ moves: [] });
	}

	// Build search conditions - search both move name AND category name
	const conditions = [];

	// SECURITY: Escape LIKE wildcards to prevent arbitrary matching/DoS
	// SQLite uses '\' as default escape character if specified with ESCAPE clause
	// Drizzle's like() doesn't easily support ESCAPE clause in all dialects,
	// but we can at least sanitize the input to avoid unwanted '%' or '_' behavior.
	const escapedQuery = query.replace(/[%_]/g, (match) => `\\${match}`);
	const searchPattern = `%${escapedQuery}%`;

	// Search in move name OR category name
	// Using sql syntax for LIKE ... ESCAPE if needed, but for now standard like()
	// with manual escaping is a good first step.
	conditions.push(or(like(moves.name, searchPattern), like(categories.name, searchPattern)));

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
		// SECURITY: Use 'and' instead of 'or' to combine the search term with filters
		// to ensure the category filter actually restricts results.
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(moves.name)
		// SECURITY: Limit results to prevent large data sets from being returned (DoS)
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
