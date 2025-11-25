<script lang="ts">
	import MoveCard from '$lib/components/MoveCard.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state(data.searchQuery);
	let selectedCategory = $state(data.categoryFilter);
	let viewMode = $state<'grid' | 'table'>('grid');
	let displayedMoves = $state(data.moves);
	let isSearching = $state(false);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Load view preference from localStorage
	onMount(() => {
		const savedView = localStorage.getItem('aerialdb-view');
		if (savedView === 'table' || savedView === 'grid') {
			viewMode = savedView;
		}
	});

	function toggleView(mode: 'grid' | 'table') {
		viewMode = mode;
		localStorage.setItem('aerialdb-view', mode);
	}

	// Debounced search function
	async function performSearch() {
		// Don't search if query is less than 3 characters
		if (!searchQuery || searchQuery.length < 3) {
			displayedMoves = data.moves;
			isSearching = false;
			return;
		}

		isSearching = true;

		try {
			const params = new URLSearchParams();
			params.set('q', searchQuery);
			if (selectedCategory) {
				params.set('category', selectedCategory);
			}

			const response = await fetch(`/api/search?${params.toString()}`);
			const result = await response.json();
			displayedMoves = result.moves;
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			isSearching = false;
		}
	}

	// Watch for search query and category changes
	$effect(() => {
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// If query is empty or less than 3 chars AND no category filter
		if ((!searchQuery || searchQuery.length < 3) && !selectedCategory) {
			displayedMoves = data.moves;
			return;
		}

		// If there's a category filter but no valid search query
		if ((!searchQuery || searchQuery.length < 3) && selectedCategory) {
			// Filter by category only
			displayedMoves = data.moves.filter(move => move.category.id === selectedCategory);
			return;
		}

		// Debounce: wait 300ms after user stops typing for search
		searchTimeout = setTimeout(() => {
			performSearch();
		}, 300);
	});
</script>

<svelte:head>
	<title>AerialDB - Aerial Moves Directory</title>
	<meta name="description" content="Browse and search aerial acrobatics moves" />
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<!-- Header -->
	<header class="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
			<h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
				AerialDB
			</h1>
			<p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
				{displayedMoves.length} aerial moves
				{#if isSearching}
					<span class="ml-2 text-blue-600 dark:text-blue-400">Searching...</span>
				{/if}
			</p>
		</div>
	</header>

	<!-- Sticky Search Bar (Mobile Optimized) -->
	<div class="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/80">
		<div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
			<!-- Search and Filter -->
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
			<!-- Search Bar -->
			<div class="flex-1">
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						{#if isSearching}
							<svg class="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						{:else}
							<svg
								class="h-5 w-5 text-zinc-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						{/if}
					</div>
					<input
						type="text"
						name="q"
						bind:value={searchQuery}
						placeholder="Search moves..."
						class="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-3 text-base placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400"
					/>
				</div>
			</div>

			<!-- Category Filter -->
			<select
				name="category"
				bind:value={selectedCategory}
				class="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:w-48"
			>
				<option value="">All Categories</option>
				{#each data.categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>

			<!-- View Toggle (Touch-Optimized) -->
			<div class="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
				<button
					type="button"
					onclick={() => toggleView('grid')}
					class="rounded p-3 transition-all active:scale-95 {viewMode === 'grid'
						? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
						: 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}"
					title="Grid view"
					aria-label="Grid view"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						></path>
					</svg>
				</button>
				<button
					type="button"
					onclick={() => toggleView('table')}
					class="rounded p-3 transition-all active:scale-95 {viewMode === 'table'
						? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
						: 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}"
					title="Table view"
					aria-label="Table view"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						></path>
					</svg>
				</button>
			</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">

		<!-- Results Count -->
		{#if searchQuery || selectedCategory}
			<div class="mb-4 flex items-center justify-between">
				<p class="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
					Found {displayedMoves.length} move{displayedMoves.length !== 1 ? 's' : ''}
				</p>
				<button
					type="button"
					onclick={() => {
						searchQuery = '';
						selectedCategory = '';
						displayedMoves = data.moves;
					}}
					class="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all active:scale-95 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
				>
					Clear filters
				</button>
			</div>
		{/if}

		<!-- Moves Display -->
		{#if displayedMoves.length > 0}
			{#if viewMode === 'grid'}
				<!-- Grid View (Mobile-Optimized: 2 columns on mobile) -->
				<div class="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
					{#each displayedMoves as move}
						<MoveCard {move} />
					{/each}
				</div>
			{:else}
				<!-- Table View -->
				<div class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800">
								<tr>
									<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
										Name
									</th>
									<th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 md:table-cell">
										Category
									</th>
									<th class="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 lg:table-cell">
										Media
									</th>
									<th class="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 xl:table-cell">
										Contributor
									</th>
									<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
								{#each displayedMoves as move}
									<tr class="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
										<td class="px-4 py-3">
											<a
												href="/moves/{move.id}"
												class="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
											>
												{move.name}
											</a>
											<div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400 md:hidden">
												{move.category.name}
											</div>
										</td>
										<td class="hidden px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 md:table-cell">
											<span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
												{move.category.name}
											</span>
										</td>
										<td class="hidden px-4 py-3 text-center lg:table-cell">
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
										<td class="hidden px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 xl:table-cell">
											{move.contributorName || '—'}
										</td>
										<td class="px-4 py-3 text-right">
											<a
												href="/moves/{move.id}"
												class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
											>
												View
											</a>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		{:else}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-zinc-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
					No moves found
				</h3>
				<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
					Try adjusting your search or filter.
				</p>
			</div>
		{/if}
	</main>
</div>
