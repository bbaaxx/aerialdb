<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>AerialDB - {m.nav_theory()}</title>
</svelte:head>

<div class="flex flex-col items-center justify-center py-20">
	<h1 class="font-serif text-4xl text-white">{m.coming_soon_title()}</h1>
	<p class="mt-4 max-w-md text-center text-on-surface-variant">
		{m.coming_soon_message()}
	</p>
	<a
		href="/"
		class="mt-8 rounded-lg bg-surface-container px-6 py-2.5 text-sm text-on-surface-variant transition hover:text-on-surface"
	>
		{m.back_to_library()}
	</a>
</div>
