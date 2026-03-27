import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/moves', () => {
	it('should render h1', async () => {
		const data = {
			moves: [],
			categories: [],
			searchQuery: '',
			categoryFilter: '',
			user: null
		};
		render(Page, { props: { data } });

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
