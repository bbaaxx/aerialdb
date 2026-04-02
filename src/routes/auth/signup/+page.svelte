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
			usernameError =
				'Username can only contain lowercase letters, numbers, hyphens, and underscores';
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

<div class="flex min-h-screen items-center justify-center bg-[#1A1C29] px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-2xl border border-gray-800 bg-[#242736] p-8 shadow-2xl">
			<!-- Header -->
			<div class="mb-8 text-center">
				<h1 class="mb-2 text-3xl font-bold text-white">Create Account</h1>
				<p class="text-[#A0A5C0]">Sign up to get started</p>
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
					<div class="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4">
						<p class="text-sm text-red-400">{form.message}</p>
					</div>
				{/if}

				<!-- Username Field -->
				<div class="mb-5">
					<label for="username" class="mb-2 block text-sm font-medium text-[#A0A5C0]">
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
						class="w-full rounded-lg border bg-[#242736] px-4 py-3 text-gray-200 transition outline-none focus:border-transparent focus:ring-2 focus:ring-[#8A63F8] {usernameError ||
						(form && 'field' in form && form.field === 'username')
							? 'border-red-500 bg-red-500/10'
							: 'border-gray-600'}"
						disabled={isSubmitting}
					/>
					{#if usernameError}
						<p class="mt-2 text-sm text-red-400">{usernameError}</p>
					{:else if form && 'field' in form && form.field === 'username' && form?.message}
						<p class="mt-2 text-sm text-red-400">{form.message}</p>
					{:else}
						<p class="mt-2 text-xs text-gray-400">
							3-31 characters, lowercase letters, numbers, hyphens, and underscores only
						</p>
					{/if}
				</div>

				<!-- Password Field -->
				<div class="mb-5">
					<label for="password" class="mb-2 block text-sm font-medium text-[#A0A5C0]">
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
						class="w-full rounded-lg border bg-[#242736] px-4 py-3 text-gray-200 transition outline-none focus:border-transparent focus:ring-2 focus:ring-[#8A63F8] {passwordError ||
						(form && 'field' in form && form.field === 'password')
							? 'border-red-500 bg-red-500/10'
							: 'border-gray-600'}"
						disabled={isSubmitting}
					/>
					{#if passwordError}
						<p class="mt-2 text-sm text-red-400">{passwordError}</p>
					{:else if form && 'field' in form && form.field === 'password' && form?.message}
						<p class="mt-2 text-sm text-red-400">{form.message}</p>
					{:else}
						<p class="mt-2 text-xs text-gray-400">Minimum 6 characters</p>
					{/if}
				</div>

				<!-- Confirm Password Field -->
				<div class="mb-6">
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-[#A0A5C0]">
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
							if (
								confirmPasswordError ||
								(form && 'field' in form && form.field === 'confirmPassword')
							) {
								validateConfirmPasswordClient(confirmPassword);
							}
						}}
						class="w-full rounded-lg border bg-[#242736] px-4 py-3 text-gray-200 transition outline-none focus:border-transparent focus:ring-2 focus:ring-[#8A63F8] {confirmPasswordError ||
						(form && 'field' in form && form.field === 'confirmPassword')
							? 'border-red-500 bg-red-500/10'
							: 'border-gray-600'}"
						disabled={isSubmitting}
					/>
					{#if confirmPasswordError}
						<p class="mt-2 text-sm text-red-400">{confirmPasswordError}</p>
					{:else if form && 'field' in form && form.field === 'confirmPassword' && form?.message}
						<p class="mt-2 text-sm text-red-400">{form.message}</p>
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
					class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-[#8A63F8] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
				>
					{#if isSubmitting}
						<span class="flex items-center justify-center">
							<svg
								class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
				<p class="text-sm text-[#A0A5C0]">
					Already have an account?
					<a
						href="/auth/login"
						class="font-medium text-[#8A63F8] hover:drop-shadow-[0_0_8px_rgba(138,99,248,0.6)]"
					>
						Sign in
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
