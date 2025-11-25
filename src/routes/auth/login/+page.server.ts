import { hashPassword, verifyPassword } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is already logged in, redirect to home
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username format',
				username: typeof username === 'string' ? username : '',
				showSignupLink: false
			});
		}
		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Invalid password format',
				username: typeof username === 'string' ? username : '',
				showSignupLink: false
			});
		}

		const db = getDb(event);
		const results = await db.select().from(table.user).where(eq(table.user.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, {
				message: 'Account not found. Please check your username or create a new account.',
				username: typeof username === 'string' ? username : '',
				showSignupLink: true
			});
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect password. Please try again.',
				username: typeof username === 'string' ? username : '',
				showSignupLink: false
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id, db);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Redirect to home page on successful login
		return redirect(302, '/');
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
