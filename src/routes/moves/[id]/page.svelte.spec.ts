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
	level: 'intermediate',
	contributorName: 'Test Contributor',
	createdAt: new Date('2026-01-01T00:00:00Z'),
	updatedAt: new Date('2026-01-02T00:00:00Z'),
	category: { id: 'test-cat', name: 'Test Category' }
};

const mockData = {
	user: null,
	move: mockMove
};

describe('moves/[id]/+page.svelte', () => {
	it('should render the move name and category', async () => {
		render(MoveDetailPage, { data: mockData });

		await expect.element(page.getByText('Test Move')).toBeVisible();
		await expect.element(page.getByText('Test Category')).toBeVisible();
	});

	it('should render the difficulty level badge when present', async () => {
		render(MoveDetailPage, { data: mockData });

		await expect.element(page.getByText('intermediate')).toBeVisible();
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
			user: null,
			move: {
				...mockMove,
				imageUrl: null,
				videoUrl: null,
				level: null
			}
		};

		render(MoveDetailPage, { data: noMediaData });

		await expect.element(page.getByText('No media available')).toBeVisible();
	});

	it('should lazy-load the YouTube iframe after clicking the facade', async () => {
		const { container } = render(MoveDetailPage, { data: mockData });

		// Facade should be visible initially
		const playButton = container.querySelector('button[aria-label="Play video: Test Move"]');
		expect(playButton).not.toBeNull();

		// Click the play button
		await (playButton as HTMLButtonElement).click();

		// Wait for state transition and re-render
		await new Promise((r) => setTimeout(r, 100));

		// Play button should be removed from container
		const playButtonAfter = container.querySelector('button[aria-label="Play video: Test Move"]');
		expect(playButtonAfter).toBeNull();

		// Iframe should now be in the container
		const iframe = container.querySelector('iframe');
		expect(iframe).not.toBeNull();
		expect(iframe?.getAttribute('src')).toBe(
			'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'
		);
	});
});
