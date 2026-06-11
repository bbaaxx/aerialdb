<script lang="ts">
	import type { PageData } from './$types';
	import { Search, X } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

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
		withImage: data.moves.filter((m) => m.hasImage).length,
		withVideo: data.moves.filter((m) => m.hasVideo).length,
		needsMedia: data.moves.filter((m) => !m.hasImage && !m.hasVideo).length,
		complete: data.moves.filter((m) => m.hasImage && m.hasVideo && m.hasDescription).length
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Admin Dashboard</h1>
			<p class="mt-2 text-on-surface-variant">Manage aerial moves and their content</p>
		</div>
		<a
			href="/admin/moves/new"
			class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
		>
			+ Add New Move
		</a>
	</div>

	<!-- Statistics Cards -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<p class="text-sm font-medium text-on-surface-variant">Total Moves</p>
			<p class="mt-2 text-3xl font-bold text-on-surface">{stats.total}</p>
		</div>
		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<p class="text-sm font-medium text-on-surface-variant">With Images</p>
			<p class="mt-2 text-3xl font-bold text-on-surface">{stats.withImage}</p>
		</div>
		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<p class="text-sm font-medium text-on-surface-variant">With Videos</p>
			<p class="mt-2 text-3xl font-bold text-on-surface">{stats.withVideo}</p>
		</div>
		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<p class="text-sm font-medium text-on-surface-variant">Needs Media</p>
			<p class="mt-2 text-3xl font-bold text-on-surface">{stats.needsMedia}</p>
		</div>
		<div class="rounded-lg bg-surface-container p-6 shadow-sm">
			<p class="text-sm font-medium text-on-surface-variant">Complete</p>
			<p class="mt-2 text-3xl font-bold text-on-surface">{stats.complete}</p>
			<p class="mt-1 text-xs text-on-surface-variant">Img + Vid + Desc</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="mb-6 flex flex-col gap-4 rounded-lg bg-surface-container p-4 shadow-sm sm:flex-row">
		<!-- Search -->
		<div class="flex-1">
			<label for="search" class="sr-only">Search moves</label>
			<div class="relative">
				<div
					class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant"
				>
					<Search size={18} />
				</div>
				<input
					type="search"
					id="search"
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Escape' && (searchQuery = '')}
					placeholder="Search moves..."
					class="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low py-2 pr-10 pl-10 text-sm text-on-surface placeholder-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant transition hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						aria-label={m.nav_search_clear()}
					>
						<X size={18} />
					</button>
				{/if}
			</div>
		</div>

		<!-- Base Technique Filter -->
		<div class="w-full sm:w-64">
			<label for="category" class="sr-only">Filter by base technique</label>
			<select
				id="category"
				bind:value={selectedCategory}
				class="w-full rounded-lg border border-outline-variant/15 bg-surface-container-low px-4 py-2 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
			>
				<option value="all">All Base Techniques</option>
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
				class="rounded-lg border border-outline-variant/15 bg-surface-container-low px-4 py-2 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
			>
				Clear
			</button>
		{/if}
	</div>

	<!-- Results Count -->
	<div class="mb-4">
		<p class="text-sm text-on-surface-variant" aria-live="polite">
			Showing {filteredMoves.length} of {data.moves.length} moves
		</p>
	</div>

	<!-- Moves Table -->
	<div class="overflow-hidden rounded-lg bg-surface-container shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-surface-container-high">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-on-surface-variant uppercase"
						>
							Name
						</th>
						<th
							class="hidden px-4 py-3 text-left text-xs font-semibold tracking-wider text-on-surface-variant uppercase sm:table-cell"
						>
							Base Technique
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-on-surface-variant uppercase md:table-cell"
						>
							Media
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-on-surface-variant uppercase lg:table-cell"
						>
							Contributor
						</th>
						<th
							class="px-4 py-3 text-right text-xs font-semibold tracking-wider text-on-surface-variant uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-outline-variant/15">
					{#each filteredMoves as move (move.id)}
						<tr class="transition-colors hover:bg-surface-container-high">
							<td class="px-4 py-3">
								<a href="/moves/{move.id}" class="font-medium text-on-surface hover:text-primary">
									{move.name}
								</a>
								<div class="mt-1 text-xs text-on-surface-variant sm:hidden">
									{move.categoryName || 'Uncategorized'}
								</div>
							</td>
							<td class="hidden px-4 py-3 text-sm text-on-surface-variant sm:table-cell">
								{move.categoryName || 'Uncategorized'}
							</td>
							<td class="hidden px-4 py-3 text-center md:table-cell">
								<div class="flex items-center justify-center gap-2">
									{#if move.hasImage}
										<span class="text-lg" title="Has image">📷</span>
									{/if}
									{#if move.hasVideo}
										<span class="text-lg" title="Has video">🎥</span>
									{/if}
									{#if move.hasDescription}
										<span class="text-lg" title="Has description">📝</span>
									{/if}
									{#if !move.hasImage && !move.hasVideo && !move.hasDescription}
										<span class="text-on-surface-variant">—</span>
									{/if}
								</div>
							</td>
							<td
								class="hidden px-4 py-3 text-center text-sm text-on-surface-variant lg:table-cell"
							>
								{move.contributorName || '—'}
							</td>
							<td class="px-4 py-3 text-right">
								<a
									href="/admin/moves/{move.id}/edit"
									class="inline-flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
								>
									Edit
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-8 text-center">
								<p class="text-on-surface-variant">No moves found</p>
								{#if searchQuery || selectedCategory !== 'all'}
									<button
										type="button"
										onclick={() => {
											searchQuery = '';
											selectedCategory = 'all';
										}}
										class="mt-2 text-sm text-primary transition-all hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none active:scale-95"
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
