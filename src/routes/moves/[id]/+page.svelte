<script lang="ts">
	import type { PageData } from './$types';
	import { ChevronLeft, Pencil, ImageOff, Share2, Check } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';
	import YouTubeFacade from '$lib/components/YouTubeFacade.svelte';

	let { data }: { data: PageData } = $props();
	let copied = $state(false);

	/**
	 * Handles sharing the move using the Web Share API if available,
	 * otherwise falls back to copying the URL to the clipboard.
	 * This provides a native sharing experience on mobile devices.
	 */
	async function handleShare() {
		const shareData = {
			title: `${data.move.name} - AerialDB`,
			text: data.move.description || `Learn the ${data.move.name} aerial move`,
			url: window.location.href
		};

		try {
			if (navigator.share && navigator.canShare?.(shareData)) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(window.location.href);
				copied = true;
				setTimeout(() => (copied = false), 2000);
			}
		} catch (err) {
			// Fail silently if user cancelled share sheet, or fallback to clipboard
			if (err instanceof Error && err.name !== 'AbortError') {
				console.error('Failed to share: ', err);
			}
		}
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

	const levelClasses = $derived(
		data.move.level === 'beginner'
			? 'text-teal-400 bg-teal-400/15 ring-1 ring-teal-400/30'
			: data.move.level === 'intermediate'
				? 'text-blue-400 bg-blue-400/15 ring-1 ring-blue-400/30'
				: data.move.level === 'advanced'
					? 'text-purple-400 bg-purple-400/15 ring-1 ring-purple-400/30'
					: data.move.level === 'professional'
						? 'text-amber-400 bg-amber-400/15 ring-1 ring-amber-400/30'
						: 'bg-surface-container-high text-on-surface-variant'
	);
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
		<div
			class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
		>
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
			>
				<ChevronLeft size={20} aria-hidden="true" />
				{m.move_back()}
			</a>

			<button
				type="button"
				onclick={handleShare}
				class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
				aria-label={copied ? m.move_copied_aria() : m.move_share_aria()}
			>
				{#if copied}
					<Check size={20} class="text-teal-400" aria-hidden="true" />
					<span class="text-teal-400">{m.move_copied()}</span>
				{:else}
					<Share2 size={20} aria-hidden="true" />
					<span>{m.move_share()}</span>
				{/if}
			</button>
		</div>
	</header>

	<!-- Main Content -->
	<main
		id="main-content"
		tabindex="-1"
		class="mx-auto max-w-4xl px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8"
	>
		<!-- Move Header (Mobile-Optimized) -->
		<div class="mb-6 sm:mb-8">
			<div
				class="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
			>
				<h1 class="text-2xl leading-tight font-bold text-white sm:text-3xl">
					{data.move.name}
				</h1>
				<div class="flex flex-wrap gap-2">
					<span
						class="shrink-0 self-start rounded-full bg-primary-container/20 px-3 py-1 text-sm font-medium text-primary"
					>
						{data.move.category.name}
					</span>
					{#if data.move.level}
						<span
							class="shrink-0 self-start rounded-full px-3 py-1 text-sm font-medium capitalize {levelClasses}"
						>
							{data.move.level}
						</span>
					{/if}
				</div>
			</div>

			{#if data.move.contributorName}
				<p class="text-sm text-on-surface-variant">
					{m.move_contributor()}:
					<span class="font-medium text-on-surface">{data.move.contributorName}</span>
				</p>
			{/if}
		</div>

		<!-- Media Section -->
		<div class="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
			<!-- Video (Optimized with Facade Pattern) -->
			{#if youtubeId}
				<YouTubeFacade videoId={youtubeId} title={data.move.name} />
			{/if}

			<!-- Image -->
			{#if data.move.imageUrl}
				<div class="overflow-hidden rounded-lg">
					<!-- Performance: Added fetchpriority="high" and loading="eager" for LCP optimization -->
					<img
						src={data.move.imageUrl}
						alt={data.move.name}
						class="w-full rounded-lg"
						fetchpriority="high"
						loading="eager"
						decoding="async"
					/>
				</div>
			{:else if !youtubeId}
				<div class="flex aspect-video items-center justify-center rounded-lg bg-surface-container">
					<div class="text-center">
						<ImageOff size={64} class="mx-auto text-on-surface-variant" aria-hidden="true" />
						<p class="mt-2 text-sm text-on-surface-variant">{m.move_no_media()}</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Description Section -->
		<div class="rounded-lg bg-surface-container p-6">
			<h2 class="mb-4 text-lg font-semibold text-on-surface">{m.move_description_title()}</h2>

			{#if data.move.description}
				<div class="prose max-w-none prose-invert">
					<p class="text-on-surface-variant">{data.move.description}</p>
				</div>
			{:else}
				<p class="text-sm text-on-surface-variant italic">
					{m.move_description_empty()}
				</p>
			{/if}
		</div>

		<!-- Admin Actions (Touch-Optimized) -->
		<div class="mt-6 sm:mt-8">
			<a
				href="/admin/moves/{data.move.id}/edit"
				class="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-primary transition-all hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
			>
				<Pencil size={20} aria-hidden="true" />
				{m.move_edit()}
			</a>
		</div>
	</main>
</div>
