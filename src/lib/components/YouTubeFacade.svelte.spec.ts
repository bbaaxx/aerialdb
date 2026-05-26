import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import YouTubeFacade from './YouTubeFacade.svelte';

describe('YouTubeFacade', () => {
	const videoId = 'dQw4w9WgXcQ';
	const title = 'Test Video';

	it('should render the thumbnail and play button initially, but not the iframe', async () => {
		const { container } = render(YouTubeFacade, { videoId, title });

		// Check for thumbnail
		const img = page.getByAltText(title);
		await expect.element(img).toBeInTheDocument();
		await expect
			.element(img)
			.toHaveAttribute('src', `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

		// Check for play button
		const button = container.querySelector('button');
		expect(button).not.toBeNull();
		expect(button?.getAttribute('aria-label')).toBe(`Play video: ${title}`);

		// Check that iframe is NOT present
		const iframe = container.querySelector('iframe');
		expect(iframe).toBeNull();
	});

	it('should render the iframe after clicking the play button', async () => {
		const { container } = render(YouTubeFacade, { videoId, title });

		const button = container.querySelector('button');
		expect(button).not.toBeNull();

		// Use direct DOM click and poll for update as per memory recommendation for Svelte 5 Vitest Browser tests
		button?.click();

		await expect.poll(() => container.querySelector('iframe')).not.toBeNull();

		const iframe = container.querySelector('iframe');
		expect(iframe?.getAttribute('src')).toContain(`https://www.youtube.com/embed/${videoId}`);
		expect(iframe?.getAttribute('src')).toContain('autoplay=1');

		// Check that button/thumbnail is gone
		expect(container.querySelector('button')).toBeNull();
	});
});
