import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MoveCard from './MoveCard.svelte';

describe('MoveCard', () => {
	const baseMove = {
		id: '1',
		name: 'Star',
		imageUrl: null as string | null,
		level: null as string | null,
		category: { id: 'cat-1', name: 'Silks' }
	};

	describe('rendering', () => {
		it('renders move name', async () => {
			const { container } = render(MoveCard, { move: baseMove });
			expect(container.textContent).toContain('Star');
		});

		it('renders category name', async () => {
			const { container } = render(MoveCard, { move: baseMove });
			expect(container.textContent).toContain('Silks');
		});

		it('renders level badge when level is set', async () => {
			const moveWithLevel = { ...baseMove, level: 'beginner' };
			const { container } = render(MoveCard, { move: moveWithLevel });
			expect(container.textContent).toContain('beginner');
		});

		it('hides level badge when level is null', async () => {
			const moveWithNullLevel = { ...baseMove, level: null };
			const { container } = render(MoveCard, { move: moveWithNullLevel });
			const levelElements = container.querySelectorAll('span');
			const levelText = Array.from(levelElements)
				.map((el) => el.textContent)
				.join(' ');
			expect(levelText).not.toContain('null');
		});

		it('hides level badge when level is undefined', async () => {
			const moveWithUndefinedLevel = {
				...baseMove,
				level: undefined
			} as unknown as typeof baseMove;
			const { container } = render(MoveCard, { move: moveWithUndefinedLevel });
			expect(container.textContent).not.toContain('undefined');
		});

		it('renders image when imageUrl is set', async () => {
			const moveWithImage = { ...baseMove, imageUrl: 'https://example.com/star.jpg' };
			const { container } = render(MoveCard, { move: moveWithImage });
			const img = container.querySelector('img');
			expect(img).not.toBeNull();
			expect(img?.getAttribute('src')).toBe('https://example.com/star.jpg');
			expect(img?.getAttribute('loading')).toBe('lazy');
			expect(img?.getAttribute('decoding')).toBe('async');
			expect(img?.getAttribute('class')).toContain('transition-transform');
			expect(img?.getAttribute('class')).toContain('group-hover:scale-105');
		});

		it('renders placeholder when imageUrl is null', async () => {
			const moveWithNullImage = { ...baseMove, imageUrl: null };
			const { container } = render(MoveCard, { move: moveWithNullImage });
			const img = container.querySelector('img');
			expect(img).toBeNull();
			const placeholder = container.querySelector('.flex.items-center.justify-center');
			expect(placeholder).not.toBeNull();
		});

		it('renders placeholder when imageUrl is undefined', async () => {
			const moveWithUndefinedImage = {
				...baseMove,
				imageUrl: undefined
			} as unknown as typeof baseMove;
			const { container } = render(MoveCard, { move: moveWithUndefinedImage });
			const img = container.querySelector('img');
			expect(img).toBeNull();
		});
	});

	describe('favorite button', () => {
		it('renders favorite button', async () => {
			const handleFavorite = vi.fn();
			const { container } = render(MoveCard, { move: baseMove, onToggleFavorite: handleFavorite });
			const favoriteButton = container.querySelector('button');
			expect(favoriteButton).not.toBeNull();
		});

		it('shows "Save to Favorites" when not favorited', async () => {
			const handleFavorite = vi.fn();
			const { container } = render(MoveCard, {
				move: baseMove,
				isFavorited: false,
				onToggleFavorite: handleFavorite
			});
			expect(container.textContent).toContain('Save to Favorites');
		});

		it('shows "Saved to Favorites" when favorited', async () => {
			const handleFavorite = vi.fn();
			const { container } = render(MoveCard, {
				move: baseMove,
				isFavorited: true,
				onToggleFavorite: handleFavorite
			});
			expect(container.textContent).toContain('Saved to Favorites');
		});
	});

	describe('level badge styling', () => {
		it('applies beginner level classes correctly', async () => {
			const beginnerMove = { ...baseMove, level: 'beginner' };
			const { container } = render(MoveCard, { move: beginnerMove });
			const levelBadge = container.querySelector('span.text-teal-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('beginner');
		});

		it('applies intermediate level classes correctly', async () => {
			const intermediateMove = { ...baseMove, level: 'intermediate' };
			const { container } = render(MoveCard, { move: intermediateMove });
			const levelBadge = container.querySelector('span.text-blue-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('intermediate');
		});

		it('applies advanced level classes correctly', async () => {
			const advancedMove = { ...baseMove, level: 'advanced' };
			const { container } = render(MoveCard, { move: advancedMove });
			const levelBadge = container.querySelector('span.text-purple-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('advanced');
		});

		it('applies professional level classes correctly', async () => {
			const professionalMove = { ...baseMove, level: 'professional' };
			const { container } = render(MoveCard, { move: professionalMove });
			const levelBadge = container.querySelector('span.text-amber-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('professional');
		});
	});

	describe('link generation', () => {
		it('generates correct href for move', async () => {
			const move = { ...baseMove, id: 'move-123' };
			const { container } = render(MoveCard, { move });
			const link = container.querySelector('a[href="/moves/move-123"]');
			expect(link).not.toBeNull();
		});
	});
});
