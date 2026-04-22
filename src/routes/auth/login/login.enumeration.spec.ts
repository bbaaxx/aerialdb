import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';

describe('Login User Enumeration Security', () => {
	vi.mock('$lib/server/db', () => ({ getDb: vi.fn() }));
	vi.mock('$lib/server/password', () => ({ verifyPassword: vi.fn().mockResolvedValue(false) }));
	vi.mock('$lib/server/auth', () => ({
		generateSessionToken: vi.fn(),
		createSession: vi.fn(),
		setSessionTokenCookie: vi.fn()
	}));

	const testLogin = async (username: string) => {
		const { getDb } = await import('$lib/server/db');
		const user =
			username === 'existinguser' ? { id: '1', username, passwordHash: 'hash' } : undefined;
		(getDb as any).mockReturnValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			at: vi.fn().mockReturnValue(user)
		});
		const formData = new FormData();
		formData.append('username', username);
		formData.append('password', 'password123');
		const event = {
			request: { formData: async () => formData },
			url: new URL('http://l'),
			locals: {},
			cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
		} as any;
		return await (actions.default as any)(event);
	};

	it('returns generic error for both existent and non-existent users', async () => {
		const msg = 'Invalid username or password. Please try again or create a new account.';
		expect((await testLogin('nonexistent')).data.message).toBe(msg);
		expect((await testLogin('existinguser')).data.message).toBe(msg);
	});
});
