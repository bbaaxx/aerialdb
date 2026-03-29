import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

const mockData = {
	moves: [
		{
			id: '1',
			name: 'Birdie',
			imageUrl: null,
			level: 'beginner',
			category: { id: 'silks', name: 'Silks' }
		}
	],
	categories: [{ id: 'silks', name: 'Silks' }],
	searchQuery: '',
	categoryFilter: null,
	levelFilter: null,
	featuredMove: null
};

describe('/+page.svelte', () => {
	it('should render the page heading', async () => {
		render(Page, { data: mockData });

		const heading = page.getByRole('heading', { name: 'Library' });
		await expect.element(heading).toBeInTheDocument();
	});

	it('should render without errors', async () => {
		expect(() => render(Page, { data: mockData })).not.toThrow();
	});
});
