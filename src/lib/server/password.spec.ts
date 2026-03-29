import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
	describe('hashPassword', () => {
		it('returns a hash different from the input password', async () => {
			// Arrange
			const password = 'mySecurePassword123';

			// Act
			const hash = await hashPassword(password);

			// Assert
			expect(hash).not.toBe(password);
			expect(hash.length).toBeGreaterThan(password.length);
		});

		it('hash contains salt and hash parts separated by colon', async () => {
			// Arrange
			const password = 'testPassword';

			// Act
			const hash = await hashPassword(password);

			// Assert
			expect(hash).toMatch(/^[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
			const [salt, hashPart] = hash.split(':');
			expect(salt.length).toBeGreaterThan(0);
			expect(hashPart.length).toBeGreaterThan(0);
		});

		it('produces different hashes for the same password (due to random salt)', async () => {
			// Arrange
			const password = 'samePassword';

			// Act
			const [hash1, hash2] = await Promise.all([hashPassword(password), hashPassword(password)]);

			// Assert
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('verifyPassword', () => {
		it('returns true for correct password', async () => {
			// Arrange
			const password = 'correctPassword';
			const hash = await hashPassword(password);

			// Act
			const isValid = await verifyPassword(hash, password);

			// Assert
			expect(isValid).toBe(true);
		});

		it('returns false for incorrect password', async () => {
			// Arrange
			const correctPassword = 'correctPassword';
			const wrongPassword = 'wrongPassword';
			const hash = await hashPassword(correctPassword);

			// Act
			const isValid = await verifyPassword(hash, wrongPassword);

			// Assert
			expect(isValid).toBe(false);
		});

		it('returns false for empty password against valid hash', async () => {
			// Arrange
			const password = 'somePassword';
			const hash = await hashPassword(password);

			// Act
			const isValid = await verifyPassword(hash, '');

			// Assert
			expect(isValid).toBe(false);
		});

		it('returns false for invalid hash format', async () => {
			// Arrange
			const invalidHash = 'not-a-valid-hash-format';
			const password = 'anyPassword';

			// Act
			const isValid = await verifyPassword(invalidHash, password);

			// Assert
			expect(isValid).toBe(false);
		});

		it('returns false for hash without colon separator', async () => {
			// Arrange
			const malformedHash = 'justAHashWithoutSeparator';
			const password = 'anyPassword';

			// Act
			const isValid = await verifyPassword(malformedHash, password);

			// Assert
			expect(isValid).toBe(false);
		});

		it('handles special characters in password', async () => {
			// Arrange
			const specialPassword = 'P@$$w0rd!#%^&*()_+-=[]{}|;:,.<>?';
			const hash = await hashPassword(specialPassword);

			// Act
			const isValid = await verifyPassword(hash, specialPassword);

			// Assert
			expect(isValid).toBe(true);
		});

		it('handles unicode characters in password', async () => {
			// Arrange
			const unicodePassword = 'пароль密码パスワード🔐';
			const hash = await hashPassword(unicodePassword);

			// Act
			const isValid = await verifyPassword(hash, unicodePassword);

			// Assert
			expect(isValid).toBe(true);
		});
	});
});
