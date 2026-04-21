/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Hardened to reject protocol-relative URLs, backslashes, whitespace, and control characters.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url || typeof url !== 'string') return false;

	// Must start with exactly one '/'
	if (!url.startsWith('/') || url.startsWith('//')) return false;

	// Reject backslashes (bypass for /), whitespace, and control characters
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F\s\\]/.test(url)) return false;

	try {
		// Use a dummy base to verify it's a relative path and doesn't change origin
		const base = 'https://example.com';
		const resolved = new URL(url, base);

		// If it's a valid internal redirect, the origin must match our dummy base
		// and it should still be a path starting with /
		return resolved.origin === base && resolved.pathname.startsWith('/');
	} catch {
		return false;
	}
}
