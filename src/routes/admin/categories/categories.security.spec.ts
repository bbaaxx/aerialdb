import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from './+page.server';
import { isRedirect } from '@sveltejs/kit';

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

describe('Categories Admin Actions Security', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	function createMockEvent(formData: FormData, user: any = null) {
		return {
			request: {
				formData: vi.fn().mockResolvedValue(formData)
			},
			locals: { user },
			url: new URL('http://localhost/admin/categories')
<<<<<<< HEAD
		} as any;
	}

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
		} as Parameters<typeof actions.createCategory>[0];

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

	it('createCategory action should return 403 if user is not an admin', async () => {
		const formData = new FormData();
		formData.append('name', 'New Category');
		const event = createMockEvent(formData, { id: 'user-1', role: 'user' });

		try {
			await actions.createCategory(event);
			expect.fail('Should have thrown an error');
		} catch (e: any) {
			expect(e.status).toBe(403);
			expect(e.body.message).toBe('Forbidden: Admin access required');
		}
	});

	it('updateCategory action should return 403 if user is not an admin', async () => {
		const formData = new FormData();
		formData.append('id', 'cat-1');
		formData.append('name', 'Updated Category');
		const event = createMockEvent(formData, { id: 'user-1', role: 'user' });

		try {
			await actions.updateCategory(event);
			expect.fail('Should have thrown an error');
		} catch (e: any) {
			expect(e.status).toBe(403);
			expect(e.body.message).toBe('Forbidden: Admin access required');
		}
	});

	it('deleteCategory action should return 403 if user is not an admin', async () => {
		const formData = new FormData();
		formData.append('id', 'cat-1');
		const event = createMockEvent(formData, { id: 'user-1', role: 'user' });

		try {
			await actions.deleteCategory(event);
			expect.fail('Should have thrown an error');
		} catch (e: any) {
			expect(e.status).toBe(403);
			expect(e.body.message).toBe('Forbidden: Admin access required');
		}
	});
});
