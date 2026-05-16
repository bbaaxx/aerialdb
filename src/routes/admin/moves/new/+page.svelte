<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let imagePreview = $state<string | null>(null);
	let categoryMode = $state<'existing' | 'new'>('existing');
	let selectedCategory = $state('');
	let name = $state('');

	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		} else {
			imagePreview = null;
		}
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
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">Add New Move</h1>
		<p class="mt-2 text-on-surface-variant">Create a new aerial move entry in the database.</p>
	</div>

	{#if form?.error}
		<div class="mb-6 rounded-lg border border-error/50 bg-error/10 p-4">
			<p class="text-sm text-error">{form.error}</p>
		</div>
	{/if}

	<form method="POST" enctype="multipart/form-data" class="space-y-6">
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
					class="w-full rounded-lg border border-gray-600 bg-[#242736] px-3 py-2 text-gray-200 focus:border-[#8A63F8] focus:ring-1 focus:ring-[#8A63F8] focus:outline-none"
				>
					<option value="">Select a base technique</option>
					{#each data.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
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
					placeholder="e.g., Fer Medina"
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
				/>
				<p class="mt-1 text-xs text-[#A0A5C0]">
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
				<input
					type="file"
					id="image"
					name="image"
					accept="image/jpeg,image/png,image/webp"
					onchange={handleImageChange}
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container px-3 py-2 text-on-surface file:mr-4 file:rounded-md file:border-0 file:bg-surface-container-high file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-on-surface-variant hover:file:bg-surface-container-highest"
				/>
				<p class="mt-1 text-xs text-on-surface-variant">Max 5MB. Formats: JPEG, PNG, WebP</p>

				{#if imagePreview}
					<div class="mt-4">
						<p class="mb-2 text-sm font-medium text-on-surface-variant">Preview:</p>
						<img src={imagePreview} alt="Preview" class="h-48 w-auto rounded-lg object-cover" />
					</div>
				{/if}
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
				class="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-[#8A63F8] focus:ring-offset-2 focus:outline-none"
			>
				Create Move
			</button>
			<a
				href="/admin"
				class="rounded-lg border border-outline-variant/15 px-6 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
