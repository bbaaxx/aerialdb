import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { params } = event;

	const [moveRaw] = await db
		.select({
			id: moves.id,
			name: moves.name,
			description: moves.description,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			contributorName: moves.contributorName,
			createdAt: moves.createdAt,
			updatedAt: moves.updatedAt,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(eq(moves.id, params.id))
		.limit(1);

	if (!moveRaw) {
		throw error(404, 'Move not found');
	}

	const move = {
		id: moveRaw.id,
		name: moveRaw.name,
		description: moveRaw.description,
		imageUrl: moveRaw.imageUrl,
		videoUrl: moveRaw.videoUrl,
		contributorName: moveRaw.contributorName,
		createdAt: moveRaw.createdAt,
		updatedAt: moveRaw.updatedAt,
		category: {
			id: moveRaw.categoryId,
			name: moveRaw.categoryName
		}
	};

	return { move };
};
