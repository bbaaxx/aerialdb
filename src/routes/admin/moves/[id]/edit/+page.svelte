<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let imagePreview = $state<string | null>(data.move.imageUrl || null);
	let removeImage = $state(false);
	let showDeleteConfirm = $state(false);
	let categoryMode = $state<'existing' | 'new'>('existing');
	let selectedCategory = $state(data.move.categoryId);

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
			class="rounded-lg border border-error/50 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
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
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			<div class="max-w-md rounded-lg bg-surface-container p-6 shadow-xl">
				<h3 class="mb-4 text-lg font-semibold text-on-surface">
					Delete "{data.move.name}"?
				</h3>
				<p class="mb-6 text-sm text-on-surface-variant">
					This action cannot be undone. The move and its associated image will be permanently
					deleted.
				</p>
				<div class="flex gap-3">
					<form method="POST" action="?/delete" class="flex-1">
						<button
							type="submit"
							class="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
						>
							Yes, Delete
						</button>
					</form>
					<button
						type="button"
						onclick={() => (showDeleteConfirm = false)}
						class="flex-1 rounded-lg border border-outline-variant/15 px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}

	<form method="POST" action="?/update" enctype="multipart/form-data" class="space-y-6">
		<input type="hidden" name="remove_image" value={removeImage ? 'true' : 'false'} />

		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-on-surface">Basic Information</h2>

			<!-- Move Name -->
			<div class="mb-4">
				<label for="name" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Move Name <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					value={data.move.name}
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
					class="w-full rounded-lg border border-gray-600 bg-[#242736] px-3 py-2 text-gray-200 focus:border-[#8A63F8] focus:ring-1 focus:ring-[#8A63F8] focus:outline-none"
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
			<h2 class="mb-4 text-lg font-semibold text-on-surface">Description</h2>

			<div>
				<label for="description" class="mb-2 block text-sm font-medium text-on-surface-variant">
					Move Description
				</label>
				<textarea
					id="description"
					name="description"
					rows="6"
					placeholder="Describe the move, how to perform it, key points, etc."
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
					>{data.move.description || ''}</textarea
				>
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
				class="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition-shadow hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
			>
				Save Changes
			</button>
			<a
				href="/moves/{data.move.id}"
				class="rounded-lg border border-outline-variant/15 px-6 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
