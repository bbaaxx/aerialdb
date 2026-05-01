<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import type { LayoutData } from './$types';
	import { m } from '$lib/paraglide/messages.js';

	const { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400..900;1,400..900&display=swap"
	/>
</svelte:head>

<div class="min-h-screen bg-surface-container-low font-sans text-on-surface">
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-surface-container-lowest focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
	>
		{m.nav_skip_to_content()}
	</a>
	<Header user={data.user} />
	<div id="main-content" tabindex="-1" class="outline-none">
		{@render children()}
	</div>
</div>
