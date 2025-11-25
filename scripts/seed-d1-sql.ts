/**
 * Generate SQL INSERT statements for Cloudflare D1 database
 * This script reads the TOON file and generates a seed.sql file
 * that can be executed on D1 using: npx wrangler d1 execute aerialdb-production --file=./seed.sql
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { parseToonFormat, extractCategories } from '../src/lib/utils/toon-parser.js';
import { hashPassword } from '../src/lib/server/password.js';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

// Simple ID generator
function generateId(length: number = 10): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return encodeBase32LowerCaseNoPadding(bytes);
}

// SQL escape function
function sqlEscape(value: string | null): string {
	if (value === null) return 'NULL';
	return `'${value.replace(/'/g, "''")}'`;
}

async function generateD1SQL() {
	console.error('🔧 Generating D1 SQL seed file...\n');

	const output: string[] = [];
	output.push('-- AerialDB Seed Data for Cloudflare D1');
	output.push('-- Generated: ' + new Date().toISOString());
	output.push('-- Total moves: 109\n');

	// 1. Create admin user
	console.error('👤 Generating admin user...');
	const adminUserId = generateId(10);
	const passwordHash = await hashPassword('admin123');

	output.push('-- Admin User');
	output.push('-- Username: admin, Password: admin123 (CHANGE THIS IN PRODUCTION!)');
	output.push(
		`INSERT INTO user (id, username, password_hash, age) VALUES (${sqlEscape(adminUserId)}, 'admin', ${sqlEscape(passwordHash)}, NULL);`
	);
	output.push('');

	// 2. Parse TOON file
	console.error('📖 Reading TOON file...');
	const toonPath = join(process.cwd(), 'db', 'db.toon');
	const toonContent = readFileSync(toonPath, 'utf-8');
	const toonMoves = parseToonFormat(toonContent);
	console.error(`✅ Parsed ${toonMoves.length} moves\n`);

	// 3. Extract and generate categories
	console.error('🏷️  Generating categories...');
	const categoryNames = extractCategories(toonMoves);
	const categoryMap = new Map<string, string>();

	output.push('-- Categories');
	for (const categoryName of categoryNames) {
		const categoryId = generateId(10);
		const timestamp = Date.now();

		output.push(
			`INSERT INTO categories (id, name, created_at) VALUES (${sqlEscape(categoryId)}, ${sqlEscape(categoryName)}, ${timestamp});`
		);

		categoryMap.set(categoryName, categoryId);
		console.error(`  ✓ ${categoryName}`);
	}
	output.push('');
	console.error(`✅ Generated ${categoryNames.length} categories\n`);

	// 4. Generate moves
	console.error('🤸 Generating moves...');
	output.push('-- Moves');

	let generatedCount = 0;
	const usedIds = new Set<string>();

	for (const toonMove of toonMoves) {
		const categoryId = categoryMap.get(toonMove.base);
		if (!categoryId) {
			console.error(`⚠️  Skipping move "${toonMove.figura}" - category not found`);
			continue;
		}

		const timestamp = Date.now();

		// Handle duplicate IDs by generating a new one
		let moveId = toonMove.id;
		if (usedIds.has(moveId)) {
			moveId = generateId(16); // Generate a new unique ID
			console.error(`  ⚠️  Duplicate ID detected for "${toonMove.figura}" (${toonMove.base}), generating new ID: ${moveId}`);
		}
		usedIds.add(moveId);

		output.push(
			`INSERT INTO moves (id, name, category_id, description, image_url, video_url, contributor_name, created_by, created_at, updated_at) VALUES (${sqlEscape(moveId)}, ${sqlEscape(toonMove.figura)}, ${sqlEscape(categoryId)}, ${sqlEscape(toonMove.descripcion)}, ${sqlEscape(toonMove.image)}, ${sqlEscape(toonMove.video)}, ${sqlEscape(toonMove.contributor)}, ${sqlEscape(adminUserId)}, ${timestamp}, ${timestamp});`
		);

		generatedCount++;

		if (generatedCount % 20 === 0) {
			console.error(`  ✓ Generated ${generatedCount} moves...`);
		}
	}

	console.error(`✅ Generated ${generatedCount} moves\n`);

	// Write to file
	const sqlContent = output.join('\n');
	return sqlContent;
}

// Run and output to stdout
generateD1SQL()
	.then((sql) => {
		console.error('✅ SQL generation completed!\n');
		console.log(sql);
	})
	.catch((error) => {
		console.error('❌ SQL generation failed:', error);
		process.exit(1);
	});
