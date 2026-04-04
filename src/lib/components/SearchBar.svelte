<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	interface Props {
		value: string;
		placeholder?: string;
		oninput?: (value: string) => void;
		onclear?: () => void;
	}

	let {
		value = '',
		placeholder = 'Search moves, performers, techniques...',
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
			type="text"
			{value}
			{placeholder}
			aria-label={placeholder}
			oninput={(e: Event) => oninput?.((e.target as HTMLInputElement).value)}
			class="w-full rounded-xl border border-gray-600 bg-dark-card py-3.5 pr-10 pl-12 text-gray-200 placeholder-gray-500 shadow-inner transition-colors focus:border-accent-purple focus:ring-1 focus:ring-accent-purple focus:outline-none"
		/>

		{#if value}
			<button
				type="button"
				onclick={() => onclear?.()}
				class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-light transition-colors hover:text-gray-200"
				aria-label="Clear search"
			>
				<X size={18} />
			</button>
		{/if}
	</div>
</div>
