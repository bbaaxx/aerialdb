import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Check if user is logged in
	if (!event.locals.user) {
		const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
		throw redirect(302, `/auth/login?redirectTo=${redirectTo}`);
	}

	// SECURITY: RBAC - Ensure only admins can access the admin layout
	if (event.locals.user.role !== 'admin') {
		throw error(403, 'Forbidden: Admin access required');
	}

	return {
		user: event.locals.user
	};
};
