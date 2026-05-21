<script lang="ts">
	import { Play } from 'lucide-svelte';

	interface Props {
		youtubeId: string;
		title: string;
	}

	let { youtubeId, title }: Props = $props();
	let videoStarted = $state(false);
	let thumbnailError = $state(false);

	const thumbnailUrl = $derived(
		thumbnailError
			? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
			: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
	);

	function startVideo() {
		videoStarted = true;
	}

	function handleThumbnailError() {
		thumbnailError = true;
	}
</script>

<div class="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-container">
	{#if videoStarted}
		<iframe
			width="100%"
			height="100%"
			src="https://www.youtube.com/embed/{youtubeId}?autoplay=1"
			{title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			class="h-full w-full border-0"
		></iframe>
	{:else}
		<button
			type="button"
			onclick={startVideo}
			class="group relative h-full w-full overflow-hidden"
			aria-label="Play video: {title}"
		>
			<img
				src={thumbnailUrl}
				alt={title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				onerror={handleThumbnailError}
				loading="lazy"
				decoding="async"
			/>
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
				>
					<Play size={32} fill="currentColor" />
				</div>
			</div>
		</button>
	{/if}
</div>
