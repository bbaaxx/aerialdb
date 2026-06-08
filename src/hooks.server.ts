import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import { type Handle, redirect, error } from '@sveltejs/kit';
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
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
			throw redirect(302, `/auth/login?redirectTo=${redirectTo}`);
		}

		if (event.locals.user.role !== 'admin') {
			throw error(403, 'Forbidden: Admin access required');
		}
	}

	return resolve(event);
};

export const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	event.setHeaders({
		'X-Frame-Options': 'SAMEORIGIN',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Resource-Policy': 'same-origin',
		'X-Permitted-Cross-Domain-Policies': 'none',
		'X-DNS-Prefetch-Control': 'off',
		'X-XSS-Protection': '0',
		'Permissions-Policy':
			'geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=(), screen-wake-lock=()'
	});

	// SECURITY: Enable HSTS in production to ensure secure connections
	if (import.meta.env.PROD) {
		event.setHeaders({
			'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
		});
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	handleSecurityHeaders,
	handleParaglide,
	handleAuth,
	handleAdminGuard
);
