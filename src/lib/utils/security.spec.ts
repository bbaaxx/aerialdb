import { describe, it, expect } from 'vitest';
import { isValidRedirect, escapeLike } from './security';

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

describe('escapeLike', () => {
	it('escapes SQLite LIKE special characters', () => {
		expect(escapeLike('normal')).toBe('normal');
		expect(escapeLike('100%')).toBe('100\\%');
		expect(escapeLike('user_name')).toBe('user\\_name');
		expect(escapeLike('backslash\\')).toBe('backslash\\\\');
		expect(escapeLike('%_%')).toBe('\\%\\_\\%');
	});
});
