import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { params } = event;

	const [move] = await db
		.select({
			id: moves.id,
			name: moves.name,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			contributorName: moves.contributorName,
			createdAt: moves.createdAt,
			updatedAt: moves.updatedAt,
			category: {
				id: categories.id,
				name: categories.name
			}
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(eq(moves.id, params.id))
		.limit(1);

	if (!move) {
		throw error(404, 'Move not found');
	}

	return { move };
};
