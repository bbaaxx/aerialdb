import { describe, it, expect, vi } from 'vitest';
import { handleSecurityHeaders } from './hooks.server';

describe('hooks.server security headers', () => {
	const expectedHeaders = {
		'X-Frame-Options': 'SAMEORIGIN',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=()',
		'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
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
		expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
		expect(response.headers.get('Content-Security-Policy')).toContain("frame-src https://www.youtube.com");
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
