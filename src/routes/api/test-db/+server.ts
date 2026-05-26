import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	// SECURITY: RBAC - Only admins can test the database connection
	if (!event.locals.user || event.locals.user.role !== 'admin') {
		return json({ error: 'Forbidden: Admin access required' }, { status: 403 });
	}

	try {
		const db = getDb(event);

		// Try to query the database
		const result = await db.query.user.findMany({
			limit: 1
		});

		return json({
			success: true,
			message: 'Database connection working',
			hasUsers: result.length > 0,
			platform: event.platform ? 'Cloudflare' : 'Local'
		});
	} catch (error) {
		// Log the error for internal tracking but don't leak details to the client
		console.error('Database connection test failed:', error);

		return json(
			{
				success: false,
				error: 'An unexpected error occurred while testing the database connection',
				platform: event.platform ? 'Cloudflare' : 'Local'
			},
			{ status: 500 }
		);
	}
};
