import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq, like, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { url } = event;

	const searchQuery = url.searchParams.get('q') || '';
	const categoryFilter = url.searchParams.get('category') || '';

	// Build query conditions
	let conditions = [];

	if (searchQuery) {
		conditions.push(like(moves.name, `%${searchQuery}%`));
	}

	if (categoryFilter) {
		conditions.push(eq(moves.categoryId, categoryFilter));
	}

	// Fetch moves with category info
	const movesData = await db
		.select({
			id: moves.id,
			name: moves.name,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			contributorName: moves.contributorName,
			category: {
				id: categories.id,
				name: categories.name
			}
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(conditions.length > 0 ? or(...conditions) : undefined)
		.orderBy(moves.name);

	// Fetch all categories for filter
	const allCategories = await db.select().from(categories).orderBy(categories.name);

	return {
		moves: movesData,
		categories: allCategories,
		searchQuery,
		categoryFilter
	};
};
