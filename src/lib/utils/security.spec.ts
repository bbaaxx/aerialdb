import { describe, it, expect } from 'vitest';
import { isValidRedirect } from './security';

describe('isValidRedirect', () => {
	it('validates internal and external paths correctly', () => {
		expect(isValidRedirect('/')).toBe(true);
		expect(isValidRedirect('/dashboard')).toBe(true);
		expect(isValidRedirect(null)).toBe(false);
		expect(isValidRedirect('')).toBe(false);
		expect(isValidRedirect('https://google.com')).toBe(false);
		expect(isValidRedirect('//google.com')).toBe(false);
	});

	it('rejects bypass payloads', () => {
		expect(isValidRedirect('/\\google.com')).toBe(false);
		expect(isValidRedirect('/ google.com')).toBe(false);
		expect(isValidRedirect('/\t/google.com')).toBe(false);
		expect(isValidRedirect('/\n/google.com')).toBe(false);
		expect(isValidRedirect('javascript:alert(1)')).toBe(false);
	});
});
