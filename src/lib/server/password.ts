/**
 * Password hashing utilities using Scrypt
 * Compatible with Cloudflare Workers/Pages
 */

import { scrypt } from '@noble/hashes/scrypt.js';
import { randomBytes } from '@noble/hashes/utils.js';
import { encodeBase64, decodeBase64 } from '@oslojs/encoding';

/**
 * Hash a password using Scrypt
 * Format: base64(salt):base64(hash)
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const hash = scrypt(password, salt, {
		N: 16384, // CPU/memory cost (2^14)
		r: 8, // Block size
		p: 1, // Parallelization
		dkLen: 32 // Derived key length
	});

	return `${encodeBase64(salt)}:${encodeBase64(hash)}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	const [saltB64, hashB64] = hash.split(':');
	if (!saltB64 || !hashB64) {
		return false;
	}

	const salt = decodeBase64(saltB64);
	const expectedHash = decodeBase64(hashB64);

	const actualHash = scrypt(password, salt, {
		N: 16384,
		r: 8,
		p: 1,
		dkLen: 32
	});

	// Constant-time comparison
	if (actualHash.length !== expectedHash.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < actualHash.length; i++) {
		result |= actualHash[i] ^ expectedHash[i];
	}

	return result === 0;
}
