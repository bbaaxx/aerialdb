import { describe, it, expect, vi } from 'vitest';
import { handleAdminGuard } from './hooks.server';
import { isRedirect } from '@sveltejs/kit';

describe('Admin Guard Hook', () => {
	it('redirects unauthenticated users from /admin', async () => {
		const event = {
			url: new URL('http://localhost/admin'),
			locals: { user: null }
		} as any;

		const resolve = vi.fn();

		try {
			await handleAdminGuard({ event, resolve });
			expect.fail('Should have thrown a redirect');
		} catch (e: any) {
			expect(isRedirect(e)).toBe(true);
			expect(e.status).toBe(302);
			expect(e.location).toContain('/auth/login');
			expect(e.location).toContain('redirectTo=%2Fadmin');
		}
	});

	it('allows authenticated users to access /admin', async () => {
		const event = {
			url: new URL('http://localhost/admin'),
			locals: { user: { id: '1' } }
		} as any;

		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleAdminGuard({ event, resolve });
		expect(response).toBeDefined();
		expect(resolve).toHaveBeenCalled();
	});

	it('allows unauthenticated users to access non-admin routes', async () => {
		const event = {
			url: new URL('http://localhost/'),
			locals: { user: null }
		} as any;

		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleAdminGuard({ event, resolve });
		expect(response).toBeDefined();
		expect(resolve).toHaveBeenCalled();
	});
});
