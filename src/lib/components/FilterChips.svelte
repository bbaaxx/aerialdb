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
	<div role="group" aria-labelledby="base-technique-label">
		<p
			id="base-technique-label"
			class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase"
		>
			Base Technique
		</p>
		<div class="flex flex-wrap gap-2">
			{#each categories as category (category.id)}
				<button
					type="button"
					onclick={() => handleApparatusClick(category.id)}
					aria-pressed={activeApparatus === category.id}
					class="rounded-full px-4 py-1.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none {activeApparatus ===
					category.id
						? 'bg-surface-container text-on-surface'
						: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
				>
					{category.name}
				</button>
			{/each}
		</div>
	</div>

	<!-- Level -->
	<div role="group" aria-labelledby="level-label">
		<p
			id="level-label"
			class="mb-2 text-xs font-semibold tracking-wider text-primary-light uppercase"
		>
			Level
		</p>
		<div class="flex flex-wrap gap-2">
			{#each levels as level (level)}
				<button
					type="button"
					onclick={() => handleLevelClick(level)}
					aria-pressed={activeLevel === level.toLowerCase()}
					class="rounded-full px-4 py-1.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none {activeLevel ===
					level.toLowerCase()
						? 'bg-surface-container text-on-surface'
						: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}"
				>
					{level}
				</button>
			{/each}
		</div>
	</div>
</div>
