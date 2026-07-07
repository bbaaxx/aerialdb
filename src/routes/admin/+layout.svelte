<script lang="ts">
	import { page } from '$app/stores';
	import { m } from '$lib/paraglide/messages.js';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const adminLinks = [
		{ href: '/admin', label: m.nav_dashboard(), exact: true },
		{ href: '/admin/categories', label: m.nav_categories() },
		{ href: '/admin/moves/new', label: m.nav_add_move() }
	];

	function isActive(href: string, exact = false): boolean {
		const pathname = $page.url.pathname;
		if (exact) return pathname === href;
		return pathname === href || pathname.startsWith(href + '/');
	}
</script>

<div class="min-h-screen bg-surface-container-low">
	<!-- Admin Header with glassmorphism -->
	<header
		class="sticky top-0 z-50 border-b border-outline-variant/10"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a
						href="/"
						class="font-serif text-xl text-white transition hover:opacity-90 active:scale-95"
					>
						AerialDB
					</a>
					<nav class="hidden space-x-1 sm:flex" aria-label="Admin navigation">
						{#each adminLinks as link (link.href)}
							{@const active = isActive(link.href, link.exact)}
							<a
								href={link.href}
								class="rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {active
									? 'bg-surface-container text-on-surface'
									: 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'}"
								aria-current={active ? 'page' : undefined}
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</div>
				<div class="flex items-center gap-4">
					<span class="hidden text-sm text-on-surface-variant md:inline">
						{data.user.username}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-lg border border-outline-variant/30 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						>
							{m.menu_sign_out()}
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main id="main-content" tabindex="-1" class="outline-none">
		{@render children()}
	</main>
</div>
