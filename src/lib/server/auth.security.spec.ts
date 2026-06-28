import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setSessionTokenCookie, deleteSessionTokenCookie, sessionCookieName } from './auth';

describe('auth cookie security', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('uses correct session cookie name based on PROD environment', () => {
		const expectedName = import.meta.env.PROD ? '__Host-auth-session' : 'auth-session';
		expect(sessionCookieName).toBe(expectedName);
	});

	it('setSessionTokenCookie sets secure attributes', () => {
		const event = {
			cookies: {
				set: vi.fn()
			}
		} as any;
		const token = 'test-token';
		const expiresAt = new Date();

		setSessionTokenCookie(event, token, expiresAt);

		expect(event.cookies.set).toHaveBeenCalledWith(
			sessionCookieName,
			token,
			expect.objectContaining({
				httpOnly: true,
				path: '/',
				secure: import.meta.env.PROD,
				sameSite: 'lax'
			})
		);
	});

	it('deleteSessionTokenCookie sets secure attributes', () => {
		const event = {
			cookies: {
				delete: vi.fn()
			}
		} as any;

		deleteSessionTokenCookie(event);

		expect(event.cookies.delete).toHaveBeenCalledWith(
			sessionCookieName,
			expect.objectContaining({
				httpOnly: true,
				path: '/',
				secure: import.meta.env.PROD,
				sameSite: 'lax'
			})
		);
	});
});
