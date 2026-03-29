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
			// Arrange & Act
			render(MoveCard, { props: { move: baseMove } });

			// Assert
			expect(document.body.innerText).toContain('Star');
		});

		it('renders category name', async () => {
			// Arrange & Act
			render(MoveCard, { props: { move: baseMove } });

			// Assert
			expect(document.body.innerText).toContain('Silks');
		});

		it('renders level badge when level is set', async () => {
			// Arrange
			const moveWithLevel = { ...baseMove, level: 'beginner' };

			// Act
			render(MoveCard, { props: { move: moveWithLevel } });

			// Assert
			expect(document.body.innerText).toContain('beginner');
		});

		it('hides level badge when level is null', async () => {
			// Arrange
			const moveWithNullLevel = { ...baseMove, level: null };

			// Act
			render(MoveCard, { props: { move: moveWithNullLevel } });

			// Assert
			// The level badge should not be visible for null level
			const levelElements = document.querySelectorAll('span');
			const levelText = Array.from(levelElements)
				.map((el) => el.textContent)
				.join(' ');
			expect(levelText).not.toContain('null');
		});

		it('hides level badge when level is undefined', async () => {
			// Arrange
			const moveWithUndefinedLevel = { ...baseMove, level: undefined };

			// Act
			render(MoveCard, { props: { move: moveWithUndefinedLevel } });

			// Assert
			// The level badge should not show any level text beyond "Silks" (category)
			expect(document.body.innerText).not.toContain('undefined');
		});

		it('renders image when imageUrl is set', async () => {
			// Arrange
			const moveWithImage = { ...baseMove, imageUrl: 'https://example.com/star.jpg' };

			// Act
			render(MoveCard, { props: { move: moveWithImage } });

			// Assert
			const img = document.querySelector('img');
			expect(img).not.toBeNull();
			expect(img?.getAttribute('src')).toBe('https://example.com/star.jpg');
		});

		it('renders placeholder when imageUrl is null', async () => {
			// Arrange
			const moveWithNullImage = { ...baseMove, imageUrl: null };

			// Act
			render(MoveCard, { props: { move: moveWithNullImage } });

			// Assert
			// Should show a placeholder div with an Image icon (not an img tag)
			const img = document.querySelector('img');
			expect(img).toBeNull();
			// The placeholder should be visible
			const placeholder = document.querySelector('.flex.items-center.justify-center');
			expect(placeholder).not.toBeNull();
		});

		it('renders placeholder when imageUrl is undefined', async () => {
			// Arrange
			const moveWithUndefinedImage = { ...baseMove, imageUrl: undefined };

			// Act
			render(MoveCard, { props: { move: moveWithUndefinedImage } });

			// Assert
			const img = document.querySelector('img');
			expect(img).toBeNull();
		});
	});

	describe('favorite button', () => {
		it('renders favorite button', async () => {
			// Arrange
			const handleFavorite = vi.fn();

			// Act
			render(MoveCard, { props: { move: baseMove, onToggleFavorite: handleFavorite } });

			// Assert
			const favoriteButton = document.querySelector('button');
			expect(favoriteButton).not.toBeNull();
		});

		it('shows "Save to Favorites" when not favorited', async () => {
			// Arrange
			const handleFavorite = vi.fn();

			// Act
			render(MoveCard, {
				props: { move: baseMove, isFavorited: false, onToggleFavorite: handleFavorite }
			});

			// Assert
			expect(document.body.innerText).toContain('Save to Favorites');
		});

		it('shows "Saved to Favorites" when favorited', async () => {
			// Arrange
			const handleFavorite = vi.fn();

			// Act
			render(MoveCard, {
				props: { move: baseMove, isFavorited: true, onToggleFavorite: handleFavorite }
			});

			// Assert
			expect(document.body.innerText).toContain('Saved to Favorites');
		});
	});

	describe('level badge styling', () => {
		it('applies beginner level classes correctly', async () => {
			// Arrange
			const beginnerMove = { ...baseMove, level: 'beginner' };

			// Act
			render(MoveCard, { props: { move: beginnerMove } });

			// Assert
			const levelBadge = document.querySelector('span.text-teal-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('beginner');
		});

		it('applies intermediate level classes correctly', async () => {
			// Arrange
			const intermediateMove = { ...baseMove, level: 'intermediate' };

			// Act
			render(MoveCard, { props: { move: intermediateMove } });

			// Assert
			const levelBadge = document.querySelector('span.text-blue-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('intermediate');
		});

		it('applies advanced level classes correctly', async () => {
			// Arrange
			const advancedMove = { ...baseMove, level: 'advanced' };

			// Act
			render(MoveCard, { props: { move: advancedMove } });

			// Assert
			const levelBadge = document.querySelector('span.text-purple-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('advanced');
		});

		it('applies professional level classes correctly', async () => {
			// Arrange
			const professionalMove = { ...baseMove, level: 'professional' };

			// Act
			render(MoveCard, { props: { move: professionalMove } });

			// Assert
			const levelBadge = document.querySelector('span.text-amber-400');
			expect(levelBadge).not.toBeNull();
			expect(levelBadge?.textContent).toBe('professional');
		});
	});

	describe('link generation', () => {
		it('generates correct href for move', async () => {
			// Arrange
			const move = { ...baseMove, id: 'move-123' };

			// Act
			render(MoveCard, { props: { move } });

			// Assert
			const link = document.querySelector('a[href="/moves/move-123"]');
			expect(link).not.toBeNull();
		});
	});
});
