/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Only allow internal paths starting with a single '/' and not followed by another '/' or '\'.
 * Uses the URL constructor to ensure origin consistency.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url || typeof url !== 'string') return false;

	// Block URLs with leading/trailing whitespace or control characters
	if (url.trim() !== url) return false;
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F]/.test(url)) return false;

	// Must start with exactly one '/' and not a '\' (which some browsers treat as '/')
	if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
		return false;
	}

	try {
		// Use a dummy base to check if the URL resolves to the same origin
		const base = 'http://localhost';
		const parsed = new URL(url, base);
		return parsed.origin === base;
	} catch {
		return false;
	}
}
