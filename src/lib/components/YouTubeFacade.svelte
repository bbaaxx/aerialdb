<script lang="ts">
	import { Play } from 'lucide-svelte';

	interface Props {
		youtubeId: string;
		title: string;
	}

	let { youtubeId, title }: Props = $props();

	let videoStarted = $state(false);
	let thumbnailError = $state(false);

	/**
	 * Performance: Using a facade pattern to lazy-load the YouTube iframe.
	 * This significantly reduces initial page load weight and JS execution time.
	 * We fallback from maxresdefault to hqdefault if the former is unavailable.
	 */
	const thumbnailUrl = $derived(
		thumbnailError
			? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
			: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
	);

	function startVideo() {
		videoStarted = true;
	}
</script>

<div class="relative aspect-video overflow-hidden rounded-lg bg-surface-container shadow-lg">
	{#if videoStarted}
		<iframe
			width="100%"
			height="100%"
			src="https://www.youtube.com/embed/{youtubeId}?autoplay=1"
			{title}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="h-full w-full"
		></iframe>
	{:else}
		<button
			type="button"
			onclick={startVideo}
			class="group relative h-full w-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-inset"
			aria-label="Play video: {title}"
		>
			<img
				src={thumbnailUrl}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				onerror={() => (thumbnailError = true)}
				loading="lazy"
				decoding="async"
			/>

			<!-- Overlay gradient for better button visibility -->
			<div class="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10"></div>

			<!-- Play Button -->
			<div
				class="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-surface-container-lowest shadow-xl backdrop-blur-sm transition-all group-hover:bg-primary group-hover:shadow-primary/20"
				>
					<Play size={32} fill="currentColor" class="ml-1" />
				</div>
			</div>
		</button>
	{/if}
</div>
