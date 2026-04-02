<script lang="ts">
	interface Props {
		categories: Array<{ id: string; name: string }>;
		activeApparatus: string | null;
		activeLevel: string | null;
		onSelectApparatus: (id: string | null) => void;
		onSelectLevel: (level: string | null) => void;
	}

	const { categories, activeApparatus, activeLevel, onSelectApparatus, onSelectLevel }: Props =
		$props();

	const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

	function handleApparatusClick(id: string) {
		onSelectApparatus(activeApparatus === id ? null : id);
	}

	function handleLevelClick(level: string) {
		const value = level.toLowerCase();
		onSelectLevel(activeLevel === value ? null : value);
	}
</script>

<div class="flex flex-col flex-wrap justify-center gap-x-12 gap-y-6 sm:flex-row">
	<!-- Base Technique -->
	<div>
		<p class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase">
			Base Technique
		</p>
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
</div>
