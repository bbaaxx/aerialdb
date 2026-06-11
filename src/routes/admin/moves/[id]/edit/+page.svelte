<script lang="ts">
	import { enhance } from '$app/forms';
	import { Loader2 } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { fade } from 'svelte/transition';
	import { untrack } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let imagePreview = $state<string | null>(untrack(() => data.move.imageUrl || null));
	let removeImage = $state(false);
	let showDeleteConfirm = $state(false);
	let categoryMode = $state<'existing' | 'new'>('existing');
	let selectedCategory = $state(untrack(() => data.move.categoryId));
	let name = $state(untrack(() => data.move.name));
	let description = $state(untrack(() => data.move.description || ''));
	let isSubmitting = $state(false);
	let isDeleting = $state(false);
	let newCategoryInput = $state<HTMLInputElement | undefined>(undefined);

	$effect(() => {
		if (categoryMode === 'new' && newCategoryInput) {
			newCategoryInput.focus();
		}
	});

	// Keep local state in sync when server data updates (e.g. navigation between moves)
	$effect(() => {
		name = data.move.name;
		description = data.move.description || '';
		selectedCategory = data.move.categoryId;
		imagePreview = data.move.imageUrl || null;
		removeImage = false;
	});

	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			removeImage = false;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleRemoveImage() {
		removeImage = true;
		imagePreview = null;
		// Clear file input
		const input = document.getElementById('image') as HTMLInputElement;
		if (input) input.value = '';
	}

	function handleCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (target.value === '__new__') {
			categoryMode = 'new';
			selectedCategory = '';
		} else {
			categoryMode = 'existing';
			selectedCategory = target.value;
		}
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Edit Move</h1>
			<p class="mt-2 text-on-surface-variant">
				Update the details for "{data.move.name}"
			</p>
		</div>
		<button
			type="button"
			onclick={() => (showDeleteConfirm = true)}
			class="rounded-lg border border-error/50 px-4 py-2 text-sm font-medium text-error transition-all hover:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error active:scale-95"
		>
			Delete Move
		</button>
	</div>

	{#if form?.error}
		<div class="mb-6 rounded-lg border border-error/50 bg-error/10 p-4">
			<p class="text-sm text-error">{form.error}</p>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	{#if showDeleteConfirm}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		>
			<div class="max-w-md rounded-lg bg-surface-container p-6 shadow-xl">
				<h3 class="mb-4 text-lg font-semibold text-on-surface">
					Delete "{data.move.name}"?
				</h3>
				<p class="mb-6 text-sm text-on-surface-variant">
					This action cannot be undone. The move and its associated image will be permanently
					deleted.
				</p>
				<div class="flex gap-3">
					<form
						method="POST"
						action="?/delete"
						class="flex-1"
						use:enhance={() => {
							isDeleting = true;
							return async ({ update }) => {
								await update();
								isDeleting = false;
							};
						}}
					>
						<button
							type="submit"
							disabled={isDeleting}
							class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-error active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{#if isDeleting}
								<Loader2 size={16} class="animate-spin" />
								<span>Deleting...</span>
							{:else}
								Yes, Delete
							{/if}
						</button>
					</form>
					<button
						type="button"
						onclick={() => (showDeleteConfirm = false)}
						class="flex-1 rounded-lg border border-outline-variant/15 px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}

	<form
		method="POST"
		action="?/update"
		enctype="multipart/form-data"
		class="space-y-6"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<input type="hidden" name="remove_image" value={removeImage ? 'true' : 'false'} />

		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-on-surface">Basic Information</h2>

			<!-- Move Name -->
			<div class="mb-4">
				<div class="mb-2 flex items-center justify-between">
					<label for="name" class="block text-sm font-medium text-on-surface-variant">
						Move Name <span class="text-red-500">*</span>
					</label>
					<span
						id="name-counter"
						class="text-xs {name.length >= 100
							? 'text-error'
							: name.length >= 90
								? 'text-amber-400'
								: 'text-on-surface-variant'}"
					>
						{name.length}/100
					</span>
				</div>
				<input
					type="text"
					id="name"
					name="name"
					required
					maxlength="100"
					bind:value={name}
					aria-describedby="name-counter"
					placeholder="e.g., Superman, Angel, Crucifix"
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				/>
			</div>

			<!-- Base Technique -->
			<div class="mb-4">
				<label for="category-select" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Base Technique <span class="text-red-500">*</span>
				</label>
				<select
					id="category-select"
					onchange={handleCategoryChange}
					bind:value={selectedCategory}
					class="w-full rounded-lg border border-outline-variant/30 bg-surface-container px-3 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				>
					<option value="">Select a base technique</option>
					{#each data.categories as category (category.id)}
						<option value={category.id}>
							{category.name}
						</option>
					{/each}
					<option value="__new__">+ Create New Base Technique</option>
				</select>

				{#if categoryMode === 'new'}
					<div class="mt-3">
						<label
							for="new-category"
							class="mb-2 block text-sm font-medium text-on-surface-variant"
						>
							New Base Technique Name <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="new-category"
							name="new_category"
							bind:this={newCategoryInput}
							required
							placeholder="e.g., Floor Work, Dynamic"
							class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
						/>
					</div>
				{:else}
					<input type="hidden" name="category" value={selectedCategory} />
				{/if}
			</div>

			<!-- Contributor -->
			<div>
				<label for="contributor" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Original Contributor
				</label>
				<input
					type="text"
					id="contributor"
					name="contributor"
					value={data.move.contributorName || ''}
					placeholder="e.g., Fer Medina"
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				/>
				<p class="mt-1 text-xs text-on-surface-variant">
					The person who originally created or popularized this move
				</p>
			</div>
		</div>

		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-on-surface">Description</h2>
				<span
					id="description-counter"
					class="text-xs {description.length >= 2000
						? 'text-error'
						: description.length >= 1800
							? 'text-amber-400'
							: 'text-on-surface-variant'}"
				>
					{description.length}/2000
				</span>
			</div>

			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Move Description
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={description}
					maxlength="2000"
					aria-describedby="description-counter"
					rows="6"
					placeholder="Describe the move, how to perform it, key points, etc."
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				></textarea>
			</div>
		</div>

		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-on-surface">Media</h2>

			<!-- Image Upload -->
			<div class="mb-4">
				<label for="image" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Image
				</label>

				{#if imagePreview && !removeImage}
					<div class="mb-4">
						<p class="mb-2 text-sm font-medium text-on-surface-variant">Current Image:</p>
						<div class="relative inline-block">
							<img src={imagePreview} alt="Current" class="h-48 w-auto rounded-lg object-cover" />
							<button
								type="button"
								onclick={handleRemoveImage}
								class="absolute top-2 right-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-lg transition-colors hover:bg-red-700"
							>
								Remove
							</button>
						</div>
					</div>
				{/if}

				<input
					type="file"
					id="image"
					name="image"
					accept="image/jpeg,image/png,image/webp"
					onchange={handleImageChange}
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface file:mr-4 file:rounded-md file:border-0 file:bg-primary/20 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/30"
				/>
				<p class="mt-1 text-xs text-on-surface-variant">
					{#if imagePreview && !removeImage}
						Upload a new image to replace the current one. Max 5MB. Formats: JPEG, PNG, WebP
					{:else}
						Max 5MB. Formats: JPEG, PNG, WebP
					{/if}
				</p>
			</div>

			<!-- Video URL -->
			<div>
				<label for="video_url" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Video URL
				</label>
				<input
					type="url"
					id="video_url"
					name="video_url"
					value={data.move.videoUrl || ''}
					placeholder="https://youtube.com/watch?v=..."
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				/>
				<p class="mt-1 text-xs text-on-surface-variant">YouTube or Vimeo URL</p>
			</div>
		</div>

		<!-- Submit -->
		<div class="flex gap-4">
			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition-shadow hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{#if isSubmitting}
					<Loader2 size={18} class="animate-spin" />
					<span>Saving...</span>
				{:else}
					Save Changes
				{/if}
			</button>
			<a
				href="/moves/{data.move.id}"
				class="rounded-lg border border-outline-variant/15 px-6 py-2.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
