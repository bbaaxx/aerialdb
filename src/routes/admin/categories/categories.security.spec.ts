import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';
import { isRedirect, type RequestEvent } from '@sveltejs/kit';

describe('Categories Admin Actions Security', () => {
	vi.mock('$lib/server/db', () => ({
		getDb: vi.fn().mockReturnValue({
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			get: vi.fn().mockResolvedValue(null),
			insert: vi.fn().mockReturnThis(),
			values: vi.fn().mockResolvedValue({})
		})
	}));

	it('createCategory action should throw redirect to /auth/login if user is not authenticated', async () => {
		expect.hasAssertions();
		const formData = new FormData();
		formData.append('name', 'New Category');

		const event = {
			request: new Request('http://localhost/admin/categories', {
				method: 'POST',
				body: formData
			}),
			locals: {
				user: null
			},
			url: new URL('http://localhost/admin/categories')
		} as unknown as RequestEvent;

		try {
			await actions.createCategory(event);
		} catch (e: any) {
			if (isRedirect(e)) {
				// Now it MUST redirect to /auth/login
				expect(e.location).toContain('/auth/login');
				return;
			}
			throw e;
		}

		throw new Error('Action did not throw a redirect');
	});
});
