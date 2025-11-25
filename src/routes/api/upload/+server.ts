import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const formData = await request.formData();
	const file = formData.get('image') as File;

	if (!file || file.size === 0) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	// Validate size (5MB = 5 * 1024 * 1024 bytes)
	if (file.size > 5 * 1024 * 1024) {
		return json({ error: 'File too large (max 5MB)' }, { status: 400 });
	}

	// Validate type
	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		return json({ error: 'Invalid file type (JPEG, PNG, WebP only)' }, { status: 400 });
	}

	// Generate unique filename
	const ext = file.name.split('.').pop();
	const filename = `${crypto.randomUUID()}.${ext}`;

	// Check if we're in Cloudflare environment
	if (platform?.env?.IMAGES) {
		// Production: Upload to Cloudflare R2
		const buffer = await file.arrayBuffer();

		await platform.env.IMAGES.put(filename, buffer, {
			httpMetadata: {
				contentType: file.type
			}
		});

		// Return R2 public URL
		// Note: You'll need to configure R2 public access or use a custom domain
		// For now, we'll use a placeholder that you'll configure
		return json({ url: `/uploads/${filename}` });
	}

	// Development mode: filesystem not available in production
	return json({ error: 'Upload not configured - R2 bucket required' }, { status: 500 });
};
