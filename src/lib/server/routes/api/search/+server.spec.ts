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

import { GET } from '../../../../../routes/api/search/+server';
import * as dbModule from '$lib/server/db';

describe('api/search/+server', () => {
	describe('GET', () => {
		let mockDb: any;

		beforeEach(() => {
			vi.clearAllMocks();
		});

		const mockMoves = [
			{
				id: '1',
				name: 'Star',
				description: 'A move',
				imageUrl: null,
				videoUrl: null,
				contributorName: 'Alice',
				categoryId: 'cat-1',
				categoryName: 'Silks'
			},
			{
				id: '2',
				name: 'Whip',
				description: 'Another move',
				imageUrl: 'img.jpg',
				videoUrl: null,
				contributorName: 'Bob',
				categoryId: 'cat-1',
				categoryName: 'Silks'
			},
			{
				id: '3',
				name: 'Angel',
				description: 'Yet another',
				imageUrl: null,
				videoUrl: null,
				contributorName: 'Carol',
				categoryId: 'cat-2',
				categoryName: 'Lyra'
			}
		];

		function createMockEvent(url: string) {
			return {
				url: new URL(url),
				request: new Request(url),
				cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
				locals: {},
				platform: undefined
			} as any;
		}

		// Create a proper Drizzle query builder mock
		function createQueryBuilderMock(result: any[]) {
			const mock = {
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				then: vi.fn().mockImplementation((resolve) => {
					return Promise.resolve(result).then(resolve);
				})
			};

			// Make them return the mock for chaining
			mock.from.mockReturnValue(mock);
			mock.innerJoin.mockReturnValue(mock);
			mock.where.mockReturnValue(mock);
			mock.orderBy.mockReturnValue(mock);
			mock.limit.mockReturnValue(mock);

			return mock;
		}

		function setupMockDb(result: any[]) {
			// Create a query builder that db.select({...}) returns
			const queryBuilder = createQueryBuilderMock(result);

			mockDb = {
				select: vi.fn().mockImplementation(() => queryBuilder),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis()
			};
			vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
		}

		it('returns empty array for query less than 3 characters', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=St');
			setupMockDb([]);

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.moves).toEqual([]);
		});

		it('returns empty array for empty query', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=');
			setupMockDb([]);

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.moves).toEqual([]);
		});

		it('returns moves matching query', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=Star');
			setupMockDb([mockMoves[0]]);

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.moves).toHaveLength(1);
			expect(body.moves[0].name).toBe('Star');
		});

		it('returns moves matching query in category name', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=Silks');
			setupMockDb(mockMoves.filter((m) => m.categoryName === 'Silks'));

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.moves.length).toBeGreaterThan(0);
		});

		it('applies category filter when specified', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=move&category=cat-1');
			setupMockDb(mockMoves.filter((m) => m.categoryId === 'cat-1'));

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.moves.length).toBe(2);
			expect(body.moves.every((m: any) => m.category.id === 'cat-1')).toBe(true);
		});

		it('returns moves with category object structure', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/api/search?q=Star');
			setupMockDb([mockMoves[0]]);

			// Act
			const response = await GET(mockEvent);
			const body = await response.json();

			// Assert
			expect(body.moves[0]).toHaveProperty('category');
			expect(body.moves[0].category).toEqual({
				id: 'cat-1',
				name: 'Silks'
			});
		});
	});
});
