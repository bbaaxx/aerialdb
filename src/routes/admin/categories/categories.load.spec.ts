import { describe, it, expect, vi } from 'vitest';
import { load } from './+page.server';
import { getDb } from '$lib/server/db';
import type { ServerLoadEvent } from '@sveltejs/kit';

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

describe('Categories Admin Load Function', () => {
	it('should return categories with move counts using a single optimized query', async () => {
		const now = new Date();
		const mockResults = [
			{ id: 'cat-1', name: 'Acro', createdAt: now, moveCount: 5 },
			{ id: 'cat-2', name: 'Balance', createdAt: now, moveCount: 0 }
		];

		// Mock the Drizzle query builder chain
		const mockDb = {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			leftJoin: vi.fn().mockReturnThis(),
			groupBy: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockImplementation(() => Promise.resolve(mockResults))
		};

		vi.mocked(getDb).mockReturnValue(mockDb as any);

		const event = {
			locals: {},
			url: new URL('http://localhost/admin/categories')
		} as any;

		const result = (await load(event)) as any;

		// Verify the returned data
		expect(result.categories).toEqual(mockResults);

		// Verify the query chain was called correctly
		expect(mockDb.select).toHaveBeenCalled();
		expect(mockDb.from).toHaveBeenCalled();
		expect(mockDb.leftJoin).toHaveBeenCalled();
		expect(mockDb.groupBy).toHaveBeenCalled();
		expect(mockDb.orderBy).toHaveBeenCalled();
	});
});
