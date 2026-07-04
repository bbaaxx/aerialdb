import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSessionToken, validateSessionToken, sessionCookieName } from './auth';

describe('auth', () => {
	describe('sessionCookieName', () => {
		it('is prefixed with __Host- in production', () => {
			if (import.meta.env.PROD) {
				expect(sessionCookieName).toBe('__Host-auth-session');
			} else {
				expect(sessionCookieName).toBe('auth-session');
			}
		});
	});

	describe('generateSessionToken', () => {
		it('returns a 24-character base64url encoded string (18 bytes)', () => {
			// Act
			const token = generateSessionToken();

			// Assert
			// 18 bytes encoded as base64url = 24 chars
			expect(typeof token).toBe('string');
			expect(token.length).toBe(24);
			// base64url uses A-Z, a-z, 0-9, -, _
			expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
		});

		it('generates unique tokens on each call', () => {
			// Act
			const tokens = new Set(Array.from({ length: 100 }, () => generateSessionToken()));

			// Assert - all 100 tokens should be unique
			expect(tokens.size).toBe(100);
		});
	});

	describe('validateSessionToken', () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it('returns user and session for valid token', async () => {
			// Arrange
			const token = 'validTestToken12345';
			const mockUser = { id: 'user-1', username: 'testuser' };
			const mockSession = {
				id: 'session-id',
				userId: 'user-1',
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
			};

			// Create a mock db that returns the expected result
			const mockDb = {
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([{ user: mockUser, session: mockSession }])
			};

			// Act
			const result = await validateSessionToken(token, mockDb as any);

			// Assert
			expect(result.user).toEqual(mockUser);
			expect(result.session).toEqual(mockSession);
		});

		it('returns null user and session for invalid/missing token', async () => {
			// Arrange
			const invalidToken = 'invalidToken';
			const mockDb = {
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([])
			};

			// Act
			const result = await validateSessionToken(invalidToken, mockDb as any);

			// Assert
			expect(result.user).toBeNull();
			expect(result.session).toBeNull();
		});

		it('returns null user and session for expired session', async () => {
			// Arrange
			const token = 'expiredToken';
			const mockUser = { id: 'user-1', username: 'testuser' };
			const expiredSession = {
				id: 'session-id',
				userId: 'user-1',
				expiresAt: new Date(Date.now() - 1000) // expired 1 second ago
			};

			const mockDb = {
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([{ user: mockUser, session: expiredSession }]),
				delete: vi.fn().mockReturnThis(),
				where2: vi.fn().mockResolvedValue(undefined) // for the delete.where call
			};
			// Make delete.where work by overriding where
			(mockDb.delete as any).where = vi.fn().mockResolvedValue(undefined);

			// Act
			const result = await validateSessionToken(token, mockDb as any);

			// Assert
			expect(result.user).toBeNull();
			expect(result.session).toBeNull();
		});

		it('renews session when nearing expiration', async () => {
			// Arrange
			const token = 'renewableToken';
			const mockUser = { id: 'user-1', username: 'testuser' };
			// Session expiring in 10 days (within 15-day renewal window)
			const nearExpirySession = {
				id: 'session-id',
				userId: 'user-1',
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10)
			};

			const mockDb = {
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				innerJoin: vi.fn().mockReturnThis(),
				where: vi.fn().mockResolvedValue([{ user: mockUser, session: { ...nearExpirySession } }]),
				update: vi.fn().mockReturnThis()
			};

			// Create chainable update().set().where()
			// update() must return an object with set(), and set() must return an object with where()
			const setChain = {
				where: vi.fn().mockResolvedValue(undefined)
			};
			const updateChain = {
				set: vi.fn().mockReturnValue(setChain),
				where: vi.fn().mockReturnThis()
			};
			mockDb.update = vi.fn().mockReturnValue(updateChain);

			// Act
			const result = await validateSessionToken(token, mockDb as any);

			// Assert - session should be renewed
			expect(result.user).toEqual(mockUser);
			expect(result.session).not.toBeNull();
			expect(result.session!.expiresAt.getTime()).toBeGreaterThan(
				nearExpirySession.expiresAt.getTime()
			);
		});
	});
});
