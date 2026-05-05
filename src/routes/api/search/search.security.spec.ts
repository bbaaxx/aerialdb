import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock before import
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

// Mock schema
vi.mock('$lib/server/db/schema', () => ({
	moves: {
		id: 'moves.id',
		name: 'moves.name',
		categoryId: 'moves.categoryId',
		imageUrl: 'moves.imageUrl',
		level: 'moves.level'
	},
	categories: {
		id: 'categories.id',
		name: 'categories.name'
	}
}));

import { GET } from './+server';
import * as dbModule from '$lib/server/db';

describe('Search API Security', () => {
	let mockDb: any;
	let queryBuilder: any;

	beforeEach(() => {
		vi.clearAllMocks();

		queryBuilder = {
			from: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			limit: vi.fn().mockImplementation(() => Promise.resolve([]))
		};

		mockDb = {
			select: vi.fn(() => queryBuilder)
		};
		vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
	});

	it('trims and limits search query length', async () => {
		const longQuery = '  ' + 'a'.repeat(150) + '  ';
		const event = {
			url: new URL(`http://localhost/api/search?q=${encodeURIComponent(longQuery)}`),
			locals: {}
		} as any;

		await GET(event);

		expect(queryBuilder.limit).toHaveBeenCalledWith(50);
	});

	it('handles SQL wildcards in search query', async () => {
		const event = {
			url: new URL('http://localhost/api/search?q=abc%25%5F'),
			locals: {}
		} as any;

		await GET(event);

		expect(mockDb.select).toHaveBeenCalled();
	});

	it('returns empty for short queries after trimming', async () => {
		const event = {
			url: new URL('http://localhost/api/search?q=%20%20ab%20%20'),
			locals: {}
		} as any;

		const response = await GET(event);
		const data = await response.json();

		expect(data.moves).toEqual([]);
		expect(mockDb.select).not.toHaveBeenCalled();
	});
});
