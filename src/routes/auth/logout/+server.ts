import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

/**
 * POST /auth/logout
 *
 * Invalidate the current session and clear the session cookie.
 * Works with or without an active session. Always redirects to `/`.
 *
 * @response 302 - Redirect to /
 */
export const POST: RequestHandler = async (event) => {
	if (event.locals.session) {
		const db = getDb(event);
		await auth.invalidateSession(event.locals.session.id, db);
		auth.deleteSessionTokenCookie(event);
	}

	event.setHeaders({
		'Clear-Site-Data': '"cookies", "storage", "cache"'
	});

	return redirect(302, '/');
};
