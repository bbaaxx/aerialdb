import 'dotenv/config';
import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { parseToonFormat, extractCategories } from '../src/lib/utils/toon-parser.js';

// Simple ID generator
function generateId(length: number = 10): string {
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return encodeBase32LowerCaseNoPadding(bytes);
}

async function initDatabase() {
	console.log('🚀 Initializing AerialDB...\n');

	const DATABASE_URL = process.env.DATABASE_URL;
	if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

	const client = createClient({ url: DATABASE_URL });
	const db = drizzle(client);

	// 1. Create tables
	console.log('📋 Creating database tables...');

	await client.execute(`
		CREATE TABLE IF NOT EXISTS user (
			id TEXT PRIMARY KEY NOT NULL,
			age INTEGER,
			username TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL
		)
	`);

	await client.execute(`
		CREATE TABLE IF NOT EXISTS session (
			id TEXT PRIMARY KEY NOT NULL,
			user_id TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id)
		)
	`);

	await client.execute(`
		CREATE TABLE IF NOT EXISTS categories (
			id TEXT PRIMARY KEY NOT NULL,
			name TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL
		)
	`);

	await client.execute(`
		CREATE TABLE IF NOT EXISTS moves (
			id TEXT PRIMARY KEY NOT NULL,
			name TEXT NOT NULL,
			category_id TEXT NOT NULL,
			description TEXT,
			image_url TEXT,
			video_url TEXT,
			contributor_name TEXT,
			created_by TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY (category_id) REFERENCES categories(id),
			FOREIGN KEY (created_by) REFERENCES user(id)
		)
	`);

	console.log('✅ Tables created\n');

	// 2. Create default admin user
	console.log('👤 Creating default admin user...');
	const adminUserId = generateId(10);
	const passwordHash = await hash('admin123', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	await client.execute({
		sql: 'INSERT INTO user (id, username, password_hash, age) VALUES (?, ?, ?, ?)',
		args: [adminUserId, 'admin', passwordHash, null]
	});

	console.log('✅ Admin user created (username: admin, password: admin123)');
	console.log('⚠️  IMPORTANT: Change this password in production!\n');

	// 3. Parse TOON file
	console.log('📖 Reading TOON file...');
	const toonPath = './db/db.toon';
	const toonContent = readFileSync(toonPath, 'utf-8');
	const toonMoves = parseToonFormat(toonContent);

	console.log(`✅ Parsed ${toonMoves.length} moves from TOON file\n`);

	// 4. Extract and insert categories
	console.log('🏷️  Creating categories...');
	const categoryNames = extractCategories(toonMoves);
	const categoryMap = new Map<string, string>();

	for (const categoryName of categoryNames) {
		const categoryId = generateId(10);
		await client.execute({
			sql: 'INSERT INTO categories (id, name, created_at) VALUES (?, ?, ?)',
			args: [categoryId, categoryName, Date.now()]
		});
		categoryMap.set(categoryName, categoryId);
		console.log(`  ✓ ${categoryName}`);
	}

	console.log(`\n✅ Created ${categoryNames.length} categories\n`);

	// 5. Insert moves
	console.log('🤸 Importing moves...');
	let importedCount = 0;
	const usedIds = new Set<string>();

	for (const toonMove of toonMoves) {
		const categoryId = categoryMap.get(toonMove.base);
		if (!categoryId) {
			console.warn(`⚠️  Skipping move "${toonMove.figura}" - category not found`);
			continue;
		}

		// Handle duplicate IDs (same move in multiple categories)
		let moveId = toonMove.id;
		if (usedIds.has(moveId)) {
			moveId = generateId(10); // Generate new ID for duplicate
			console.log(`  ⚠️  Duplicate ID for "${toonMove.figura}" - using new ID`);
		}
		usedIds.add(moveId);

		await client.execute({
			sql: `INSERT INTO moves (
				id, name, category_id, description, image_url, video_url,
				contributor_name, created_by, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			args: [
				moveId,
				toonMove.figura,
				categoryId,
				toonMove.descripcion,
				toonMove.image,
				toonMove.video,
				toonMove.contributor,
				adminUserId,
				Date.now(),
				Date.now()
			]
		});

		importedCount++;

		if (importedCount % 25 === 0) {
			console.log(`  ✓ Imported ${importedCount} moves...`);
		}
	}

	console.log(`\n✅ Imported ${importedCount} moves\n`);
	console.log('🎉 Database initialization completed!\n');
	console.log('📊 Summary:');
	console.log(`  - Admin user: admin / admin123`);
	console.log(`  - Categories: ${categoryNames.length}`);
	console.log(`  - Moves: ${importedCount}\n`);
	console.log('🚀 Ready to run: npm run dev');
}

initDatabase()
	.then(() => {
		console.log('\n✅ Initialization completed successfully');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ Initialization failed:', error);
		process.exit(1);
	});
