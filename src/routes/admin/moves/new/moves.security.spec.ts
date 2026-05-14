import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
	mockDb: {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		get: vi.fn().mockResolvedValue(null),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockResolvedValue({})
	}
}));

vi.mock('$lib/server/db', () => ({
	getDb: vi.fn(() => mockDb)
}));

import { actions } from './+page.server';
import { type RequestEvent } from '@sveltejs/kit';

describe('Moves Admin Actions Security', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	function createMockEvent(formData: FormData): RequestEvent {
		return {
			request: {
				formData: vi.fn().mockResolvedValue(formData)
			},
			locals: {
				user: { id: 'user1' }
			},
			fetch: vi.fn(),
			url: new URL('http://localhost/admin/moves/new')
		} as unknown as RequestEvent;
	}

	it('should fail if name is longer than 100 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'a'.repeat(101));
		formData.append('category', 'cat1');

		const event = createMockEvent(formData);
		const result: any = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toContain('100 characters or less');
	});

	it('should fail if description is longer than 2000 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat1');
		formData.append('description', 'a'.repeat(2001));

		const event = createMockEvent(formData);
		const result: any = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toContain('2000 characters or less');
	});

	it('should fail if video URL is longer than 255 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat1');
		formData.append('video_url', 'https://' + 'a'.repeat(250));

		const event = createMockEvent(formData);
		const result: any = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toContain('255 characters or less');
	});

	it('should fail if contributor name is longer than 100 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat1');
		formData.append('contributor', 'a'.repeat(101));

		const event = createMockEvent(formData);
		const result: any = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toContain('100 characters or less');
	});

	it('should fail if new category name is longer than 100 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('new_category', 'a'.repeat(101));

		const event = createMockEvent(formData);
		const result: any = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toContain('100 characters or less');
	});
});
