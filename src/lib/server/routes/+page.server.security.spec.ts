import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock before import
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

vi.mock('$lib/server/db/schema', () => ({
	moves: {
		id: vi.fn(),
		name: vi.fn(),
		imageUrl: vi.fn(),
		level: vi.fn(),
		categoryId: vi.fn(),
		createdAt: vi.fn()
	},
	categories: {
		id: vi.fn(),
		name: vi.fn(),
		createdAt: vi.fn()
	}
}));

import { load } from '../../../routes/+page.server';
import * as dbModule from '$lib/server/db';

describe('home page search hardening', () => {
	let mockDb: any;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	function createMockEvent(url: string) {
		return {
			url: new URL(url),
			request: new Request(url),
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
			locals: {},
			platform: undefined
		} as any;
	}

	function setupMockDb() {
		const queryBuilder = {
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([])
		};

		mockDb = {
			select: vi.fn().mockReturnValue(queryBuilder)
		};

		// Promise.all in load function expects [movesDataRaw, allCategories, [featuredMoveRaw]]
		vi.mocked(dbModule.getDb).mockReturnValue({
			...mockDb
			// Mocking Promise.all return value for the destructuring in +page.server.ts
			// This is tricky because we use Promise.all([ (db as any).select()... ])
			// We need to mock the thenable or use a more sophisticated mock
		} as any);

		// Handle the Promise.all by mocking the db instance to return an array of results when called via Promise.all
		// Actually, Promise.all is called on the results of the select/from/where chain.
		// So the chains themselves must return promises that resolve to the expected values.

		// Overwrite setup to return these promises
		mockDb.select.mockImplementation(() => {
			const chain: any = {
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				then: (resolve: any) => {
					// This is a hack to satisfy the parallel destructuring
					// but since they are separate calls in Promise.all, we can't easily distinguish them here
					// unless we look at what was selected or which table was used in .from()
					return Promise.resolve([]).then(resolve);
				}
			};
			return chain;
		});

		vi.mocked(dbModule.getDb).mockReturnValue(mockDb);

		// A better way: mock Promise.all specifically for this test if possible,
		// but it's a global. Let's just mock the chain to return different things based on call count or arguments.
		let callCount = 0;
		mockDb.select.mockImplementation(() => {
			const chain: any = {
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis()
			};
			chain.then = (resolve: any) => {
				callCount++;
				if (callCount === 1) return Promise.resolve([]).then(resolve); // movesDataRaw
				if (callCount === 2) return Promise.resolve([]).then(resolve); // allCategories
				if (callCount === 3) return Promise.resolve([]).then(resolve); // featuredMoveRaw (wrapped in array by destructuring)
				return Promise.resolve([]).then(resolve);
			};
			return chain;
		});

		mockDb.batch = vi.fn().mockImplementation(async (queries) => {
			return Promise.all(queries);
		});

		return queryBuilder;
	}

	it('limits search query length to 100 characters', async () => {
		const longQuery = 'a'.repeat(150);
		const mockEvent = createMockEvent(`http://localhost/?q=${longQuery}`);
		setupMockDb();

		const result = (await load(mockEvent)) as { searchQuery: string };

		expect(result.searchQuery.length).toBe(100);
	});

	it('limits category filter length to 100 characters', async () => {
		const longCategory = 'c'.repeat(150);
		const mockEvent = createMockEvent(`http://localhost/?category=${longCategory}`);
		setupMockDb();

		const result = (await load(mockEvent)) as { categoryFilter: string };

		expect(result.categoryFilter.length).toBe(100);
	});

	it('whitelists level filter and rejects invalid values', async () => {
		const invalidLevel = 'expert';
		const mockEvent = createMockEvent(`http://localhost/?level=${invalidLevel}`);
		setupMockDb();

		const result = (await load(mockEvent)) as { levelFilter: string };

		expect(result.levelFilter).toBe('');
	});

	it('accepts valid level filters', async () => {
		const validLevel = 'advanced';
		const mockEvent = createMockEvent(`http://localhost/?level=${validLevel}`);
		setupMockDb();

		const result = (await load(mockEvent)) as { levelFilter: string };

		expect(result.levelFilter).toBe('advanced');
	});
});
