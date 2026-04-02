import { getDb } from '$lib/server/db';
import { type MoveWithCategoryRawFull } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Load all moves with their categories
	// Type assertion needed: getDb() returns a union type (D1 | libsql)
	// that breaks .select({fields}) overload resolution
	const allMoves = (await (db as any)
		.select({
			id: moves.id,
			name: moves.name,
			categoryId: moves.categoryId,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			contributorName: moves.contributorName,
			createdAt: moves.createdAt,
			updatedAt: moves.updatedAt,
			categoryName: categories.name
		})
		.from(moves)
		.leftJoin(categories, eq(moves.categoryId, categories.id))
		.orderBy(moves.name)) as MoveWithCategoryRawFull[];

	// Load all categories
	const allCategories = await db.select().from(categories);

	return {
		moves: allMoves,
		categories: allCategories
	};
};
