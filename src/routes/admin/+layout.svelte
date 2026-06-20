<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	const navLinks = [
		{ href: '/admin', label: 'Dashboard', exact: true },
		{ href: '/admin/moves/new', label: 'Add Move', exact: false },
		{ href: '/admin/categories', label: 'Categories', exact: false }
	];

	function isActive(href: string, exact: boolean) {
		const pathname = $page.url.pathname;
		if (exact) return pathname === href;
		return pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-surface-container-low text-on-surface">
	<!-- Admin Header with glassmorphism -->
	<header
		class="sticky top-0 z-50 border-b border-outline-variant/15"
		style="background: linear-gradient(180deg, rgba(26,28,41,0.95) 0%, rgba(26,28,41,0.80) 100%); backdrop-filter: blur(12px);"
	>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center gap-8">
					<a
						href="/"
						class="font-serif text-xl text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
					>
						AerialDB
					</a>
					<nav class="hidden space-x-1 sm:flex" aria-label="Admin navigation">
						{#each navLinks as link}
							<a
								href={link.href}
								aria-current={isActive(link.href, link.exact) ? 'page' : undefined}
								class="rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 {isActive(
									link.href,
									link.exact
								)
									? 'bg-surface-container text-on-surface'
									: 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'}"
							>
								{link.label}
							</a>
						{/each}
					</nav>
				</div>
				<div class="flex items-center gap-4">
					<span class="text-sm text-on-surface-variant">
						{data.user.username}
					</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="rounded-lg border border-outline-variant/15 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95"
						>
							Logout
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
