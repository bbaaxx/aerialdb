import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { redirect, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';

/**
 * Delete an image file from either local filesystem or R2
 */
async function deleteImage(imageUrl: string, platform?: App.Platform) {
	const filename = imageUrl.split('/').pop();
	if (!filename) return;

	if (platform?.env?.IMAGES) {
		// Production: Delete from Cloudflare R2
		await platform.env.IMAGES.delete(filename);
	} else {
		// Development: Delete from local filesystem
		const { unlink } = await import('fs/promises');
		const { join } = await import('path');
		await unlink(join('static', 'uploads', filename)).catch(() => {
			// Ignore errors if file doesn't exist
		});
	}
}

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);
	const { params } = event;

	const [move] = await db
		.select()
		.from(moves)
		.where(eq(moves.id, params.id))
		.limit(1);

	if (!move) {
		throw error(404, 'Move not found');
	}

	const allCategories = await db.select().from(categories).orderBy(categories.name);

	return { move, categories: allCategories };
};

export const actions = {
	update: async (event) => {
		const db = getDb(event);
		const { request, params, fetch, platform } = event;
		const formData = await request.formData();

		// Validate required fields
		const name = formData.get('name') as string;
		let categoryId = formData.get('category') as string;
		const newCategoryName = formData.get('new_category') as string;

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		// Handle new category creation
		if (newCategoryName) {
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

		if (!categoryId) {
			return fail(400, { error: 'Category is required' });
		}

		// Get current move data
		const [currentMove] = await db
			.select()
			.from(moves)
			.where(eq(moves.id, params.id))
			.limit(1);

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
				description: (formData.get('description') as string) || null,
				imageUrl,
				videoUrl: (formData.get('video_url') as string) || null,
				contributorName: (formData.get('contributor') as string) || null,
				updatedAt: new Date()
			})
			.where(eq(moves.id, params.id));

		throw redirect(303, `/moves/${params.id}`);
	},

	delete: async (event) => {
		const db = getDb(event);
		const { params, platform } = event;

		// Get move to delete associated image
		const [move] = await db
			.select()
			.from(moves)
			.where(eq(moves.id, params.id))
			.limit(1);

		if (move?.imageUrl) {
			// Delete file from storage (local or R2)
			await deleteImage(move.imageUrl, platform);
		}

		// Delete from database
		await db.delete(moves).where(eq(moves.id, params.id));

		throw redirect(303, '/admin');
	}
} satisfies Actions;
