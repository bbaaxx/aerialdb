import { describe, it, expect } from 'vitest';
import { parseToonFormat, extractCategories, type ToonMove } from './toon-parser';

describe('toon-parser', () => {
	describe('parseToonFormat', () => {
		it('parses a valid TOON string into structured move data', () => {
			// Arrange
			const validToon = `data[2]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
1,Star,Silks,An advanced inversion pose,null,null,Alice
2,Whip,Silks,A dynamic release move,images/whip.jpg,null,Bob`;

			// Act
			const moves = parseToonFormat(validToon);

			// Assert
			expect(moves).toHaveLength(2);

			expect(moves[0]).toEqual({
				id: '1',
				figura: 'Star',
				base: 'Silks',
				descripcion: 'An advanced inversion pose',
				image: null,
				video: null,
				contributor: 'Alice'
			});

			expect(moves[1]).toEqual({
				id: '2',
				figura: 'Whip',
				base: 'Silks',
				descripcion: 'A dynamic release move',
				image: 'images/whip.jpg',
				video: null,
				contributor: 'Bob'
			});
		});

		it('handles malformed TOON gracefully', () => {
			// Arrange - missing header
			const malformedToon = `This is not a valid TOON format
1,Star,Silks,desc,null,null,Alice`;

			// Act & Assert
			expect(() => parseToonFormat(malformedToon)).toThrow('Invalid TOON format: header not found');
		});

		it('handles empty lines and comments', () => {
			// Arrange
			const toonWithComments = `data[2]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
// This is a comment
1,Star,Silks,desc,null,null,Alice

2,Whip,Silks,desc2,null,null,Bob`;

			// Act
			const moves = parseToonFormat(toonWithComments);

			// Assert
			expect(moves).toHaveLength(2);
			expect(moves[0].figura).toBe('Star');
			expect(moves[1].figura).toBe('Whip');
		});

		it('extracts required vs optional fields correctly', () => {
			// Arrange
			const toon = `data[1]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
1,Star,Silks,desc,images/star.jpg,videos/star.mp4,Alice`;

			// Act
			const [move] = parseToonFormat(toon);

			// Assert - required fields
			expect(move.id).toBe('1');
			expect(move.figura).toBe('Star');
			expect(move.base).toBe('Silks');

			// Assert - optional fields
			expect(move.descripcion).toBe('desc');
			expect(move.image).toBe('images/star.jpg');
			expect(move.video).toBe('videos/star.mp4');
			expect(move.contributor).toBe('Alice');
		});

		it('handles null values for optional fields', () => {
			// Arrange
			const toon = `data[1]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
1,Star,Silks,null,null,null,null`;

			// Act
			const [move] = parseToonFormat(toon);

			// Assert - null values are properly converted to null (not the string "null")
			expect(move.descripcion).toBeNull();
			expect(move.image).toBeNull();
			expect(move.video).toBeNull();
			expect(move.contributor).toBeNull();
		});

		it('handles quoted strings with commas', () => {
			// Arrange
			const toon = `data[1]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
1,Star,Silks,"A complex, multi-part pose",null,null,Alice`;

			// Act
			const [move] = parseToonFormat(toon);

			// Assert
			expect(move.descripcion).toBe('A complex, multi-part pose');
		});

		it('warns on mismatched field count but continues parsing', () => {
			// Arrange - missing one field
			const toon = `data[2]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
1,Star,Silks,desc,images/star.jpg
2,Whip,Silks,desc2,images/whip.jpg,null,Bob`;

			// Act - should still parse the second row correctly
			const moves = parseToonFormat(toon);

			// Assert - second row should be parsed (first is skipped due to mismatch)
			expect(moves.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('extractCategories', () => {
		it('extracts unique categories from moves', () => {
			// Arrange
			const moves: ToonMove[] = [
				{
					id: '1',
					figura: 'Star',
					base: 'Silks',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				},
				{
					id: '2',
					figura: 'Whip',
					base: 'Silks',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				},
				{
					id: '3',
					figura: 'Bird',
					base: 'Lyra',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				},
				{
					id: '4',
					figura: 'Angel',
					base: 'Silks',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				}
			];

			// Act
			const categories = extractCategories(moves);

			// Assert
			expect(categories).toHaveLength(2);
			expect(categories).toEqual(['Lyra', 'Silks']); // Should be sorted alphabetically
		});

		it('handles empty moves array', () => {
			// Arrange
			const moves: ToonMove[] = [];

			// Act
			const categories = extractCategories(moves);

			// Assert
			expect(categories).toHaveLength(0);
		});

		it('ignores moves with empty base', () => {
			// Arrange
			const moves: ToonMove[] = [
				{
					id: '1',
					figura: 'Star',
					base: 'Silks',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				},
				{
					id: '2',
					figura: 'Ghost',
					base: '',
					descripcion: null,
					image: null,
					video: null,
					contributor: null
				}
			];

			// Act
			const categories = extractCategories(moves);

			// Assert
			expect(categories).toHaveLength(1);
			expect(categories[0]).toBe('Silks');
		});
	});
});
