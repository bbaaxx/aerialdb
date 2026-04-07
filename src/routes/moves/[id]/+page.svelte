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
	<meta
		name="description"
		content={data.move.description || `Learn the ${data.move.name} aerial move`}
	/>
</svelte:head>

<div class="min-h-screen bg-surface-container-low">
	<!-- Header (Mobile-Optimized Back Button) -->
	<header
		class="sticky top-0 z-10 bg-surface-container-low/95 backdrop-blur"
		style="backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface active:scale-95"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path>
				</svg>
				Back
			</a>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
		<!-- Move Header (Mobile-Optimized) -->
		<div class="mb-6 sm:mb-8">
			<div
				class="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
			>
				<h1 class="text-2xl leading-tight font-bold text-white sm:text-3xl">
					{data.move.name}
				</h1>
				<span
					class="shrink-0 self-start rounded-full bg-primary-container/20 px-3 py-1 text-sm font-medium text-primary"
				>
					{data.move.category.name}
				</span>
			</div>

			{#if data.move.contributorName}
				<p class="text-sm text-on-surface-variant">
					Contributor: <span class="font-medium text-on-surface">{data.move.contributorName}</span>
				</p>
			{/if}
		</div>

		<!-- Media Section -->
		<div class="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
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
					<img src={data.move.imageUrl} alt={data.move.name} class="w-full rounded-lg" />
				</div>
			{:else if !youtubeId}
				<div class="flex aspect-video items-center justify-center rounded-lg bg-surface-container">
					<div class="text-center">
						<svg
							class="mx-auto h-16 w-16 text-on-surface-variant"
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
						<p class="mt-2 text-sm text-on-surface-variant">No media available</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Description Section -->
		<div class="rounded-lg bg-surface-container p-6">
			<h2 class="mb-4 text-lg font-semibold text-on-surface">Description</h2>

			{#if data.move.description}
				<div class="prose max-w-none prose-invert">
					<p class="text-on-surface-variant">{data.move.description}</p>
				</div>
			{:else}
				<p class="text-sm text-on-surface-variant italic">
					No description available yet. Check back later!
				</p>
			{/if}
		</div>

		<!-- Admin Actions (Touch-Optimized) -->
		<div class="mt-6 sm:mt-8">
			<a
				href="/admin/moves/{data.move.id}/edit"
				class="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-primary transition-all hover:bg-primary/10 active:scale-95"
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
