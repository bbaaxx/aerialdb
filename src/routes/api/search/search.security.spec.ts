import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock drizzle-orm
vi.mock('drizzle-orm', async () => {
	const actual = (await vi.importActual('drizzle-orm')) as any;
	return {
		...actual,
		and: vi.fn().mockImplementation(actual.and),
		or: vi.fn().mockImplementation(actual.or),
		eq: vi.fn().mockImplementation(actual.eq),
		sql: vi.fn().mockImplementation((strings, ...values) => {
			return {
				kind: 'sql',
				strings,
				values
			};
		})
	};
});

// Mock before import
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

vi.mock('$lib/server/db/schema', () => ({
	moves: {
		id: { name: 'id' },
		name: { name: 'name' },
		imageUrl: { name: 'image_url' },
		level: { name: 'level' },
		categoryId: { name: 'category_id' }
	},
	categories: {
		id: { name: 'id' },
		name: { name: 'name' }
	}
}));

import { GET } from './+server';
import * as dbModule from '$lib/server/db';
import { sql } from 'drizzle-orm';

describe('api/search security hardening', () => {
	let mockDb: any;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	function createMockEvent(url: string) {
		return {
			url: new URL(url),
			request: new Request(url),
			locals: {}
		} as any;
	}

	function setupMockDb() {
		const queryBuilder = {
			from: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			then: vi.fn().mockImplementation((resolve) => resolve([]))
		};

		mockDb = {
			select: vi.fn().mockReturnValue(queryBuilder)
		};
		vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
		return queryBuilder;
	}

	it('should handle large query strings by limiting them (DoS protection)', async () => {
		const longQuery = 'a'.repeat(1000);
		const mockEvent = createMockEvent(`http://localhost/api/search?q=${longQuery}`);
		setupMockDb();

		await GET(mockEvent);

		// The implementation should truncate the query to 100 characters.
		const sqlCalls = vi.mocked(sql).mock.calls;
		let foundTruncated = false;

		// Simplify: just check query length in any call
		for (const call of sqlCalls) {
			for (const arg of call) {
				if (Array.isArray(arg)) {
					for (const val of arg) {
						if (typeof val === 'string' && val.includes('aaaaa')) {
							if (val.length <= 102) foundTruncated = true;
						}
					}
				} else if (typeof arg === 'string' && arg.includes('aaaaa')) {
					if (arg.length <= 102) foundTruncated = true;
				}
			}
		}
		expect(foundTruncated).toBe(true);
	});

	it('should limit the number of results returned (DoS protection)', async () => {
		const mockEvent = createMockEvent('http://localhost/api/search?q=test');
		const queryBuilder = setupMockDb();

		await GET(mockEvent);

		// Check if .limit() was called on the query builder
		expect(queryBuilder.limit).toHaveBeenCalledWith(50);
	});

	it('should escape SQL LIKE wildcards in the query', async () => {
		const mockEvent = createMockEvent('http://localhost/api/search?q=100%_\\');
		setupMockDb();

		await GET(mockEvent);

		const sqlCalls = vi.mocked(sql).mock.calls;
		const expectedPattern = '%100\\%\\_\\\\%';

		let foundEscaped = false;
		for (const call of sqlCalls) {
			let hasPattern = false;
			let hasEscape = false;
			for (const arg of call) {
				if (Array.isArray(arg)) {
					if (arg.includes(expectedPattern)) hasPattern = true;
					if (arg.some((s) => typeof s === 'string' && s.includes("ESCAPE '\\'"))) hasEscape = true;
				} else if (typeof arg === 'string') {
					if (arg === expectedPattern) hasPattern = true;
					if (arg.includes("ESCAPE '\\'")) hasEscape = true;
				}
			}
			if (hasPattern && hasEscape) {
				foundEscaped = true;
				break;
			}
		}
		expect(foundEscaped).toBe(true);
	});
});
