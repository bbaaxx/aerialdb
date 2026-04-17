import { describe, it, expect } from 'vitest';
import { isValidRedirect } from './security';

describe('isValidRedirect', () => {
	it('should allow valid internal paths', () => {
		expect(isValidRedirect('/')).toBe(true);
		expect(isValidRedirect('/home')).toBe(true);
		expect(isValidRedirect('/moves/123')).toBe(true);
		expect(isValidRedirect('/admin?q=test')).toBe(true);
		expect(isValidRedirect('/auth/login?redirectTo=/admin')).toBe(true);
	});

	it('should reject null or empty', () => {
		expect(isValidRedirect(null)).toBe(false);
		expect(isValidRedirect('')).toBe(false);
	});

	it('should reject external URLs', () => {
		expect(isValidRedirect('https://google.com')).toBe(false);
		expect(isValidRedirect('http://google.com')).toBe(false);
		expect(isValidRedirect('//google.com')).toBe(false);
		expect(isValidRedirect('ftp://google.com')).toBe(false);
	});

	it('should reject potential open redirect bypasses', () => {
		// Some browsers treat /\ as //
		expect(isValidRedirect('/\\google.com')).toBe(false);
		expect(isValidRedirect('/\\/google.com')).toBe(false);

		// Some browsers might treat multiple slashes differently
		expect(isValidRedirect('///google.com')).toBe(false);

		// Control characters or other weirdness
		expect(isValidRedirect('/\tgoogle.com')).toBe(false);
		expect(isValidRedirect('/\ngoogle.com')).toBe(false);
		expect(isValidRedirect('/ google.com')).toBe(false);
		expect(isValidRedirect('/\rgoogle.com')).toBe(false);

		// Injection attempts
		expect(isValidRedirect('/path\r\nLocation: http://malicious.com')).toBe(false);
		expect(isValidRedirect('/path%0d%0aLocation: http://malicious.com')).toBe(true); // URL encoding is generally safe as it stays in path
	});

	it('should allow valid but tricky internal paths', () => {
		expect(isValidRedirect('/.git')).toBe(true);
		expect(isValidRedirect('/@username')).toBe(true);
		expect(isValidRedirect('/-dash')).toBe(true);
		expect(isValidRedirect('/_underscore')).toBe(true);
		expect(isValidRedirect('/path/with/../traversal')).toBe(true); // new URL resolves this to /path/traversal
	});
});
