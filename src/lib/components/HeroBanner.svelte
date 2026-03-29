<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	interface Props {
		move: {
			id: string;
			name: string;
			imageUrl: string | null;
			level: string | null;
			category: { id: string; name: string };
		} | null;
	}

	let { move }: Props = $props();

	function levelClasses(level: string): string {
		const map: Record<string, string> = {
			beginner: 'text-teal-400 border-teal-400/30 bg-teal-400/10',
			intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
			advanced: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
			professional: 'text-amber-400 border-amber-400/30 bg-amber-400/10'
		};
		return map[level] ?? '';
	}
</script>

<div class="relative overflow-hidden">
	<!-- Left adjacent slide (visual bleed) -->
	<div class="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 scale-95 opacity-30">
		{#if move?.imageUrl}
			<img src={move.imageUrl} alt="" aria-hidden="true" class="h-full w-full object-cover" />
		{:else}
			<div class="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800"></div>
		{/if}
	</div>

	<!-- Right adjacent slide (visual bleed) -->
	<div class="pointer-events-none absolute inset-y-0 -right-1/3 z-0 w-1/3 scale-95 opacity-30">
		{#if move?.imageUrl}
			<img src={move.imageUrl} alt="" aria-hidden="true" class="h-full w-full object-cover" />
		{:else}
			<div class="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800"></div>
		{/if}
	</div>

	<!-- Main hero -->
	<div
		class="relative z-10 mx-auto h-[250px] max-w-5xl overflow-hidden rounded-2xl shadow-2xl sm:h-[320px] md:h-[400px]"
	>
		<!-- Image layer -->
		{#if move?.imageUrl}
			<img
				src={move.imageUrl}
				alt={move.name}
				class="absolute inset-0 z-0 h-full w-full object-cover"
			/>
		{:else}
			<div
				class="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-dark-card to-gray-800"
			></div>
		{/if}

		<!-- Gradient overlay -->
		<div
			class="absolute inset-0 z-10 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"
		></div>

		<!-- Content -->
		<div
			class="absolute inset-y-0 left-0 z-20 flex max-w-2xl flex-col justify-center p-5 sm:p-8 md:p-12"
		>
			{#if move}
				<!-- Move of the Day label -->
				<span class="mb-3 text-sm font-medium tracking-wide text-teal-400"> Move of the Day </span>

				<!-- Title -->
				<h2
					class="mb-4 font-serif text-2xl leading-tight font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl"
				>
					{move.name}
				</h2>

				<!-- Badges -->
				<div class="mb-5 flex flex-wrap items-end gap-3 sm:mb-8 sm:gap-4">
					{#if move.level}
						<div>
							<span class="mb-1 block text-xs tracking-wide text-primary-light uppercase">
								Difficulty
							</span>
							<span
								class="rounded-full border px-3 py-1 text-xs font-medium {levelClasses(move.level)}"
							>
								{move.level}
							</span>
						</div>
					{/if}

					<div>
						<span class="mb-1 block text-xs tracking-wide text-primary-light uppercase">
							Base Technique
						</span>
						<span
							class="rounded-full border border-gray-600 bg-gray-800/50 px-3 py-1 text-xs font-medium text-gray-300"
						>
							{move.category.name}
						</span>
					</div>
				</div>

				<!-- CTA button -->
				<div>
					<a
						href="/moves/{move.id}"
						class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:scale-105 hover:shadow-[0_0_20px_rgba(138,99,248,0.6)]"
					>
						Learn More
						<ChevronRight size={18} />
					</a>
				</div>
			{:else}
				<!-- Placeholder state -->
				<span class="mb-3 text-sm font-medium tracking-wide text-teal-400">
					Welcome to AerialDB
				</span>

				<h2
					class="mb-4 font-serif text-2xl leading-tight font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl"
				>
					Explore Aerial Moves
				</h2>

				<p class="mb-5 max-w-md text-sm text-primary-light sm:mb-8 sm:text-base">
					Discover a curated library of aerial acrobatics moves, from beginner to professional
					level.
				</p>
			{/if}
		</div>

		<!-- Carousel dots -->
		<div class="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 gap-2 sm:flex">
			<button class="h-2 w-2 rounded-full bg-white" aria-label="Slide 1"></button>
			<button class="h-2 w-2 rounded-full bg-white/30" aria-label="Slide 2"></button>
			<button class="h-2 w-2 rounded-full bg-white/30" aria-label="Slide 3"></button>
		</div>
	</div>
</div>
