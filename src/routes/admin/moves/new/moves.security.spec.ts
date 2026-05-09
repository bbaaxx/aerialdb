import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';

describe('Moves Admin Actions Security', () => {
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

	function createMockEvent(formData: FormData) {
		return {
			request: {
				formData: async () => formData
			},
			locals: {
				user: { id: 'user-1' }
			},
			url: new URL('http://localhost/admin/moves/new'),
			fetch: vi.fn()
		} as any;
	}

	it('rejects move name longer than 100 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'a'.repeat(101));
		formData.append('category', 'cat-1');

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Name must be 100 characters or less');
	});

	it('rejects description longer than 2000 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat-1');
		formData.append('description', 'a'.repeat(2001));

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Description must be 2000 characters or less');
	});

	it('rejects contributor name longer than 100 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat-1');
		formData.append('contributor', 'a'.repeat(101));

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Contributor name must be 100 characters or less');
	});

	it('rejects video URL longer than 255 characters', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat-1');
		formData.append('video_url', 'https://' + 'a'.repeat(250) + '.com');

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Video URL must be 255 characters or less');
	});

	it('rejects invalid video URL format', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat-1');
		formData.append('video_url', 'not-a-url');

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Invalid Video URL format');
	});

	it('rejects video URL with unsafe protocol (XSS prevention)', async () => {
		const formData = new FormData();
		formData.append('name', 'Valid Name');
		formData.append('category', 'cat-1');
		formData.append('video_url', 'javascript:alert(1)');

		const event = createMockEvent(formData);
		const result = await actions.default(event);

		expect(result.status).toBe(400);
		expect(result.data.error).toBe('Video URL must use http or https protocol');
	});
});
