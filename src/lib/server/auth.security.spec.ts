import { describe, it, expect, vi } from 'vitest';
import { sessionCookieName, setSessionTokenCookie, deleteSessionTokenCookie } from './auth';

describe('auth security', () => {
	it('sessionCookieName has __Host- prefix in production', () => {
		if (import.meta.env.PROD) {
			expect(sessionCookieName).toBe('__Host-auth-session');
		} else {
			expect(sessionCookieName).toBe('auth-session');
		}
	});

	it('setSessionTokenCookie uses secure attributes', () => {
		const event = {
			cookies: {
				set: vi.fn()
			}
		} as any;
		const expiresAt = new Date();
		setSessionTokenCookie(event, 'token', expiresAt);

		expect(event.cookies.set).toHaveBeenCalledWith(
			sessionCookieName,
			'token',
			expect.objectContaining({
				httpOnly: true,
				path: '/',
				sameSite: 'lax',
				secure: import.meta.env.PROD
			})
		);

		// __Host- prefix requirements:
		// 1. Must have Secure attribute
		// 2. Must not have Domain attribute
		// 3. Path must be /
		if (import.meta.env.PROD) {
			const options = (event.cookies.set as any).mock.calls[0][2];
			expect(options.secure).toBe(true);
			expect(options.path).toBe('/');
			expect(options.domain).toBeUndefined();
		}
	});

	it('deleteSessionTokenCookie uses secure attributes', () => {
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
