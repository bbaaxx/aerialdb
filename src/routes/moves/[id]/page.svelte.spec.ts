import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MoveDetailPage from './+page.svelte';
import { m } from '$lib/paraglide/messages.js';

const mockMove = {
	id: '04aa596e0421344f95c4dabb165d9053',
	name: 'Test Move',
	description: 'Test Description',
	imageUrl: 'https://example.com/image.jpg',
	videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
	contributorName: 'Test Contributor',
	category: { id: 'test-cat', name: 'Test Category' }
};

const mockData = {
	move: mockMove
};

describe('moves/[id]/+page.svelte', () => {
	it('should render the move name and category', async () => {
		render(MoveDetailPage, { data: mockData });

		await expect.element(page.getByText('Test Move')).toBeVisible();
		await expect.element(page.getByText('Test Category')).toBeVisible();
	});

	it('should have a share button that copies to clipboard when Web Share API is unavailable', async () => {
		const writeTextMock = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: writeTextMock
			},
			share: undefined
		});

		render(MoveDetailPage, { data: mockData });

		const shareButton = page.getByRole('button', { name: m.move_share_aria() });
		await expect.element(shareButton).toBeVisible();

		await shareButton.click();

		expect(writeTextMock).toHaveBeenCalledWith(window.location.href);
		await expect.element(page.getByText(m.move_copied())).toBeVisible();
	});

	it('should use Web Share API when available', async () => {
		const shareMock = vi.fn().mockResolvedValue(undefined);
		const canShareMock = vi.fn().mockReturnValue(true);

		vi.stubGlobal('navigator', {
			share: shareMock,
			canShare: canShareMock
		});

		render(MoveDetailPage, { data: mockData });

		const shareButton = page.getByRole('button', { name: m.move_share_aria() });
		await shareButton.click();

		expect(shareMock).toHaveBeenCalledWith({
			title: 'Test Move - AerialDB',
			text: 'Test Description',
			url: window.location.href
		});
	});

	it('should show no media message when no image or video', async () => {
		const noMediaData = {
			move: {
				...mockMove,
				imageUrl: null,
				videoUrl: null
			}
		};

		render(MoveDetailPage, { data: noMediaData });

		await expect.element(page.getByText('No media available')).toBeVisible();
	});

	it('should show video facade initially and load iframe on click', async () => {
		const { container } = render(MoveDetailPage, { data: mockData });

		// Check for the play button (facade)
		const playButton = container.querySelector('button[aria-label="Play video"]');
		expect(playButton).not.toBeNull();

		// Initially, there should be no iframe
		const iframeBefore = container.querySelector('iframe[title="Test Move"]');
		expect(iframeBefore).toBeNull();

		// Click the facade
		const playButtonEl = playButton as HTMLButtonElement;
		playButtonEl.click();

		// Wait for Svelte to update the DOM
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Now the iframe should be visible
		const iframeAfter = container.querySelector('iframe[title="Test Move"]');
		expect(iframeAfter).not.toBeNull();
		expect(iframeAfter?.getAttribute('src')).toContain('autoplay=1');

		// Facade should be gone
		const playButtonAfter = container.querySelector('button[aria-label="Play video"]');
		expect(playButtonAfter).toBeNull();
	});
});
