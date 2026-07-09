import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => {
	const db: any = {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		get: vi.fn(),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockResolvedValue({}),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis()
	};
	return { mockDb: db };
});

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn(() => mockDb)
}));

import { actions as newActions } from './new/+page.server';
import { actions as editActions } from './[id]/edit/+page.server';
import { isRedirect } from '@sveltejs/kit';

describe('Moves Admin Actions Security', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset mock chains
		mockDb.select.mockReturnThis();
		mockDb.from.mockReturnThis();
		mockDb.where.mockReturnThis();
		mockDb.orderBy.mockReturnThis();
		mockDb.insert.mockReturnThis();
		mockDb.update.mockReturnThis();
		mockDb.set.mockReturnThis();
		mockDb.limit.mockReturnThis();
		mockDb.get.mockReset();
	});

	function createMockEvent(formData: FormData, user: any = null, params: any = {}) {
		return {
			request: {
				formData: vi.fn().mockResolvedValue(formData)
			},
			locals: { user },
			params,
			fetch: vi.fn().mockResolvedValue({
				ok: true,
				json: vi.fn().mockResolvedValue({ url: 'http://example.com/image.jpg' })
			}),
			platform: {}
		} as unknown as any;
	}

	describe('new move action', () => {
		it('should redirect to login if not authenticated', async () => {
			const event = createMockEvent(new FormData()) as unknown as Parameters<
				typeof newActions.default
			>[0];
			await expect(newActions.default(event)).rejects.toSatisfy(isRedirect);
		});

		it('should return 403 if user is not an admin', async () => {
			const event = createMockEvent(new FormData(), { id: 'user-1', role: 'user' });
			try {
				await newActions.default(event);
				expect.fail('Should have thrown an error');
			} catch (e: any) {
				expect(e.status).toBe(403);
				expect(e.body.message).toBe('Forbidden: Admin access required');
			}
		});

		it('should require a name', async () => {
			const formData = new FormData();
			formData.append('name', '   '); // Empty after trim
			const event = createMockEvent(formData, { id: 'admin-1', role: 'admin' });
			const result: any = await newActions.default(event);
			expect(result.status).toBe(400);
			expect(result.data.error).toBe('Name is required');
		});

		it('should trim and limit input lengths', async () => {
			const formData = new FormData();
			formData.append('name', '  A New Move  ');
			formData.append('description', 'a'.repeat(3000));
			formData.append('category', 'cat-1');

			const event = createMockEvent(formData, { id: 'admin-1', role: 'admin' });

			try {
				await newActions.default(event);
			} catch (e) {
				if (!isRedirect(e)) throw e;
				// Success
			}

			expect(mockDb.insert).toHaveBeenCalled();
			const insertedValues = vi.mocked(mockDb.values).mock.calls[0][0];
			expect(insertedValues.name).toBe('A New Move');
			expect(insertedValues.description.length).toBe(2000);
		});
	});

	describe('edit move action', () => {
		it('update should redirect to login if not authenticated', async () => {
			const event = createMockEvent(new FormData(), null, {
				id: 'move-1'
			}) as unknown as Parameters<typeof editActions.update>[0];
			await expect(editActions.update(event)).rejects.toSatisfy(isRedirect);
		});

		it('update should return 403 if user is not an admin', async () => {
			const event = createMockEvent(new FormData(), { id: 'user-1', role: 'user' });
			try {
				await editActions.update(event);
				expect.fail('Should have thrown an error');
			} catch (e: any) {
				expect(e.status).toBe(403);
				expect(e.body.message).toBe('Forbidden: Admin access required');
			}
		});

		it('update should trim and limit input lengths', async () => {
			const formData = new FormData();
			formData.append('name', '  Updated Name  ');
			formData.append('description', 'b'.repeat(3000));
			formData.append('category', 'cat-1');

			const event = createMockEvent(formData, { id: 'admin-1', role: 'admin' }, { id: 'move-1' });

			// The update action calls db.select().from(moves).where(...).limit(1) as any
			// which is what getDb() returns.
			// Wait, in update action:
			// const [currentMove] = (await (db as any).select({ imageUrl: moves.imageUrl }).from(moves).where(eq(moves.id, params.id)).limit(1))

			// We need mockDb to return an array for the select()... sequence
			mockDb.limit.mockResolvedValueOnce([{ imageUrl: null }]);

			try {
				await editActions.update(event);
			} catch (e) {
				if (!isRedirect(e)) throw e;
				// Success
			}

			expect(mockDb.update).toHaveBeenCalled();
			const updatedValues = vi.mocked(mockDb.set).mock.calls[0][0];
			expect(updatedValues.name).toBe('Updated Name');
			expect(updatedValues.description.length).toBe(2000);
		});

		it('delete should redirect to login if not authenticated', async () => {
			const event = createMockEvent(new FormData(), null, {
				id: 'move-1'
			}) as unknown as Parameters<typeof editActions.delete>[0];
			await expect(editActions.delete(event)).rejects.toSatisfy(isRedirect);
		});

		it('delete should return 403 if user is not an admin', async () => {
			const event = createMockEvent(new FormData(), { id: 'user-1', role: 'user' });
			try {
				await editActions.delete(event);
				expect.fail('Should have thrown an error');
			} catch (e: any) {
				expect(e.status).toBe(403);
				expect(e.body.message).toBe('Forbidden: Admin access required');
			}
		});
	});
});
