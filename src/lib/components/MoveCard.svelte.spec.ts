import { describe, it, expect, vi, beforeEach } from 'vitest';
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

	function createMoveProps(move: typeof baseMove) {
		return { move };
	}

	describe('rendering', () => {
		it('renders move name', async () => {
			const target = document.createElement('div');
			render(MoveCard, { target, props: createMoveProps(baseMove) });
			expect(target.textContent).toContain('Star');
		});

		it('renders category name', async () => {
			const target = document.createElement('div');
			render(MoveCard, { target, props: createMoveProps(baseMove) });
			expect(target.textContent).toContain('Silks');
		});

		it('renders level badge when level is set', async () => {
			const target = document.createElement('div');
			const moveWithLevel = { ...baseMove, level: 'beginner' };
			render(MoveCard, { target, props: createMoveProps(moveWithLevel) });
			expect(target.textContent).toContain('beginner');
		});

		it('hides level badge when level is null', async () => {
			const target = document.createElement('div');
			const moveWithNullLevel = { ...baseMove, level: null };
			render(MoveCard, { target, props: createMoveProps(moveWithNullLevel) });
			const levelElements = target.querySelectorAll('span');
			const levelText = Array.from(levelElements)
				.map((el) => el.textContent)
				.join(' ');
			expect(levelText).not.toContain('null');
		});

		it('hides level badge when level is undefined', async () => {
			const target = document.createElement('div');
			const moveWithUndefinedLevel = {
				...baseMove,
				level: undefined
			} as unknown as typeof baseMove;
			render(MoveCard, { target, props: createMoveProps(moveWithUndefinedLevel) });
			expect(target.textContent).not.toContain('undefined');
		});

		it('renders image when imageUrl is set', async () => {
			const target = document.createElement('div');
			const moveWithImage = { ...baseMove, imageUrl: 'https://example.com/star.jpg' };
			render(MoveCard, { target, props: createMoveProps(moveWithImage) });
			const img = target.querySelector('img');
			expect(img).not.toBeNull();
			expect(img?.getAttribute('src')).toBe('https://example.com/star.jpg');
		});

		it('renders placeholder when imageUrl is null', async () => {
			const target = document.createElement('div');
			const moveWithNullImage = { ...baseMove, imageUrl: null };
			render(MoveCard, { target, props: createMoveProps(moveWithNullImage) });
			const img = target.querySelector('img');
			expect(img).toBeNull();
			const placeholder = target.querySelector('.flex.items-center.justify-center');
			expect(placeholder).not.toBeNull();
		});

		it('renders placeholder when imageUrl is undefined', async () => {
			const target = document.createElement('div');
			const moveWithUndefinedImage = {
				...baseMove,
				imageUrl: undefined
			} as unknown as typeof baseMove;
			render(MoveCard, { target, props: createMoveProps(moveWithUndefinedImage) });
			const img = target.querySelector('img');
			expect(img).toBeNull();
		});
	});

	describe('favorite button', () => {
		it('renders favorite button', async () => {
			const target = document.createElement('div');
			const handleFavorite = vi.fn();
			render(MoveCard, { target, props: { move: baseMove, onToggleFavorite: handleFavorite } });
			const favoriteButton = target.querySelector('button');
			expect(favoriteButton).not.toBeNull();
		});

		it('shows "Save to Favorites" when not favorited', async () => {
			const target = document.createElement('div');
			const handleFavorite = vi.fn();
			render(MoveCard, {
				target,
				props: { move: baseMove, isFavorited: false, onToggleFavorite: handleFavorite }
			});
			expect(target.textContent).toContain('Save to Favorites');
		});

		it('shows "Saved to Favorites" when favorited', async () => {
			const target = document.createElement('div');
			const handleFavorite = vi.fn();
			render(MoveCard, {
				target,
				props: { move: baseMove, isFavorited: true, onToggleFavorite: handleFavorite }
			});
			expect(target.textContent).toContain('Saved to Favorites');
		});
	});

	describe('level badge styling', () => {
		it('applies beginner level classes correctly', async () => {
			const target = document.createElement('div');
			const beginnerMove = { ...baseMove, level: 'beginner' };
			render(MoveCard, { target, props: createMoveProps(beginnerMove) });
			const levelBadge = target.querySelector('span.text-teal-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('beginner');
		});

		it('applies intermediate level classes correctly', async () => {
			const target = document.createElement('div');
			const intermediateMove = { ...baseMove, level: 'intermediate' };
			render(MoveCard, { target, props: createMoveProps(intermediateMove) });
			const levelBadge = target.querySelector('span.text-blue-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('intermediate');
		});

		it('applies advanced level classes correctly', async () => {
			const target = document.createElement('div');
			const advancedMove = { ...baseMove, level: 'advanced' };
			render(MoveCard, { target, props: createMoveProps(advancedMove) });
			const levelBadge = target.querySelector('span.text-purple-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('advanced');
		});

		it('applies professional level classes correctly', async () => {
			const target = document.createElement('div');
			const professionalMove = { ...baseMove, level: 'professional' };
			render(MoveCard, { target, props: createMoveProps(professionalMove) });
			const levelBadge = target.querySelector('span.text-amber-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('professional');
		});
	});

	describe('link generation', () => {
		it('generates correct href for move', async () => {
			const target = document.createElement('div');
			const move = { ...baseMove, id: 'move-123' };
			render(MoveCard, { target, props: createMoveProps(move) });
			const link = target.querySelector('a[href="/moves/move-123"]');
			expect(link).not.toBeNull();
		});
	});
});
