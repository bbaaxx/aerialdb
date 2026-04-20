import { describe, it, expect } from 'vitest';
import { isValidRedirect } from './security';

describe('isValidRedirect', () => {
	it('validates internal paths and rejects malicious bypasses', () => {
		// Valid
		expect(isValidRedirect('/')).toBe(true);
		expect(isValidRedirect('/admin?q=1')).toBe(true);
		// Invalid: null/empty/external
		expect(isValidRedirect(null)).toBe(false);
		expect(isValidRedirect('')).toBe(false);
		expect(isValidRedirect('https://evil.com')).toBe(false);
		expect(isValidRedirect('//evil.com')).toBe(false);
		// Invalid: bypass attempts
		expect(isValidRedirect('/\\evil.com')).toBe(false);
		expect(isValidRedirect('/\n/evil.com')).toBe(false);
		expect(isValidRedirect('/ ')).toBe(false);
		expect(isValidRedirect('evil.com')).toBe(false);
	});
});
