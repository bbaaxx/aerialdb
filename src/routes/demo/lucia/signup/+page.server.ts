import { hashPassword } from '$lib/server/password';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/demo/lucia');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		// Validate username
		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Username must be 3-31 characters and contain only lowercase letters, numbers, hyphens, and underscores',
				field: 'username' as const,
				username: typeof username === 'string' ? username : ''
			});
		}

		// Validate password
		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Password must be at least 6 characters long',
				field: 'password' as const,
				username: typeof username === 'string' ? username : ''
			});
		}

		// Validate password confirmation
		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match',
				field: 'confirmPassword' as const,
				username: typeof username === 'string' ? username : ''
			});
		}

		const userId = generateUserId();
		const passwordHash = await hashPassword(password);

		try {
			const db = getDb(event);
			await db.insert(table.user).values({ id: userId, username, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId, db);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			// Check if it's a unique constraint violation (username already exists)
			if (e && typeof e === 'object' && 'code' in e && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, {
					message: 'Username already taken',
					field: 'username' as const,
					username: typeof username === 'string' ? username : ''
				});
			}
			return fail(500, {
				message: 'An unexpected error occurred. Please try again.',
				username: typeof username === 'string' ? username : ''
			});
		}
		return redirect(302, '/demo/lucia');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

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
