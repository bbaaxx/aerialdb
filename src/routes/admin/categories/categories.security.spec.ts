import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';
import { getDb } from '$lib/server/db';

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn()
}));

vi.mock('drizzle-orm', async () => {
	const actual = await vi.importActual('drizzle-orm');
	return {
		...actual,
		eq: vi.fn(),
		sql: {
			raw: vi.fn()
		}
	};
});

describe('Admin Categories Security', () => {
	const mockDb = {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		get: vi.fn().mockResolvedValue(null),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockResolvedValue({}),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis()
	};

	const createEvent = (formDataMap: Map<string, string>) =>
		({
			request: {
				formData: vi.fn().mockResolvedValue(formDataMap)
			},
			locals: {} // No user in locals
		}) as any;

	it('createCategory action redirects to login when not authenticated', async () => {
		(getDb as any).mockReturnValue(mockDb);
		const event = createEvent(new Map([['name', 'New Category']]));

		let error: any;
		try {
			await actions.createCategory(event);
		} catch (e: any) {
			error = e;
		}

		expect(error?.status).toBe(302);
		expect(error?.location).toBe('/auth/login');
	});

	it('updateCategory action redirects to login when not authenticated', async () => {
		(getDb as any).mockReturnValue(mockDb);
		const event = createEvent(
			new Map([
				['id', '123'],
				['name', 'Updated Category']
			])
		);

		let error: any;
		try {
			await actions.updateCategory(event);
		} catch (e: any) {
			error = e;
		}

		expect(error?.status).toBe(302);
		expect(error?.location).toBe('/auth/login');
	});

	it('deleteCategory action redirects to login when not authenticated', async () => {
		(getDb as any).mockReturnValue(mockDb);
		const event = createEvent(new Map([['id', '123']]));

		let error: any;
		try {
			await actions.deleteCategory(event);
		} catch (e: any) {
			error = e;
		}

		expect(error?.status).toBe(302);
		expect(error?.location).toBe('/auth/login');
	});
});
