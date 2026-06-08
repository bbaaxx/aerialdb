import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => {
	const db: any = {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		batch: vi.fn().mockImplementation(async (queries) => Promise.all(queries))
	};
	return { mockDb: db };
});

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn(() => mockDb)
}));

vi.mock('$lib/server/db/schema', () => ({
	moves: {
		id: 'moves_id',
		name: 'moves_name',
		categoryId: 'moves_category_id',
		description: 'moves_description',
		imageUrl: 'moves_image_url',
		videoUrl: 'moves_video_url',
		contributorName: 'moves_contributor_name'
	},
	categories: {
		id: 'categories_id',
		name: 'categories_name'
	}
}));

import { load } from './+page.server';

describe('Admin Edit Move Load', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch move and categories using db.batch', async () => {
		const mockMove = {
			id: 'move-1',
			name: 'Test Move',
			categoryId: 'cat-1',
			description: 'Test Description',
			imageUrl: null,
			videoUrl: null,
			contributorName: null
		};
		const mockCategories = [{ id: 'cat-1', name: 'Cat 1' }];

		// Mock the query results
		// Since db.batch calls Promise.all(queries), and our queries are thenables
		// we need to make sure they resolve to what we expect.
		// Drizzle query builders are thenable.

		mockDb.select.mockImplementation(() => {
			const chain: any = {
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				then: (onfulfilled: any) => {
					// This is slightly complex because multiple queries are batched
					// and we need to return the right data for each.
					// But our mock batch implementation uses Promise.all(queries),
					// and queries are just these chain objects.
					return Promise.resolve([]).then(onfulfilled);
				}
			};
			return chain;
		});

		// Refined mock for batch to return specific results
		mockDb.batch.mockResolvedValueOnce([[mockMove], mockCategories]);

		const event = {
			params: { id: 'move-1' },
			platform: {}
		} as any;

		const result = await load(event);

		expect(mockDb.batch).toHaveBeenCalled();
		expect(result.move).toEqual(mockMove);
		expect(result.categories).toEqual(mockCategories);
	});

	it('should throw 404 if move is not found', async () => {
		mockDb.batch.mockResolvedValueOnce([[], []]);

		const event = {
			params: { id: 'non-existent' },
			platform: {}
		} as any;

		await expect(load(event)).rejects.toMatchObject({
			status: 404,
			body: { message: 'Move not found' }
		});
	});
});
