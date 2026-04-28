import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import { type Handle, redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { getDb } from '$lib/server/db';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const db = getDb(event);
	const { session, user } = await auth.validateSessionToken(sessionToken, db);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handleAdminGuard: Handle = async ({ event, resolve }) => {
	// Protect all routes starting with /admin
	if (event.url.pathname.startsWith('/admin') && !event.locals.user) {
		const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
		throw redirect(302, `/auth/login?redirectTo=${redirectTo}`);
	}

	return resolve(event);
};

export const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'geolocation=(), camera=(), microphone=(), payment=()'
	);
	// CSP removed - was blocking SvelteKit hydration inline scripts
	// Uncomment if needed for production:
	// response.headers.set('Content-Security-Policy', [...]);

	// SECURITY: Enable HSTS in production to ensure secure connections
	if (import.meta.env.PROD) {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	return response;
};

export const handle: Handle = sequence(
	handleParaglide,
	handleAuth,
	handleAdminGuard,
	handleSecurityHeaders
);
