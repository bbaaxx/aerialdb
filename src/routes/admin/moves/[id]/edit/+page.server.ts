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

	// Performance: Fetch move and categories in parallel to reduce TTFB.
	// Selective Field Fetching: Only fetch fields needed for the edit form to minimize data transfer.
	// Note: using any to bypass Drizzle's complex union types for getDb() results
	const [movesData, allCategories] = await Promise.all([
		(db as any)
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
		(db as any)
			.select({
				id: categories.id,
				name: categories.name
			})
			.from(categories)
			.orderBy(categories.name)
	]);

	const move = (
		movesData as {
			id: string;
			name: string;
			categoryId: string;
			description: string | null;
			imageUrl: string | null;
			videoUrl: string | null;
			contributorName: string | null;
		}[]
	)[0];

	if (!move) {
		throw error(404, 'Move not found');
	}

	return { move, categories: allCategories as { id: string; name: string }[] };
};

export const actions = {
	update: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		const db = getDb(event);
		const { request, params, fetch, platform } = event;
		const formData = await request.formData();

		// Validate required fields
		const name = (formData.get('name') as string | null)?.trim();
		let categoryId = formData.get('category') as string;
		const newCategoryName = formData.get('new_category') as string;

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		// SECURITY: Limit move name length to prevent oversized data storage/DoS
		if (name.length > 100) {
			return fail(400, { error: 'Move name must be 100 characters or less' });
		}

		// Handle new category creation
		if (newCategoryName) {
			const name = newCategoryName.trim();
			if (name.length > 100) {
				return fail(400, { error: 'Category name must be 100 characters or less' });
			}

			// Check if category already exists
			const existing = await db.select().from(categories).where(eq(categories.name, name)).get();

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
					name,
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
		const [currentMove] = (await (db as any)
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

		// Validate other fields
		const description = (formData.get('description') as string | null)?.trim();
		const videoUrl = (formData.get('video_url') as string | null)?.trim();
		const contributorName = (formData.get('contributor') as string | null)?.trim();

		// SECURITY: Enforce length limits on all user-provided fields
		if (description && description.length > 2000) {
			return fail(400, { error: 'Description must be 2000 characters or less' });
		}
		if (videoUrl && videoUrl.length > 255) {
			return fail(400, { error: 'Video URL must be 255 characters or less' });
		}
		if (contributorName && contributorName.length > 100) {
			return fail(400, { error: 'Contributor name must be 100 characters or less' });
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
				contributorName: contributorName || null,
				updatedAt: new Date()
			})
			.where(eq(moves.id, params.id));

		throw redirect(303, `/moves/${params.id}`);
	},

	delete: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		const db = getDb(event);
		const { params, platform } = event;

		// Get move to delete associated image
		// Optimization: Only fetch imageUrl to check for existing image, reducing data transfer.
		const [move] = (await (db as any)
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
