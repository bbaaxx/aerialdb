import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions as newActions } from './new/+page.server';
import { actions as editActions } from './[id]/edit/+page.server';
import { type RequestEvent } from '@sveltejs/kit';

// Mock DB
vi.mock('$lib/server/db', () => ({
	getDb: vi.fn().mockReturnValue({
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		get: vi.fn().mockResolvedValue(null),
		limit: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockResolvedValue({}),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis()
	})
}));

describe('Moves Admin Actions Security', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	function createMockEvent(formData: FormData, locals: any = { user: { id: 'user1' } }) {
		return {
			request: {
				formData: vi.fn().mockResolvedValue(formData)
			},
			locals,
			params: { id: 'move1' },
			fetch: vi.fn(),
			platform: {}
		} as unknown as RequestEvent;
	}

	describe('New Move Action', () => {
		it('should return 400 if name is too long', async () => {
			const formData = new FormData();
			formData.append('name', 'a'.repeat(101));
			formData.append('category', 'cat1');

			const event = createMockEvent(formData);
			const result = await newActions.default(event);

			expect(result).toEqual({
				status: 400,
				data: { error: 'Name must be 100 characters or less' }
			});
		});

		it('should return 400 if description is too long', async () => {
			const formData = new FormData();
			formData.append('name', 'Valid Name');
			formData.append('category', 'cat1');
			formData.append('description', 'a'.repeat(2001));

			const event = createMockEvent(formData);
			const result = await newActions.default(event);

			expect(result).toEqual({
				status: 400,
				data: { error: 'Description must be 2000 characters or less' }
			});
		});

		it('should return 400 if video_url is too long', async () => {
			const formData = new FormData();
			formData.append('name', 'Valid Name');
			formData.append('category', 'cat1');
			formData.append('video_url', 'http://' + 'a'.repeat(250) + '.com');

			const event = createMockEvent(formData);
			const result = await newActions.default(event);

			expect(result).toEqual({
				status: 400,
				data: { error: 'Video URL must be 255 characters or less' }
			});
		});
	});

	describe('Edit Move Action', () => {
		it('should return 400 if name is too long on update', async () => {
			const formData = new FormData();
			formData.append('name', 'a'.repeat(101));
			formData.append('category', 'cat1');

			const event = createMockEvent(formData);
			const result = await editActions.update(event);

			expect(result).toEqual({
				status: 400,
				data: { error: 'Name must be 100 characters or less' }
			});
		});
	});
});
