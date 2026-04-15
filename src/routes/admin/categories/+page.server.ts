import { getDb } from '$lib/server/db';
import { categories, moves } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

function generateId(length: number = 10): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(bytes)
		.map((b) => b.toString(36).padStart(2, '0'))
		.join('')
		.slice(0, length);
}

type CategoryWithMoveCount = {
	id: string;
	name: string;
	createdAt: Date;
	moveCount: number;
};

export const load: PageServerLoad = async (event) => {
	const db = getDb(event);

	// Fetch all categories
	const allCategories = await (db as any)
		.select({
			id: categories.id,
			name: categories.name,
			createdAt: categories.createdAt
		})
		.from(categories)
		.orderBy(categories.name);

	// Get move counts per category using raw SQL count
	const moveCountsRaw = await (db as any)
		.select({
			categoryId: moves.categoryId,
			count: sql`count(*)`.as('count')
		})
		.from(moves)
		.groupBy(moves.categoryId);

	// Create a map for faster lookup
	const moveCountMap = new Map<string, number>(
		moveCountsRaw.map((mc: { categoryId: string; count: number }) => [mc.categoryId, mc.count])
	);

	// Merge categories with their move counts
	const categoriesWithCounts: CategoryWithMoveCount[] = allCategories.map(
		(cat: { id: string; name: string; createdAt: Date }) => ({
			...cat,
			moveCount: moveCountMap.get(cat.id) ?? 0
		})
	);

	return {
		categories: categoriesWithCounts
	};
};

export const actions = {
	createCategory: async (event) => {
		if (!event.locals.user) {
			return fail(401, { error: 'Unauthorized: Authentication required' });
		}
		const db = getDb(event);
		const formData = await event.request.formData();
		const name = (formData.get('name') as string | null)?.trim();

		if (!name || name.length === 0) {
			return fail(400, { error: 'Category name is required', action: 'create' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Category name must be 100 characters or less', action: 'create' });
		}

		// Check for duplicate
		const existing = await db.select().from(categories).where(eq(categories.name, name)).get();

		if (existing) {
			return fail(400, { error: 'A category with this name already exists', action: 'create' });
		}

		const newCategory = {
			id: generateId(10),
			name,
			createdAt: new Date()
		};

		await db.insert(categories).values(newCategory);
		throw redirect(303, '/admin/categories');
	},

	updateCategory: async (event) => {
		if (!event.locals.user) {
			return fail(401, { error: 'Unauthorized: Authentication required' });
		}
		const db = getDb(event);
		const formData = await event.request.formData();
		const id = formData.get('id') as string | null;
		const name = (formData.get('name') as string | null)?.trim();

		if (!id) {
			return fail(400, { error: 'Category ID is required', action: 'update' });
		}

		if (!name || name.length === 0) {
			return fail(400, { error: 'Category name is required', action: 'update', id });
		}

		if (name.length > 100) {
			return fail(400, {
				error: 'Category name must be 100 characters or less',
				action: 'update',
				id
			});
		}

		// Check for duplicate (excluding current category)
		const existing = await db.select().from(categories).where(eq(categories.name, name)).get();

		if (existing && existing.id !== id) {
			return fail(400, { error: 'A category with this name already exists', action: 'update', id });
		}

		// Verify category exists
		const category = await db.select().from(categories).where(eq(categories.id, id)).get();

		if (!category) {
			return fail(404, { error: 'Category not found', action: 'update', id });
		}

		await db.update(categories).set({ name }).where(eq(categories.id, id));

		return { success: true, action: 'update', id };
	},

	deleteCategory: async (event) => {
		if (!event.locals.user) {
			return fail(401, { error: 'Unauthorized: Authentication required' });
		}
		const db = getDb(event);
		const formData = await event.request.formData();
		const id = formData.get('id') as string | null;

		if (!id) {
			return fail(400, { error: 'Category ID is required', action: 'delete' });
		}

		// Check if category exists
		const category = await db.select().from(categories).where(eq(categories.id, id)).get();

		if (!category) {
			return fail(404, { error: 'Category not found', action: 'delete' });
		}

		// Check if any moves reference this category using count
		const moveCountResult = await (db as any)
			.select({ count: sql`count(*)`.as('count') })
			.from(moves)
			.where(eq(moves.categoryId, id))
			.get();

		const moveCount = moveCountResult?.count ?? 0;

		if (moveCount > 0) {
			return fail(400, {
				error: `Cannot delete category: ${moveCount} move${moveCount === 1 ? '' : 's'} still reference${moveCount === 1 ? 's' : ''} this category. Please reassign or delete the moves first.`,
				action: 'delete',
				id,
				moveCount
			});
		}

		await db.delete(categories).where(eq(categories.id, id));

		return { success: true, action: 'delete', id };
	}
} satisfies Actions;
