import { getDb } from '$lib/server/db';
import { moves, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
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
	const allCategories = await db.select().from(categories).orderBy(categories.name);
	return { categories: allCategories };
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, '/auth/login');
		}
		const db = getDb(event);
		const { request, locals, fetch } = event;
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
			// SECURITY: Trim and validate input length to ensure data integrity
			// and prevent potential database storage abuse.
			const trimmedName = newCategoryName.trim();
			if (!trimmedName) {
				return fail(400, { error: 'New category name cannot be empty' });
			}
			if (trimmedName.length > 100) {
				return fail(400, { error: 'New category name must be 100 characters or less' });
			}

			// SECURITY: Explicitly check for duplicate category names before insertion.
			// This prevents unhandled database constraint violation errors (500) and ensures a clean UI.
			const existingCategory = await db
				.select()
				.from(categories)
				.where(eq(categories.name, trimmedName))
				.get();
			if (existingCategory) {
				return fail(400, { error: 'A category with this name already exists' });
			}

			const newCategoryId = generateId(10);
			await db.insert(categories).values({
				id: newCategoryId,
				name: trimmedName,
				createdAt: new Date()
			});
			categoryId = newCategoryId;
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
			description: (formData.get('description') as string) || null,
			imageUrl,
			videoUrl: (formData.get('video_url') as string) || null,
			contributorName: (formData.get('contributor') as string) || null,
			createdBy: locals.user!.id,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		throw redirect(303, `/moves/${moveId}`);
	}
} satisfies Actions;
