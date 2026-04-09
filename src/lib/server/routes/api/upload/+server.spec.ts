import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../../../routes/api/upload/+server';

describe('api/upload/+server', () => {
	describe('POST', () => {
		let mockPlatform: any;

		beforeEach(() => {
			mockPlatform = {
				env: {
					IMAGES: null,
					PUBLIC_R2_URL: 'https://pub-xxx.r2.dev'
				}
			};
		});

		function createMockEvent(platform: any, body?: BodyInit) {
			return {
				request: new Request('http://localhost/api/upload', {
					method: 'POST',
					body
				}),
				platform,
				locals: {
					user: { id: 'test-user', username: 'testuser' }
				}
			};
		}

		it('rejects request without file', async () => {
			// Arrange
			const formData = new FormData();
			// No file added

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(400);
			expect(body.error).toBe('No file provided');
		});

		it('rejects empty file', async () => {
			// Arrange
			const formData = new FormData();
			const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
			formData.append('image', emptyFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(400);
			expect(body.error).toBe('No file provided');
		});

		it('rejects non-image file', async () => {
			// Arrange
			const formData = new FormData();
			const textFile = new File(['hello world'], 'document.txt', { type: 'text/plain' });
			formData.append('image', textFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(400);
			expect(body.error).toBe('Invalid file type (JPEG, PNG, WebP only)');
		});

		it('accepts valid image file (mock R2)', async () => {
			// Arrange
			const mockR2 = {
				put: vi.fn().mockResolvedValue(undefined)
			};
			mockPlatform.env.IMAGES = mockR2;

			const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG header
			const imageFile = new File([imageData], 'test.png', { type: 'image/png' });
			const formData = new FormData();
			formData.append('image', imageFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body).toHaveProperty('url');
			expect(body.url).toMatch(/^https:\/\/pub-xxx\.r2\.dev\/.+\.png$/);
			expect(mockR2.put).toHaveBeenCalled();
		});

		it('accepts JPEG file', async () => {
			// Arrange
			const mockR2 = {
				put: vi.fn().mockResolvedValue(undefined)
			};
			mockPlatform.env.IMAGES = mockR2;

			const imageData = new Uint8Array([0xff, 0xd8, 0xff]); // JPEG header
			const imageFile = new File([imageData], 'photo.jpg', { type: 'image/jpeg' });
			const formData = new FormData();
			formData.append('image', imageFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.url).toMatch(/\.jpg$/);
		});

		it('accepts WebP file', async () => {
			// Arrange
			const mockR2 = {
				put: vi.fn().mockResolvedValue(undefined)
			};
			mockPlatform.env.IMAGES = mockR2;

			const imageData = new Uint8Array([0x52, 0x49, 0x46, 0x46]); // RIFF header (WebP starts with RIFF)
			const imageFile = new File([imageData], 'image.webp', { type: 'image/webp' });
			const formData = new FormData();
			formData.append('image', imageFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(body.url).toMatch(/\.webp$/);
		});

		it('rejects file larger than 5MB', async () => {
			// Arrange - create a file larger than 5MB
			const largeData = new Uint8Array(5 * 1024 * 1024 + 1);
			const largeFile = new File([largeData], 'large.jpg', { type: 'image/jpeg' });
			const formData = new FormData();
			formData.append('image', largeFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(400);
			expect(body.error).toBe('File too large (max 5MB)');
		});

		it('returns error when R2 is not configured', async () => {
			// Arrange
			// When IMAGES is null, the server returns "Upload not configured - R2 bucket required"
			mockPlatform.env.IMAGES = null;
			mockPlatform.env.PUBLIC_R2_URL = '';

			const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
			const imageFile = new File([imageData], 'test.png', { type: 'image/png' });
			const formData = new FormData();
			formData.append('image', imageFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(500);
			expect(body.error).toContain('Upload not configured');
		});

		it('returns R2 URL on success', async () => {
			// Arrange
			const mockR2 = {
				put: vi.fn().mockResolvedValue(undefined)
			};
			mockPlatform.env.IMAGES = mockR2;
			mockPlatform.env.PUBLIC_R2_URL = 'https://custom-domain.example.com';

			const imageData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
			const imageFile = new File([imageData], 'test.png', { type: 'image/png' });
			const formData = new FormData();
			formData.append('image', imageFile);

			const mockEvent = createMockEvent(mockPlatform, formData);

			// Act
			const response = await POST(mockEvent as any);
			const body = await response.json();

			// Assert
			expect(response.status).toBe(200);
			const urlPath = body.url.replace('https://custom-domain.example.com/', '');
			expect(urlPath).toMatch(/^.+\.png$/);
		});
	});
});
