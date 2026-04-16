<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let username = $state(form?.username || '');
	let password = $state('');
	let isSubmitting = $state(false);

	// Client-side validation states
	let usernameError = $state('');
	let passwordError = $state('');

	function validateUsernameClient(value: string) {
		if (!value) {
			usernameError = 'Username is required';
			return false;
		}
		if (value.length < 3) {
			usernameError = 'Username must be at least 3 characters';
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
		passwordError = '';
		return true;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-surface-container-low px-4 py-12">
	<div class="w-full max-w-md">
		<div class="rounded-2xl bg-surface-container p-8 shadow-2xl">
			<!-- Header -->
			<div class="mb-8 text-center">
				<h1 class="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
				<p class="text-on-surface-variant">Sign in to your account</p>
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
				{#if data.redirectTo}
					<input type="hidden" name="redirectTo" value={data.redirectTo} />
				{/if}
				<!-- Error Message -->
				{#if form?.message}
					<div class="mb-6 rounded-lg border border-error bg-error/10 p-4">
						<p class="text-sm text-error">{form.message}</p>
						{#if form.showSignupLink}
							<p class="mt-2 text-sm text-error">
								Don't have an account?
								<a
									href="/auth/signup"
									class="font-medium text-primary underline hover:drop-shadow-[0_0_8px_rgba(138,99,248,0.6)]"
								>
									Create one here
								</a>
							</p>
						{/if}
					</div>
				{/if}

				<!-- Username Field -->
				<div class="mb-5">
					<label for="username" class="mb-2 block text-sm font-medium text-on-surface-variant">
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
							if (usernameError) {
								validateUsernameClient(username);
							}
						}}
						class="w-full rounded-lg border bg-surface-container px-4 py-3 text-on-surface placeholder-on-surface-variant transition outline-none focus:border-primary focus:ring-1 focus:ring-primary {usernameError
							? 'border-error bg-error/10'
							: 'border-outline-variant/15'}"
						disabled={isSubmitting}
					/>
					{#if usernameError}
						<p class="mt-2 text-sm text-error">{usernameError}</p>
					{/if}
				</div>

				<!-- Password Field -->
				<div class="mb-6">
					<label for="password" class="mb-2 block text-sm font-medium text-on-surface-variant">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						onblur={() => validatePasswordClient(password)}
						oninput={() => {
							if (passwordError) {
								validatePasswordClient(password);
							}
						}}
						class="w-full rounded-lg border bg-surface-container px-4 py-3 text-on-surface placeholder-on-surface-variant transition outline-none focus:border-primary focus:ring-1 focus:ring-primary {passwordError
							? 'border-error bg-error/10'
							: 'border-outline-variant/15'}"
						disabled={isSubmitting}
					/>
					{#if passwordError}
						<p class="mt-2 text-sm text-error">{passwordError}</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting || !!usernameError || !!passwordError || !username || !password}
					class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
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
							Signing in...
						</span>
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<!-- Sign Up Link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-on-surface-variant">
					Don't have an account?
					<a
						href="/auth/signup"
						class="font-medium text-primary hover:underline hover:drop-shadow-[0_0_8px_rgba(138,99,248,0.6)]"
					>
						Create one
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
