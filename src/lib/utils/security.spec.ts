import { describe, it, expect } from 'vitest';
import { isValidRedirect } from './security';

describe('isValidRedirect', () => {
    it('should allow valid internal paths', () => {
        expect(isValidRedirect('/')).toBe(true);
        expect(isValidRedirect('/dashboard')).toBe(true);
        expect(isValidRedirect('/moves/123')).toBe(true);
    });

    it('should reject null or empty', () => {
        expect(isValidRedirect(null)).toBe(false);
        expect(isValidRedirect('')).toBe(false);
    });

    it('should reject external URLs', () => {
        expect(isValidRedirect('https://google.com')).toBe(false);
        expect(isValidRedirect('http://google.com')).toBe(false);
        expect(isValidRedirect('//google.com')).toBe(false);
    });

    it('should reject potential bypasses', () => {
        expect(isValidRedirect('/\\google.com')).toBe(false);
        expect(isValidRedirect('\\\\google.com')).toBe(false);
        expect(isValidRedirect(' /dashboard')).toBe(false);
        expect(isValidRedirect('\n/dashboard')).toBe(false);
    });
});
