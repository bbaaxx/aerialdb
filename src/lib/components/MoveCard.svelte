<script lang="ts">
	interface Props {
		move: {
			id: string;
			name: string;
			description: string | null;
			imageUrl: string | null;
			category: {
				id: string;
				name: string;
			};
			contributorName: string | null;
		};
	}

	let { move }: Props = $props();
</script>

<a
	href="/moves/{move.id}"
	class="group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
>
	<!-- Image -->
	<div class="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
		{#if move.imageUrl}
			<img
				src={move.imageUrl}
				alt={move.name}
				class="h-full w-full object-cover transition group-hover:scale-105"
			/>
		{:else}
			<div
				class="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600"
			>
				<svg
					class="h-16 w-16"
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
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-4">
		<div class="mb-2 flex items-start justify-between gap-2">
			<h3 class="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600">
				{move.name}
			</h3>
			<span
				class="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
			>
				{move.category.name}
			</span>
		</div>

		{#if move.description}
			<p class="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
				{move.description}
			</p>
		{/if}

		{#if move.contributorName}
			<p class="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
				by {move.contributorName}
			</p>
		{/if}
	</div>
</a>
