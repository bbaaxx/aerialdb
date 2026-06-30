import { describe, it, expect, vi } from 'vitest';
import { setSessionTokenCookie, deleteSessionTokenCookie, sessionCookieName } from './auth';

describe('Session Cookie Security', () => {
	it('uses the __Host- prefix when in production', () => {
		// This test depends on how import.meta.env.PROD is set in the test environment
		// If we can't easily mock import.meta.env.PROD, we at least verify the logic
		if (import.meta.env.PROD) {
			expect(sessionCookieName).toBe('__Host-auth-session');
		} else {
			expect(sessionCookieName).toBe('auth-session');
		}
	});

	it('sets the correct cookie attributes for session creation', () => {
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
				sameSite: 'lax',
				secure: import.meta.env.PROD
			})
		);

		// If it's __Host- prefixed, it MUST have Path=/ and Secure
		if (sessionCookieName.startsWith('__Host-')) {
			const options = event.cookies.set.mock.calls[0][2];
			expect(options.path).toBe('/');
			expect(options.secure).toBe(true);
		}
	});

	it('sets the correct cookie attributes for session deletion', () => {
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
				sameSite: 'lax',
				secure: import.meta.env.PROD
			})
		);
	});
});
