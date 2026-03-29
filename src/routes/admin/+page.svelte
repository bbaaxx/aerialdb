<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('all');

	// Filtered moves based on search and category
	let filteredMoves = $derived(
		data.moves.filter((move) => {
			const matchesSearch = move.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || move.categoryId === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	// Statistics
	let stats = $derived({
		total: data.moves.length,
		withImage: data.moves.filter((m) => m.imageUrl).length,
		withVideo: data.moves.filter((m) => m.videoUrl).length,
		needsMedia: data.moves.filter((m) => !m.imageUrl && !m.videoUrl).length,
		complete: data.moves.filter((m) => m.imageUrl && m.videoUrl && m.description).length
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
			<p class="mt-2 text-zinc-600 dark:text-zinc-400">Manage aerial moves and their content</p>
		</div>
		<a
			href="/admin/moves/new"
			class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
		>
			+ Add New Move
		</a>
	</div>

	<!-- Statistics Cards -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Moves</p>
			<p class="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</p>
		</div>
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">With Images</p>
			<p class="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.withImage}</p>
		</div>
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">With Videos</p>
			<p class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats.withVideo}</p>
		</div>
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Needs Media</p>
			<p class="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.needsMedia}</p>
		</div>
		<div
			class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
		>
			<p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Complete</p>
			<p class="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.complete}</p>
			<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Img + Vid + Desc</p>
		</div>
	</div>

	<!-- Filters -->
	<div
		class="mb-6 flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-900"
	>
		<!-- Search -->
		<div class="flex-1">
			<label for="search" class="sr-only">Search moves</label>
			<input
				type="text"
				id="search"
				bind:value={searchQuery}
				placeholder="Search moves..."
				class="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
			/>
		</div>

		<!-- Category Filter -->
		<div class="w-full sm:w-64">
			<label for="category" class="sr-only">Filter by category</label>
			<select
				id="category"
				bind:value={selectedCategory}
				class="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
			>
				<option value="all">All Categories</option>
				{#each data.categories as category (category.id)}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</div>

		<!-- Clear Filters -->
		{#if searchQuery || selectedCategory !== 'all'}
			<button
				type="button"
				onclick={() => {
					searchQuery = '';
					selectedCategory = 'all';
				}}
				class="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
			>
				Clear
			</button>
		{/if}
	</div>

	<!-- Results Count -->
	<div class="mb-4">
		<p class="text-sm text-zinc-600 dark:text-zinc-400">
			Showing {filteredMoves.length} of {data.moves.length} moves
		</p>
	</div>

	<!-- Moves Table -->
	<div
		class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
						>
							Name
						</th>
						<th
							class="hidden px-4 py-3 text-left text-xs font-semibold tracking-wider text-zinc-700 uppercase sm:table-cell dark:text-zinc-300"
						>
							Category
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-zinc-700 uppercase md:table-cell dark:text-zinc-300"
						>
							Media
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-zinc-700 uppercase lg:table-cell dark:text-zinc-300"
						>
							Contributor
						</th>
						<th
							class="px-4 py-3 text-right text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
					{#each filteredMoves as move (move.id)}
						<tr class="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
							<td class="px-4 py-3">
								<a
									href="/moves/{move.id}"
									class="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
								>
									{move.name}
								</a>
								<div class="mt-1 text-xs text-zinc-500 sm:hidden dark:text-zinc-400">
									{move.categoryName || 'Uncategorized'}
								</div>
							</td>
							<td class="hidden px-4 py-3 text-sm text-zinc-600 sm:table-cell dark:text-zinc-400">
								{move.categoryName || 'Uncategorized'}
							</td>
							<td class="hidden px-4 py-3 text-center md:table-cell">
								<div class="flex items-center justify-center gap-2">
									{#if move.imageUrl}
										<span class="text-lg" title="Has image">📷</span>
									{/if}
									{#if move.videoUrl}
										<span class="text-lg" title="Has video">🎥</span>
									{/if}
									{#if move.description}
										<span class="text-lg" title="Has description">📝</span>
									{/if}
									{#if !move.imageUrl && !move.videoUrl && !move.description}
										<span class="text-zinc-400 dark:text-zinc-600">—</span>
									{/if}
								</div>
							</td>
							<td
								class="hidden px-4 py-3 text-center text-sm text-zinc-600 lg:table-cell dark:text-zinc-400"
							>
								{move.contributorName || '—'}
							</td>
							<td class="px-4 py-3 text-right">
								<a
									href="/admin/moves/{move.id}/edit"
									class="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
								>
									Edit
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-8 text-center">
								<p class="text-zinc-500 dark:text-zinc-400">No moves found</p>
								{#if searchQuery || selectedCategory !== 'all'}
									<button
										type="button"
										onclick={() => {
											searchQuery = '';
											selectedCategory = 'all';
										}}
										class="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
									>
										Clear filters
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
