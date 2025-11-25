import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const db = getDb(event);
		await auth.invalidateSession(event.locals.session.id, db);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/demo/lucia/login');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/demo/lucia/login');
	}

	return locals.user;
}
