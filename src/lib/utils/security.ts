/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Only allow internal paths starting with a single '/' and not followed by another '/'.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url || typeof url !== 'string') return false;

	// Must start with '/'
	if (!url.startsWith('/')) return false;

	// Block common bypasses at the start: //, /\, / (whitespace/control)
	if (url.length > 1) {
		const secondChar = url.charCodeAt(1);
		// If second character is / (47), \ (92), or <= space (32)
		if (secondChar === 47 || secondChar === 92 || secondChar <= 32) {
			return false;
		}
	}

	// Ensure no control characters or newlines in the entire string
	// to prevent header injection or other bypasses.
	// eslint-disable-next-line no-control-regex
	if (/[\x00-\x1F\x7F]/.test(url)) {
		return false;
	}

	try {
		// Use a dummy base to check if it remains an internal path
		const base = 'http://localhost';
		const resolved = new URL(url, base);

		// If the origin changed, it's an external redirect
		return resolved.origin === base;
	} catch {
		return false;
	}
}
