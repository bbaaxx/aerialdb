import { describe, it, expect } from 'vitest';
import { actions } from './+page.server';
import { fail } from '@sveltejs/kit';

describe('Categories Admin Actions Security', () => {
	const mockEvent = () =>
		({ locals: { user: null }, request: { formData: async () => new FormData() } }) as any;

	it('createCategory action returns 401 if unauthenticated', async () => {
		expect(await actions.createCategory(mockEvent())).toEqual(
			fail(401, { error: 'Unauthorized: Authentication required' })
		);
	});

	it('updateCategory action returns 401 if unauthenticated', async () => {
		expect(await actions.updateCategory(mockEvent())).toEqual(
			fail(401, { error: 'Unauthorized: Authentication required' })
		);
	});

	it('deleteCategory action returns 401 if unauthenticated', async () => {
		expect(await actions.deleteCategory(mockEvent())).toEqual(
			fail(401, { error: 'Unauthorized: Authentication required' })
		);
	});
});
