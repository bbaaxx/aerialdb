<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages.js';

	interface Props {
		value: string;
		placeholder?: string;
		oninput?: (value: string) => void;
		onclear?: () => void;
	}

	const {
		value = '',
		placeholder = m.nav_search_placeholder(),
		oninput,
		onclear
	}: Props = $props();
</script>

<div class="mx-auto w-full max-w-2xl">
	<div class="relative">
		<div
			class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-primary-light"
		>
			<Search size={18} />
		</div>

		<input
			type="search"
			{value}
			{placeholder}
			aria-label={placeholder}
			oninput={(e: Event) => oninput?.((e.target as HTMLInputElement).value)}
			class="w-full rounded-xl border border-outline-variant/15 bg-surface-container py-3.5 pr-10 pl-12 text-on-surface placeholder-on-surface-variant shadow-inner transition-colors focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
		/>

		{#if value}
			<button
				type="button"
				onclick={() => onclear?.()}
				class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-light transition-colors hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
				aria-label={m.nav_search_clear()}
			>
				<X size={18} />
			</button>
		{/if}
	</div>
</div>
