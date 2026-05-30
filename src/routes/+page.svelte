<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import FilterChips from '$lib/components/FilterChips.svelte';
	import HeroBanner from '$lib/components/HeroBanner.svelte';
	import MoveCard from '$lib/components/MoveCard.svelte';
	import { Loader2, SearchX } from 'lucide-svelte';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Filter state - initialized from URL params (server data)
	let selectedBaseTechnique = $state<string | null>(untrack(() => data.categoryFilter || null));
	let selectedLevel = $state<string | null>(untrack(() => data.levelFilter || null));
	let favoriteIds = $state<Set<string>>(new Set());

	// Update URL when filters change -> triggers server load -> data updates
	function updateFilters() {
		const params = new URLSearchParams();
		if (data.searchQuery) params.set('q', data.searchQuery);
		if (selectedBaseTechnique) params.set('category', selectedBaseTechnique);
		if (selectedLevel) params.set('level', selectedLevel);
		const qs = params.toString();
		goto(qs ? `/?${qs}` : '/', { replaceState: true, noScroll: true });
	}

	function handleSelectBaseTechnique(id: string | null) {
		selectedBaseTechnique = id;
		updateFilters();
	}

	function handleSelectLevel(level: string | null) {
		selectedLevel = level;
		updateFilters();
	}

	function handleToggleFavorite(id: string) {
		if (favoriteIds.has(id)) {
			favoriteIds.delete(id);
		} else {
			favoriteIds.add(id);
		}
		favoriteIds = new Set(favoriteIds);
	}
</script>

<svelte:head>
	<title>AerialDB - Aerial Moves Directory</title>
	<meta name="description" content="Browse and search aerial acrobatics moves" />
</svelte:head>

<main
	id="main-content"
	tabindex="-1"
	class="mx-auto max-w-7xl px-4 py-8 outline-none sm:px-6 lg:px-8"
>
	<!-- Filter Chips -->
	<div class="mb-8">
		<FilterChips
			categories={data.categories}
			activeApparatus={selectedBaseTechnique}
			activeLevel={selectedLevel}
			onSelectApparatus={handleSelectBaseTechnique}
			onSelectLevel={handleSelectLevel}
		/>
	</div>

	<!-- Hero Banner -->
	<div class="mb-12">
		<HeroBanner move={data.featuredMove} />
	</div>

	<!-- Section heading -->
	<div class="mb-6 flex items-center justify-between">
		<h2 class="font-serif text-2xl text-white">Library</h2>
		<span class="text-sm text-primary-light" aria-live="polite">
			{data.moves.length} move{data.moves.length !== 1 ? 's' : ''}
		</span>
	</div>

	<!-- Moves Grid: 3-col desktop -->
	{#if $navigating}
		<!-- Loading state during navigation -->
		<div class="flex flex-col items-center justify-center py-20">
			<Loader2 size={36} class="animate-spin text-accent-purple" />
			<p class="mt-4 text-sm text-primary-light">Loading moves...</p>
		</div>
	{:else if data.moves.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.moves as move (move.id)}
				<MoveCard
					{move}
					isFavorited={favoriteIds.has(move.id)}
					onToggleFavorite={handleToggleFavorite}
				/>
			{/each}
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex flex-col items-center justify-center py-20">
			<div class="mb-4 rounded-full bg-dark-card p-4">
				<SearchX size={32} class="text-primary-light" />
			</div>
			<h3 class="font-serif text-xl text-gray-300">No moves found</h3>
			<p class="mt-2 max-w-sm text-center text-sm text-primary-light">
				Try adjusting your search or filters to discover more aerial moves.
			</p>
			<button
				type="button"
				onclick={() => {
					selectedBaseTechnique = null;
					selectedLevel = null;
					goto('/');
				}}
				class="mt-6 rounded-lg bg-surface-container px-5 py-2 text-sm text-on-surface-variant transition hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
			>
				Clear all filters
			</button>
		</div>
	{/if}
</main>
