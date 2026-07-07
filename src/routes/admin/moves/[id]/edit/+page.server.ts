import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { redirect, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';

/**
 * Delete an image file from R2
 */
async function deleteImage(imageUrl: string, platform?: App.Platform) {
	const filename = imageUrl.split('/').pop();
	if (!filename) return;

	if (platform?.env?.IMAGES) {
		// Production: Delete from Cloudflare R2
		await platform.env.IMAGES.delete(filename);
	}
	// Development mode: filesystem not available in production
}

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { params } = event;

	// Performance: Batch move and categories queries into a single round-trip.
	// This is specifically optimized for Cloudflare D1 to minimize network latency between Worker and DB.
	// Selective Field Fetching: Only fetch fields needed for the edit form to minimize data transfer.
	const [movesData, allCategories] = await db.batch([
		db
			.select({
				id: moves.id,
				name: moves.name,
				categoryId: moves.categoryId,
				description: moves.description,
				imageUrl: moves.imageUrl,
				videoUrl: moves.videoUrl,
				contributorName: moves.contributorName
			})
			.from(moves)
			.where(eq(moves.id, params.id))
			.limit(1),
		db
			.select({
				id: categories.id,
				name: categories.name
			})
			.from(categories)
			.orderBy(categories.name)
	]);

	const move = movesData[0];

	if (!move) {
		throw error(404, 'Move not found');
	}

	return { move, categories: allCategories };
};

export const actions = {
	update: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		if (event.locals.user.role !== 'admin') {
			throw error(403, 'Forbidden: Admin access required');
		}
		const db = getDb(event);
		const { request, params, fetch, platform } = event;
		const formData = await request.formData();

		// SECURITY: Trim and limit inputs to prevent DoS and ensure data integrity
		const name = ((formData.get('name') as string) || '').trim().slice(0, 100);
		const description = ((formData.get('description') as string) || '').trim().slice(0, 2000);
		const videoUrl = ((formData.get('video_url') as string) || '').trim().slice(0, 255);
		const contributor = ((formData.get('contributor') as string) || '').trim().slice(0, 100);

		let categoryId = formData.get('category') as string;
		const newCategoryName = ((formData.get('new_category') as string) || '').trim().slice(0, 100);

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		// Handle new category creation
		if (newCategoryName) {
			// Check if category already exists
			const existing = await db
				.select()
				.from(categories)
				.where(eq(categories.name, newCategoryName))
				.get();

			if (existing) {
				categoryId = existing.id;
			} else {
				// Generate ID helper (same as in new move)
				const generateId = (length: number = 10): string => {
					const bytes = crypto.getRandomValues(new Uint8Array(length));
					return encodeBase32LowerCaseNoPadding(bytes);
				};

				const newCategoryId = generateId(10);
				await db.insert(categories).values({
					id: newCategoryId,
					name: newCategoryName,
					createdAt: new Date()
				});
				categoryId = newCategoryId;
			}
		}

		if (!categoryId) {
			return fail(400, { error: 'Category is required' });
		}

		// Get current move data
		// Optimization: Only fetch imageUrl to check for existing image, reducing data transfer.
		const [currentMove] = (await db
			.select({ imageUrl: moves.imageUrl })
			.from(moves)
			.where(eq(moves.id, params.id))
			.limit(1)) as { imageUrl: string | null }[];

		if (!currentMove) {
			return fail(404, { error: 'Move not found' });
		}

		// Handle image upload
		let imageUrl = currentMove.imageUrl;
		const imageFile = formData.get('image') as File;

		if (imageFile && imageFile.size > 0) {
			// Delete old image if it exists
			if (currentMove.imageUrl) {
				await deleteImage(currentMove.imageUrl, platform);
			}

			// Upload new image via API endpoint
			const uploadFormData = new FormData();
			uploadFormData.append('image', imageFile);

			const uploadRes = await fetch('/api/upload', {
				method: 'POST',
				body: uploadFormData
			});

			if (uploadRes.ok) {
				const { url } = await uploadRes.json();
				imageUrl = url;
			} else {
				const { error } = await uploadRes.json();
				return fail(400, { error: error || 'Image upload failed' });
			}
		}

		// Check if user wants to remove image
		const removeImage = formData.get('remove_image') === 'true';
		if (removeImage) {
			// Delete old image file
			if (currentMove.imageUrl) {
				await deleteImage(currentMove.imageUrl, platform);
			}
			imageUrl = null;
		}

		// Update move
		await db
			.update(moves)
			.set({
				name,
				categoryId,
				description: description || null,
				imageUrl,
				videoUrl: videoUrl || null,
				contributorName: contributor || null,
				updatedAt: new Date()
			})
			.where(eq(moves.id, params.id));

		throw redirect(303, `/moves/${params.id}`);
	},

	delete: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		if (event.locals.user.role !== 'admin') {
			throw error(403, 'Forbidden: Admin access required');
		}
		const db = getDb(event);
		const { params, platform } = event;

		// Get move to delete associated image
		// Optimization: Only fetch imageUrl to check for existing image, reducing data transfer.
		const [move] = (await db
			.select({ imageUrl: moves.imageUrl })
			.from(moves)
			.where(eq(moves.id, params.id))
			.limit(1)) as { imageUrl: string | null }[];

		if (move?.imageUrl) {
			// Delete file from storage (local or R2)
			await deleteImage(move.imageUrl, platform);
		}

		// Delete from database
		await db.delete(moves).where(eq(moves.id, params.id));

		throw redirect(303, '/admin');
	}
} satisfies Actions;
