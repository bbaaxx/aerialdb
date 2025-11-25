/**
 * Test password verification
 */
import { verifyPassword } from '../src/lib/server/password.js';

async function testVerify() {
	const hash = 'qBeQkhIAlV5xLK0uqr0qig==:beZwcj/8Ib1j8cpqiogBXn0d8itA8hsMWbbEZvWTKUc=';
	const password = 'admin123';

	console.log('Testing password verification...');
	console.log('Hash:', hash);
	console.log('Password:', password);

	const isValid = await verifyPassword(hash, password);
	console.log('Verification result:', isValid);

	if (!isValid) {
		console.error('❌ Password verification FAILED!');
		process.exit(1);
	} else {
		console.log('✅ Password verification SUCCESS!');
	}
}

testVerify();
