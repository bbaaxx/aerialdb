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
			verifyPassword: vi.fn().mockResolvedValue(true),
			dummyPasswordHash: 'dummy_hash'
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
			// @ts-expect-error - action is default
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

	it('action returns generic error message for non-existent user to prevent enumeration', async () => {
		// Mock dependencies to return no user
		const { getDb } = await import('$lib/server/db');
		vi.mocked(getDb).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			at: vi.fn().mockReturnValue(undefined)
		} as any);

		const formData = new FormData();
		formData.append('username', 'nonexistentuser');
		formData.append('password', 'password123');

		const event = {
			request: {
				formData: async () => formData
			},
			url: new URL('http://localhost/auth/login'),
			locals: {},
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;

		// @ts-expect-error - action is default
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid username or password');
		// Ensure showSignupLink is NOT present
		expect(result.data.showSignupLink).toBeUndefined();
	});

	it('action returns generic error message for incorrect password to prevent enumeration', async () => {
		// Mock dependencies to return a user but incorrect password
		const { getDb } = await import('$lib/server/db');
		vi.mocked(getDb).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			at: vi.fn().mockReturnValue({
				id: '1',
				username: 'testuser',
				passwordHash: 'hashed_password'
			})
		} as any);

		const { verifyPassword } = await import('$lib/server/password');
		vi.mocked(verifyPassword).mockResolvedValue(false);

		const formData = new FormData();
		formData.append('username', 'testuser');
		formData.append('password', 'wrongpassword');

		const event = {
			request: {
				formData: async () => formData
			},
			url: new URL('http://localhost/auth/login'),
			locals: {},
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;

		// @ts-expect-error - action is default
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.message).toBe('Invalid username or password');
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
