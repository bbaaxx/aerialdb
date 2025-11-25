<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state(form?.username || '');
	let password = $state('');
	let confirmPassword = $state('');
	let isSubmitting = $state(false);

	// Client-side validation states
	let usernameError = $state('');
	let passwordError = $state('');
	let confirmPasswordError = $state('');

	function validateUsernameClient(value: string) {
		if (!value) {
			usernameError = 'Username is required';
			return false;
		}
		if (value.length < 3) {
			usernameError = 'Username must be at least 3 characters';
			return false;
		}
		if (value.length > 31) {
			usernameError = 'Username must be no more than 31 characters';
			return false;
		}
		if (!/^[a-z0-9_-]+$/.test(value)) {
			usernameError = 'Username can only contain lowercase letters, numbers, hyphens, and underscores';
			return false;
		}
		usernameError = '';
		return true;
	}

	function validatePasswordClient(value: string) {
		if (!value) {
			passwordError = 'Password is required';
			return false;
		}
		if (value.length < 6) {
			passwordError = 'Password must be at least 6 characters';
			return false;
		}
		if (value.length > 255) {
			passwordError = 'Password must be no more than 255 characters';
			return false;
		}
		passwordError = '';
		return true;
	}

	function validateConfirmPasswordClient(value: string) {
		if (!value) {
			confirmPasswordError = 'Please confirm your password';
			return false;
		}
		if (value !== password) {
			confirmPasswordError = 'Passwords do not match';
			return false;
		}
		confirmPasswordError = '';
		return true;
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-2xl shadow-xl p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
				<p class="text-gray-600">Sign up to get started</p>
			</div>

			<!-- Form -->
			<form
				method="post"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<!-- Global Error Message -->
				{#if form?.message && !('field' in form)}
					<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm text-red-800">{form.message}</p>
					</div>
				{/if}

				<!-- Username Field -->
				<div class="mb-5">
					<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						bind:value={username}
						onblur={() => validateUsernameClient(username)}
						oninput={() => {
							if (usernameError || (form && 'field' in form && form.field === 'username')) {
								validateUsernameClient(username);
							}
						}}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
						class:border-red-500={usernameError || (form && 'field' in form && form.field === 'username')}
						class:bg-red-50={usernameError || (form && 'field' in form && form.field === 'username')}
						disabled={isSubmitting}
					/>
					{#if usernameError}
						<p class="mt-2 text-sm text-red-600">{usernameError}</p>
					{:else if form && 'field' in form && form.field === 'username' && form?.message}
						<p class="mt-2 text-sm text-red-600">{form.message}</p>
					{:else}
						<p class="mt-2 text-xs text-gray-500">
							3-31 characters, lowercase letters, numbers, hyphens, and underscores only
						</p>
					{/if}
				</div>

				<!-- Password Field -->
				<div class="mb-5">
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						bind:value={password}
						onblur={() => validatePasswordClient(password)}
						oninput={() => {
							if (passwordError || (form && 'field' in form && form.field === 'password')) {
								validatePasswordClient(password);
							}
							if (confirmPassword) {
								validateConfirmPasswordClient(confirmPassword);
							}
						}}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
						class:border-red-500={passwordError || (form && 'field' in form && form.field === 'password')}
						class:bg-red-50={passwordError || (form && 'field' in form && form.field === 'password')}
						disabled={isSubmitting}
					/>
					{#if passwordError}
						<p class="mt-2 text-sm text-red-600">{passwordError}</p>
					{:else if form && 'field' in form && form.field === 'password' && form?.message}
						<p class="mt-2 text-sm text-red-600">{form.message}</p>
					{:else}
						<p class="mt-2 text-xs text-gray-500">Minimum 6 characters</p>
					{/if}
				</div>

				<!-- Confirm Password Field -->
				<div class="mb-6">
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autocomplete="new-password"
						required
						bind:value={confirmPassword}
						onblur={() => validateConfirmPasswordClient(confirmPassword)}
						oninput={() => {
							if (confirmPasswordError || (form && 'field' in form && form.field === 'confirmPassword')) {
								validateConfirmPasswordClient(confirmPassword);
							}
						}}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
						class:border-red-500={confirmPasswordError || (form && 'field' in form && form.field === 'confirmPassword')}
						class:bg-red-50={confirmPasswordError || (form && 'field' in form && form.field === 'confirmPassword')}
						disabled={isSubmitting}
					/>
					{#if confirmPasswordError}
						<p class="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
					{:else if form && 'field' in form && form.field === 'confirmPassword' && form?.message}
						<p class="mt-2 text-sm text-red-600">{form.message}</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting ||
						!!usernameError ||
						!!passwordError ||
						!!confirmPasswordError ||
						!username ||
						!password ||
						!confirmPassword}
					class="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{#if isSubmitting}
						<span class="flex items-center justify-center">
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creating account...
						</span>
					{:else}
						Create Account
					{/if}
				</button>
			</form>

			<!-- Login Link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					Already have an account?
					<a
						href="/demo/lucia/login"
						class="text-blue-600 hover:text-blue-700 font-medium hover:underline"
					>
						Sign in
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
