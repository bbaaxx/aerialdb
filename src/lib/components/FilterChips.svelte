<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { X } from 'lucide-svelte';

	interface Props {
		categories: Array<{ id: string; name: string }>;
		activeApparatus: string | null;
		activeLevel: string | null;
		onSelectApparatus: (id: string | null) => void;
		onSelectLevel: (level: string | null) => void;
		onClearAll?: () => void;
	}

	const {
		categories,
		activeApparatus,
		activeLevel,
		onSelectApparatus,
		onSelectLevel,
		onClearAll
	}: Props = $props();

	const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

	const activeCategoryName = $derived(
		categories.find((c) => c.id === activeApparatus)?.name || null
	);

	const activeLevelName = $derived(levels.find((l) => l.toLowerCase() === activeLevel) || null);

	const hasActiveFilters = $derived(Boolean(activeApparatus || activeLevel));

	function handleApparatusClick(id: string) {
		onSelectApparatus(activeApparatus === id ? null : id);
	}

	function handleLevelClick(level: string) {
		const value = level.toLowerCase();
		onSelectLevel(activeLevel === value ? null : value);
	}

	function handleClearAll() {
		if (onClearAll) {
			onClearAll();
		} else {
			onSelectApparatus(null);
			onSelectLevel(null);
		}
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

<div class="flex flex-col gap-4">
	{#if hasActiveFilters}
		<div
			class="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-surface-container/60 px-4 py-2.5 backdrop-blur-sm"
			aria-label={m.filter_active_title()}
		>
			<span class="text-xs font-medium tracking-wider text-on-surface-variant uppercase">
				{m.filter_active_title()}
			</span>

			{#if activeCategoryName}
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface ring-1 ring-white/10"
				>
					<span>{activeCategoryName}</span>
					<button
						type="button"
						onclick={() => onSelectApparatus(null)}
						class="rounded-full p-0.5 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						aria-label={m.filter_remove_category()}
					>
						<X size={12} aria-hidden="true" />
					</button>
				</span>
			{/if}

			{#if activeLevelName}
				<span
					class="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface ring-1 ring-white/10"
				>
					<span>{activeLevelName}</span>
					<button
						type="button"
						onclick={() => onSelectLevel(null)}
						class="rounded-full p-0.5 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						aria-label={m.filter_remove_level()}
					>
						<X size={12} aria-hidden="true" />
					</button>
				</span>
			{/if}

			<button
				type="button"
				onclick={handleClearAll}
				class="ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary/10 hover:text-primary-light focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
				aria-label={m.filter_clear_all_aria()}
			>
				{m.filter_clear_all()}
			</button>
		</div>
	{/if}

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
						class="rounded-full px-4 py-1.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {activeApparatus ===
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
						class="rounded-full px-4 py-1.5 text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {getLevelClasses(
							level
						)}"
					>
						{level}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
