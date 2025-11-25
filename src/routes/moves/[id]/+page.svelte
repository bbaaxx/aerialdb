<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Extract YouTube video ID from URL
	function getYouTubeId(url: string | null): string | null {
		if (!url) return null;
		const match = url.match(
			/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
		);
		return match ? match[1] : null;
	}

	const youtubeId = $derived(getYouTubeId(data.move.videoUrl));
</script>

<svelte:head>
	<title>{data.move.name} - AerialDB</title>
	<meta name="description" content={data.move.description || `Learn the ${data.move.name} aerial move`} />
</svelte:head>

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<!-- Header (Mobile-Optimized Back Button) -->
	<header class="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/80">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-blue-600 transition-all active:scale-95 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					></path>
				</svg>
				Back
			</a>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
		<!-- Move Header (Mobile-Optimized) -->
		<div class="mb-6 sm:mb-8">
			<div class="mb-3 sm:mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
				<h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
					{data.move.name}
				</h1>
				<span
					class="self-start shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
				>
					{data.move.category.name}
				</span>
			</div>

			{#if data.move.contributorName}
				<p class="text-sm text-zinc-600 dark:text-zinc-400">
					Contributor: <span class="font-medium">{data.move.contributorName}</span>
				</p>
			{/if}
		</div>

		<!-- Media Section -->
		<div class="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
			<!-- Video -->
			{#if youtubeId}
				<div class="overflow-hidden rounded-lg">
					<div class="aspect-video">
						<iframe
							width="100%"
							height="100%"
							src="https://www.youtube.com/embed/{youtubeId}"
							title={data.move.name}
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
							class="h-full w-full"
						></iframe>
					</div>
				</div>
			{/if}

			<!-- Image -->
			{#if data.move.imageUrl}
				<div class="overflow-hidden rounded-lg">
					<img
						src={data.move.imageUrl}
						alt={data.move.name}
						class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
					/>
				</div>
			{:else if !youtubeId}
				<div
					class="flex aspect-video items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
				>
					<div class="text-center">
						<svg
							class="mx-auto h-16 w-16 text-zinc-400 dark:text-zinc-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							></path>
						</svg>
						<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No media available</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Description Section -->
		<div class="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Description</h2>

			{#if data.move.description}
				<div class="prose prose-zinc dark:prose-invert max-w-none">
					<p class="text-zinc-700 dark:text-zinc-300">{data.move.description}</p>
				</div>
			{:else}
				<p class="text-sm italic text-zinc-500 dark:text-zinc-400">
					No description available yet. Check back later!
				</p>
			{/if}
		</div>

		<!-- Admin Actions (Touch-Optimized) -->
		<div class="mt-6 sm:mt-8">
			<a
				href="/admin/moves/{data.move.id}/edit"
				class="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-blue-600 transition-all active:scale-95 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					></path>
				</svg>
				Edit this move
			</a>
		</div>
	</main>
</div>
