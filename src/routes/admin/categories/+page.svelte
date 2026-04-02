<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State for inline editing
	let editingId = $state<string | null>(null);
	let editingName = $state('');

	// State for delete confirmation
	let deletingId = $state<string | null>(null);
	let deleteMoveCount = $state(0);

	// New category form state
	let newCategoryName = $state('');

	// Start editing a category
	function startEdit(id: string, name: string) {
		editingId = id;
		editingName = name;
	}

	// Cancel editing
	function cancelEdit() {
		editingId = null;
		editingName = '';
	}

	// Start delete confirmation
	function startDelete(id: string, moveCount: number) {
		deletingId = id;
		deleteMoveCount = moveCount;
	}

	// Cancel delete
	function cancelDelete() {
		deletingId = null;
		deleteMoveCount = 0;
	}

	// Refresh data after action
	async function refreshData() {
		await invalidateAll();
		newCategoryName = '';
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Manage Categories</h1>
			<p class="mt-2 text-[#A0A5C0]">Organize aerial moves into categories</p>
		</div>
	</div>

	<!-- Add Category Form -->
	<div class="mb-8 rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-white">Add New Category</h2>
		<form
			method="POST"
			action="?/createCategory"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result.type === 'redirect' || result.type === 'success') {
						await refreshData();
					}
				};
			}}
			class="flex flex-col gap-4 sm:flex-row sm:items-end"
		>
			<div class="flex-1">
				<label for="new-category-name" class="sr-only">Category name</label>
				<input
					type="text"
					id="new-category-name"
					name="name"
					bind:value={newCategoryName}
					placeholder="Enter category name..."
					maxlength="100"
					required
					class="w-full rounded-lg border border-gray-600 bg-[#242736] px-4 py-2 text-sm text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
				/>
				{#if form?.action === 'create' && form?.error}
					<p class="mt-1 text-sm text-red-400">{form.error}</p>
				{/if}
			</div>
			<button
				type="submit"
				class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition-all hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
			>
				Add Category
			</button>
		</form>
	</div>

	<!-- Error/Success Messages -->
	{#if form?.error && form?.action !== 'create'}
		<div class="mb-6 rounded-lg border border-red-900 bg-red-950/50 p-4">
			<p class="text-sm text-red-300">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-6 rounded-lg border border-green-900 bg-green-950/50 p-4">
			<p class="text-sm text-green-300">Operation completed successfully.</p>
		</div>
	{/if}

	<!-- Categories Table -->
	<div class="overflow-hidden rounded-lg border border-gray-800 bg-[#242736] shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead class="border-b border-gray-800 bg-[#242736]">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase"
						>
							Name
						</th>
						<th
							class="px-4 py-3 text-center text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase"
						>
							Moves
						</th>
						<th
							class="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each data.categories as category (category.id)}
						<tr class="transition-colors hover:bg-[#2A2D3E]">
							<td class="px-4 py-3">
								{#if editingId === category.id}
									<!-- Inline Edit Form -->
									<form
										method="POST"
										action="?/updateCategory"
										use:enhance={() => {
											return async ({ result, update }) => {
												await update();
												if (result.type === 'success') {
													cancelEdit();
													await refreshData();
												}
											};
										}}
										class="flex items-center gap-2"
									>
										<input type="hidden" name="id" value={category.id} />
										<input
											type="text"
											name="name"
											bind:value={editingName}
											maxlength="100"
											required
											class="flex-1 rounded-lg border border-gray-600 bg-[#242736] px-3 py-1.5 text-sm text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
										/>
										<button
											type="submit"
											class="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
										>
											Save
										</button>
										<button
											type="button"
											onclick={cancelEdit}
											class="rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-700"
										>
											Cancel
										</button>
									</form>
									{#if form?.action === 'update' && form?.id === category.id && (form as any).error}
										<p class="mt-1 text-sm text-red-400">{(form as any).error}</p>
									{/if}
								{:else}
									<span class="font-medium text-gray-200">{category.name}</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-center">
								<span
									class="inline-flex items-center rounded-full bg-[#2A2D3E] px-2.5 py-0.5 text-xs font-medium text-gray-300"
								>
									{category.moveCount}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								{#if deletingId === category.id}
									<!-- Delete Confirmation -->
									<div class="flex items-center justify-end gap-2">
										<span class="text-sm text-[#A0A5C0]">
											{#if deleteMoveCount > 0}
												{deleteMoveCount} move{deleteMoveCount === 1 ? '' : 's'} linked
											{:else}
												Delete?
											{/if}
										</span>
										<form
											method="POST"
											action="?/deleteCategory"
											use:enhance={() => {
												return async ({ result, update }) => {
													await update();
													if (result.type === 'success' || result.type === 'redirect') {
														cancelDelete();
														await refreshData();
													}
												};
											}}
											class="inline"
										>
											<input type="hidden" name="id" value={category.id} />
											<button
												type="submit"
												class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
											>
												Confirm
											</button>
										</form>
										<button
											type="button"
											onclick={cancelDelete}
											class="rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-700"
										>
											Cancel
										</button>
									</div>
									{#if form?.action === 'delete' && form?.id === category.id && (form as any).error}
										<p class="mt-1 text-sm text-red-400">{(form as any).error}</p>
									{/if}
								{:else}
									<div class="flex items-center justify-end gap-2">
										<button
											type="button"
											onclick={() => startEdit(category.id, category.name)}
											class="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
										>
											Edit
										</button>
										<button
											type="button"
											onclick={() => startDelete(category.id, category.moveCount)}
											class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
										>
											Delete
										</button>
									</div>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="3" class="px-4 py-8 text-center">
								<p class="text-gray-400">No categories found</p>
								<p class="mt-1 text-sm text-gray-500">Add your first category above</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
