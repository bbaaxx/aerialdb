/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Only allow internal paths starting with a single '/' and not followed by another '/' or '\'.
 * Rejects URLs containing whitespace or control characters to prevent bypasses.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url) return false;

	// Must start with exactly one '/' and not followed by another '/' or '\'
	// (Browsers may treat /\ as //)
	if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
		return false;
	}

	// Rejects URLs containing whitespace or control characters
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F\s]/.test(url)) {
		return false;
	}

	try {
		// Use URL constructor with a dummy base to verify it's a relative path
		// and doesn't escape to a different origin
		const base = 'http://localhost';
		const parsed = new URL(url, base);
		return parsed.origin === base && parsed.pathname.startsWith('/');
	} catch {
		return false;
	}
}
