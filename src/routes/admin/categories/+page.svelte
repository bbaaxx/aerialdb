<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { Loader2 } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);
	let processingId = $state<string | null>(null);

	// State for inline editing
	let editingId = $state<string | null>(null);
	let editingName = $state('');

	// State for delete confirmation
	let deletingId = $state<string | null>(null);
	let deleteMoveCount = $state(0);

	// New category form state
	let newCategoryName = $state('');

	// Character count helper
	function getCountColor(length: number, max: number) {
		if (length >= max) return 'text-error';
		if (length >= max * 0.9) return 'text-amber-400';
		return 'text-on-surface-variant';
	}

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
			<p class="mt-2 text-on-surface-variant">Organize aerial moves into categories</p>
		</div>
	</div>

	<!-- Add Category Form -->
	<div class="mb-8 rounded-lg bg-surface-container p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-on-surface">Add New Category</h2>
		<form
			method="POST"
			action="?/createCategory"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;
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
					aria-describedby="new-category-hint"
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-4 py-2 text-sm text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
				/>
				<div id="new-category-hint" class="mt-1 flex items-center justify-between px-1">
					{#if form?.action === 'create' && form?.error}
						<p class="text-xs text-error">{form.error}</p>
					{:else}
						<span></span>
					{/if}
					<span
						class="ml-auto text-[10px] font-medium {getCountColor(newCategoryName.length, 100)}"
					>
						{newCategoryName.length}/100
					</span>
				</div>
			</div>
			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition-all hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container disabled:opacity-70"
			>
				{#if isSubmitting}
					<Loader2 size={18} class="animate-spin" />
					Adding...
				{:else}
					Add Category
				{/if}
			</button>
		</form>
	</div>

	<!-- Error/Success Messages -->
	{#if form?.error && form?.action !== 'create'}
		<div class="mb-6 rounded-lg border border-error bg-error/10 p-4">
			<p class="text-sm text-error">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-6 rounded-lg bg-green-500/10 p-4">
			<p class="text-sm text-green-300">Operation completed successfully.</p>
		</div>
	{/if}

	<!-- Categories Table -->
	<div class="overflow-hidden rounded-lg bg-surface-container shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead class="bg-surface-container-high">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-on-surface-variant uppercase"
						>
							Name
						</th>
						<th
							class="px-4 py-3 text-center text-xs font-semibold tracking-wider text-on-surface-variant uppercase"
						>
							Moves
						</th>
						<th
							class="px-4 py-3 text-right text-xs font-semibold tracking-wider text-on-surface-variant uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-outline-variant/15">
					{#each data.categories as category (category.id)}
						<tr class="transition-colors hover:bg-surface-container-high">
							<td class="px-4 py-3">
								{#if editingId === category.id}
									<!-- Inline Edit Form -->
									<form
										method="POST"
										action="?/updateCategory"
										use:enhance={() => {
											processingId = category.id;
											return async ({ result, update }) => {
												await update();
												processingId = null;
												if (result.type === 'success') {
													cancelEdit();
													await refreshData();
												}
											};
										}}
										class="flex items-center gap-2"
									>
										<input type="hidden" name="id" value={category.id} />
										<div class="relative flex-1">
											<input
												type="text"
												name="name"
												bind:value={editingName}
												maxlength="100"
												required
												aria-describedby="edit-category-hint-{category.id}"
												class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-1.5 pr-16 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
											/>
											<span
												id="edit-category-hint-{category.id}"
												class="absolute right-3 bottom-1.5 text-[10px] font-medium {getCountColor(
													editingName.length,
													100
												)}"
											>
												{editingName.length}/100
											</span>
										</div>
										<button
											type="submit"
											disabled={processingId === category.id}
											class="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high disabled:opacity-70"
										>
											{#if processingId === category.id}
												<Loader2 size={14} class="animate-spin" />
												Saving...
											{:else}
												Save
											{/if}
										</button>
										<button
											type="button"
											onclick={cancelEdit}
											class="rounded-lg border border-outline-variant/15 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high"
										>
											Cancel
										</button>
									</form>
									{#if form?.action === 'update' && form?.id === category.id && (form as any).error}
										<p class="mt-1 text-sm text-error">{form.error}</p>
									{/if}
								{:else}
									<span class="font-medium text-on-surface">{category.name}</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-center">
								<span
									class="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-medium text-on-surface-variant"
								>
									{category.moveCount}
								</span>
							</td>
							<td class="px-4 py-3 text-right">
								{#if deletingId === category.id}
									<!-- Delete Confirmation -->
									<div
										transition:fade={{ duration: 150 }}
										class="flex items-center justify-end gap-2"
									>
										<span class="text-sm text-on-surface-variant">
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
												processingId = category.id;
												return async ({ result, update }) => {
													await update();
													processingId = null;
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
												disabled={processingId === category.id}
												class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high disabled:opacity-70"
											>
												{#if processingId === category.id}
													<Loader2 size={14} class="animate-spin" />
													Deleting...
												{:else}
													Confirm
												{/if}
											</button>
										</form>
										<button
											type="button"
											onclick={cancelDelete}
											class="rounded-lg border border-outline-variant/15 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high"
										>
											Cancel
										</button>
									</div>
									{#if form?.action === 'delete' && form?.id === category.id && (form as any).error}
										<p class="mt-1 text-sm text-error">{(form as any).error}</p>
									{/if}
								{:else}
									<div class="flex items-center justify-end gap-2">
										<button
											type="button"
											onclick={() => startEdit(category.id, category.name)}
											class="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high"
										>
											Edit
										</button>
										<button
											type="button"
											onclick={() => startDelete(category.id, category.moveCount)}
											class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-1 focus-visible:ring-offset-surface-container-high"
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
								<p class="text-on-surface-variant">No categories found</p>
								<p class="mt-1 text-sm text-on-surface-variant">Add your first category above</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
