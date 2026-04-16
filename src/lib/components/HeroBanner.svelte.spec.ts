import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HeroBanner from './HeroBanner.svelte';

const mockMove = {
	id: '1',
	name: 'Test Move',
	imageUrl: 'https://example.com/image.jpg',
	level: 'beginner',
	category: { id: '1', name: 'Test Category' }
};

describe('HeroBanner', () => {
	it('should have correct performance attributes on the main hero image', async () => {
		render(HeroBanner, { move: mockMove });

		const img = page.getByAltText('Test Move');
		await expect.element(img).toBeInTheDocument();

		await expect.element(img).toHaveAttribute('fetchpriority', 'high');
		await expect.element(img).toHaveAttribute('loading', 'eager');
		await expect.element(img).toHaveAttribute('decoding', 'async');
	});

	it('should have lazy loading and async decoding on decorative images', async () => {
		const { container } = render(HeroBanner, { move: mockMove });

		// The decorative images have alt="" and aria-hidden="true"
		const decorativeImgs = container.querySelectorAll('img[aria-hidden="true"]');
		expect(decorativeImgs.length).toBe(2);

		decorativeImgs.forEach((img) => {
			expect(img.getAttribute('loading')).toBe('lazy');
			expect(img.getAttribute('decoding')).toBe('async');
		});
	});
});
