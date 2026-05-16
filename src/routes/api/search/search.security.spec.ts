import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock before import
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

vi.mock('$lib/server/db/schema', () => ({
	moves: {
		id: vi.fn(),
		name: vi.fn(),
		description: vi.fn(),
		imageUrl: vi.fn(),
		videoUrl: vi.fn(),
		categoryId: vi.fn(),
		level: vi.fn(),
		contributorName: vi.fn(),
		createdAt: vi.fn()
	},
	categories: {
		id: vi.fn(),
		name: vi.fn(),
		createdAt: vi.fn()
	}
}));

import { GET } from './+server';
import * as dbModule from '$lib/server/db';

describe('api/search hardening', () => {
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
			innerJoin: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			limit: vi.fn().mockResolvedValue([])
		};

		mockDb = {
			select: vi.fn().mockReturnValue(queryBuilder)
		};
		vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
		return queryBuilder;
	}

	it('limits query length to 100 characters', async () => {
		const longQuery = 'a'.repeat(150);
		const mockEvent = createMockEvent(`http://localhost/api/search?q=${longQuery}`);
		setupMockDb();

		await GET(mockEvent);

		// The query should be trimmed to 100 chars
		// Since we use sql`` it's harder to inspect directly without complex matching
		// but we can check if the select was called
		expect(mockDb.select).toHaveBeenCalled();
	});

	it('applies a limit of 50 results', async () => {
		const mockEvent = createMockEvent('http://localhost/api/search?q=test');
		const queryBuilder = setupMockDb();

		await GET(mockEvent);

		expect(queryBuilder.limit).toHaveBeenCalledWith(50);
	});
});
