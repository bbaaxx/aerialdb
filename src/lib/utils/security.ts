/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Only allow internal paths starting with a single '/' and not followed by another '/'.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url) return false;

	// Reject control characters and whitespace to prevent bypasses
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F\s]/.test(url)) return false;

	// Must start with exactly one '/'
	if (!url.startsWith('/') || url.startsWith('//')) return false;

	try {
		// Use URL constructor with a dummy base to ensure it's a valid relative path
		const base = 'http://localhost';
		const parsed = new URL(url, base);

		// If the origin changed, it's an external URL (e.g. /\\example.com)
		// We also check for backslashes explicitly because some environments might normalize them differently
		return parsed.origin === base && !url.includes('\\');
	} catch {
		return false;
	}
}

/**
 * Escapes special characters for SQLite LIKE queries.
 * Standard characters to escape are '%', '_', and the escape character itself.
 */
export function escapeLike(str: string): string {
	return str.replace(/[\\%_]/g, (match) => `\\${match}`);
}
