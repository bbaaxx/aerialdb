import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import type { RequestEvent } from '@sveltejs/kit';

// Type for Cloudflare platform
type CloudflarePlatform = {
	env: {
		DB: D1Database;
		IMAGES: R2Bucket;
	};
};

// Support both SvelteKit runtime and standalone scripts
let DATABASE_URL: string;

try {
	// Try SvelteKit env first
	const { env } = await import('$env/dynamic/private');
	DATABASE_URL = env.DATABASE_URL;
} catch {
	// Fallback to process.env for standalone scripts
	DATABASE_URL = process.env.DATABASE_URL || '';
}

// Local development database (SQLite via libsql)
const localClient = DATABASE_URL ? createClient({ url: DATABASE_URL }) : null;
const localDb = localClient ? drizzleLibsql(localClient, { schema }) : null;

/**
 * Get database instance based on environment
 * - In Cloudflare production: Uses D1 from platform.env
 * - In local development: Uses local SQLite
 */
export function getDb(event?: RequestEvent) {
	// Check if we're in Cloudflare environment
	const platform = event?.platform as CloudflarePlatform | undefined;

	if (platform?.env?.DB) {
		// Production: Use Cloudflare D1
		return drizzleD1(platform.env.DB, { schema });
	}

	// Development: Use local SQLite
	if (!localDb) {
		throw new Error('DATABASE_URL is not set for local development');
	}

	return localDb;
}

// Export default db for backwards compatibility (local dev only)
// Note: In Cloudflare, you must use getDb(event) instead
export const db = localDb!;
