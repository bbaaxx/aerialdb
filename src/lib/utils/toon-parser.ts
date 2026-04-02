/**
 * TOON Format Parser
 * Parses the TOON format used for aerial moves database
 *
 * Format: data[count]{fields}: row1, row2, row3...
 * Example: data[109]{Id,Figura,Base,Descripcion,Image,Video,Contributor}: ...
 */

export interface ToonMove {
	id: string;
	figura: string; // Move name
	base: string; // Category
	descripcion: string | null;
	image: string | null;
	video: string | null;
	contributor: string | null;
}

export function parseToonFormat(toonContent: string): ToonMove[] {
	const lines = toonContent.trim().split('\n');

	// Parse header: data[109]{Id,Figura,Base,Descripcion,Image,Video,Contributor}:
	const headerLine = lines[0];
	const headerMatch = headerLine.match(/data\[(\d+)\]\{(.+)\}:/);

	if (!headerMatch) {
		throw new Error('Invalid TOON format: header not found');
	}

	const expectedCount = parseInt(headerMatch[1]);
	const fields = headerMatch[2].split(',');

	// Parse data rows
	const moves: ToonMove[] = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.startsWith('//')) continue; // Skip empty lines and comments

		// Split by comma, but handle quoted strings
		const values = parseCSVLine(line);

		if (values.length !== fields.length) {
			console.warn(`Line ${i}: Expected ${fields.length} fields, got ${values.length}`);
			continue;
		}

		const move: ToonMove = {
			id: values[0],
			figura: values[1],
			base: values[2],
			descripcion: values[3] === 'null' ? null : values[3],
			image: values[4] === 'null' ? null : values[4],
			video: values[5] === 'null' ? null : values[5],
			contributor: values[6] === 'null' ? null : values[6]
		};

		moves.push(move);
	}

	if (moves.length !== expectedCount) {
		console.warn(`Expected ${expectedCount} moves, parsed ${moves.length}`);
	}

	return moves;
}

/**
 * Parse a CSV line handling quoted strings
 */
function parseCSVLine(line: string): string[] {
	const values: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === ',' && !inQuotes) {
			values.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}

	// Push the last value
	if (current) {
		values.push(current.trim());
	}

	return values;
}

/**
 * Extract unique categories from moves
 */
export function extractCategories(moves: ToonMove[]): string[] {
	const categories = new Set<string>();
	moves.forEach((move) => {
		if (move.base) {
			categories.add(move.base);
		}
	});
	return Array.from(categories).sort();
}
