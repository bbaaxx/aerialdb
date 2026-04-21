<script lang="ts">
	import { Image, Heart } from 'lucide-svelte';

	interface Props {
		move: {
			id: string;
			name: string;
			imageUrl: string | null;
			level: string | null;
			category: { name: string };
		};
		isFavorited?: boolean;
		onToggleFavorite?: (id: string) => void;
	}

	const { move, isFavorited = false, onToggleFavorite }: Props = $props();

	let levelClasses = $derived(
		move.level === 'beginner'
			? 'text-teal-400 bg-teal-400/10'
			: move.level === 'intermediate'
				? 'text-blue-400 bg-blue-400/10'
				: move.level === 'advanced'
					? 'text-purple-400 bg-purple-400/10'
					: move.level === 'professional'
						? 'text-amber-400 bg-amber-400/10'
						: ''
	);

	function handleFavoriteClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		onToggleFavorite?.(move.id);
	}
</script>

<a
	href="/moves/{move.id}"
	class="group block rounded-xl bg-surface-container p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]"
>
	<div class="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
		{#if move.imageUrl}
			<img
				src={move.imageUrl}
				alt={move.name}
				class="h-full w-full object-cover"
				loading="lazy"
				decoding="async"
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center text-gray-600">
				<Image size={48} />
			</div>
		{/if}

		<button
			type="button"
			onclick={handleFavoriteClick}
			class="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-md transition-all duration-300 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 active:scale-95 {isFavorited
				? 'text-accent-purple opacity-100 shadow-[0_0_15px_rgba(138,99,248,0.4)]'
				: 'opacity-0'}"
			aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
			aria-pressed={isFavorited}
		>
			<Heart
				size={14}
				fill={isFavorited ? 'currentColor' : 'none'}
				class="transition-transform duration-300 {isFavorited ? 'scale-110' : ''}"
			/>
			<span>{isFavorited ? 'Saved to Favorites' : 'Save to Favorites'}</span>
		</button>
	</div>

	<h3 class="mt-3 mb-2 truncate font-serif text-lg text-gray-200">
		{move.name}
	</h3>

	<div class="flex items-center justify-between">
		<span
			class="rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs text-on-surface-variant"
		>
			{move.category.name}
		</span>
		{#if move.level}
			<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {levelClasses}">
				{move.level}
			</span>
		{/if}
	</div>
</a>
