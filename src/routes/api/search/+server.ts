import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { type MoveWithCategoryRaw } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { and, eq, like, or } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const db = getDb(event);
	const { url } = event;

	const query = url.searchParams.get('q') || '';
	const categoryFilter = url.searchParams.get('category') || '';

	// Return empty if query is less than 3 characters
	if (!query || query.length < 3) {
		return json({ moves: [] });
	}

	// Build search conditions - search both move name AND category name
	const conditions = [];

	// Search in move name OR category name
	const searchPattern = `%${query}%`;
	conditions.push(or(like(moves.name, searchPattern), like(categories.name, searchPattern)));

	// Add category filter if specified
	if (categoryFilter) {
		conditions.push(eq(moves.categoryId, categoryFilter));
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
			contributorName: moves.contributorName,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		// Performance & Correctness: Use 'and' for additive filtering (search term AND category filter)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(moves.name)) as MoveWithCategoryRaw[];

	const movesData = movesDataRaw.map((move) => ({
		id: move.id,
		name: move.name,
		description: move.description,
		imageUrl: move.imageUrl,
		videoUrl: move.videoUrl,
		contributorName: move.contributorName,
		category: {
			id: move.categoryId,
			name: move.categoryName
		}
	}));

	return json({ moves: movesData });
};
