<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let imagePreview = $state<string | null>(null);
	let categoryMode = $state<'existing' | 'new'>('existing');
	let selectedCategory = $state('');

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
		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Add New Move</h1>
		<p class="mt-2 text-zinc-600 dark:text-zinc-400">
			Create a new aerial move entry in the database.
		</p>
	</div>

	{#if form?.error}
		<div
			class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
		>
			<p class="text-sm text-red-800 dark:text-red-200">{form.error}</p>
		</div>
	{/if}

	<form method="POST" enctype="multipart/form-data" class="space-y-6">
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Basic Information</h2>

			<!-- Move Name -->
			<div class="mb-4">
				<label for="name" class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
					Move Name <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					placeholder="e.g., Superman, Angel, Crucifix"
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
				/>
			</div>

			<!-- Base Technique -->
			<div class="mb-4">
				<label
					for="category-select"
					class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Base Technique <span class="text-red-500">*</span>
				</label>
				<select
					id="category-select"
					onchange={handleCategoryChange}
					bind:value={selectedCategory}
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
							class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							New Base Technique Name <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="new-category"
							name="new_category"
							required
							placeholder="e.g., Floor Work, Dynamic"
							class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
						/>
					</div>
				{:else}
					<input type="hidden" name="category" value={selectedCategory} />
				{/if}
			</div>

			<!-- Contributor -->
			<div>
				<label
					for="contributor"
					class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Original Contributor
				</label>
				<input
					type="text"
					id="contributor"
					name="contributor"
					placeholder="e.g., Fer Medina"
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
				/>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
					The person who originally created or popularized this move
				</p>
			</div>
		</div>

		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Description</h2>

			<div>
				<label
					for="description"
					class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Move Description
				</label>
				<textarea
					id="description"
					name="description"
					rows="6"
					placeholder="Describe the move, how to perform it, key points, etc."
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
				></textarea>
			</div>
		</div>

		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Media</h2>

			<!-- Image Upload -->
			<div class="mb-4">
				<label for="image" class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
					Image
				</label>
				<input
					type="file"
					id="image"
					name="image"
					accept="image/jpeg,image/png,image/webp"
					onchange={handleImageChange}
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:file:bg-blue-950 dark:file:text-blue-300"
				/>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
					Max 5MB. Formats: JPEG, PNG, WebP
				</p>

				{#if imagePreview}
					<div class="mt-4">
						<p class="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Preview:</p>
						<img
							src={imagePreview}
							alt="Preview"
							class="h-48 w-auto rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
						/>
					</div>
				{/if}
			</div>

			<!-- Video URL -->
			<div>
				<label
					for="video_url"
					class="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Video URL
				</label>
				<input
					type="url"
					id="video_url"
					name="video_url"
					placeholder="https://youtube.com/watch?v=..."
					class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
				/>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">YouTube or Vimeo URL</p>
			</div>
		</div>

		<!-- Submit -->
		<div class="flex gap-4">
			<button
				type="submit"
				class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Create Move
			</button>
			<a
				href="/admin"
				class="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
