import { expect, test } from '@playwright/test';

test.describe('Category Management Focus UX', () => {
	test('should autofocus the "Add New Category" input and select text on Edit', async ({
		page
	}) => {
		await page.goto('/auth/login?redirectTo=/admin/categories');
		await page.getByRole('textbox', { name: 'Username' }).fill('admin');
		await page.locator('#password').fill('admin123');
		await page.getByRole('button', { name: 'Sign In' }).click();

		await expect(page.locator('#new-category-name')).toBeFocused();

		await page.getByRole('button', { name: 'Edit' }).first().click();
		const editInput = page.locator('form[action="?/updateCategory"] input[name="name"]');
		await expect(editInput).toBeFocused();

		const isSelected = await editInput.evaluate(
			(el: HTMLInputElement) => el.selectionStart === 0 && el.selectionEnd === el.value.length
		);
		expect(isSelected).toBe(true);
	});
});
