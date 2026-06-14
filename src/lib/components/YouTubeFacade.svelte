<script lang="ts">
	import { Play } from 'lucide-svelte';

	interface Props {
		videoId: string;
		title: string;
	}

	const { videoId, title }: Props = $props();

	let isLoaded = $state(false);
	let thumbnailError = $state(false);

	const thumbnailUrl = $derived(
		thumbnailError
			? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
			: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
	);

	function handleLoad() {
		isLoaded = true;
	}

	function handleThumbnailError() {
		thumbnailError = true;
	}
</script>

<div class="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
	{#if !isLoaded}
		<button
			type="button"
			onclick={handleLoad}
			class="group relative h-full w-full focus:outline-none"
			aria-label="Play video: {title}"
		>
			<!-- Thumbnail -->
			<!-- Performance: Added fetchpriority="high" and loading="eager" for LCP optimization as this is the primary media -->
			<img
				src={thumbnailUrl}
				alt={title}
				onerror={handleThumbnailError}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus:scale-105"
				fetchpriority="high"
				loading="eager"
				decoding="async"
			/>

			<!-- Overlay Gradient -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40"
			></div>

			<!-- Play Button -->
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-focus:scale-110"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-sm transition-colors group-hover:bg-primary group-focus:bg-primary"
				>
					<Play size={32} fill="currentColor" class="ml-1" />
				</div>
			</div>
		</button>
	{:else}
		<iframe
			width="100%"
			height="100%"
			src="https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0"
			{title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="h-full w-full"
		></iframe>
	{/if}
</div>
