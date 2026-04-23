/**
 * Password hashing utilities using Scrypt
 * Compatible with Cloudflare Workers/Pages
 */

import { scrypt } from '@noble/hashes/scrypt.js';
import { randomBytes } from '@noble/hashes/utils.js';
import { encodeBase64, decodeBase64 } from '@oslojs/encoding';

/**
 * Dummy hash used to mitigate timing attacks by performing a fake verification
 * when a user is not found.
 */
export const dummyPasswordHash =
	'Vt3YfpHilRAHxeCnmdqk7Q==:b+jvCaSk7N4a0qT4glCxj44wAujtWN8nuk48Vlnxuws=';

/**
 * Hash a password using Scrypt
 * Format: base64(salt):base64(hash)
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);
	const hash = scrypt(password, salt, {
		N: 4096, // CPU/memory cost (2^12) - reduced for Cloudflare Workers
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
		N: 4096, // Must match hashPassword parameters
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
