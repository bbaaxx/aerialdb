import { describe, it, expect } from 'vitest';
import { isValidRedirect } from './security';

describe('isValidRedirect', () => {
	it('should allow valid internal paths', () => {
		expect(isValidRedirect('/')).toBe(true);
		expect(isValidRedirect('/home')).toBe(true);
		expect(isValidRedirect('/moves/123')).toBe(true);
		expect(isValidRedirect('/auth/login?redirectTo=/admin')).toBe(true);
	});

	it('should reject null or empty strings', () => {
		expect(isValidRedirect(null)).toBe(false);
		expect(isValidRedirect('')).toBe(false);
	});

	it('should reject external URLs starting with http/https', () => {
		expect(isValidRedirect('http://google.com')).toBe(false);
		expect(isValidRedirect('https://google.com')).toBe(false);
	});

	it('should reject protocol-relative URLs (//)', () => {
		expect(isValidRedirect('//google.com')).toBe(false);
	});

	it('should reject bypass attempts with backslashes', () => {
		// /\google.com can be interpreted as //google.com by some browsers
		expect(isValidRedirect('/\\google.com')).toBe(false);
		expect(isValidRedirect('\\/google.com')).toBe(false);
	});

	it('should reject URLs with leading whitespace or control characters', () => {
		expect(isValidRedirect(' /home')).toBe(false);
		expect(isValidRedirect('\n/home')).toBe(false);
		expect(isValidRedirect('\t/home')).toBe(false);
	});
});
