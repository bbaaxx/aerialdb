import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from './index.js';
import { categories, moves, user } from './schema.js';
import { parseToonFormat, extractCategories } from '$lib/utils/toon-parser.js';
import { hashPassword } from '../password.js';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

// Simple ID generator
function generateId(length: number = 10): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return encodeBase32LowerCaseNoPadding(bytes);
}

/**
 * Seed database with initial data:
 * 1. Create default admin user
 * 2. Import categories from TOON file
 * 3. Import moves from TOON file
 */
export async function seedDatabase() {
	console.log('🌱 Starting database seed...');

	// 1. Create default admin user
	console.log('👤 Creating default admin user...');
	const adminUserId = generateId(10);
	const passwordHash = await hashPassword('admin123');

	await db.insert(user).values({
		id: adminUserId,
		username: 'admin',
		passwordHash,
		age: null,
		role: 'admin'
	});

	console.log('✅ Admin user created (username: admin, password: admin123)');
	console.log('⚠️  IMPORTANT: Change this password in production!');

	// 2. Parse TOON file
	console.log('📖 Reading TOON file...');
	const toonPath = join(process.cwd(), 'db', 'db.toon');
	const toonContent = readFileSync(toonPath, 'utf-8');
	const toonMoves = parseToonFormat(toonContent);

	console.log(`✅ Parsed ${toonMoves.length} moves from TOON file`);

	// 3. Extract and insert categories
	console.log('🏷️  Extracting categories...');
	const categoryNames = extractCategories(toonMoves);
	const categoryMap = new Map<string, string>();

	for (const categoryName of categoryNames) {
		const categoryId = generateId(10);
		await db.insert(categories).values({
			id: categoryId,
			name: categoryName,
			createdAt: new Date()
		});
		categoryMap.set(categoryName, categoryId);
		console.log(`  ✓ Created category: ${categoryName}`);
	}

	console.log(`✅ Created ${categoryNames.length} categories`);

	// 4. Insert moves
	console.log('🤸 Importing moves...');
	let importedCount = 0;

	// Deterministic level distribution: ~30% beginner, ~40% intermediate, ~30% advanced
	const levelDistribution: Array<'beginner' | 'intermediate' | 'advanced'> = [
		'beginner',
		'beginner',
		'beginner',
		'intermediate',
		'intermediate',
		'intermediate',
		'intermediate',
		'advanced',
		'advanced',
		'advanced'
	];
	const levelCounts = new Map<string, number>([
		['beginner', 0],
		['intermediate', 0],
		['advanced', 0]
	]);

	for (const toonMove of toonMoves) {
		const categoryId = categoryMap.get(toonMove.base);
		if (!categoryId) {
			console.warn(`⚠️  Skipping move "${toonMove.figura}" - category not found`);
			continue;
		}

		const level = levelDistribution[importedCount % levelDistribution.length];

		await db.insert(moves).values({
			id: generateId(10), // Generate unique ID (TOON IDs may have duplicates)
			name: toonMove.figura,
			categoryId,
			level,
			description: toonMove.descripcion,
			imageUrl: toonMove.image,
			videoUrl: toonMove.video,
			contributorName: toonMove.contributor,
			createdBy: adminUserId,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		levelCounts.set(level, (levelCounts.get(level) ?? 0) + 1);

		importedCount++;

		if (importedCount % 10 === 0) {
			console.log(`  ✓ Imported ${importedCount} moves...`);
		}
	}

	console.log(`✅ Imported ${importedCount} moves`);
	console.log('🎉 Database seed completed!');
	console.log('');
	console.log('📊 Summary:');
	console.log(`  - Admin user: admin / admin123`);
	console.log(`  - Categories: ${categoryNames.length}`);
	console.log(`  - Moves: ${importedCount}`);
	console.log(`  - Level distribution:`);
	for (const [lvl, count] of levelCounts) {
		const pct = importedCount > 0 ? ((count / importedCount) * 100).toFixed(1) : '0.0';
		console.log(`    ${lvl}: ${count} (${pct}%)`);
	}
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase()
		.then(() => {
			console.log('✅ Seed completed successfully');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Seed failed:', error);
			process.exit(1);
		});
}
