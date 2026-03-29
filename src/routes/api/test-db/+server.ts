import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
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
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				stack: error instanceof Error ? error.stack : undefined,
				platform: event.platform ? 'Cloudflare' : 'Local'
			},
			{ status: 500 }
		);
	}
};
