import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from './schema';
import type { RequestEvent } from '@sveltejs/kit';

// Cloudflare types (stub for development)
interface D1Database {
	prepare(query: string): any;
	exec(query: string): Promise<any>;
}

interface R2Bucket {
	get(key: string): Promise<any>;
	put(key: string, value: any): Promise<any>;
}

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

// Common base type for both libsql (local) and D1 (Cloudflare) databases.
// Both extend BaseSQLiteDatabase<'async', ...>, so using any for TRunResult is safe
// since we only use query builder methods (select/insert/update/delete).
export type Database = BaseSQLiteDatabase<'async', any, typeof schema> & {
	batch<U extends [any, ...any[]]>(queries: U): Promise<U>;
};

/**
 * Get database instance based on environment
 * - In Cloudflare production/preview: Uses D1 from platform.env
 * - In local development: Uses local SQLite
 */
export function getDb(event?: RequestEvent): Database {
	// Check if we're in Cloudflare environment
	const platform = event?.platform as CloudflarePlatform | undefined;
	const isCloudflare = platform?.env?.DB && process.env.NODE_ENV !== 'development';

	if (isCloudflare) {
		// Cloudflare: Use D1 binding
		return drizzleD1(platform.env.DB, { schema }) as unknown as Database;
	}

	// Development: Use local SQLite
	if (!localDb) {
		throw new Error('DATABASE_URL is not set for local development');
	}

	return localDb as unknown as Database;
}

// Export default db for backwards compatibility (local dev only)
// Note: In Cloudflare, you must use getDb(event) instead
export const db = localDb as unknown as Database;
