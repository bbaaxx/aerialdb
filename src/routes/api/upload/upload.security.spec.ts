import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './+server';

describe('api/upload extension hardening', () => {
	let mockPlatform: any;

	beforeEach(() => {
		mockPlatform = {
			env: {
				IMAGES: {
					put: vi.fn().mockResolvedValue(undefined)
				},
				PUBLIC_R2_URL: 'https://pub-xxx.r2.dev'
			}
		};
	});

	function createMockEvent(platform: any, body?: BodyInit, user: any = { id: 'user-1' }) {
		return {
			request: new Request('http://localhost/api/upload', {
				method: 'POST',
				body
			}),
			platform,
			locals: {
				user
			}
		};
	}

	it('uses extension from MIME type, not from provided filename (prevent spoofing)', async () => {
		// Arrange: Provide a .php extension but image/png MIME type
		const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
		const imageFile = new File([imageData], 'malicious.php', { type: 'image/png' });
		const formData = new FormData();
		formData.append('image', imageFile);

		const mockEvent = createMockEvent(mockPlatform, formData);

		// Act
		const response = await POST(mockEvent as any);
		const body = await response.json();

		// Assert
		expect(response.status).toBe(200);
		// It should end in .png, NOT .php
		expect(body.url).toMatch(/\.png$/);
		expect(body.url).not.toMatch(/\.php$/);

		// Verify R2 put was called with .png
		const filename = mockPlatform.env.IMAGES.put.mock.calls[0][0];
		expect(filename).toMatch(/\.png$/);
		expect(filename).not.toMatch(/\.php$/);
	});
});
