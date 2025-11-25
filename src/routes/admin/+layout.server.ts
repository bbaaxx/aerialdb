import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Check if user is logged in
	if (!event.locals.user) {
		throw redirect(302, '/demo/lucia/login');
	}

	return {
		user: event.locals.user
	};
};
