import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MoveDetailPage from './+page.svelte';

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

	it('should have a share button that copies to clipboard', async () => {
		// Mock clipboard API
		const writeTextMock = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', {
			clipboard: {
				writeText: writeTextMock
			}
		});

		render(MoveDetailPage, { data: mockData });

		const shareButton = page.getByRole('button', { name: 'Share this move' });
		await expect.element(shareButton).toBeVisible();

		await shareButton.click();

		expect(writeTextMock).toHaveBeenCalled();
		// It should show "Copied!" after clicking
		await expect.element(page.getByText('Copied!')).toBeVisible();
	});

	it('should show ImageOff icon when no media is available', async () => {
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
});
