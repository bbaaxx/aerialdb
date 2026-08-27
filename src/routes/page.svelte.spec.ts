import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

const mockData = {
	user: null,
	moves: [
		{
			id: '1',
			name: 'Birdie',
			description: null,
			imageUrl: null,
			videoUrl: null,
			level: 'beginner',
			contributorName: null,
			category: { id: 'silks', name: 'Silks' }
		}
	],
	categories: [{ id: 'silks', name: 'Silks', createdAt: new Date() }],
	searchQuery: '',
	categoryFilter: '',
	levelFilter: '',
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

	it('should render active filter summary when category or level filter is active', async () => {
		const filteredData = {
			...mockData,
			categoryFilter: 'silks',
			levelFilter: 'beginner'
		};
		render(Page, { data: filteredData });

		const activeSummary = page.getByText('Active Filters:');
		await expect.element(activeSummary).toBeInTheDocument();

		const clearAllButton = page.getByRole('button', { name: 'Clear all active filters' });
		await expect.element(clearAllButton).toBeInTheDocument();
	});
});
