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
			<h1 class="text-3xl font-bold text-white">Admin Dashboard</h1>
			<p class="mt-2 text-[#A0A5C0]">Manage aerial moves and their content</p>
		</div>
		<a
			href="/admin/moves/new"
			class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
		>
			+ Add New Move
		</a>
	</div>

	<!-- Statistics Cards -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
			<p class="text-sm font-medium text-[#A0A5C0]">Total Moves</p>
			<p class="mt-2 text-3xl font-bold text-white">{stats.total}</p>
		</div>
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
			<p class="text-sm font-medium text-[#A0A5C0]">With Images</p>
			<p class="mt-2 text-3xl font-bold text-white">{stats.withImage}</p>
		</div>
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
			<p class="text-sm font-medium text-[#A0A5C0]">With Videos</p>
			<p class="mt-2 text-3xl font-bold text-white">{stats.withVideo}</p>
		</div>
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
			<p class="text-sm font-medium text-[#A0A5C0]">Needs Media</p>
			<p class="mt-2 text-3xl font-bold text-white">{stats.needsMedia}</p>
		</div>
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6 shadow-sm">
			<p class="text-sm font-medium text-[#A0A5C0]">Complete</p>
			<p class="mt-2 text-3xl font-bold text-white">{stats.complete}</p>
			<p class="mt-1 text-xs text-[#A0A5C0]">Img + Vid + Desc</p>
		</div>
	</div>

	<!-- Filters -->
	<div
		class="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-[#242736] p-4 shadow-sm sm:flex-row"
	>
		<!-- Search -->
		<div class="flex-1">
			<label for="search" class="sr-only">Search moves</label>
			<input
				type="text"
				id="search"
				bind:value={searchQuery}
				placeholder="Search moves..."
				class="w-full rounded-lg border border-gray-700 bg-[#1A1C29] px-4 py-2 text-sm text-white placeholder-[#A0A5C0] focus:border-[#8A63F8] focus:ring-2 focus:ring-[#8A63F8] focus:outline-none"
			/>
		</div>

		<!-- Base Technique Filter -->
		<div class="w-full sm:w-64">
			<label for="category" class="sr-only">Filter by base technique</label>
			<select
				id="category"
				bind:value={selectedCategory}
				class="w-full rounded-lg border border-gray-700 bg-[#1A1C29] px-4 py-2 text-sm text-white focus:border-[#8A63F8] focus:ring-2 focus:ring-[#8A63F8] focus:outline-none"
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
				class="rounded-lg border border-gray-700 bg-[#1A1C29] px-4 py-2 text-sm font-medium text-[#A0A5C0] transition-colors hover:bg-white/5"
			>
				Clear
			</button>
		{/if}
	</div>

	<!-- Results Count -->
	<div class="mb-4">
		<p class="text-sm text-[#A0A5C0]">
			Showing {filteredMoves.length} of {data.moves.length} moves
		</p>
	</div>

	<!-- Moves Table -->
	<div class="overflow-hidden rounded-lg border border-gray-800 bg-[#242736] shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-gray-800 bg-[#242736]">
					<tr>
						<th
							class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase"
						>
							Name
						</th>
						<th
							class="hidden px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase sm:table-cell"
						>
							Base Technique
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase md:table-cell"
						>
							Media
						</th>
						<th
							class="hidden px-4 py-3 text-center text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase lg:table-cell"
						>
							Contributor
						</th>
						<th
							class="px-4 py-3 text-right text-xs font-semibold tracking-wider text-[#A0A5C0] uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each filteredMoves as move (move.id)}
						<tr class="transition-colors hover:bg-white/5">
							<td class="px-4 py-3">
								<a href="/moves/{move.id}" class="font-medium text-white hover:text-[#8A63F8]">
									{move.name}
								</a>
								<div class="mt-1 text-xs text-[#A0A5C0] sm:hidden">
									{move.categoryName || 'Uncategorized'}
								</div>
							</td>
							<td class="hidden px-4 py-3 text-sm text-[#A0A5C0] sm:table-cell">
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
										<span class="text-[#A0A5C0]">—</span>
									{/if}
								</div>
							</td>
							<td class="hidden px-4 py-3 text-center text-sm text-[#A0A5C0] lg:table-cell">
								{move.contributorName || '—'}
							</td>
							<td class="px-4 py-3 text-right">
								<a
									href="/admin/moves/{move.id}/edit"
									class="inline-flex items-center rounded-md bg-[#8A63F8]/10 px-3 py-1.5 text-sm font-medium text-[#8A63F8] transition-colors hover:bg-[#8A63F8]/20"
								>
									Edit
								</a>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-8 text-center">
								<p class="text-[#A0A5C0]">No moves found</p>
								{#if searchQuery || selectedCategory !== 'all'}
									<button
										type="button"
										onclick={() => {
											searchQuery = '';
											selectedCategory = 'all';
										}}
										class="mt-2 text-sm text-[#8A63F8] hover:text-[#8A63F8]/80"
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
