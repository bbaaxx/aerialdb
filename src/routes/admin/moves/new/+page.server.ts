import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';

// Generate ID helper
function generateId(length: number = 10): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return encodeBase32LowerCaseNoPadding(bytes);
}

// Load categories for dropdown
export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Selective Field Fetching: Only fetch fields needed for the category dropdown to minimize data transfer.
	// Note: using any to bypass Drizzle's complex union types for getDb() results
	const allCategories = await (db as any)
		.select({
			id: categories.id,
			name: categories.name
		})
		.from(categories)
		.orderBy(categories.name);

	return { categories: allCategories as { id: string; name: string }[] };
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		if (event.locals.user.role !== 'admin') {
			throw error(403, 'Forbidden: Admin access required');
		}
		const db = getDb(event);
		const { request, locals, fetch } = event;
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

		// Handle image upload
		let imageUrl = null;
		const imageFile = formData.get('image') as File;

		if (imageFile && imageFile.size > 0) {
			// Upload via API endpoint
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

		// Insert move
		const moveId = generateId(10);
		await db.insert(moves).values({
			id: moveId,
			name,
			categoryId,
			description: description || null,
			imageUrl,
			videoUrl: videoUrl || null,
			contributorName: contributor || null,
			createdBy: locals.user!.id,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		throw redirect(303, `/moves/${moveId}`);
	}
} satisfies Actions;
