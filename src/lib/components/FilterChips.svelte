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

	function getLevelClasses(level: string) {
		const val = level.toLowerCase();
		const isActive = activeLevel === val;

		if (!isActive)
			return 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface';

		const map: Record<string, string> = {
			beginner: 'text-teal-400 bg-teal-400/15 ring-1 ring-teal-400/30',
			intermediate: 'text-blue-400 bg-blue-400/15 ring-1 ring-blue-400/30',
			advanced: 'text-purple-400 bg-purple-400/15 ring-1 ring-purple-400/30',
			professional: 'text-amber-400 bg-amber-400/15 ring-1 ring-amber-400/30'
		};
		return map[val] ?? 'bg-surface-container text-on-surface';
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
					aria-pressed={activeApparatus === category.id}
					onclick={() => handleApparatusClick(category.id)}
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
					aria-pressed={activeLevel === level.toLowerCase()}
					onclick={() => handleLevelClick(level)}
					class="rounded-full px-4 py-1.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none {getLevelClasses(
						level
					)}"
				>
					{level}
				</button>
			{/each}
		</div>
	</div>
</div>
