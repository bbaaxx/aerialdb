<script lang="ts">
	import { ChevronLeft, Share2, Check, Pencil, ImageOff } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let copied = $state(false);

	function handleShare() {
		navigator.clipboard.writeText(window.location.href);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

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

<div class="min-h-screen bg-[#1A1C29]">
	<!-- Header (Mobile-Optimized Back Button) -->
	<header
		class="sticky top-0 z-10 border-b border-white/5 bg-[#1A1C29]/95 backdrop-blur"
		style="backdrop-filter: blur(12px);"
	>
		<div
			class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
		>
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-[#A0A5C0] transition-all hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:outline-none active:scale-95"
			>
				<ChevronLeft size={20} />
				Back
			</a>

			<button
				type="button"
				onclick={handleShare}
				class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:outline-none active:scale-95"
				aria-label={copied ? 'Copied to clipboard' : 'Share this move'}
			>
				{#if copied}
					<Check size={18} class="text-teal-400" />
					<span class="text-teal-400">Copied!</span>
				{:else}
					<Share2 size={18} class="text-[#A0A5C0]" />
					<span class="text-[#A0A5C0]">Share</span>
				{/if}
			</button>
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
					class="shrink-0 self-start rounded-full bg-[#8A63F8]/20 px-3 py-1 text-sm font-medium text-[#8A63F8]"
				>
					{data.move.category.name}
				</span>
			</div>

			{#if data.move.contributorName}
				<p class="text-sm text-[#A0A5C0]">
					Contributor: <span class="font-medium text-white">{data.move.contributorName}</span>
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
					<img
						src={data.move.imageUrl}
						alt={data.move.name}
						class="w-full rounded-lg border border-gray-700"
					/>
				</div>
			{:else if !youtubeId}
				<div
					class="flex aspect-video items-center justify-center rounded-lg border border-gray-800 bg-[#242736]"
				>
					<div class="text-center">
						<ImageOff class="mx-auto h-16 w-16 text-[#A0A5C0]" />
						<p class="mt-2 text-sm text-[#A0A5C0]">No media available</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Description Section -->
		<div class="rounded-lg border border-gray-800 bg-[#242736] p-6">
			<h2 class="mb-4 text-lg font-semibold text-white">Description</h2>

			{#if data.move.description}
				<div class="prose max-w-none prose-invert">
					<p class="text-gray-300">{data.move.description}</p>
				</div>
			{:else}
				<p class="text-sm text-[#A0A5C0] italic">No description available yet. Check back later!</p>
			{/if}
		</div>

		<!-- Admin Actions (Touch-Optimized) -->
		<div class="mt-6 sm:mt-8">
			<a
				href="/admin/moves/{data.move.id}/edit"
				class="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-[#8A63F8] transition-all hover:bg-[#8A63F8]/10 focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:outline-none active:scale-95"
			>
				<Pencil size={20} />
				Edit this move
			</a>
		</div>
	</main>
</div>
