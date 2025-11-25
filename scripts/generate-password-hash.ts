/**
 * Generate a Scrypt password hash for updating the database
 */
import { hashPassword } from '../src/lib/server/password.js';

async function generateHash() {
	const password = 'admin123';
	const hash = await hashPassword(password);
	console.log('Password:', password);
	console.log('Hash:', hash);
}

generateHash();
