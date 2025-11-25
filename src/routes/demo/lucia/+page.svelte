<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let isLoggingOut = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
	<div class="max-w-2xl mx-auto">
		<!-- Success Card -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
			<!-- Success Icon -->
			<div class="flex justify-center mb-6">
				<div class="bg-green-100 rounded-full p-4">
					<svg
						class="w-12 h-12 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</div>

			<!-- Welcome Message -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome, {data.user.username}!</h1>
				<p class="text-gray-600">You're successfully signed in</p>
			</div>

			<!-- User Information Card -->
			<div class="bg-gray-50 rounded-lg p-6 mb-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-sm font-medium text-gray-600">Username:</span>
						<span class="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded border border-gray-200"
							>{data.user.username}</span
						>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-sm font-medium text-gray-600">User ID:</span>
						<span
							class="text-sm text-gray-900 font-mono bg-white px-3 py-1 rounded border border-gray-200 truncate max-w-xs"
							title={data.user.id}>{data.user.id}</span
						>
					</div>
				</div>
			</div>

			<!-- Sign Out Button -->
			<form
				method="post"
				action="?/logout"
				use:enhance={() => {
					isLoggingOut = true;
					return async ({ update }) => {
						await update();
						isLoggingOut = false;
					};
				}}
			>
				<button
					type="submit"
					disabled={isLoggingOut}
					class="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{#if isLoggingOut}
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
							Signing out...
						</span>
					{:else}
						Sign Out
					{/if}
				</button>
			</form>
		</div>

		<!-- Info Card -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm text-blue-700">
						This is a demo authentication page. In a production environment, you would build your
						application features here.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
