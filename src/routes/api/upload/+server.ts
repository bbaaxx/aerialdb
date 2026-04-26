import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	// Authentication check: Only logged-in users can upload images
	if (!locals.user) {
		return json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('image') as File;

	if (!file || file.size === 0) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	// Validate size (5MB = 5 * 1024 * 1024 bytes)
	if (file.size > 5 * 1024 * 1024) {
		return json({ error: 'File too large (max 5MB)' }, { status: 400 });
	}

	// Validate type and map to safe extensions
	// SECURITY: Map validated MIME types to specific safe extensions on the server
	// instead of trusting the client-provided filename extension to prevent spoofing.
	const mimeToExt: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp'
	};

	const ext = mimeToExt[file.type];
	if (!ext) {
		return json({ error: 'Invalid file type (JPEG, PNG, WebP only)' }, { status: 400 });
	}

	// Generate unique filename
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
		// Use PUBLIC_R2_URL from environment variables (configured in Cloudflare Pages)
		// This should be your R2 public bucket URL (e.g., https://pub-xxxxx.r2.dev)
		// or your custom domain (e.g., https://images.yourdomain.com)
		const publicUrl = platform.env.PUBLIC_R2_URL || '';

		if (!publicUrl) {
			return json(
				{
					error: 'R2 public URL not configured. Please set PUBLIC_R2_URL environment variable.'
				},
				{ status: 500 }
			);
		}

		return json({ url: `${publicUrl}/${filename}` });
	}

	// Development mode: filesystem not available in production
	return json({ error: 'Upload not configured - R2 bucket required' }, { status: 500 });
};
