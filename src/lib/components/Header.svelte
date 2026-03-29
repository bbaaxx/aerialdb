<script lang="ts">
	import { ChevronDown, LogOut } from 'lucide-svelte';

	interface Props {
		user?: { username: string } | null;
	}

	let { user = null }: Props = $props();
</script>

<header class="sticky top-0 z-50 w-full">
	<div
		class="mx-auto mt-4 max-w-7xl rounded-xl px-6 py-4"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.9) 0%, rgba(26,28,41,0.7) 100%); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05);"
	>
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="font-serif text-2xl text-white transition hover:opacity-90"> AerialDB </a>

			<!-- Nav links — hidden on mobile -->
			<nav class="hidden items-center gap-6 md:flex">
				<a
					href="/"
					class="flex items-center gap-1 text-sm text-primary-light transition hover:text-white"
				>
					Discover
					<ChevronDown size={14} />
				</a>
				<a href="/" class="text-sm text-primary-light transition hover:text-white"> Library </a>
				<a href="/" class="text-sm text-primary-light transition hover:text-white"> Community </a>
				<a href="/" class="text-sm text-primary-light transition hover:text-white"> My Training </a>
			</nav>

			<!-- Auth section -->
			<div class="flex items-center gap-3">
				{#if user}
					<span class="hidden text-sm text-primary-light sm:inline">
						Hi, {user.username}
					</span>
					<a
						href="/auth/logout"
						class="flex items-center gap-1.5 text-sm text-primary-light transition hover:text-white"
					>
						<LogOut size={14} />
						<span class="hidden sm:inline">Sign Out</span>
					</a>
				{:else}
					<a
						href="/auth/signup"
						class="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(138,99,248,0.5)] transition hover:shadow-[0_0_20px_rgba(138,99,248,0.6)]"
					>
						Sign Up
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>
