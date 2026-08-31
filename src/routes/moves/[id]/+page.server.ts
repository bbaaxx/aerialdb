import { getDb } from '$lib/server/db';
import { type MoveWithCategoryRawFull } from '$lib/server/db/types';
import { moves, categories } from '$lib/server/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { params } = event;

	const [moveRaw] = (await db
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
		.limit(1)) as [MoveWithCategoryRawFull];

	if (!moveRaw) {
		throw error(404, 'Move not found');
	}

	const relatedMovesRaw = await db
		.select({
			id: moves.id,
			name: moves.name,
			imageUrl: moves.imageUrl,
			videoUrl: moves.videoUrl,
			level: moves.level,
			categoryId: categories.id,
			categoryName: categories.name
		})
		.from(moves)
		.innerJoin(categories, eq(moves.categoryId, categories.id))
		.where(and(eq(moves.categoryId, moveRaw.categoryId), ne(moves.id, moveRaw.id)))
		.orderBy(desc(moves.createdAt))
		.limit(4);

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

	const relatedMoves = relatedMovesRaw.map((m) => ({
		id: m.id,
		name: m.name,
		imageUrl: m.imageUrl,
		videoUrl: m.videoUrl,
		level: m.level,
		category: {
			id: m.categoryId,
			name: m.categoryName
		}
	}));

	return { move, relatedMoves };
};
