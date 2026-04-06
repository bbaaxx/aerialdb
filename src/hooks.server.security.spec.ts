import { describe, it, expect, vi } from 'vitest';
import { handleSecurityHeaders } from './hooks.server';

describe('hooks.server security headers', () => {
	it('adds security headers to the response', async () => {
		// Mock event
		const event = {} as any;

		// Mock resolve function that returns a basic response
		const resolve = vi.fn().mockResolvedValue(new Response('OK'));

		const response = await handleSecurityHeaders({ event, resolve });

		expect(response.headers.get('X-Frame-Options')).toBe('DENY');
		expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
		expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
		expect(response.headers.get('Permissions-Policy')).toBe(
			'geolocation=(), camera=(), microphone=(), payment=()'
		);
	});
});
