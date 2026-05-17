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

	it('should render a video facade initially and load the iframe after click', async () => {
		const { container } = render(MoveDetailPage, { data: mockData });

		// Initially, the iframe should NOT be present
		const iframeBefore = container.querySelector('iframe');
		expect(iframeBefore).toBeNull();

		// Initially, the play button (facade) SHOULD be present
		const playButton = page.getByRole('button', { name: 'Play video' });
		await expect.element(playButton).toBeVisible();

		// Click the play button
		const btn = container.querySelector('#play-video-button') as HTMLButtonElement;
		btn.click();

		// After click, the iframe SHOULD be present with autoplay=1
		// We use a polling expect for Vitest Browser to handle reactivity
		await expect
			.poll(() => container.querySelector('iframe'), {
				timeout: 1000,
				interval: 50
			})
			.not.toBeNull();

		const iframeAfter = container.querySelector('iframe');
		expect(iframeAfter?.src).toContain('autoplay=1');
		expect(iframeAfter?.src).toContain('dQw4w9WgXcQ');
	});
});
