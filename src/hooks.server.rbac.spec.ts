import { describe, it, expect, vi } from 'vitest';
import { handleAdminGuard } from './hooks.server';

describe('hooks.server RBAC', () => {
	it('allows access to /admin for users with admin role', async () => {
		const event = {
			url: new URL('http://localhost/admin/moves'),
			locals: {
				user: { id: '1', username: 'admin', role: 'admin' }
			}
		} as any;
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleAdminGuard({ event, resolve });
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('OK');
		expect(resolve).toHaveBeenCalledWith(event);
	});

	it('denies access to /admin (403) for users with user role', async () => {
		const event = {
			url: new URL('http://localhost/admin/moves'),
			locals: {
				user: { id: '2', username: 'regular', role: 'user' }
			}
		} as any;
		const resolve = vi.fn();

		const response = await handleAdminGuard({ event, resolve });
		expect(response.status).toBe(403);
		expect(await response.text()).toBe('Forbidden: Admin access required');
		expect(resolve).not.toHaveBeenCalled();
	});

	it('redirects unauthenticated users from /admin to login', async () => {
		const event = {
			url: new URL('http://localhost/admin/moves'),
			locals: { user: null }
		} as any;
		const resolve = vi.fn();

		try {
			await handleAdminGuard({ event, resolve });
			expect.fail('Should have thrown a redirect');
		} catch (e: any) {
			expect(e.status).toBe(302);
			expect(e.location).toBe('/auth/login?redirectTo=%2Fadmin%2Fmoves');
		}
	});

	it('allows access to non-admin routes for regular users', async () => {
		const event = {
			url: new URL('http://localhost/moves/1'),
			locals: {
				user: { id: '2', username: 'regular', role: 'user' }
			}
		} as any;
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleAdminGuard({ event, resolve });
		expect(response.status).toBe(200);
		expect(await response.text()).toBe('OK');
		expect(resolve).toHaveBeenCalledWith(event);
	});
});
