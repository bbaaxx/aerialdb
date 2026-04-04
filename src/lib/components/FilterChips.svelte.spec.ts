import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FilterChips from './FilterChips.svelte';

describe('FilterChips', () => {
	const categories = [
		{ id: '1', name: 'Silks' },
		{ id: '2', name: 'Hoop' }
	];

	it('renders category buttons with correct aria-pressed state', async () => {
		const { container } = render(FilterChips, {
			categories,
			activeApparatus: '1',
			activeLevel: null,
			onSelectApparatus: vi.fn(),
			onSelectLevel: vi.fn()
		});

		const silkButton = Array.from(container.querySelectorAll('button')).find((b) =>
			b.textContent?.includes('Silks')
		);
		const hoopButton = Array.from(container.querySelectorAll('button')).find((b) =>
			b.textContent?.includes('Hoop')
		);

		expect(silkButton?.getAttribute('aria-pressed')).toBe('true');
		expect(hoopButton?.getAttribute('aria-pressed')).toBe('false');
	});

	it('renders level buttons with correct aria-pressed state', async () => {
		const { container } = render(FilterChips, {
			categories,
			activeApparatus: null,
			activeLevel: 'beginner',
			onSelectApparatus: vi.fn(),
			onSelectLevel: vi.fn()
		});

		const beginnerButton = Array.from(container.querySelectorAll('button')).find(
			(b) => b.textContent?.trim() === 'Beginner'
		);
		const intermediateButton = Array.from(container.querySelectorAll('button')).find(
			(b) => b.textContent?.trim() === 'Intermediate'
		);

		expect(beginnerButton?.getAttribute('aria-pressed')).toBe('true');
		expect(intermediateButton?.getAttribute('aria-pressed')).toBe('false');
	});

	it('has role="group" and aria-labelledby for filter sections', async () => {
		const { container } = render(FilterChips, {
			categories,
			activeApparatus: null,
			activeLevel: null,
			onSelectApparatus: vi.fn(),
			onSelectLevel: vi.fn()
		});

		const groups = container.querySelectorAll('[role="group"]');
		expect(groups.length).toBe(2);

		expect(groups[0].getAttribute('aria-labelledby')).toBe('base-technique-label');
		expect(groups[1].getAttribute('aria-labelledby')).toBe('level-label');

		expect(container.querySelector('#base-technique-label')).not.toBeNull();
		expect(container.querySelector('#level-label')).not.toBeNull();
	});
});
