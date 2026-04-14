import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import { isRedirect } from '@sveltejs/kit';

describe('Login Open Redirect Security Test', () => {
	it('load function redirects to / if external URL is provided in redirectTo and user is logged in', async () => {
		const url = new URL('http://localhost/auth/login?redirectTo=https://malicious.com');
		const event = {
			url,
			locals: { user: { id: '1', username: 'testuser' } },
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;

		try {
			await load(event);
			expect.fail('Should have thrown a redirect');
		} catch (e: any) {
			if (isRedirect(e)) {
				expect(e.location).toBe('/');
			} else {
				throw e;
			}
		}
	});

	it('action redirects to / if external URL is provided in redirectTo after successful login', async () => {
		// Mock dependencies
		vi.mock('$lib/server/db', () => ({
			getDb: vi.fn().mockReturnValue({
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				at: vi.fn().mockReturnValue({
					id: '1',
					username: 'testuser',
					passwordHash: 'hashed_password'
				})
			})
		}));

		vi.mock('$lib/server/password', () => ({
			verifyPassword: vi.fn().mockResolvedValue(true)
		}));

		vi.mock('$lib/server/auth', () => ({
			generateSessionToken: vi.fn().mockReturnValue('token'),
			createSession: vi.fn().mockResolvedValue({ expiresAt: new Date() }),
			setSessionTokenCookie: vi.fn()
		}));

		const formData = new FormData();
		formData.append('username', 'testuser');
		formData.append('password', 'password123');
		formData.append('redirectTo', 'https://malicious.com');

		const event = {
			request: {
				formData: async () => formData
			},
			url: new URL('http://localhost/auth/login'),
			locals: {},
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;

		try {
			// @ts-expect-error - pre-existing issue
			await actions.default(event);
			expect.fail('Should have thrown a redirect');
		} catch (e: any) {
			if (isRedirect(e)) {
				expect(e.location).toBe('/');
			} else {
				throw e;
			}
		}
	});

	it('load function accepts valid internal redirect', async () => {
		const url = new URL('http://localhost/auth/login?redirectTo=/admin');
		const event = {
			url,
			locals: { user: { id: '1', username: 'testuser' } },
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;

		try {
			await load(event);
			expect.fail('Should have thrown a redirect');
		} catch (e: any) {
			if (isRedirect(e)) {
				expect(e.location).toBe('/admin');
			} else {
				throw e;
			}
		}
	});
});
