import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to mock before importing
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

// Now import the modules under test
import { load } from '../../../routes/+page.server';
import * as dbModule from '$lib/server/db';

describe('+page.server', () => {
	describe('load', () => {
		let mockDb: any;

		beforeEach(() => {
			vi.clearAllMocks();
		});

		const mockMoves = [
			{
				id: '1',
				name: 'Star',
				description: 'A beautiful move',
				imageUrl: null,
				videoUrl: null,
				level: 'beginner',
				contributorName: 'Alice',
				categoryId: 'cat-1',
				categoryName: 'Silks'
			},
			{
				id: '2',
				name: 'Whip',
				description: 'A dynamic move',
				imageUrl: 'img.jpg',
				videoUrl: null,
				level: 'advanced',
				contributorName: 'Bob',
				categoryId: 'cat-1',
				categoryName: 'Silks'
			}
		];

		const mockCategories = [
			{ id: 'cat-1', name: 'Silks', createdAt: new Date() },
			{ id: 'cat-2', name: 'Lyra', createdAt: new Date() }
		];

		function createMockEvent(url: string) {
			return {
				url: new URL(url),
				locals: {},
				cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
				fetch: vi.fn(),
				getClientAddress: vi.fn(),
				platform: undefined,
				request: new Request(url)
			} as any;
		}

		// Create a proper Drizzle query builder mock
		function createQueryBuilderMock(results: any[]) {
			let resultIndex = 0;
			const queryBuilder = {
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockImplementation(function (this: any) {
					// Return a thenable that resolves to the next result
					const thenable = {
						then: (resolve: any) => {
							const result = results[resultIndex++] || [];
							return Promise.resolve(result).then(resolve);
						},
						orderBy: vi.fn().mockReturnThis(),
						limit: vi.fn().mockImplementation(function (this: any) {
							const result = results[resultIndex++] || [];
							return Promise.resolve(result);
						})
					};
					return thenable;
				}),
				orderBy: vi.fn().mockImplementation(function (this: any) {
					// Return a thenable
					const thenable = {
						then: (resolve: any) => {
							const result = results[resultIndex++] || [];
							return Promise.resolve(result).then(resolve);
						},
						limit: vi.fn().mockImplementation(function (this: any) {
							const result = results[resultIndex++] || [];
							return Promise.resolve(result);
						})
					};
					return thenable;
				})
			};
			return queryBuilder;
		}

		function setupMockDb(queryResults: any[]) {
			const queryBuilder = createQueryBuilderMock(queryResults);

			mockDb = {
				select: vi.fn().mockImplementation(() => queryBuilder),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				orderBy: vi.fn().mockReturnThis()
			};
			vi.mocked(dbModule.getDb).mockReturnValue(mockDb);
		}

		it('returns moves, categories, searchQuery, levelFilter', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/');
			// Results: main query, categories query, featured move query
			setupMockDb([mockMoves, mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result).toHaveProperty('moves');
			expect(result).toHaveProperty('categories');
			expect(result).toHaveProperty('searchQuery');
			expect(result).toHaveProperty('levelFilter');
			expect(result.searchQuery).toBe('');
			expect(result.levelFilter).toBe('');
		});

		it('load with ?q= param returns filtered moves', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/?q=Star');
			setupMockDb([[mockMoves[0]], mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result.searchQuery).toBe('Star');
			expect(result.moves).toHaveLength(1);
			expect(result.moves[0].name).toBe('Star');
		});

		it('load with ?category= param returns filtered moves', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/?category=cat-1');
			setupMockDb([mockMoves, mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result.categoryFilter).toBe('cat-1');
		});

		it('load with ?level= param returns filtered moves', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/?level=beginner');
			setupMockDb([[mockMoves[0]], mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result.levelFilter).toBe('beginner');
		});

		it('returns featuredMove', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/');
			// Results: main query, categories query, featured move query
			setupMockDb([mockMoves, mockCategories, [mockMoves[1]]]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result).toHaveProperty('featuredMove');
			expect(result.featuredMove).not.toBeNull();
			expect(result.featuredMove?.name).toBe('Whip');
		});

		it('returns featuredMove as null when no moves have images', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/');
			// Results: main query (first move has no image), categories query, featured query (empty)
			setupMockDb([[mockMoves[0]], mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result.featuredMove).toBeNull();
		});

		it('returns moves with category object structure', async () => {
			// Arrange
			const mockEvent = createMockEvent('http://localhost/');
			setupMockDb([mockMoves, mockCategories, []]);

			// Act
			const result = (await load(mockEvent)) as any;

			// Assert
			expect(result.moves[0]).toHaveProperty('category');
			expect(result.moves[0].category).toEqual({
				id: 'cat-1',
				name: 'Silks'
			});
		});
	});
});
