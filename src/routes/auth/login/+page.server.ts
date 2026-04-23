import { verifyPassword } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { isValidRedirect } from '$lib/utils/security';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is already logged in, redirect to home or the specified redirect URL
	if (event.locals.user) {
		const redirectTo = event.url.searchParams.get('redirectTo');
		return redirect(302, isValidRedirect(redirectTo) ? redirectTo : '/');
	}

	const redirectTo = event.url.searchParams.get('redirectTo');
	return { redirectTo };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const redirectTo = formData.get('redirectTo') as string | null;

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

		// Use a dummy hash for non-existent users to prevent timing attacks (user enumeration)
		// This ensures that verifyPassword is always called and takes a similar amount of time.
		const dummyHash = '+J6mAU4gdBajcPCY/n3Gsw==:pVit99yFbG/spnoO0FTSSWz5uMOSCDS9ZQWqmIR7AVE=';
		const validPassword = await verifyPassword(
			existingUser ? existingUser.passwordHash : dummyHash,
			password
		);

		if (!existingUser || !validPassword) {
			return fail(400, {
				message: 'Invalid username or password. Please try again or create a new account.',
				username: typeof username === 'string' ? username : '',
				showSignupLink: true
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id, db);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Redirect to the specified URL or home page on successful login
		// Validate redirectTo to prevent Open Redirect vulnerabilities
		return redirect(302, isValidRedirect(redirectTo) ? redirectTo : '/');
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
