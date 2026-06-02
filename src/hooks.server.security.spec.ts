import { describe, it, expect, vi } from 'vitest';
import { handleSecurityHeaders, handleAdminGuard } from './hooks.server';

describe('hooks.server security headers', () => {
	const expectedHeaders = {
		'X-Frame-Options': 'SAMEORIGIN',
		'X-Content-Type-Options': 'nosniff',
		'X-Permitted-Cross-Domain-Policies': 'none',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Resource-Policy': 'same-origin',
		'X-XSS-Protection': '0',
		'Permissions-Policy':
			'geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=(), screen-wake-lock=()'
		// HSTS removed - only in production
	};

	async function callHook(response: Response) {
		const event = {} as any;
		const resolve = vi.fn().mockResolvedValue(response);
		return handleSecurityHeaders({ event, resolve });
	}

	function assertSecurityHeaders(response: Response) {
		for (const [header, value] of Object.entries(expectedHeaders)) {
			expect(response.headers.get(header)).toBe(value);
		}
		// CSP is now handled by SvelteKit config, but in unit tests of this hook it might not be present
		// since we are calling handleSecurityHeaders directly on a mock Response.
		expect(response.headers.get('Strict-Transport-Security')).toBeNull();
	}

	it('adds security headers to a successful response', async () => {
		const response = await callHook(new Response('OK'));
		assertSecurityHeaders(response);
	});

	it('adds security headers to an error response', async () => {
		const response = await callHook(new Response('Not Found', { status: 404 }));
		assertSecurityHeaders(response);
	});

	it('adds security headers to a JSON response', async () => {
		const response = await callHook(
			new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			})
		);
		assertSecurityHeaders(response);
	});

	it('adds security headers to a redirect response', async () => {
		const response = await callHook(
			new Response(null, { status: 302, headers: { Location: '/login' } })
		);
		assertSecurityHeaders(response);
		expect(response.headers.get('Location')).toBe('/login');
	});
});

describe('hooks.server admin guard', () => {
	it('redirects unauthenticated users from /admin routes', async () => {
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

	it('denies access to /admin routes for authenticated non-admin users', async () => {
		const event = {
			url: new URL('http://localhost/admin/moves'),
			locals: { user: { id: 'user-1', username: 'tester', role: 'user' } }
		} as any;
		const resolve = vi.fn();

		try {
			await handleAdminGuard({ event, resolve });
			expect.fail('Should have thrown a forbidden error');
		} catch (e: any) {
			expect(e.status).toBe(403);
			expect(e.body.message).toBe('Forbidden: Admin access required');
		}
	});

	it('allows access to /admin routes for authenticated admin users', async () => {
		const event = {
			url: new URL('http://localhost/admin/moves'),
			locals: { user: { id: 'admin-1', username: 'admin', role: 'admin' } }
		} as any;
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleAdminGuard({ event, resolve });
		expect(response.status).toBe(200);
		expect(resolve).toHaveBeenCalled();
	});
});
