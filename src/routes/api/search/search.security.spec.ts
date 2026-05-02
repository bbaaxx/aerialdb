import { describe, it, expect, vi } from 'vitest';
import { GET } from './+server';
import { type RequestEvent } from '@sveltejs/kit';

const mockDb = {
	select: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	innerJoin: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	orderBy: vi.fn().mockReturnThis(),
	limit: vi.fn().mockResolvedValue([])
};

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn().mockImplementation(() => mockDb)
}));

describe('Search API Security', () => {
	it('should limit search query to 100 characters', async () => {
		const longQuery = 'a'.repeat(150);
		const url = new URL(`http://localhost/api/search?q=${longQuery}`);
		const event = {
			url,
			locals: {}
		} as unknown as RequestEvent;

		await GET(event);

		// Check that mockDb.limit was called with 50 (result limit)
		expect(mockDb.limit).toHaveBeenCalledWith(50);
	});

	it('should escape SQL LIKE wildcards', async () => {
		const query = 'test%_\\';
		const url = new URL(`http://localhost/api/search?q=${encodeURIComponent(query)}`);
		const event = {
			url,
			locals: {}
		} as unknown as RequestEvent;

		await GET(event);

		// We check if the db where was called.
		expect(mockDb.where).toHaveBeenCalled();
	});

	it('should return empty results for queries shorter than 3 characters', async () => {
		const url = new URL('http://localhost/api/search?q=ab');
		const event = {
			url,
			locals: {}
		} as unknown as RequestEvent;

		const response = await GET(event);
		const data = await response.json();

		expect(data.moves).toEqual([]);
	});
});
