/**
 * Security utilities
 */

/**
 * Validates a redirect URL to prevent Open Redirect vulnerabilities.
 * Only allow internal paths starting with a single '/' and not followed by another '/'.
 */
export function isValidRedirect(url: string | null): url is string {
	if (!url) return false;
	return url.startsWith('/') && !url.startsWith('//');
}
