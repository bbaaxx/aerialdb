<script lang="ts">
	interface Props {
		categories: Array<{ id: string; name: string }>;
		activeApparatus: string | null;
		activeLevel: string | null;
		onSelectApparatus: (id: string | null) => void;
		onSelectLevel: (level: string | null) => void;
	}

	let { categories, activeApparatus, activeLevel, onSelectApparatus, onSelectLevel }: Props =
		$props();

	const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
	const styles = ['Dynamic', 'Flow', 'Strength', 'Dance', 'Lyrical'];

	function handleApparatusClick(id: string) {
		onSelectApparatus(activeApparatus === id ? null : id);
	}

	function handleLevelClick(level: string) {
		const value = level.toLowerCase();
		onSelectLevel(activeLevel === value ? null : value);
	}
</script>

<div class="flex flex-col flex-wrap justify-center gap-x-12 gap-y-6 sm:flex-row">
	<!-- Apparatus -->
	<div>
		<p class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase">Apparatus</p>
		<div class="flex flex-wrap gap-2">
			{#each categories as category (category.id)}
				<button
					type="button"
					onclick={() => handleApparatusClick(category.id)}
					class="rounded-full border px-4 py-1.5 text-sm transition-all {activeApparatus ===
					category.id
						? 'border-accent-purple bg-dark-card text-white'
						: 'border-gray-600 text-gray-300 hover:border-accent-purple hover:text-white'}"
				>
					{category.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Level -->
	<div>
		<p class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase">Level</p>
		<div class="flex flex-wrap gap-2">
			{#each levels as level (level)}
				<button
					type="button"
					onclick={() => handleLevelClick(level)}
					class="rounded-full border px-4 py-1.5 text-sm transition-all {activeLevel ===
					level.toLowerCase()
						? 'border-accent-purple bg-dark-card text-white'
						: 'border-gray-600 text-gray-300 hover:border-accent-purple hover:text-white'}"
				>
					{level}
				</button>
			{/each}
		</div>
	</div>

	<!-- Style (Coming Soon) -->
	<div>
		<p class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase">Style</p>
		<div class="flex flex-wrap gap-2">
			{#each styles as style (style)}
				<span
					class="cursor-not-allowed rounded-full border border-gray-600 px-4 py-1.5 text-sm text-gray-300 opacity-50"
					title="Coming Soon"
				>
					{style}
				</span>
			{/each}
		</div>
	</div>
</div>
