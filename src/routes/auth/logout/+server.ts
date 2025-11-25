import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (event.locals.session) {
		const db = getDb(event);
		await auth.invalidateSession(event.locals.session.id, db);
		auth.deleteSessionTokenCookie(event);
	}

	return redirect(302, '/');
};
